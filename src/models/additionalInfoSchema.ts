import mongoose from "mongoose";
import { Schema } from "mongoose";
const additionalInfoSchema: Schema = new mongoose.Schema({
  "transportation": {
    "vendor": String,
    "receipt": String,
    "accept": Boolean,
    "address1": String,
    "address2": String,
    "city": String,
    "state": String,
    "zip": String
  }
}, { _id : false });

export default additionalInfoSchema;
