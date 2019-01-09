import Application from "../models/Application";
import { Request, Response } from 'express';
import mapValues from "lodash/mapValues";

export function getUserList(req: Request, res: Response) {

  // Text matching search
  let filter = JSON.parse(req.query.filter || "{}");
  for (let key in filter) {
    // Matching by a string in any location
    if (typeof filter[key] === 'string') {
      filter[key] = { $regex: filter[key], $options: 'i' };
    }
  }
  let queryOptions = {
    "treehacks:groups": res.locals.user['cognito:groups']
  }
  let query = Application.find(filter, JSON.parse(req.query.project || "{}"), queryOptions);
  let sortedAndFilteredQuery =
    query.sort(JSON.parse(req.query.sort || "{}"))
      .skip(parseInt(req.query.page) * parseInt(req.query.pageSize));

  if (parseInt(req.query.pageSize) >= 0) {
    sortedAndFilteredQuery = sortedAndFilteredQuery.limit(parseInt(req.query.pageSize));
  }

  let countQuery = Application.countDocuments(filter);
  countQuery.setOptions(queryOptions);

  Promise.all([
    sortedAndFilteredQuery.lean().exec(),
    countQuery
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