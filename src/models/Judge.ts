import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface IJudge extends mongoose.Document {
    _id: string,
    email: string,
    categories: string[]
}

const judgeSchema: Schema = new mongoose.Schema({
    "_id": String,
    "email": String,
    "categories": [String]
});

const model: Model<IJudge> = mongoose.model("Judge", judgeSchema);
export default model;