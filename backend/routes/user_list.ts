import Application from "../models/Application";
import { Request, Response, application } from 'express';
import { getGenericList } from "./common";

export function getUserList(req: Request, res: Response) {
  return getGenericList(req, res, Application);
}

const facetStatsRequest = async () => {
  const result = await Application.aggregate([
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
  ]);
  return result[0];
}
const timelineStatsRequest = async () => {
  const applications = (await Application.find({}, { "type": 1, "status": 1, "_id": 1 })).map(application => ({
    ...application,
    date_created: application._id.getTimestamp()
  })).sort((a, b) => a.date_created - b.date_created);
  let counter: { [x: string]: any } = {
    "type": { "is": 0, "oos": 0, "stanford": 0 },
    "status": { "submitted": 0, "incomplete": 0 }
  };
  let results = [];
  for (let i in applications) {
    const application = applications[i];
    counter.type[application.type]++;
    counter.status[application.status]++;
    results.push({
      num_is: counter.type.is,
      num_oos: counter.type.oos,
      num_stanford: counter.type.stanford,
      num_incomplete: counter.status.incomplete,
      num_submitted: counter.status.submitted,
      date: application.date_created,
      num_total: i + 1
    });
  };
  return results;
}

export async function getUserStats(req: Request, res: Response) {
  const [facetStatsResponse, timelineStatsResponse] = await Promise.all([facetStatsRequest(), timelineStatsRequest()]);
  res.json({
    ...facetStatsResponse,
    timeline: timelineStatsResponse
  });
}