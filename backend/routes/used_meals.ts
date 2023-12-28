import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { IApplication } from '../models/Application.d';

export function getMeetInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, (e: IApplication) => {
        return e.used_meals || {};
    }, true);
}

export function setMeetInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            e.forms.used_meals = req.body;
        },
        e => e.forms.used_meals
    );
}
