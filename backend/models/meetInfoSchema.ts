import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    phone: String,
    verticals: {type: [String], default: undefined},
    university: String,
    level_of_study: String,
    major: String,
    q1: String,
    q2: String,
    q3: String,
    q_slack: String
}, { _id: false });

export default meetInfoSchema;