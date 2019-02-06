export var USER_ID_UPDATE = "test_user_id_update";
export var USER_ID = "test_user_id";
export var STATUS = {
    INCOMPLETE: "incomplete",
    SUBMITTED: "submitted",
    WAITLISTED: "waitlisted",
    REJECTED: "rejected",
    ADMITTED: "admitted",
    ADMISSION_CONFIRMED: "admission_confirmed",
    ADMISSION_DECLINED: "admission_declined"
}
export var TRANSPORTATION_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  SUBMITTED: "submitted",
  REJECTED: "rejected",
  APPROVED: "approved",
  PAID: "paid"
}

export var TYPE = {
  IN_STATE: "is",
  OUT_OF_STATE: "oos",
  STANFORD: "stanford"
}

export var TRANSPORTATION_TYPE = {
  BUS: "bus",
  FLIGHT: "flight",
  OTHER: "other"
}

export const sponsorApplicationDisplayFields = ["first_name", "last_name", "university", "graduation_year", "level_of_study", "major", "resume", "q2_experience", "q4"];
export const applicationReviewDisplayFields = ["first_name", "last_name", "university", "graduation_year", "level_of_study", "major", "skill_level", "hackathon_experience", "resume", "q1_goodfit", "q2_experience", "q3", "q4"];

export const hackReviewDisplayFields = ["_id", "devpostUrl", "title", "categories"];

// Maps vertical names (keys) to corresponding hack categories i.e. prizes (values)
export const VERTICALS_TO_CATEGORIES = {
  "health": "Health Grand Prize",
  "safety": "Security Grand Prize",
  "awareness": "Energy Grand Prize",
  // Required for unit tests:
  "test1": "test1",
  "test2": "test2",
  "test3": "test3"
}

export const AVAILABLE_ROOMS = [
  {
    "id": "007",
    "name": "007 The Leo Chan",
    "description": ""
  },
  {
    "id": "008",
    "name": "008 The George Tang",
    "description": ""
  },
  {
    "id": "019",
    "name": "019 Phi",
    "description": ""
  },
  {
    "id": "020",
    "name": "020 Theta",
    "description": ""
  },
  {
    "id": "203",
    "name": "203 Pi",
    "description": ""
  },
  {
    "id": "218",
    "name": "218 The Barnholt Family",
    "description": ""
  },
  {
    "id": "219",
    "name": "219 The Robert B Taggart and Donna F Taggart",
    "description": ""
  },
  {
    "id": "304",
    "name": "304 Alpha",
    "description": ""
  },
  {
    "id": "305",
    "name": "305 Leone Perkins",
    "description": ""
  },
  {
    "id": "306",
    "name": "306 Koshland Family",
    "description": ""
  },
];
