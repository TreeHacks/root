import { Request, Response } from 'express';
import Hack from "../../models/Hack";
import { mapValues } from "lodash";
import { IHack } from '../../models/Hack.d';

interface IHacksImportRequestBody {
    items: IHack // Not actually a mongoose document.
}

export async function importHacks(req: Request, res: Response) {
    const body = req.body as IHacksImportRequestBody;
    // if (!(req.body instanceof IHacksImportRequestBody)) {
    //     return res.status(400).send("Invalid request body");
    // }
    await Hack.insertMany(body.items);
    res.status(200).json({status: "Bulk hack import successful."});
}