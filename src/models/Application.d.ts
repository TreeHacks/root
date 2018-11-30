import {Document} from "mongoose";

export interface IReview {
    reader: { id: String, email: String },
    cultureFit: Number,
    experience: Number,
    passion: Number,
    isOrganizer: Boolean,
    isBeginner: Boolean
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
    q2_experience: String,
    q3: String,
    q4: String
}
export interface ITransportationInfo {
    [e: string]: any
}

export interface IApplication extends Document {
  "forms": { // can only be modified by user/editors
      "application_info": IApplicationInfo,
      "transportation": ITransportationInfo
      // we can conceivably add additional forms here.
  },
  "admin_info": { // Only editable by admin.
      "transportation": {
          "method": String,
          "bus_name": String
      },
      "reimbursement_amount": String
  },
  "reviews": [IReview],
  "user": {
    "email": String
   }, // foreign key
  "id": String,
  "status": String, // only editable by admin (or this user, to a limited extent).
  "type": String,
  "location": String,
  "transportation_status": String
}