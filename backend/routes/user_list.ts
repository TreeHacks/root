import Application from "../models/Application";
import { Request, Response } from 'express';
import { getGenericList } from "./common";

export function getUserList(req: Request, res: Response) {
  return getGenericList(req, res, Application);
}

export function getUserStats(req: Request, res: Response) {
  return Application.aggregate([
    {
      "$facet": {
        "gender": [{ $sortByCount: "$forms.application_info.gender" }],
        "race": [{ // "More than one" if multiple races are selected.
          $sortByCount: {
            $cond: {
              if: { $lte: [{ $size: { $ifNull: ["$forms.application_info.race", []] } }, 1] },
              then: "$forms.application_info.race",
              else: ["More than one"]
            }
          }
        },
        { $unwind: "$_id" }
        ],
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