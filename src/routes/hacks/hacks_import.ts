import { Request, Response } from 'express';
import Hack from "../../models/Hack";
import { mapValues } from "lodash";
import { IHack } from '../../models/Hack.d';

interface IHacksImportRequestBody {
    items: IHack[] // Not actually a mongoose document.,
    floor: number
}

export async function importHacks(req: Request, res: Response) {
    let body = req.body as IHacksImportRequestBody;
    // if (!(req.body instanceof IHacksImportRequestBody)) {
    //     return res.status(400).send("Invalid request body");
    // }
    if (!body.floor) {
        return res.status(400).send("No floor specified");
    }
    let maxHack = (await Hack.find().sort({_id:-1}).limit(1))[0];
    let maxNumber = (maxHack && maxHack._id) || -1;
    for (let item of body.items) {
        maxNumber++;
        item._id = maxNumber;
        item.floor = body.floor;
    }
    await Hack.insertMany(body.items);
    res.status(200).json({status: "Bulk hack import successful."});
}