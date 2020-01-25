import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    verticals: {type: [String], default: undefined},
    idea: String,
    showProfile: Boolean
}, { _id: false });

export default meetInfoSchema;