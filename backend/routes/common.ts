import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from "express";
import { CognitoUser } from "../models/cognitoUser";
import { STATUS } from "../constants";
import { injectDynamicApplicationContent } from "../utils/file_plugin";
import { ServerResponse } from "http";
import { Model } from "mongoose";
import Judge from "../models/Judge";
import Mentor from "../models/Mentor";

export function getDeadline(type) {
  switch (type) {
    case "is":
      return new Date("2025-02-18:45:00.000Z");
    case "stanford":
      return new Date("2025-02-18T07:59:00.000Z");
    case "oos":
    default:
      return new Date("2025-02-18:45:00.000Z");
  }
}

/*
 * Get application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export async function getApplicationAttribute(
  req: Request,
  res: Response,
  getter: (e: IApplication) => any,
  createIfNotFound = false
) {
  // prevent non-admins from viewing applications
  const groups = res.locals.user["cognito:groups"] || [];
  const canView = groups.includes("admin") || groups.includes("organizers_current");
  if (!canView && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to view this application");
  }

  let application: IApplication | null = await Application.findOne(
    { "user.id": req.params.userId },
    { __v: 0, reviews: 0 },
    { "treehacks:groups": res.locals.user["cognito:groups"] }
  );

  if (!application) {
    if (createIfNotFound) {
      return createApplication(res.locals.user as CognitoUser).then((e) =>
        getApplicationAttribute(req, res, getter, false)
      );
    } else {
      res.status(404).send("Application not found.");
    }
  } else {
    application = (await injectDynamicApplicationContent(
      application
    )) as IApplication;
    res.status(200).send(getter(application));
  }
}

/*
 * Set application attribute from current request, return updated values.
 * req - Request (must have userId param)
 * res - Response
 * setter - a function describing what happens to the application before save. It can also return an error (server response), in which case the application isn't saved.
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export async function setApplicationAttribute(
  req: Request,
  res: Response,
  setter: (e: IApplication) => any,
  getter: (e: IApplication) => any = (e) => e,
  considerDeadline = false
) {
  // prevent non-admins from viewing other applications
  const groups = res.locals.user["cognito:groups"] || [];
  const canEdit = groups.includes("admin") || groups.includes("organizers_current");
  if (!canEdit && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to edit this application");
  }

  const application: IApplication | null = await Application.findOne(
    { "user.id": req.params.userId },
    { __v: 0, reviews: 0 }
  );

  if (!application) {
    res.status(404).send("Application not found.");
    return;
  }

  let deadline = getDeadline(application.type);
  if (considerDeadline && deadline < new Date()) {
    res
      .status(403)
      .send(
        `Application deadline has already passed: ${deadline.toLocaleString()}`
      );
    return;
  }

  let setResponse = setter(application);
  if (setResponse instanceof ServerResponse) {
    // Which means the setter found and sent validation error
    return;
  }

  await application.save();

  await getApplicationAttribute(req, res, getter);
}

/* Structure of res.locals.user: 
aud
:
"..."
auth_time
:
1536589507
cognito:username
:
"fhdfhgds-4cf5-423e-a7d1-daba1fe9f47c"
email
:
"aramaswamis@gmail.com"
email_verified
:
true
event_id
:
"sdf-b505-11e8-b4bf-81fff1fe3398"
exp
:
1536593107
iat
:
1536589507
iss
:
"https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zraMJaf9F"
name
:
"User"
sub
:
"asdasd-4cf5-423e-a7d1-daba1fe9f47c"
token_use
:
"id"
website
:
"http://localhost:9000/"

*/

/* Create application. Lookup userId in cognito user pool, then set starting parameters accordingly.
 * userId - user ID.
 */
export async function createApplication(user: CognitoUser) {
  let applicationInfo = {};
  let applicationLocation = user["custom:location"];
  let applicationType = user["custom:location"] === "California" ? "is" : "oos";
  let applicationStatus = STATUS.INCOMPLETE;
  let transportationStatus: string | null = null;
  if (user.email.match(/@stanford.edu$/)) {
    applicationInfo = {
      university: "Stanford University",
    };
    applicationType = "stanford";
    applicationLocation = "California";
    const existingApplication = await Application.findOne({
      "user.email": user.email,
    });
    if (existingApplication) {
      return existingApplication;
    }
  }
  const application = new Application({
    forms: {
      application_info: applicationInfo,
    },
    admin_info: {},
    reviews: [],
    user: { email: user.email, id: user.sub },
    type: applicationType,
    location: applicationLocation,
    status: applicationStatus,
    transportation_status: transportationStatus,
  });
  return await application.save(); // todo: return something else here?
}

