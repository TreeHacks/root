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
    skill_level: Number,
    hackathon_experience: Number,
    resume: String,
    accept_terms: boolean,
    accept_share: boolean,
    q3: String,
    q4: String,
    q5: String,
    // Fields only used in 2019:
    q1_goodfit: String,
    q2_experience: String,
    // Fields only used in 2020:
    q1: String,
    q2: String,
    volunteer: boolean,
    q_team_matching_1: String,
    q_team_matching_2: String
}
export interface ITransportationInfo {
    [e: string]: any
}

export interface IMeetInfo {
  first_name: String,
  last_name: String,
  phone: String,
  verticals: [String],
  university: String,
  level_of_study: String,
  major: String,
  q1: String,
  q2: String,
  q3: String,
  q_slack: String
}

export interface IApplication extends Document {
  "forms": { // can only be modified by user/editors
      "application_info": IApplicationInfo,
      "transportation": ITransportationInfo,
      "meet_info": IMeetInfo
      // we can conceivably add additional forms here.
  },
  "admin_info": { // Only editable by admin.
    "acceptance": {
        "deadline": Date
      },
      "transportation": {
        "type": string,
        "amount": Number,
        "id": String,
        "deadline": Date
      }
  },
  "reviews": [IReview],
  "user": {
    "email": string
   }, // foreign key
  "id": String,
  "status": string, // only editable by admin (or this user, to a limited extent).
  "type": string,
  "location": String,
  "transportation_status": String,
  "sponsor_optout": Boolean,
  "year": String
}