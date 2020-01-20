import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { TRANSPORTATION_STATUS, TRANSPORTATION_TYPE } from "../constants";
import { IApplication } from '../models/Application.d';

export function getMeetInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, e => e.forms.meet_info || {});
}

export function setMeetInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            e.forms.meet_info = req.body;
        },
        e => e.forms.meet_info
    );
}