import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';

/*
 * Get application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export function getApplicationAttribute(req: Request, res: Response, getter: (e: IApplication) => any) {
  return Application.findOne(
    { "_id": req.params.userId }).then(
      (application: IApplication | null) => {
        if (!application) {
          res.status(404).send("Application not found.");
        }
        else {
          res.status(200).send(getter(application));
        }
      });
}

/*
 * Set application attribute from current request.
 * req - Request (must have userId param)
 * res - Response
 * setter - a function describing what happens to the application before save.
 * getter - function describing what part of the application should be returned from the endpoint.
 */
export function setApplicationAttribute(req: Request, res: Response, setter: (e: IApplication) => any, getter: (e: IApplication) => any = e => e) {
  return Application.findOne(
    { "_id": req.params.userId }).then(
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