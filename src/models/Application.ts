import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { IApplication } from "./Application.d"
import applicationInfoSchema from "./applicationInfoSchema";
import adminInfoSchema from "./adminInfoSchema";
import reviewSchema from "./reviewSchema";
import { STATUS, TRANSPORTATION_STATUS } from "../constants";
import {values} from "lodash";
import transportationInfoSchema from "./transportationInfoSchema";
import s3FilePlugin from "../utils/file_plugin";

export const applicationSchema: Schema = new mongoose.Schema({
    // user id is _id.
    "_id": String,
    "forms": { // can only be modified by user/editors
        "application_info": applicationInfoSchema,
        "transportation": transportationInfoSchema
    },
    "admin_info": adminInfoSchema, // Only editable by admin.
    "reviews": [reviewSchema], // each review can only be modified by the reviewer who made it.
    "user": {
        "email": String
    },
    "status": {
        type: String,
        default: STATUS.INCOMPLETE,
        enumValues: values(STATUS)
    },
    "transportation_status": {
        type: String,
        default: null,
        enumValues: values(TRANSPORTATION_STATUS)
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

applicationSchema.plugin(s3FilePlugin);

const model: Model<IApplication> = mongoose.model("Application", applicationSchema);
export default model; 