import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    verticals: {type: [String], default: undefined},
    idea: String,
    showProfile: Boolean,
    pronouns: String,
    commitment: String,
    skills: {type: [String], default: undefined},
    timezoneOffset: {type: Number, min: -14, max: 14},
    socialLinks: {type: [String], default: undefined},
    // will be prepopulated -- need to add them to the schema so that they can be set
    profilePicture: String,
    first_name: String,
    last_initial: String
}, { _id: false });

export default meetInfoSchema;
