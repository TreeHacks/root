import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema: Schema = new mongoose.Schema({
  reader_id: String,
  culture_fit: Number,
  experience: Number,
  passion: Number,
  is_organizer: Boolean,
  is_beginner: Boolean
}, { _id : false });

export default reviewSchema;