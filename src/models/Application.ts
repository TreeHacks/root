import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { IApplication } from "./Application.d"
import applicationInfoSchema from "./applicationInfoSchema";
import additionalInfoSchema from "./additionalInfoSchema";
import adminInfoSchema from "./adminInfoSchema";
import reviewSchema from "./reviewSchema";
import { STATUS } from "../constants";

export const applicationSchema: Schema = new mongoose.Schema({
    // user id is _id.
    "_id": String,
    "forms": { // can only be modified by user/editors
        "application_info": applicationInfoSchema,
        "additional_info": additionalInfoSchema
    },
    "admin_info": adminInfoSchema, // Only editable by admin.
    "reviews": [reviewSchema], // each review can only be modified by the reviewer who made it.
    "user": {
        "email": String
    },
    "status": {
        type: String,
        default: "incomplete",
        enumValues: [STATUS.INCOMPLETE, STATUS.SUBMITTED, STATUS.WAITLISTED, STATUS.REJECTED, STATUS.ADMITTED, STATUS.ADMISSION_CONFIRMED, STATUS.ADMISSION_DECLINED]
    },
    "type": {
        type: String,
        enumValues: ["is", "oos", "stanford"]
    },
    "location": {
        type: String,
        enumValues: ["Outside USA", "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "US Territories"]
    }
});

const model: Model<IApplication> = mongoose.model("Application", applicationSchema);
export default model;