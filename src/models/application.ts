import mongoose from "mongoose";
import {Model} from "mongoose";

const applicationSchema = new mongoose.Schema({
  "forms": { // can only be modified by user/editors
      "application_info": {},
      "additional_info": {}
      // we can conceivably add additional forms here.
  },
  "admin_info": { // Only editable by admin.
      "status": String,
      "transportation": {
          "method": String,
          "bus_name": String
      },
      "reimbursement_amount": String
  },
  "reviews": [
      {} // each review can only be modified by the reviewer who made it.
  ],
  "user": String, // foreign key
  "id": String,
  "status": String, // only editable by admin (or this user, to a limited extent). incomplete (default), submitted, admitted, waitlisted, rejected, admission_confirmed, admission_declined
  "type": {
    type: String,
    enumValues: ["is", "oos", "stanford"]
  }, // this is created when user is created, cannot be modified later.
});
const model = mongoose.model("Application", schema);
export default model;