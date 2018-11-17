import Application from "../models/Application";
import { Request, Response } from 'express';
import mapValues from "lodash/mapValues";

export function getUserList(req: Request, res: Response) {
  
  // Text matching search
  let filtered = JSON.parse(req.query.filtered);
  for (let key in filtered) {
    filtered[key] = {$regex: filtered[key]};
  }

  Promise.all([
    Application.find(filtered)
      .sort(JSON.parse(req.query.sorted))
      .skip(parseInt(req.query.page) * parseInt(req.query.pageSize))
      .limit(parseInt(req.query.pageSize))
      .lean().exec(),
    Application.find({}).count()
  ])
    .then(([results, count]) => {
      return res.status(200).json({
        results: results,
        count: count
      });
    }).catch(err => {
      return res.status(400).json(err);
    })
};

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