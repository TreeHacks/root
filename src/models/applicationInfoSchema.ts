import mongoose from "mongoose";
import { Schema } from "mongoose";
const applicationInfoSchema: Schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone: String,
  dob: String,
  gender: String,
  race: [String],
  university: String,
  graduation_year: String,
  level_of_study: String,
  major: String,
  resume: String,
  accept_terms: Boolean,
  accept_share: Boolean,
  q1_goodfit: String,
  q2_experience: String
}, { _id : false });

export default applicationInfoSchema;