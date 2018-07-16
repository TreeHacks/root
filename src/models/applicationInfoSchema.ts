import mongoose from "mongoose";
import { Schema } from "mongoose";
const applicationInfoSchema: Schema = new mongoose.Schema({
  university: String
}, { _id : false });

export default applicationInfoSchema;