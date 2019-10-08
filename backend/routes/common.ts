import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import { CognitoUser } from "../models/cognitoUser";
import { STATUS, TYPE, TRANSPORTATION_STATUS } from "../constants";
import { uploadBase64Content, generateSignedUrlForFile } from "../services/file_actions";
import { injectDynamicApplicationContent } from "../utils/file_plugin";
import { ServerResponse } from "http";
import { Model } from "mongoose";

export function getDeadline(type) {
  switch (type) {
    case "is":
      return new Date("2018-11-27T07:59:00.000Z");
    case "stanford":
      return new Date("2019-02-18T07:59:00.000Z");
    case "oos":
    default:
      return new Date("2018-11-20T07:59:00.000Z");
  }
}

/*
 * Get application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export async function getApplicationAttribute(req: Request, res: Response, getter: (e: IApplication) => any, createIfNotFound = false) {
  let application: IApplication | null = await Application.findOne(
    { "user.id": req.params.userId }, { "__v": 0, "reviews": 0 },
    { "treehacks:groups": res.locals.user['cognito:groups'] });

  if (!application) {
    if (createIfNotFound) {
      return createApplication(res.locals.user as CognitoUser).then(e => getApplicationAttribute(req, res, getter, false));
    }
    else {
      res.status(404).send("Application not found.");
    }
  }
  else {
    application = await injectDynamicApplicationContent(application) as IApplication;
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
export async function setApplicationAttribute(req: Request, res: Response, setter: (e: IApplication) => any, getter: (e: IApplication) => any = e => e, considerDeadline = false) {
  const application: IApplication | null = await Application.findOne(
    { "user.id": req.params.userId }, { "__v": 0, "reviews": 0 });

  if (!application) {
    res.status(404).send("Application not found.");
    return;
  }

  let deadline = getDeadline(application.type);
  if (considerDeadline && (deadline < new Date())) {
    res.status(403).send(`Application deadline has already passed: ${deadline.toLocaleString()}`);
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
  let transportationStatus: (string | null) = null;
  if (user.email.match(/@stanford.edu$/)) {
    applicationInfo = {
      "university": "Stanford University"
    };
    applicationType = "stanford";
    applicationLocation = "California";
    const existingApplication = await Application.findOne({ "user.email": user.email });
    if (existingApplication) {
      return existingApplication;
    }
  }
  const application = new Application({
    "forms": {
      "application_info": applicationInfo
    },
    "admin_info": {},
    "reviews": [],
    "user": { "email": user.email, "id": user.sub },
    "type": applicationType,
    "location": applicationLocation,
    "status": applicationStatus,
    "transportation_status": transportationStatus
  });
  return await application.save(); // todo: return something else here?
}

export function getGenericList(req: Request, res: Response, Model: Model<any>) {
  // Text matching search
  let filter = JSON.parse(req.query.filter || "{}");
  for (let key in filter) {
    // Matching by a string in any location
    if (typeof filter[key] === 'string') {
      filter[key] = { $regex: '^' + filter[key], $options: 'i' };
    }
  }
  let queryOptions = {
    "treehacks:groups": res.locals.user && res.locals.user['cognito:groups']
  }
  let query = Model.find(filter, JSON.parse(req.query.project || "{}"), queryOptions);
  let sortedAndFilteredQuery =
    query.sort(JSON.parse(req.query.sort || "{}"))
      .skip(parseInt(req.query.page) * parseInt(req.query.pageSize));

  if (parseInt(req.query.pageSize) >= 0) {
    sortedAndFilteredQuery = sortedAndFilteredQuery.limit(parseInt(req.query.pageSize));
  }

  let countQuery = Model.countDocuments(filter);
  countQuery.setOptions(queryOptions);

  Promise.all([
    sortedAndFilteredQuery.lean().exec(),
    countQuery
  ])
    .then(([results, count]) => {
      return res.status(200).json({
        results: results,
        count: count
      });
    }).catch(err => {
      return res.status(400).json(err);
    })
}