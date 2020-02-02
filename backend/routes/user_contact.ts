import { Request, Response } from 'express';
import { WebClient } from '@slack/client';
import Application from '../models/Application';
import { IApplication } from '../models/Application.d';

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

    const web = new WebClient(process.env.SLACK_OAUTH_ACCESS_TOKEN!);
    let response;
    try {
        response = (await web.users.lookupByEmail({ email }) as any); // TODO: fix slack typings
        const { ok, user } = response;
        if (ok) {
            res.redirect(`https://treehacks-2020.slack.com/team/${user.id}`); // TODO: don't hardocde workspace URL
        } else {
            throw "Slack user not found";
        }
    } catch (e) {
        res.type('html').send(`
        <meta http-equiv="refresh" content="0;url=mailto:${email}" />
        This user has not connected with Slack yet. Try emailing them instead: <a href="mailto:${email}">${email}</a>
        `);
    }
}