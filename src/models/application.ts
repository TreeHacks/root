import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { IApplication } from "./Application.d"

const applicationSchema: Schema = new mongoose.Schema({
    // user id is _id.
    "_id": String,
    "forms": { // can only be modified by user/editors
        "application_info": any,
        "additional_info": any
        // we can conceivably add additional forms here.
    },
    "admin_info": { // Only editable by admin.
        "transportation": {
            "method": String,
            "bus_name": String
        },
        "reimbursement_amount": String
    },
    "reviews": [
        {} // each review can only be modified by the reviewer who made it.
    ],
    "user": {
        "name": String,
        "email": String
    },
    "status": String, // only editable by admin (or this user, to a limited extent). incomplete (default), submitted, admitted, waitlisted, rejected, admission_confirmed, admission_declined
    "type": {
        type: String,
        enumValues: ["is", "oos", "stanford"]
    }, // this is created when user is created, cannot be modified later.
});

const model: Model<IApplication> = mongoose.model("Application", applicationSchema);
export default model;