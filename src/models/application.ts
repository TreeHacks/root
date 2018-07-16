import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { IApplication } from "./Application.d"
import applicationInfoSchema from "./applicationInfoSchema";
import additionalInfoSchema from "./additionalInfoSchema";
import reviewSchema from "./reviewSchema";

const applicationSchema: Schema = new mongoose.Schema({
    // user id is _id.
    "_id": String,
    "forms": { // can only be modified by user/editors
        "application_info": applicationInfoSchema,
        "additional_info": additionalInfoSchema
    },
    "admin_info": { // Only editable by admin.
        "transportation": {
            "method": String,
            "bus_name": String
        },
        "reimbursement_amount": {type: String, default: null}
    },
    "reviews": [reviewSchema] // each review can only be modified by the reviewer who made it.
    ,
    "user": {
        "name": String,
        "email": String
    },
    "status": {
        type: String,
        default: "incomplete",
        enumValues: ["incomplete", "submitted", "admitted", "waitlisted", "rejected", "admission_confirmed", "admission_declined"]
    },
    "type": {
        type: String,
        enumValues: ["is", "oos", "stanford"]
    }
});

const model: Model<IApplication> = mongoose.model("Application", applicationSchema);
export default model;