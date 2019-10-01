import { Request, Response } from 'express';
import { WebClient } from '@slack/client';
import {filter} from "lodash";

export async function getAnnouncements(req: Request, res: Response) {
    const web = new WebClient(process.env.SLACK_OAUTH_ACCESS_TOKEN!);
    const response = await web.channels.history({
        channel: process.env.SLACK_ANNOUNCEMENTS_CHANNEL_ID!,
        count: 1000
    });
    if (response.ok === true && response["messages"]) {
        // Filter out channel_join messages
        const history = response["messages"]
            .filter(e => e.type === "message" && !e.subtype);
        return res.status(200).json(history);
    }
    else {
        return res.status(500).json(response);
    }  
}