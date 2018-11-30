import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { ALLOWED_TRANSITIONS_USER, TRANSPORTATION_STATUS } from "../constants";

export function getTransportationInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, e => e.forms.transportation || {});
  }

export function setTransportationInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        e => {
            if (e.transportation_status === TRANSPORTATION_STATUS.AVAILABLE) {
                e.forms.transportation = req.body;
            }
            else {
                res.status(400).send("Transportation form status is not 'AVAILABLE'.");
            }
        },
        e => e.forms.transportation
    );
}

export function submitTransportationInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        e => {
            if (e.transportation_status !== TRANSPORTATION_STATUS.AVAILABLE) {
                res.status(400).send("Transportation form status is not 'AVAILABLE'.");
            }
            // todo: make list of required fields.
            // todo: share this with the frontend in some common configuration.
            const requiredFields = [];
            let completed = true;
            for (let requiredField of requiredFields) {
                if (typeof e.forms.application_info[requiredField] === "undefined") {
                    completed = false;
                }
            }
            if (completed) {
                e.transportation_status = TRANSPORTATION_STATUS.SUBMITTED;
            }
            else {
                res.status(400).send("Not all required fields have been submitted.");
            }
        },
        e => e.forms.transportation,
        false
    );
}