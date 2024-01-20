import mongoose from "mongoose";
import { Schema } from "mongoose";

const teamInfoSchema: Schema = new mongoose.Schema({
    teamList: String,
}, { _id: false });

export default teamInfoSchema;