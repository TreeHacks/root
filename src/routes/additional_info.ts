import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';

export function getAdditionalInfo(req: Request, res: Response) {
  return Application.findOne(
    { "user": req.params.userId }).then(
      (application: IApplication | null) => {
        if (!application) {
          res.status(404).send("Resource not found.");
        }
        else {
          res.status(200).send(application.forms.additional_info);
        }
      });
}

export function setAdditionalInfo(req: Request, res: Response) {
  return Application.findOneAndUpdate(
    req.params.userId,
    { "$set": { "additional_info": req.body.additional_info } },
    (application: IApplication) => {
      res.status(200).send(application.forms.additional_info);
    });
}