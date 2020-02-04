import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { STATUS } from '../constants';
import { IApplication } from '../models/Application.d';
import Application from '../models/Application';

export async function getUserProfile(req: Request, res: Response) {
  const userId = res.locals.user['sub'];
  const groups = res.locals.user['cognito:groups'];
  let response: any = {
    email: res.locals.user['email'],
    id: userId,
    groups
  };
  let application = await Application.findOne(
    { "user.id": userId }, { "status": 1, "user": 1, "forms.application_info": 1 },
    { "treehacks:groups": groups });
  if (!application) {
    res.json(response);
  } else {
    response = {
      ...response,
      status: application.status
    };
    if (application.forms && application.forms.application_info) {
      response = {
        ...response,
        first_name: application.forms.application_info.first_name,
        last_name: application.forms.application_info.last_name,
        phone: application.forms.application_info.phone
      };
    }
    res.json(response);
  }
}

export function getApplicationStatus(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => ({status: e.status}));
}

export function setApplicationStatus(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.status = req.body.status,
    e => ({ status: e.status }));
}

export function confirmAdmission(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    (e: IApplication) => {
      if (e.status !== STATUS.ADMITTED) {
        return res.status(403).send("Status is not admitted. It is " + e.status);
      }
      if (new Date(e.admin_info.acceptance.deadline) < new Date()) {
        return res.status(403).send("Acceptance deadline has passed.");
      }
      e.status = STATUS.ADMISSION_CONFIRMED
    },
    e => ({ status: e.status }));
}

export function declineAdmission(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    (e: IApplication) => {
      if (e.status !== STATUS.ADMITTED && e.status !== STATUS.ADMISSION_CONFIRMED) {
        return res.status(403).send("Status is not admitted or admission_confirmed. It is " + e.status);
      }
      if (e.status === STATUS.ADMITTED && new Date(e.admin_info.acceptance.deadline) < new Date()) {
        // Acceptance deadline does not apply for admission_confirmed applicants who decline.
        return res.status(403).send("Acceptance deadline has passed.");
      }
      e.status = STATUS.ADMISSION_DECLINED
    },
    e => ({ status: e.status }));
}