import { Document } from "mongoose";

export interface IReview {
  reader: { id: String; email: String };
  cultureFit: Number;
  experience: Number;
  passion: Number;
  isOrganizer: Boolean;
  isBeginner: Boolean;
}
export interface IApplicationInfo {
  first_name: String;
  last_name: String;
  full_name: String;
  phone: String;
  dob: String;
  gender: String;
  race: [String];
  university: String;
  graduation_year: String;
  level_of_study: String;
  major: String;
  skill_level: Number;
  hackathon_experience: Number;
  address1: String;
  address2: String;
  city: String;
  state: String;
  zip: String;
  country: String;
  resume: String;
  accept_terms: boolean;
  accept_share: boolean;
  accept_conditions: boolean;
  beginner_info: boolean;
  top_track: String;
  q3: String;
  q4: String;
  q5: String;
  q6: String;
  q7: String;
  // Fields only used in 2019:
  q1_goodfit: String;
  q2_experience: String;
  // Fields only used in 2020:
  q1: String;
  q2: String;
  volunteer: boolean;
  q_team_matching_1: String;
  q_team_matching_2: String;
}
export interface ITransportationInfo {
  [e: string]: any;
}

export interface IMealInfo {
  usedMeals?: [String];
  dietaryRestrictions?: String;
}

export interface ITeamInfo {
  teamList?: String;
}

export interface IWorkshopInfo {
  attendedWorkshops?: [String];
}

export interface ICheckInInfo {
  checkedIn?: Boolean;
  checkedInBy?: String;
  checkedInAt?: Date;
  tshirtSize?: String;
}

export interface IMeetInfo {
  verticals?: String;
  numMoreTeammates?: String;
  profileDesc?: String;
  idea?: String;
  pronouns?: String;
  showProfile?: Boolean;
  commitment?: String;
  skills?: String;
  timezoneOffset?: String;
  githubLink?: String;
  devpostLink?: String;
  linkedinLink?: String;
  portfolioLink?: String;
  isMentor?: Boolean;

  // populated from script
  profilePicture?: String;

  // dynamically populated from API:
  first_name?: String;
  last_initial?: String;
}

export interface ISubmitInfo {
  members?: String[];
  url?: String;
}

export interface IHardwareInfo {
  checkedOutBy?: String;
  checkedOutAt?: Date;
  pendingReturn?: Boolean;
  returnedAt?: Date;
  returnedBy?: String;
  hardwareList?: String[];
}

export interface IApplication extends Document {
  forms: {
    // can only be modified by user/editors
    application_info: IApplicationInfo;
    transportation: ITransportationInfo;
    meet_info: IMeetInfo;
    submit_info: ISubmitInfo;
    meal_info: IMealInfo;
    check_in_info: ICheckInInfo;
    team_info: ITeamInfo;
    workshop_info: IWorkshopInfo;
    hardware_info: IHardwareInfo;
    // we can conceivably add additional forms here.
  };
  admin_info: {
    // Only editable by admin.
    acceptance: {
      deadline: Date;
    };
    transportation: {
      type: string;
      amount: Number;
      id: String;
      deadline: Date;
    };
  };
  reviews: [IReview];
  user: {
    email: string;
  }; // foreign key
  id: String;
  status: string; // only editable by admin (or this user, to a limited extent).
  type: string;
  location: String;
  transportation_status: String;
  sponsor_optout: Boolean;
  year: String;
}
