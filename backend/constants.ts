// import settings from "../src/themes/settings";

export var USER_ID_UPDATE = "test_user_id_update";
export var USER_ID = "test_user_id";
export var STATUS = {
  INCOMPLETE: "incomplete",
  SUBMITTED: "submitted",
  WAITLISTED: "waitlisted",
  REJECTED: "rejected",
  ADMITTED: "admitted",
  ADMISSION_CONFIRMED: "admission_confirmed",
  ADMISSION_DECLINED: "admission_declined",
  DONTREVIEW: "no_reviewing",
};
export var TRANSPORTATION_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  SUBMITTED: "submitted",
  REJECTED: "rejected",
  APPROVED: "approved",
  PAID: "paid",
};

export var TYPE = {
  IN_STATE: "is",
  OUT_OF_STATE: "oos",
  STANFORD: "stanford",
};

export var TRANSPORTATION_TYPE = {
  BUS: "bus",
  FLIGHT: "flight",
  TRAIN: "train",
  OTHER: "other",
};

export const sponsorApplicationDisplayFields = [
  "first_name",
  "last_name",
  // "phone",
  // "dob",
  "university",
  "graduation_year",
  "level_of_study",
  "major",
  "skill_level",
  "hackathon_experience",
  "resume",
  "section2",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  // "volunteer",
  // "section3",
  // "q_team_matching_1",
  // "q_team_matching_2",
  // "section4",
  // "gender",
  // "race",
  // "accept_terms",
  // "accept_share",
  // "accept_conditions",
];
export const applicationReviewDisplayFields = [
  // "first_name",
  // "last_name",
  // "full_name",
  // "phone",
  // "dob",
  "university",
  "graduation_year",
  "level_of_study",
  "major",
  "skill_level",
  "hackathon_experience",
  "resume",
  // "section2",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  // "volunteer",
  // "section3",
  "q_team_matching_1",
  "q_team_matching_2",
  // "section4",
  // "gender",
  // "race",
  // "accept_terms",
  // "accept_share",
  // "accept_conditions",
];
export const applicationRequiredFields = [
  "first_name",
  "last_name",
  "full_name",
  "phone",
  "dob",
  "university",
  "graduation_year",
  "level_of_study",
  "major",
  "skill_level",
  "hackathon_experience",
  "address1",
  "city",
  "state",
  "zip",
  "country",
  "q1",
  "q2",
  "q3",
  "top_track",
  "q4",
  "accept_terms",
  "accept_share",
  "accept_conditions",
];
export const applicationRequiredFieldsStanford = applicationRequiredFields;
export const applicationReviewDisplayFieldsNoSection = applicationReviewDisplayFields.filter(
  (e) => !e.startsWith("section")
);
export const sponsorApplicationDisplayFieldsNoSection = sponsorApplicationDisplayFields.filter(
  (e) => !e.startsWith("section")
);

export const hackReviewDisplayFields = [
  "floor",
  "_id",
  "devpostUrl",
  "title",
  "categories",
];

// Maps vertical names (keys) to corresponding hack categories i.e. prizes (values)
export const VERTICALS_TO_CATEGORIES = {
  health: "Health Grand Prize",
  safety: "Security Grand Prize",
  awareness: "Energy Grand Prize",
  // Required for unit tests:
  test1: "test1",
  test2: "test2",
  test3: "test3",
};

// Format for unavailability:
// [
//   { label: "Public-facing event name", start: "2/15 10pm PST", end: "2/16 2am PST" }
// ]

interface IRoom {
  id: string;
  name: string;
  description: string;
  unavailable: {
    start: string;
    end: string;
    label: string;
  }[];
}

export let AVAILABLE_ROOMS: IRoom[] = [
  {
    id: "007",
    name: "007 The Leo Chan",
    description: "",
    unavailable: [],
  },
  {
    id: "008",
    name: "008 The George Tang",
    description: "",
    unavailable: [
      {
        start: "2/15 4:30 PM PST",
        end: "2/15 6 PM PST",
        label: "",
      },
    ],
  },
  {
    id: "019",
    name: "019 Phi",
    description: "",
    unavailable: [],
  },
  //   {
  //     "id": "020",
  //     "name": "020 Theta",
  //     "description": "",
  //     "unavailable": []
  //   },
  {
    id: "203",
    name: "203 Pi",
    description: "",
    unavailable: [],
  },
  //{
  //  "id": "219",
  //  "name": "219 The Robert B Taggart and Donna F Taggart",
  //  "description": "",
  //  "unavailable": []
  //},
  {
    id: "304",
    name: "304 Alpha",
    description: "",
    unavailable: [],
  },
  {
    id: "306",
    name: "306 Koshland Family",
    description: "",
    unavailable: [
      {
        start: "2/15 3 PM PST",
        end: "2/15 6 PM PST",
        label: "",
      },
    ],
  },
];

export const HACKATHON_YEAR = "2025"; //settings.hackathon_year;
export const HACKATHON_YEAR_STRING = String(HACKATHON_YEAR);
export const AUTO_ADMIT_STANFORD = false;

export const IGNORED_REVIEWERS = process.env.IGNORED_REVIEWERS
  ? JSON.parse(process.env.IGNORED_REVIEWERS)
  : [];

export const ALLOWED_GROUPS = ["admin", "reviewer", "sponsor", "mentor"];
// ["admin", "reviewer", "sponsor", "judge"];

export const REVIEWS_PER_APP = 2;

export const TEAM_CODE_LENGTH = 6;
export const MAX_TEAM_SIZE = 4;
