import mongoose from "mongoose";
import { Schema } from "mongoose";

const hardwareInfoSchema: Schema = new mongoose.Schema({
    checkedOutBy: String,
    checkedOutAt: Date,
    pendingReturn: Boolean,
    returnedAt: Date,
    returnedBy: String,
    hardwareList: [String]
}, { _id: false });

export default hardwareInfoSchema; 