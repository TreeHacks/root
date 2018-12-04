import mongoose from "mongoose";
import { Schema } from "mongoose";
import { S3File } from '../utils/file_plugin';

const transportationInfoSchema: Schema = new mongoose.Schema({
  "vendor": String,
  "receipt": S3File,
  "accept": Boolean,
  "address1": String,
  "address2": String,
  "city": String,
  "state": String,
  "zip": String
}, { _id: false });

export default transportationInfoSchema;
