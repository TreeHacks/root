import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { IApplication } from '../models/Application.d';
import Application from 'backend/models/Application';
import { HACKATHON_YEAR } from 'backend/constants';
import { mergeWith, pickBy } from "lodash";

export function getTeamInfo(req: Request, res: Response) {
    return getApplicationAttribute(req, res, (e: IApplication) => {
        return e.forms.team_info || {};
    }, true);
}

export function setTeamInfo(req: Request, res: Response) {
    return setApplicationAttribute(req, res,
        (e: IApplication) => {
            e.forms.team_info = req.body;
        },
        e => e.forms.team_info
    );
}

// parse existing teammate list, or create one with only user if doesn't exist
function parseList(list: string | null, email: string): Record<string, number> {
    try {
        return JSON.parse(list);
    } catch (_) {
        return { [email]: 1 };
    }
}

// filter out pending teammates from team list
function filterPending(list: Record<string, number>) {
    return pickBy(list, value => value !== 0);
}

// combine team lists, preferring a confirmed teammate (a number 1) over a pending teammate (a number 0)
function combineLists(one: Record<string, number>, two: Record<string, number>): Record<string, number> {
    return mergeWith(one, two, (oneValue, twoValue) => oneValue || twoValue);
}

function applicationByEmail(email: string): PromiseLike<IApplication | null> {
    return Application.findOne(
        { "user.email": email, year: HACKATHON_YEAR },
        { __v: 0, reviews: 0 }
    );
}

// add each teammate from `two` to the teamList of each user in `one`
async function combineTeams(one: Record<string, number>, two: Record<string, number>) {
    for (const email of Object.keys(one)) {
        const teammate = await applicationByEmail(email);
    
        if (!teammate) {
            throw new Error("Teammate not found");
        }

        const teammateList = parseList(teammate.forms.team_info.teamList.toString(), email);
        const newTeam = combineLists(teammateList, two);

        teammate.forms.team_info.teamList = JSON.stringify(newTeam);
        await teammate.save();
    }
}

export async function addTeammate(req: Request, res: Response) {
    // find request user's application
    const user: IApplication | null = await Application.findOne(
        { "user.id": req.params.userId },
        { __v: 0, reviews: 0 }
    );

    if (!user) {
        res.status(404).send("User application not found.");
        return;
    }

    // find requested teammate user's application
    const teammate = await applicationByEmail(req.body.email);

    if (!teammate) {
        res.status(404).send("Teammate application not found.");
        return;
    }

    // filter out user's pending teammates
    const userList = parseList(user.forms.team_info.teamList.toString(), user.user.email);
    const userConfirmed = filterPending(userList);

    // filter out teammate's pending teammates
    const teammateList = parseList(teammate.forms.team_info.teamList.toString(), teammate.user.email);
    const teammateConfirmed = filterPending(teammateList);

    // requested teammate hasn't added user
    if (!teammateList.hasOwnProperty(user.user.email)) {
        userList[teammate.user.email] = 0;
        user.forms.team_info.teamList = JSON.stringify(userList);

        await user.save();
        return;
    }

    // check combined teams at most four people
    const combinedConfirmed = combineLists(userConfirmed, teammateConfirmed);
    if (Object.keys(combinedConfirmed).length > 4) {
        res.status(400).send("Too many combined teammates");
    }

    // for each of user's current teammate, combine with requested teammate
    try {
        await combineTeams(userConfirmed, teammateConfirmed);
    } catch (e) {
        res.status(404).send(e);
        return;
    }

    // for each of requeste teammates's current teammate, combine with user
    try {
        await combineTeams(teammateConfirmed, userConfirmed);
    } catch (e) {
        res.status(404).send(e);
        return;
    }

    res.status(200).send();
}
