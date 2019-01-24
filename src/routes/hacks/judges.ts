import { Request, Response } from 'express';
import Judge from "../../models/Judge";
import { getGenericList } from '../common';

export function getJudgeList(req: Request, res: Response) {
    return getGenericList(req, res, Judge);
}

export async function editJudge(req: Request, res: Response) {
    try {
        res.status(200).send(await Judge.replaceOne({_id: req.params.judgeId}, req.body));
    }
    catch (e) {
        res.status(500).send("Error: " + e);
    }
}