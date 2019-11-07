import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema: Schema = new mongoose.Schema({
  reader: { id: String, email: String },

  cultureFit: Number,
  experience: Number,
  passion: Number,

  major_prize: Boolean,
  minor_grand_prize: Boolean,
  tech_job: Boolean,
  personal_volume: Boolean,
  personal_quality: Boolean,
  research: Boolean,
  competition: Boolean,
  organizer: Boolean,

  // Deprecated
  isOrganizer: Boolean,
  isBeginner: Boolean
}, { _id: false });

export default reviewSchema;