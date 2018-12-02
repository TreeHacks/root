import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { ALLOWED_TRANSITIONS_USER, TRANSPORTATION_STATUS } from "../constants";
import { IApplication } from '../models/Application.d';

export function getTransportationInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, e => e.forms.transportation || {});
  }

export function setTransportationInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            if (e.transportation_status !== TRANSPORTATION_STATUS.AVAILABLE) {
                return res.status(403).send("Transportation form status is not 'AVAILABLE'.");
            }
            if (new Date(e.admin_info.transportation.deadline) > new Date()) {
                res.status(403).send("Transportation deadline has passed.");
            }
            e.forms.transportation = req.body;
        },
        e => e.forms.transportation
    );
}

export function submitTransportationInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            if (e.transportation_status !== TRANSPORTATION_STATUS.AVAILABLE) {
                return res.status(403).send("Transportation form status is not 'AVAILABLE'.");
            }
            if (new Date(e.admin_info.transportation.deadline) > new Date()) {
                return res.status(403).send("Transportation deadline has passed.");
            }
            // todo: make list of required fields.
            // todo: share this with the frontend in some common configuration.
            // const requiredFields = [];
            let completed = true;
            // for (let requiredField of requiredFields) {
            //     if (typeof e.forms.application_info[requiredField] === "undefined") {
            //         completed = false;
            //     }
            // }
            if (completed) {
                e.transportation_status = TRANSPORTATION_STATUS.SUBMITTED;
            }
            else {
                res.status(400).send("Not all required fields have been submitted.");
            }
        },
        e => e.forms.transportation
    );
}