import Application from "../models/Application";
import { Request, Response, application } from 'express';
import { getGenericList } from "./common";

export function getUserList(req: Request, res: Response) {
  return getGenericList(req, res, Application);
}

export async function getUserStats(req: Request, res: Response) {
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
    const applications = await Application.find({}, { "type": 1, "_id": 1 });
    return applications.map(application => ({
      type: application.type,
      date_created: application._id.getTimestamp()
    }));
  }
  const [facetStatsResponse, timelineStatsResponse] = await Promise.all([facetStatsRequest(), timelineStatsRequest()]);
  res.json({
    ...facetStatsResponse,
    timeline: timelineStatsResponse
  });
}