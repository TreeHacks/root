import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    verticals: {type: [String], default: undefined},
    profileDesc: String,
    idea: String,
    showProfile: Boolean,
    pronouns: String,
    commitment: String,
    skills: {type: [String], default: undefined},
    timezoneOffset: String,
    githubLink: String,
    devpostLink: String,
    linkedinLink: String,
    portfolioLink: String,
    // will be prepopulated -- need to add them to the schema so that they can be set
    profilePicture: String,
    first_name: String,
    last_initial: String,
    isMentor: Boolean,
}, { _id: false });

export default meetInfoSchema;
