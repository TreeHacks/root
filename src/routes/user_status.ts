import { Request, Response } from 'express';
import {getApplicationAttribute, setApplicationAttribute} from "./common";

export function getApplicationStatus(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => ({status: e.status}));
}

// Todo: auth
export function setApplicationStatus(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.status = req.body.status,
    e => ({status: e.status}));
}