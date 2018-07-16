import Application from "../models/application";
import { Request, Response } from 'express';

export default {
  getAdditionalInfo: (req: Request, res: Response) => {
    let application = Application.findOne(req.params.id);
    res.status(200).send(JSON.stringify(application.forms.additional_info));
  }
}