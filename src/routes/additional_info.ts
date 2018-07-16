import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import {getApplicationAttribute, setApplicationAttribute} from "./common";

export function getAdditionalInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.additional_info);
}

export function setAdditionalInfo(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.forms.additional_info = req.body,
    e => e.forms.additional_info
  );
}