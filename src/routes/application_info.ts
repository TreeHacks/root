import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common"

export function getApplicationInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.application_info);
}

export function setApplicationInfo(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.forms.application_info = req.body,
    e => e.forms.application_info
  );
}