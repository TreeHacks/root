import { Request, Response } from 'express';
import { bulkAutoCreateUser } from '../services/auth_actions';
import queryString from "query-string";
import axios from "axios";

/*
POST /mentor_create
JSON body:
{
    "email":  "...",
    "token": "..."
}
*/

export async function mentorCreate(req: Request, res: Response) {
    if (req.body.token !== process.env.MENTOR_SLACK_INVITE_SECRET_TOKEN) {
        return res.status(400).send("invalid token");
    }
    const { password, error } = await bulkAutoCreateUser({
        email: req.body.email,
        group: "mentor"
    });
    if (error) {
        res.json({
            success: false,
            error: error
        });
    }
    let slackInviteSent = false;
    try {
        const url = "https://slack.com/api/users.admin.invite?" + queryString.stringify({
            token: process.env.SLACK_LEGACY_INVITE_TOKEN,
            email: req.body.email,
            channels: process.env.MENTOR_SLACK_INVITE_DEFAULT_CHANNEL
        });
        const slackResponse = await axios.get(url);
        if (!slackResponse.data.ok) {
            throw "not ok";
        }
        slackInviteSent = true;
    } catch (e) {
    }
    res.json({
        success: true,
        temporaryPassword: password,
        slackInviteSent: slackInviteSent
    });
}