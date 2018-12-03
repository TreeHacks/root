import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import { CognitoUser } from "../models/cognitoUser";
import { STATUS } from "../constants";
import { uploadBase64Content, generateSignedUrlForFile } from "../services/file_actions";

function getDeadline(type) {
  switch (type) {
      case "is":
          return new Date("2018-11-27T07:59:00.000Z");
      case "stanford":
          return new Date("2019-02-14T07:59:00.000Z");
      case "oos":
      default:
          return new Date("2018-11-20T07:59:00.000Z");
  }
}

export async function injectDynamicApplicationContent(application: IApplication) {
  // Inject fresh resume url from s3
  const resume = application && application.forms.application_info.resume;
  if (resume && resume.indexOf('data:') !== 0) {
    try {
      const url = await generateSignedUrlForFile(application._id);
      application.forms.application_info.resume = url;
    } catch (e) {
      // fall through - fixme add error logging
      console.error(e);
    }
  }

  return application;
}

/*
 * Get application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export async function getApplicationAttribute(req: Request, res: Response, getter: (e: IApplication) => any, createIfNotFound = false) {
  let application: IApplication | null = await Application.findOne(
    { "_id": req.params.userId }, { "__v": 0, "reviews": 0 });

  if (!application) {
    if (createIfNotFound) {
      return createApplication(res.locals.user as CognitoUser).then(e => getApplicationAttribute(req, res, getter, false));
    }
    else {
      res.status(404).send("Application not found.");
    }
  }
  else {
    // Inject resume from s3
    application = await injectDynamicApplicationContent(application);

    res.status(200).send(getter(application));
  }
}

/*
 * Set application attribute from current request, return updated values.
 * req - Request (must have userId param)
 * res - Response
 * setter - a function describing what happens to the application before save.
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export async function setApplicationAttribute(req: Request, res: Response, setter: (e: IApplication) => any, getter: (e: IApplication) => any = e => e, considerDeadline = false) {
  const application: IApplication | null = await Application.findOne(
    { "_id": req.params.userId }, { "__v": 0, "reviews": 0 });

  if (!application) {
    res.status(404).send("Application not found.");
    return;
  }
  if (application.status === STATUS.SUBMITTED) {
    res.status(403).send("Application is already submitted. If you need to change anything, please contact hello@treehacks.com.");
    return;
  }

  let deadline = getDeadline(application.type);
  if (considerDeadline && (deadline < new Date())) {
    res.status(403).send(`Application deadline has already passed: ${deadline.toLocaleString()}`);
    return;
  }

  const originalResume = application.forms.application_info.resume;

  setter(application);

  // Handle base64 resumes => s3
  // If upload fails for whatever reason, just persist the base64
  const resume = application.forms.application_info.resume;
  if (resume && resume.indexOf('data:') === 0) {
    try {
      const result = await uploadBase64Content(application._id, resume);
      if (result.Key) {
        application.forms.application_info.resume = result.Key;
      }
    } catch (e) {
      // fall through - fixme add error logging
      console.error(e);
    }
  } else {
    // If resume was not freshly uploaded, just persist the old one
    application.forms.application_info.resume = originalResume;
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
  if (user.email.match(/@stanford.edu$/)) {
    applicationInfo = {
      "university": "Stanford University"
    };
    applicationType = "stanford";
    applicationLocation = "California";
  }
  const application = new Application({
    "_id": user.sub,
    "forms": {
      "application_info": applicationInfo
    },
    "admin_info": {},
    "reviews": [],
    "user": { "email": user.email },
    "type": applicationType,
    "location": applicationLocation
  });
  return await application.save(); // todo: return something else here?
}