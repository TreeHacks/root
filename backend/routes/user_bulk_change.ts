import { Request, Response } from 'express';
import Application from "../models/Application";
import { STATUS, TRANSPORTATION_TYPE, TRANSPORTATION_STATUS, HACKATHON_YEAR_STRING } from '../constants';
import { mapValues } from "lodash";

interface IElement {
    acceptanceDeadline: string;
    transportationDeadline: string;
    transportationType: string;
    transportationAmount: string;
    transportationId: string;
    id: string;
}
interface IBulkChangeReqBody {
    ids: (IElement)[],
    status: string
}

export function bulkChangeUsers(req: Request, res: Response) {
    const body = req.body as IBulkChangeReqBody;
    let bulk = Application.collection.initializeUnorderedBulkOp();
    for (let element of body.ids) {
        element = mapValues(element, e => String(e).trim());
        if (body.status == STATUS.ADMITTED) {
            switch (element.transportationType) {
                case TRANSPORTATION_TYPE.BUS:
                case TRANSPORTATION_TYPE.FLIGHT:
                case TRANSPORTATION_TYPE.TRAIN:
                case TRANSPORTATION_TYPE.OTHER:
                    break;
                case "":
                    bulk.find({ "user.id": element.id, "year": HACKATHON_YEAR_STRING }).updateOne({
                        "$set": {
                            "status": body.status,
                            "admin_info.acceptance.deadline": new Date(element.acceptanceDeadline),
                            "transportation_status": TRANSPORTATION_STATUS.UNAVAILABLE
                        }
                    });
                    continue;
                default:
                    res.status(400).send(`Invalid transportation type specified: ${element.transportationType}`);
                    return;
            }
            bulk.find({ "user.id": element.id, "year": HACKATHON_YEAR_STRING }).updateOne({
                $set: {
                    "status": body.status,
                    "admin_info.acceptance.deadline": new Date(element.acceptanceDeadline),
                    "admin_info.transportation": {
                        type: element.transportationType,
                        amount: parseFloat(element.transportationAmount),
                        id: element.transportationId,
                        deadline: new Date(element.transportationDeadline)
                    },
                    "transportation_status": TRANSPORTATION_STATUS.AVAILABLE
                }
            });
        }
        else {
            // todo: append history.
            bulk.find({ "user.id": element.id, "year": HACKATHON_YEAR_STRING }).updateOne({ $set: { status: body.status } });
        }
    }
    return bulk.execute().then(e => {
        res.json({ nModified: e.nModified });
    });
}