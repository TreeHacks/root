import Application from "../models/Application";
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  let applications = Application.find();
  res.status(200).send(JSON.stringify(applications));
};