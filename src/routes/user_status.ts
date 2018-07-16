import { Request, Response } from 'express';
import {getApplicationAttribute} from "./common"

export function getApplicationStatus(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => ({status: e.status}));
}