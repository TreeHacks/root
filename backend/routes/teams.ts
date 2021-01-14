import { Request, Response } from "express";
import { TEAM_CODE_LENGTH } from "../constants";

import Team from "../models/Team";
import { pick } from "lodash";

function makeCode(length: number): string {
    let baseChar = "A".charCodeAt(0);
    let code = "";

    for (var i = 0; i < length; i++) {
        var rand = Math.floor(Math.random() * 26);
        code += String.fromCharCode(baseChar + rand);
    }

    return code;
}

export async function createTeam(req: Request, res: Response) {
    let userId = req.params.userId;

    if (await Team.findOne({ memberIds: userId })) {
        res.status(400).send(`User ${userId} already part of a team`);
        return;
    }

    let teamCode = makeCode(TEAM_CODE_LENGTH);
    while ((await Team.countDocuments({ code: teamCode })) > 0) {
        teamCode = makeCode(TEAM_CODE_LENGTH);
    }

    let team = new Team({
        code: teamCode,
        memberIds: [userId],
    });
    await team.save();

    res.json({
        success: true,
        data: team,
        userId: userId,
    });
}

export async function setTeamData(req: Request, res: Response) {
    let update = pick(req.body, [
        "name",
        "description",
        "challenges",
        "prizes",
        "technologies",
        "roomLink",
        "open",
    ]);

    let team = await Team.findOneAndUpdate(
        { memberIds: req.params.userId },
        update,
        { new: true }
    );

    if (!team) {
        res.status(400).send("User not part of a team");
        return;
    }

    res.json({
        success: true,
        data: team,
    });
}

export async function joinTeam(req: Request, res: Response) {
    let code = req.body.code;

    let team = await Team.findOneAndUpdate(
        { code: code },
        { $push: { memberIds: req.params.userId } }
    );
    res.json({
        success: true,
        data: team,
    });
}

export async function leaveTeam(req: Request, res: Response) {
    let team = await Team.findOneAndUpdate(
        { memberIds: req.params.userId },
        { $pull: { memberIds: req.params.userId } },
        { new: true }
    );

    res.json({
        success: true,
        data: team,
    });
}

export async function getUserTeamData(req: Request, res: Response) {
    let team = await Team.findOne({ memberIds: req.params.userId }, "+code");

    res.json({
        data: team,
    });
}
