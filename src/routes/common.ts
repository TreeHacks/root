import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';

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