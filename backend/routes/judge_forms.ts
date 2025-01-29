import { Request, Response } from 'express';
import { getJudgeAttribute, setJudgeAttribute } from "./common";

export function getJudgeForms(req: Request, res: Response) {
    return getJudgeAttribute(req, res, e => e.forms || {});
}

export function getJudgeMealInfo(req: Request, res: Response) {
    return getJudgeAttribute(req, res, e => {
        return e.forms.meal_info || {};
    });
}

export function setJudgeMealInfo(req: Request, res: Response) {
    return setJudgeAttribute(req, res,
        e => {
            e.forms.meal_info = req.body;
        },
        e => e.forms.meal_info
    );
}

export function getJudgeCheckInInfo(req: Request, res: Response) {
    return getJudgeAttribute(req, res, e => {
        return e.forms.check_in_info || {};
    });
}

export function setJudgeCheckInInfo(req: Request, res: Response) {
    return setJudgeAttribute(req, res,
        e => {
            e.forms.check_in_info = req.body;
        },
        e => e.forms.check_in_info
    );
}
