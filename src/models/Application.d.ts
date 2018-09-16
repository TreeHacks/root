import {Document} from "mongoose";

export interface IReview {
    
}
export interface IApplicationInfo {
    first_name: String,
    last_name: String,
    phone: String,
    dob: String,
    gender: String,
    race: [String],
    university: String,
    graduation_year: String,
    level_of_study: String,
    major: String,
    resume: String,
    accept_terms: boolean,
    accept_share: boolean,
    q1_goodfit: String,
    q2_experience: String
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
          "method": {type: String},
          "bus_name": {type: String}
      },
      "reimbursement_amount": {type: String}
  },
  "reviews": [IReview// each review can only be modified by the reviewer who made it.
  ],
  "user": {
    "email": {type: String}
   }, // foreign key
  "id": {type: String},
  "status": {type: String}, // only editable by admin (or this user, to a limited extent). incomplete (default), submitted, admitted, waitlisted, rejected, admission_confirmed, admission_declined
  "type": {type: String}
}