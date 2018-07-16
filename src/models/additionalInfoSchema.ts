import mongoose from "mongoose";
import { Schema } from "mongoose";
const additionalInfoSchema: Schema = new mongoose.Schema({
  bus_confirmed_spot: Boolean
}, { _id : false });

export default additionalInfoSchema;