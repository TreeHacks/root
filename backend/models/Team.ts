import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { ITeam } from "./Team.d";
import { MAX_TEAM_SIZE } from "../constants";

const teamSchema: Schema = new mongoose.Schema(
    {
        name: String,
        description: String,
        challenges: [String],
        prizes: [String],
        technologies: [String],

        roomLink: String,
        // open to people dropping in
        open: {
            type: Boolean,
            default: false,
        },

        // created by API
        // join code
        code: {
            type: String,
            unique: true,
            index: true,
            select: false,
            immutable: true
        },
        memberIds: {
            type: [String],
            validate: [validateMemberIds, "Team exceeds maximum size"],
        },
    },
    { strict: true }
);

function validateMemberIds(memberIds: string[]): boolean {
    return memberIds.length <= MAX_TEAM_SIZE;
}

const model: Model<ITeam> = mongoose.model("Team", teamSchema);
export default model;
