import mongoose from "mongoose";
import { Schema } from "mongoose";
const adminInfoSchema: Schema = new mongoose.Schema({
  "transportation": {
    "method": String,
    "bus_name": String
  },
  "reimbursement_amount": { type: String, default: null }
}, { _id: false });

export default adminInfoSchema;