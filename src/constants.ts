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
  "safety": "Safety Grand Prize",
  "awareness": "Awareness Grand Prize",
  // Required for unit tests:
  "test1": "test1",
  "test2": "test2",
  "test3": "test3"
}