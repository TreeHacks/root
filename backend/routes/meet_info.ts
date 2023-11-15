import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { TRANSPORTATION_STATUS, TRANSPORTATION_TYPE } from "../constants";
import { IApplication } from '../models/Application.d';

// Prepopulate meet_info with first name and last initial from application_info,
// then deletes application_info.
export function prepopulateMeetInfo(result: IApplication) {
    if (!result.forms.meet_info) {
        result.forms.meet_info = {};
    }
    if (result.forms.application_info && result.forms.application_info.first_name && result.forms.application_info.last_name) {
        result.forms.meet_info.first_name = result.forms.application_info.first_name;
        result.forms.meet_info.last_initial = result.forms.application_info.last_name[0];
        delete result.forms.application_info;
    }
}

export function getMeetInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, (e: IApplication) => {
        prepopulateMeetInfo(e);
        return e.forms.meet_info || {};
    }, true);
}

export function setMeetInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            e.forms.meet_info = req.body;
        },
        e => e.forms.meet_info
    );
}