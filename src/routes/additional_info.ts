import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import {getApplicationAttribute} from "./common"

export function getAdditionalInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.additional_info);
}

export function setAdditionalInfo(req: Request, res: Response) {
  return Application.findOneAndUpdate(
    {"_id": req.params.userId},
    { "$set": { "additional_info": req.body.additional_info } },
    (application: IApplication) => {
      res.status(200).send(application.forms.additional_info);
    });
}