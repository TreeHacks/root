import mongoose from "mongoose";
import { Schema } from "mongoose";
const additionalInfoSchema: Schema = new mongoose.Schema({
  "transportation": {
    "address": {any: {}},
    "vendor": String,
    "receipt": String,
    "accept": Boolean
  }
}, { _id : false });

export default additionalInfoSchema;