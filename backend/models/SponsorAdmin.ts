import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface ISponsorAdmin extends mongoose.Document {
  email: string;
  company_id?: number;
}

const sponsorAdmin: Schema = new mongoose.Schema({
  _id: String,
  email: String,
  company_id: Number,
});

const model: Model<ISponsorAdmin> = mongoose.model("SponsorAdmin", sponsorAdmin);
export { model as SponsorAdmin, ISponsorAdmin };
