import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    verticals: {type: [String], default: undefined},
    idea: String,
    showProfile: Boolean,
    pronouns: String,
    // will be prepopulated -- need to add them to the schema so that they can be set
    first_name: String,
    last_initial: String
}, { _id: false });

export default meetInfoSchema;