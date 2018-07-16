import Application from "../models/application";
import { Request, Response } from 'express';

export default {
  getAdditionalInfo: (req: Request, res: Response) => {
    return Application.findOne(req.params.id, application => {
      res.status(200).send(application.forms.additional_info);
    });
  },
  setAdditionalInfo: (req: Request, res: Response) => {
    return Application.findOneAndUpdate(req.params.id, {"$set": {"additional_info": req.params.additional_info} }, application => {
      res.status(200).send(application.forms.additional_info);
    });
  }
}