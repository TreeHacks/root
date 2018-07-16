import { Request, Response } from 'express';
import {getApplicationAttribute} from "./common"

export function getUserDetail(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e);
}