import { Request, Response } from 'express';
import Application from "../models/Application";
import { getApplicationAttribute } from "./common";

export function getUserDetail(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e, true);
}