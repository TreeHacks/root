import mongoose from "mongoose";
import { Schema } from "mongoose";

const transportationInfoSchema: Schema = new mongoose.Schema({
  "vendor": String,
  "receipt": String,
  "accept": Boolean,
  "address1": String,
  "address2": String,
  "city": String,
  "state": String,
  "zip": String
}, { _id: false });

export default transportationInfoSchema;
