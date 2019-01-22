import Hack from "../../models/Hack";
import { getGenericList } from "../common";
import { Request, Response } from "express";

export function getHackList(req: Request, res: Response) {
    return getGenericList(req, res, Hack);
}