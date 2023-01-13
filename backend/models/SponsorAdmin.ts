import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface ISponsorAdmin extends mongoose.Document {
  email: string;
  company_id: string;
}

const sponsorAdmin: Schema = new mongoose.Schema({
  email: String,
  company_id: String,
});

const model: Model<ISponsorAdmin> = mongoose.model("SponsorAdmin", sponsorAdmin);
export { model as SponsorAdmin, ISponsorAdmin };
