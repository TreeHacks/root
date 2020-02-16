import mongoose from "mongoose";
import { Schema } from "mongoose";

const submitInfoSchema: Schema = new mongoose.Schema({
    members: {type: [String], default: undefined},
    url: String
}, { _id: false });

export default submitInfoSchema;
