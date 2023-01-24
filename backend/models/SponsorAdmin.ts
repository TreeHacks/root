import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface ISponsorAdmin extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
}

const sponsorAdmin: Schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  company_id: String,
});

const model: Model<ISponsorAdmin> = mongoose.model("SponsorAdmin", sponsorAdmin);
export { model as SponsorAdmin, ISponsorAdmin };
