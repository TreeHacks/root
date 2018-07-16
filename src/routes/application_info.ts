import { Request, Response } from 'express';
import {getApplicationAttribute} from "./common"

export function getApplicationInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.application_info);
}