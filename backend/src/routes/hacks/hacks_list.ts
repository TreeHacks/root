import Hack from "../../models/Hack";
import { getGenericList } from "../common";
import { Request, Response } from "express";
import {set} from "lodash";

export function getHackList(req: Request, res: Response) {
    return getGenericList(req, res, Hack);
}

export async function editHack(req: Request, res: Response) {
    let hack = await Hack.findById(req.params.hackId);
    if (!hack) {
        return res.status(400).send("Hack not found");
    }
    for (let key in req.body) {
        set(hack, key, req.body[key]);
    }
    await hack.save();
    res.status(200).send(hack);
}