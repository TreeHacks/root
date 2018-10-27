import Application from "../models/Application";
import { Request, Response } from 'express';

export function getUserList(req: Request, res: Response) {
  Application.find({}, {"forms.application_info": 0, "forms.application_info.resume": 0}).lean().exec(function (err, users) {
    if (err) {
      res.status(400).end(JSON.stringify(err));
    }
    return res.status(200).end(JSON.stringify(users));
  });
};