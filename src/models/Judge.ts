import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface IJudge extends mongoose.Document {
    _id: string,
    email: string,
    verticals: string[],
    floor: number
}

const judgeSchema: Schema = new mongoose.Schema({
    "_id": String,
    "email": String,
    "verticals": [String],
    "floor": Number
});

const model: Model<IJudge> = mongoose.model("Judge", judgeSchema);
export default model;