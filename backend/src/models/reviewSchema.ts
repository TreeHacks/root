import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema: Schema = new mongoose.Schema({
  reader: { id: String, email: String },
  cultureFit: Number,
  experience: Number,
  passion: Number,
  isOrganizer: Boolean,
  isBeginner: Boolean
}, { _id: false });

export default reviewSchema;