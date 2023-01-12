import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { ISponsor } from "./Sponsor.d";
import { HACKATHON_YEAR_STRING } from "../constants";

function setCurrentYear(this: ISponsor) {
  if (!this.year) {
    this.year = HACKATHON_YEAR_STRING;
  }
}

function sponsorCurrentYear(this: mongoose.Query<ISponsor>) {
  const query = this.getQuery();
  this.setQuery({ ...query, year: HACKATHON_YEAR_STRING });
}

const sponsorSchema: Schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  logo_url: String,
  website_url: String,
  prizes: [String],
  users: {
    admin_ids: [Number],
    hacker_ids: [Number],
  },
  year: String,
  created_at: Number,
  updated_at: Number,
});

sponsorSchema.pre("find", sponsorCurrentYear);
sponsorSchema.pre("findOne", sponsorCurrentYear);
sponsorSchema.pre("save", setCurrentYear);

const model: Model<ISponsor> = mongoose.model("Sponsor", sponsorSchema);

export { model as Sponsor };
