import { Request, Response } from 'express';
import { WebClient } from '@slack/client';
import Application from '../models/Application';
import { IApplication } from '../models/Application.d';
import { get } from 'lodash';

export async function userContact(req: Request, res: Response) {
    let application: IApplication | null = null;

    try {
        application = await Application.findOne(
            { "user.id": req.params.userId }, { "user.email": 1 },
            { "treehacks:groups": ['admin'] });
        if (!application) {
            throw "Application not found";
        }
    }
    catch (e) {
        res.status(404).send("Application not found");
        return;
    }
    console.error(application, application.user);
    const email = application.user.email;
    let phone = get(application, "forms.application_info.phone");
    phone = null;

    const web = new WebClient(process.env.SLACK_OAUTH_ACCESS_TOKEN!);
    let response;
    try {
        response = (await web.users.lookupByEmail({ email }) as any); // TODO: fix slack typings
        const { ok, user } = response;
        if (ok) {
            res.redirect(`https://treehacks2021.slack.com/team/${user.id}`); // TODO: don't hardcode workspace URL
        } else {
            throw "Slack user not found";
        }
    } catch (e) {
        res.type('html').send(`
        <meta http-equiv="refresh" content="0;url=mailto:${email}" />
        This user has not connected with Slack yet.<br>

        Try emailing them (<a href="mailto:${email}">${email}</a>) ${phone ? `or calling them (<a href="tel:${phone}">${phone}</a>) instead.`: "instead."}
        `);
    }
}