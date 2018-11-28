import { Request, Response } from 'express';
import {getApplicationAttribute, setApplicationAttribute} from "./common";
import { STATUS } from '../constants';

export function getApplicationStatus(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => ({status: e.status}));
}

export function setApplicationStatus(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.status = req.body.status,
    e => ({status: e.status}));
}

export function confirmAdmission(req: Request, res: Response) {
  return confirmDenyAdmission(req, res, STATUS.ADMISSION_CONFIRMED);
}

export function declineAdmission(req: Request, res: Response) {
  return confirmDenyAdmission(req, res, STATUS.ADMISSION_DECLINED);
}

function confirmDenyAdmission(req, res, newStatus) {
  return setApplicationAttribute(req, res,
    e => {
      if (e.status !== STATUS.ADMITTED) {
        res.send(400).send("Status is not admitted.");
      }
      e.status = newStatus
    },
    e => ({status: e.status}));
}