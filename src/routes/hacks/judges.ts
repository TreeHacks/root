import { Request, Response } from 'express';
import Judge from "../../models/Judge";
import { getGenericList } from '../common';
import {set} from "lodash";

export function getJudgeList(req: Request, res: Response) {
    return getGenericList(req, res, Judge);
}

export async function editJudge(req: Request, res: Response) {
    let judge = await Judge.findById(req.params.judgeId);
    if (!judge) {
        return res.status(400).send("Judge not found");
    }
    for (let key in req.body) {
        set(judge, key, req.body[key]);
    }
    await judge.save();
    res.status(200).send(judge);
}