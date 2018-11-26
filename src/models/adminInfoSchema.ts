import mongoose from "mongoose";
import { Schema } from "mongoose";
import { values } from "lodash";
import { TRANSPORTATION_TYPE } from "../constants";

const adminInfoSchema: Schema = new mongoose.Schema({
  "transportation": {
    "method": { type: String, enum: values(TRANSPORTATION_TYPE) },
    "amount": Number,
    "number": String
  }
}, { _id: false });

export default adminInfoSchema;