import { Request, Response } from 'express';
import { getMentorAttribute, setMentorAttribute } from "./common";

export function getMentorForms(req: Request, res: Response) {
    return getMentorAttribute(req, res, e => e.forms || {});
}

export function getMentorMealInfo(req: Request, res: Response) {
    return getMentorAttribute(req, res, e => {
        return e.forms.meal_info || {};
    });
}

export function setMentorMealInfo(req: Request, res: Response) {
    return setMentorAttribute(req, res,
        e => {
            e.forms.meal_info = req.body;
        },
        e => e.forms.meal_info
    );
}

export function getMentorCheckInInfo(req: Request, res: Response) {
    return getMentorAttribute(req, res, e => {
        return e.forms.check_in_info || {};
    });
}

export function setMentorCheckInInfo(req: Request, res: Response) {
    return setMentorAttribute(req, res,
        e => {
            e.forms.check_in_info = req.body;
        },
        e => e.forms.check_in_info
    );
}
