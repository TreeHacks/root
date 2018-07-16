import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema: Schema = new mongoose.Schema({
  is_beginner: Boolean
}, { _id : false });

export default reviewSchema;