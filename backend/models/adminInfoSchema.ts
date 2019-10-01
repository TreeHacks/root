import mongoose from "mongoose";
import { Schema } from "mongoose";
import { values } from "lodash";
import { TRANSPORTATION_TYPE } from "../constants";

const adminInfoSchema: Schema = new mongoose.Schema({
  "acceptance": {
    "deadline": Date
  },
  "transportation": {
    "type": { type: String, enum: values(TRANSPORTATION_TYPE) },
    "amount": Number,
    "id": String,
    "deadline": Date
  }
}, { _id: false });

export default adminInfoSchema;