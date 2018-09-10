import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';

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
          console.log("NOT FOUND");
          if (createIfNotFound) {
            createApplication(req.params.userId).then(e => getApplicationAttribute(req, res, getter, createIfNotFound));
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
        }
        else {
          setter(application);
          return application.save();
        }
      }).then((application: IApplication) => {
        res.status(200).send(getter(application));
      });
}

/* Create application. Lookup userId in cognito user pool, then set starting parameters accordingly.
 * userId - user ID.
 */
export function createApplication(userId: string) {
  // TODO: Look up cognito user id, email for out of state.
  const application = new Application({
    "_id": userId,
    "forms": {
      "application_info": { "university": "stanford" },
      "additional_info": { "bus_confirmed_spot": true }
    },
    "admin_info": {},
    "reviews": [],
    "user": { "name": "default_user", "email": "default_email@default_email.com" },
    "type": "oos"
  });
  return application.save();
}