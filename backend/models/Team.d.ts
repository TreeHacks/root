import { Document } from "mongoose";

export interface ITeam extends Document {
    name: string;
    description: string;
    challenges: string[];
    prizes: string[];
    technologies: string[];

    roomLink: string;
    open: boolean; // open to people dropping in

    // populated by API
    code: string; // join code
    memberIds: string[];
}
