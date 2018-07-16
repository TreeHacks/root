import {Document} from "mongoose";

export interface IReview {
    
}
export interface IApplicationInfo {
    university: Boolean
}
export interface IAdditionalInfo {
    bus_confirmed_spot: Boolean
}

export interface IApplication extends Document {
  "forms": { // can only be modified by user/editors
      "application_info": IApplicationInfo,
      "additional_info": IAdditionalInfo
      // we can conceivably add additional forms here.
  },
  "admin_info": { // Only editable by admin.
      "transportation": {
          "method": {type: string},
          "bus_name": {type: string}
      },
      "reimbursement_amount": {type: string}
  },
  "reviews": [IReview// each review can only be modified by the reviewer who made it.
  ],
  "user": {
    "name": {type: string},
    "email": {type: string}
   }, // foreign key
  "id": {type: string},
  "status": {type: string}, // only editable by admin (or this user, to a limited extent). incomplete (default), submitted, admitted, waitlisted, rejected, admission_confirmed, admission_declined
  "type": {type: string}
}