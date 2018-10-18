import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common"
import { STATUS } from '../constants';

export function getApplicationInfo(req: Request, res: Response) {
  return getApplicationAttribute(req, res, e => e.forms.application_info);
}

export function setApplicationInfo(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => {
      e.forms.application_info = req.body;
      if (e.status == STATUS.INCOMPLETE) {
        // todo: share this with the frontend in some common configuration.
        const requiredFields = [
          "first_name",
          "last_name",
          "phone",
          "dob",
          "gender",
          "race",
          "university",
          "graduation_year",
          "level_of_study",
          "major",
          "accept_terms",
          "accept_share",
          "q1_goodfit",
          "q2_experience"
        ];
        let completed = true;
        for (let requiredField of requiredFields) {
          if (typeof e.forms.application_info[requiredField] === "undefined") {
            completed = false;
          }
        }
        if (completed) {
          e.status = STATUS.SUBMITTED;
          // todo: send email.
        }
      }
    },
    e => e.forms.application_info
  );
}