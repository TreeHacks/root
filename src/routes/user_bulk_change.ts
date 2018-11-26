import { Request, Response } from 'express';
import Application from "../models/Application";

interface IBulkChangeReqBody {
    ids: string[],
    status: string
}

export function bulkChangeUsers(req: Request, res: Response) {
    const body = req.body as IBulkChangeReqBody;
    var bulk = Application.collection.initializeOrderedBulkOp();
    bulk.find({'_id': {$in: body.ids}}).update({$set: {status: body.status}});
    return bulk.execute().then(e => {
        res.json({nModified: e.nModified});
    });
}