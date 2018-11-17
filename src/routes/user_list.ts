import Application from "../models/Application";
import { Request, Response } from 'express';

export function getUserList(req: Request, res: Response) {
  Application.find({}, { "forms.application_info": 0, "forms.application_info.resume": 0 }).lean().exec(function (err, users) {
    if (err) {
      res.status(400).end(JSON.stringify(err));
    }
    return res.status(200).end(JSON.stringify(users));
  });
};

export function getUserStats(req: Request, res: Response) {
  return Application.aggregate([
    {
      "$facet": {
        "gender": [{ $sortByCount: "$forms.application_info.gender" }],
        // Todo: race needs to be weighted -- if someone selects two races, it is double-counted.
        "race": [{ $unwind: "$forms.application_info.race" }, { $sortByCount: "$forms.application_info.race" }],
        "hackathon_experience": [{ $sortByCount: "$forms.application_info.hackathon_experience" }],
        "skill_level": [{ $sortByCount: "$forms.application_info.skill_level" }],
        "university": [{ $sortByCount: "$forms.application_info.university" }],
        "location": [{ $sortByCount: "$location" }],
        "type": [{ $sortByCount: "$type" }],
        "status": [{ $sortByCount: "$status" }]
      }
    }
  ]).then(data => {
    res.json(data[0]);
  });
}