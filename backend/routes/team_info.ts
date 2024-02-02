import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common";
import { IApplication } from '../models/Application.d';
import Application from '../models/Application';
import { HACKATHON_YEAR } from '../constants';
import { mergeWith, pickBy, without } from "lodash";

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
            throw new Error("Teammate not found.");
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
        res.status(404).json({message: "User application not found."});
        return;
    }

    // find requested teammate user's application
    const teammate = await applicationByEmail(req.body.email);

    if (!teammate) {
        res.status(404).json({message: "Teammate application not found."});
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
        res.status(200).json(user.forms.team_info);
        return;
    }

    // check combined teams at most four people
    const combinedConfirmed = combineLists(userConfirmed, teammateConfirmed);
    if (Object.keys(combinedConfirmed).length > 4) {
        res.status(400).json({message: "Too many combined teammates."});
    }

    // for each of user's current teammate, combine with requested teammate
    try {
        await combineTeams(userConfirmed, teammateConfirmed);
    } catch (e: any) {
        res.status(404).json({message: e.message});
        return;
    }

    // for each of requeste teammates's current teammate, combine with user
    try {
        await combineTeams(teammateConfirmed, userConfirmed);
    } catch (e: any) {
        res.status(404).json({message: e.message});
        return;
    }

    res.status(200).json(user.forms.team_info);
}

// remove an email `removed` from each confirmed teammate in `team`
async function removeTeammateFromAll(team: Record<string, number>, removed: string) {
    for (const email of without(Object.keys(team), removed)) {
        const teammate = await applicationByEmail(email);
    
        if (!teammate) {
            throw new Error("Teammate not found.");
        }

        const teammateList = parseList(teammate.forms.team_info.teamList.toString(), email);
        delete teammateList[removed];

        teammate.forms.team_info.teamList = JSON.stringify(teammateList);
        await teammate.save();
    }
}

export async function removeTeammate(req: Request, res: Response) {
    // find request user's application
    const user: IApplication | null = await Application.findOne(
        { "user.id": req.params.userId },
        { __v: 0, reviews: 0 }
    );

    if (!user) {
        res.status(404).json({message: "User application not found."});
        return;
    }

    // find removed teammate user's application
    const teammate = await applicationByEmail(req.body.email);

    if (!teammate) {
        res.status(404).json({message: "Teammate application not found."});
        return;
    }

    // filter out user's pending teammates
    const userList = parseList(user.forms.team_info.teamList.toString(), user.user.email);
    const userConfirmed = filterPending(userList);

    // ensure email exists in team
    if (!userList.hasOwnProperty(teammate.user.email)) {
        res.status(400).json({message: "Removed teammate is not in user's team list."});
        return;
    }

    // if pending, only remove from user's team list
    if (!userConfirmed.hasOwnProperty(teammate.user.email)) {
        delete userList[teammate.user.email];
        user.forms.team_info.teamList = JSON.stringify(userList);
        await user.save()

        res.status(200).json(user.forms.team_info);
        return;
    }

    // delete all emails except self and pending teammates in deleted user's team list
    const teammateList = parseList(teammate.forms.team_info.teamList.toString(), teammate.user.email);
    for (const email of without(Object.keys(teammateList), teammate.user.email)) {
        if (teammateList[email] === 1) {
            delete teammateList[email];
        }
    }

    teammate.forms.team_info.teamList = JSON.stringify(teammateList);
    await teammate.save();

    // for each user in the team except the deleted user,
    // remove the deleted user's email
    try {
        await removeTeammateFromAll(userConfirmed, teammate.user.email);
    } catch (e: any) {
        res.status(404).json({message: e.message});
        return;
    }

    res.status(200).json(user.forms.team_info);
}
