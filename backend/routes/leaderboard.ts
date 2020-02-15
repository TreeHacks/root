import { Request, Response } from 'express';
import axios from "axios";
import Application from "../models/Application";
const mongoose = require('mongoose')

export async function leaderboard(req: Request, res: Response) {
    const url = "https://api.eventive.org/reports/passholder_tickets_tags";
    const data = {
        "api_key": process.env.EVENTIVE_API_KEY,
        "event_bucket": process.env.EVENTIVE_EVENT_BUCKET,
    }
    try {
        const response = await axios.post(url, data);
        let ids = [];
        let display_types = [];
        for (var key in response.data) {
          var user_id = response.data[key]["data"]["data_1548654864366"]
          var event_data = {};
          if (user_id) {
            event_data = response.data[key]["attendance"]
          }
          user_id && ids.push({
            id: user_id,
            events: event_data
          });

          Object.keys(event_data).map(key =>
            !display_types.includes(key) && display_types.push(key)
          );
        }

        let sorted_data = []
        display_types.map(type => {
          let type_data = [];
          ids.map(id => {
            if (Object.keys(id["events"]).includes(type)) {
              type_data.push({
                id: id["id"],
                num: id["events"][type]
              })
            }
          });
          type_data = type_data.sort(
            function (a,b) {
              return b["num"] - a["num"];
            }
          ).slice(0, 10);
          sorted_data.push({
            type: type,
            data: type_data
          });
        });
        let best_ids = [];
        sorted_data.map(type_data =>
          type_data["data"].map(data_point => {
            !best_ids.includes(data_point["id"]) && best_ids.push(data_point["id"]);
          })
        );
        const user_response = await Application.find({"user.id": {$in: best_ids}}, {"forms.application_info.first_name": 1, "forms.application_info.last_name": 1, "forms.meet_info.profilePicture": 1, "user.id": 1});

        user_response.forEach(data =>
          sorted_data.forEach(type_data =>
            type_data["data"].forEach(data_point => {
              console.log(data.user["id"]);
              console.log(data_point["id"]);
              if (data.user["id"] == data_point["id"]) {
                if (!data.forms || !data.forms.application_info) {
                  return;
                }
                data_point["first_name"] = data.forms.application_info.first_name;
                data_point["last_name"] = data.forms.application_info.last_name;
                data_point["picture"] = data.forms.meet_info && data.forms.meet_info.profilePicture;
              }
            })
          )
        );

        return res.json({
            success: true,
            data: sorted_data
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
}
