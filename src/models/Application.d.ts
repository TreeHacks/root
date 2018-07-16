import {Document} from "mongoose";
export interface IApplication extends Document {
  "forms": { // can only be modified by user/editors
      "application_info": {},
      "additional_info": {}
      // we can conceivably add additional forms here.
  },
  "admin_info": { // Only editable by admin.
      "status": {type: string},
      "transportation": {
          "method": {type: string},
          "bus_name": {type: string}
      },
      "reimbursement_amount": {type: string}
  },
  "reviews": [
      {} // each review can only be modified by the reviewer who made it.
  ],
  "user": {type: string}, // foreign key
  "id": {type: string},
  "status": {type: string}, // only editable by admin (or this user, to a limited extent). incomplete (default), submitted, admitted, waitlisted, rejected, admission_confirmed, admission_declined
  "type": {type: string}
}