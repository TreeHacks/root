import { Request, Response } from 'express';
import { WebClient } from '@slack/client';

export async function getAnnouncements(req: Request, res: Response) {
    const web = new WebClient(process.env.SLACK_OAUTH_ACCESS_TOKEN!);
    let response;
    try {
        response = await web.conversations.history({
            channel: process.env.SLACK_ANNOUNCEMENTS_CHANNEL_ID!,
            limit: 1000
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: e});
    }
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