export function getGenericList(req: Request, res: Response, Model: Model<any>) {
  // Text matching search
  let filter = JSON.parse(req.query.filter || "{}");
  for (let key in filter) {
    // Matching by a string in any location
    if (typeof filter[key] === "string") {
      filter[key] = { $regex: "^" + filter[key], $options: "i" };
    }
  }
  let queryOptions = {
    "treehacks:groups": res.locals.user && res.locals.user["cognito:groups"],
  };

  let query = Model.find(
    filter,
    JSON.parse(req.query.project || "{}"),
    queryOptions
  );
  let sortedAndFilteredQuery = query
    .sort(JSON.parse(req.query.sort || "{}"))
    .skip(parseInt(req.query.page) * parseInt(req.query.pageSize));

  if (parseInt(req.query.pageSize) >= 0) {
    sortedAndFilteredQuery = sortedAndFilteredQuery.limit(
      parseInt(req.query.pageSize)
    );
  }

  let countQuery = Model.countDocuments(filter);
  countQuery.setOptions(queryOptions);

  Promise.all([sortedAndFilteredQuery.lean().exec(), countQuery])
    .then(([results, count]) => {
      return res.status(200).json({
        results: results,
        count: count,
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
}

export async function getJudgeAttribute(
  req: Request,
  res: Response,
  getter: (e: any) => any
) {
  // prevent non-admins from viewing judges
  const groups = res.locals.user["cognito:groups"] || [];
  const canView = groups.includes("admin") || groups.includes("organizers_current");
  if (!canView && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to view this judge");
  }

  let judge = await Judge.findOne(
    { "user.id": req.params.userId },
    { __v: 0 },
    { "treehacks:groups": res.locals.user["cognito:groups"] }
  );

  if (!judge) {
    res.status(404).send("Judge not found.");
  } else {
    res.status(200).send(getter(judge));
  }
}

export async function setJudgeAttribute(
  req: Request,
  res: Response,
  setter: (e: any) => any,
  getter: (e: any) => any = (e) => e
) {
  // prevent non-admins from editing other judges
  const groups = res.locals.user["cognito:groups"] || [];
  const canEdit = groups.includes("admin") || groups.includes("organizers_current");
  if (!canEdit && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to edit this judge");
  }

  const judge = await Judge.findOne(
    { "user.id": req.params.userId },
    { __v: 0 }
  );

  if (!judge) {
    res.status(404).send("Judge not found.");
    return;
  }

  let setResponse = setter(judge);
  if (setResponse instanceof ServerResponse) {
    return;
  }

  await judge.save();

  await getJudgeAttribute(req, res, getter);
}

export async function getMentorAttribute(
  req: Request,
  res: Response,
  getter: (e: any) => any
) {
  // prevent non-admins from viewing mentors
  const groups = res.locals.user["cognito:groups"] || [];
  const canView = groups.includes("admin") || groups.includes("organizers_current");
  if (!canView && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to view this mentor");
  }

  let mentor = await Mentor.findOne(
    { "user.id": req.params.userId },
    { __v: 0 },
    { "treehacks:groups": res.locals.user["cognito:groups"] }
  );

  if (!mentor) {
    res.status(404).send("Mentor not found.");
  } else {
    res.status(200).send(getter(mentor));
  }
}

export async function setMentorAttribute(
  req: Request,
  res: Response,
  setter: (e: any) => any,
  getter: (e: any) => any = (e) => e
) {
  // prevent non-admins from editing other mentors
  const groups = res.locals.user["cognito:groups"] || [];
  const canEdit = groups.includes("admin") || groups.includes("organizers_current");
  if (!canEdit && res.locals.user.sub !== req.params.userId) {
    return res.status(403).send("You do not have access to edit this mentor");
  }

  const mentor = await Mentor.findOne(
    { "user.id": req.params.userId },
    { __v: 0 }
  );

  if (!mentor) {
    res.status(404).send("Mentor not found.");
    return;
  }

  let setResponse = setter(mentor);
  if (setResponse instanceof ServerResponse) {
    return;
  }

  await mentor.save();

  await getMentorAttribute(req, res, getter);
}
