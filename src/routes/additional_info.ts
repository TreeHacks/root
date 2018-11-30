import Application from "../models/Application";
import { IApplication } from "../models/Application.d";
import { Request, Response } from 'express';
import {getApplicationAttribute, setApplicationAttribute} from "./common";
import { setApplicationStatus } from "./user_status";
import { ALLOWED_TRANSITIONS_USER, TRANSPORTATION_STATUS } from "../constants";

// export function getAdditionalInfo(req: Request, res: Response) {
//   return getApplicationAttribute(req, res, e => e.forms.additional_info);
// }

// export function setAdditionalInfo(req: Request, res: Response) {
//   return setApplicationAttribute(req, res,
//     e => e.forms.additional_info = req.body,
//     e => e.forms.additional_info
//   );
// }