import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute, getDeadline } from "./common"
import { STATUS, TYPE, TRANSPORTATION_STATUS, AUTO_ADMIT_STANFORD, applicationRequiredFieldsStanford, applicationRequiredFields } from '../constants';
import { sendApplicationSubmittedEmail } from "../services/send_email";
import { IApplication } from '../models/Application.d';

export function getApplicationInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.application_info);
}

export function setApplicationInfo(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    (e: IApplication) => {
      if (e.status !== STATUS.INCOMPLETE) {
        return res.status(403).send("Application is already submitted. If you need to change anything, please contact hello@treehacks.com.");
      }
      e.forms.application_info = req.body
    },
    e => e.forms.application_info,
    true
  );
}

export async function submitApplicationInfo(req: Request, res: Response) {
  return await setApplicationAttribute(req, res,
    e => {
      if (e.status !== STATUS.INCOMPLETE) {
        return res.status(403).send("Application is already submitted. If you need to change anything, please contact hello@treehacks.com.");
      }
      let requiredFields = e.type === TYPE.STANFORD ? applicationRequiredFieldsStanford : applicationRequiredFields;
      let completed = true;
      for (let requiredField of requiredFields) {
        if (typeof e.forms.application_info[requiredField] === "undefined") {
          completed = false;
        }
      }
      if (completed) {
        // Auto-admit Stanford students.
        if (AUTO_ADMIT_STANFORD && e.type === TYPE.STANFORD) {
          e.status = STATUS.ADMISSION_CONFIRMED;
          e.transportation_status = TRANSPORTATION_STATUS.UNAVAILABLE;
        }
        else {
          e.status = STATUS.SUBMITTED;
          sendApplicationSubmittedEmail(res.locals.user.email);
        }
      }
      else {
        return res.status(403).send("Not all required fields are complete. Required fields are " + requiredFields.join(", "));
      }
    },
    e => e.forms.application_info,
    true
  );
}