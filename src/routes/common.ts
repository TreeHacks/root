import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import { CognitoUser } from "../models/cognitoUser";
import { STATUS } from "../constants";

/*
 * Get application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export function getApplicationAttribute(req: Request, res: Response, getter: (e: IApplication) => any, createIfNotFound=false) {
  return Application.findOne(
    { "_id": req.params.userId }, {"__v": 0}).then(
      (application: IApplication | null) => {
        if (!application) {
          if (createIfNotFound) {
            return createApplication(res.locals.user as CognitoUser).then(e => getApplicationAttribute(req, res, getter, false));
          }
          else {
            res.status(404).send("Application not found.");
          }
        }
        else {
          res.status(200).send(getter(application));
        }
      });
}

/*
 * Set application attribute from current request, return updated values.
 * req - Request (must have userId param)
 * res - Response
 * setter - a function describing what happens to the application before save.
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export function setApplicationAttribute(req: Request, res: Response, setter: (e: IApplication) => any, getter: (e: IApplication) => any = e => e) {
  return Application.findOne(
    { "_id": req.params.userId }, {"__v": 0}).then(
      (application: IApplication | null) => {
        if (!application) {
          res.status(404).send("Application not found.");
          return;
        }
        if (application.status === STATUS.SUBMITTED) {
          res.status(400).send("Application is already submitted. If you need to change anything, please contact hello@treehacks.com.");
          return;
        }
        else {
          setter(application);
          return application.save();
        }
      }).then((application: IApplication) => {
        res.status(200).send(getter(application));
      });
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
  let applicationType = user["custom:location"] === "CA" ? "is": "oos";
  if (user.email.match(/@stanford.edu$/)) {
    applicationInfo = {
      "university": "Stanford University"
    };
    applicationType = "stanford";
  }
  const application = new Application({
    "_id": user.sub,
    "forms": {
      "application_info": applicationInfo,
      "additional_info": { }
    },
    "admin_info": {},
    "reviews": [],
    "user": { "email": user.email },
    "type": applicationType
  });
  return await application.save(); // todo: return something else here?
}