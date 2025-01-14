import settings from "./themes/settings";
import {
  sponsorApplicationDisplayFields as sponsorApplicationDisplayFieldsObj,
  applicationReviewDisplayFields as applicationReviewDisplayFieldsObj,
} from "../backend/constants";

export var GROUPS = {
  admin: "Administrator",
  reviewer: "Reviewer",
  sponsor: "Sponsor",
  judge: "Judge",
  mentor: "Mentor",
  hardware_admin: "Hardware Admin",
};

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

export var TYPE = {
  IN_STATE: "is",
  OUT_OF_STATE: "oos",
  STANFORD: "stanford",
};

export var DEADLINES = settings.deadlines;

export var TRANSPORTATION_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  SUBMITTED: "submitted",
  REJECTED: "rejected",
  APPROVED: "approved",
  PAID: "paid",
};

export var TRANSPORTATION_TYPES = {
  BUS: "bus",
  FLIGHT: "flight",
  TRAIN: "train",
  OTHER: "other",
};

export var TRANSPORTATION_BUS_ROUTES = {
  TEST: "test",
  TEST_NO_COORDINATOR: "test_no_coordinator",
  USC: "usc",
  UCLA: "ucla",
  CALTECH: "caltech",
  UBER: "uber",
  UCIUBER: "uci-uber",
  USCUBER: "usc-uber",
  SANDIEGO: "sandiego",
  UCI: "uci",
  POMONA: "pomona",
  BERKELEY12: "berkeley12",
  BERKELEY34: "berkeley34",
};

export var TRANSPORTATION_DEADLINES = {
  [TRANSPORTATION_TYPES.FLIGHT]: "December 9th at 11:59pm PST",
  [TRANSPORTATION_TYPES.BUS]: "January 10th at 11:59pm PST",
  [TRANSPORTATION_TYPES.OTHER]: "February 19th at 11:59pm PST",
};

export type IBusRoute = {
  day?: string;
  time?: string;
  stop?: string;
  location?: string;
  hack?: boolean;
};

export var TRANSPORTATION_BUS_ROUTE_DETAILS: {
  [x: string]: {
    coordinator: { name: string; email: string };
    route: IBusRoute[];
  };
} = {
  [TRANSPORTATION_BUS_ROUTES.USCUBER]: {
    coordinator: null,
    route: [
      {
        day: "Friday, February 14th",
        time: "8:30am",
        stop: "Check in at 37th & McClintock",
        location: "Los Angeles",
      },
      {
        day: "Friday, February 14th",
        time: "4:00pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 16th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        day: "Sunday, February 16th",
        time: "10:30pm",
        stop: "37th & McClintock",
        location: "Los Angeles",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.UCIUBER]: {
    coordinator: null,
    route: [
      {
        day: "Friday, Februrary 14th",
        time: "6:30am",
        stop: "Check-in in at West Peltason & Mesa",
        location: "Irvine",
      },

      {
        day: "Friday, Feburary 14th",
        time: "5:30pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, Februrary 16th",
        time: "4:00pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        day: "Monday, Februrary 17th",
        time: "1:00am",
        stop: "West Peltason & Mesa",
        location: "Irvine",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.CALTECH]: {
    coordinator: { name: "Alex Cui", email: "acui@caltech.edu" },
    route: [
      {
        day: "Friday, February 14th",
        time: "8:00am",
        stop: "Check in at 293 S Holliston Ave (In Front of Avery House)",
        location: "Pasadena",
      },
      {
        day: "Friday, February 14th",
        time: "4:03pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 16th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        day: "Monday, February 17th",
        time: "10:26pm",
        stop: "293 S Holliston Ave (In Front of Avery House)",
        location: "Pasadena",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.UBER]: {
    coordinator: null,
    route: [
      {
        day: "Friday, February 14th",
        time: "8:00am",
        stop: "Check in at 293 S Holliston Ave (In Front of Avery House)",
        location: "Pasadena",
      },
      {
        day: "Friday, February 14th",
        time: "4:03pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 16th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        day: "Monday, February 17th",
        time: "10:26pm",
        stop: "293 S Holliston Ave (In Front of Avery House)",
        location: "Pasadena",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.USC]: {
    coordinator: { name: "Lily Perry", email: "lilyperr@usc.edu" },
    route: [
      {
        day: "Friday, February 14th",
        time: "9:28am",
        stop: "Check in at 37th & McClintock",
        location: "Los Angeles",
      },
      {
        day: "Friday, February 14th",
        time: "4:40pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 16th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },
      {
        day: "Sunday, February 16th",
        time: "9:59pm",
        stop: "37th & McClintock",
        location: "Los Angeles",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.TEST]: {
    coordinator: { name: "Tree Hack", email: "treehack@treehacks.com" },
    route: [
      {
        day: "Friday, February 15th",
        time: "8:00am",
        stop: "Check in at 37th & McClintock",
        location: "Atlanta",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 17th",
        time: "11:00pm",
        stop: "37th & McClintock",
        location: "Los Angeles",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.TEST_NO_COORDINATOR]: {
    coordinator: null,
    route: [
      {
        day: "Friday, February 15th",
        time: "8:00am",
        stop: "Check in at 37th & McClintock",
        location: "Atlanta",
      },
      {
        hack: true,
      },
      {
        day: "Sunday, February 17th",
        time: "11:00pm",
        stop: "37th & McClintock",
        location: "Los Angeles",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.UCLA]: {
    coordinator: {
      name: "Nathan Leung",
      email: "https://app.slack.com/client/T04LLEE9DED/D04PXJ1EC13",
    },
    route: [
      {
        day: "Friday, February 17th",
        time: "8:45am",
        stop: "Check in at 10 Charles E. Young N",
        location: "UCLA",
      },
      {
        day: "Friday, February 17th",
        time: "9:00am",
        stop: "Bus departs from 10 Charles E. Young N",
        location: "UCLA",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, February 19th",
        time: "4:00pm",
        stop: "Check in at Via Ortega",
        location: "Stanford",
      },

      {
        day: "Sunday, February 19th",
        time: "4:15pm",
        stop: "Bus departs to 10 Charles E. Young N",
        location: "UCLA",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.SANDIEGO]: {
    coordinator: null,
    route: [
      {
        day: "Friday, February 15th",
        time: "7:30am",
        stop: "Check in at UCSD (location added later)",
        location: "Los Angeles",
      },

      {
        day: "Friday, February 15th",
        time: "6:00pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, February 17th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        day: "Sunday, February 17th",
        time: "11:45pm",
        stop: "UCSD",
        location: "San Diego",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.UCI]: {
    coordinator: { name: "Kevin Truong", email: "kctruon1@uci.edu" },
    route: [
      {
        day: "Friday, Februrary 14th",
        time: "8:00am",
        stop: "Check-in in at West Peltason & Mesa",
        location: "Irvine",
      },

      {
        day: "Friday, Feburary 14th",
        time: "4:40pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, Februrary 16th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        day: "Sunday, February 17th",
        time: "11:00pm",
        stop: "West Peltason & Mesa",
        location: "Irvine",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.POMONA]: {
    coordinator: { name: "Meera Rachamallu", email: "mrachamallu@g.ucla.edu" },
    route: [
      {
        day: "Friday, Februrary 15th",
        time: "10:45am",
        stop: "Check in at Harvey Mudd (location added later)",
        location: "Claremont",
      },

      {
        day: "Friday, Feburary 15th",
        time: "6:00pm",
        stop: "Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, Februrary 17th",
        time: "3:30pm",
        stop: "Check in at Panama St. & Via Ortega",
        location: "Stanford",
      },

      {
        day: "Sunday, Februrary 17th",
        time: "10:00pm",
        stop: "Harvey Mudd",
        location: "Claremont",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.BERKELEY12]: {
    coordinator: { name: "Rohan Patra", email: "925 587 4500" },
    route: [
      {
        day: "Friday, Februrary 17th",
        time: "1:30pm",
        stop: "Check in at West Circle / University Drive",
        location: "Berkeley",
      },
      {
        day: "Friday, Februrary 17th",
        time: "1:45pm",
        stop: "Bus departs from West Circle / University Drive to Stanford",
        location: "Berkeley",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, Februrary 19th",
        time: "4:00pm",
        stop: "Check in at Via Ortega",
        location: "Stanford",
      },
      {
        day: "Sunday, Februrary 19th",
        time: "4:15pm",
        stop: "Bus leaves from Via Ortega to UC Berkeley",
        location: "Stanford",
      },
    ],
  },
  [TRANSPORTATION_BUS_ROUTES.BERKELEY34]: {
    coordinator: { name: "Chris Leung", email: "925 436 2325" },
    route: [
      {
        day: "Friday, Februrary 17th",
        time: "4:00pm",
        stop: "Check in at West Circle / University Drive",
        location: "Berkeley",
      },
      {
        day: "Friday, Februrary 17th",
        time: "4:15pm",
        stop: "Bus departs from West Circle / University Drive to Stanford",
        location: "Berkeley",
      },

      {
        hack: true,
      },

      {
        day: "Sunday, Februrary 19th",
        time: "6:30pm",
        stop: "Check in at Via Ortega",
        location: "Stanford",
      },
      {
        day: "Sunday, Februrary 19th",
        time: "6:45pm",
        stop: "Bus leaves from Via Ortega to UC Berkeley",
        location: "Stanford",
      },
    ],
  },
};

export const HACKATHON_YEAR = settings.hackathon_year;
export const HACKATHON_DATE_RANGE = settings.hackathon_date_range;
export const LOCATIONS = settings.locations;
export const applicationReviewDisplayFields = applicationReviewDisplayFieldsObj;
export const sponsorApplicationDisplayFields = sponsorApplicationDisplayFieldsObj;
export const applicationDisplayFields = [
  "section1",
  "first_name",
  "last_name",
  "full_name",
  "phone",
  "dob",
  "university",
  "graduation_year",
  "level_of_study",
  "major",
  // "volunteer",
  "skill_level",
  "hackathon_experience",
  "shipping",
  "address1",
  "address2",
  "city",
  "state",
  "zip",
  "country",
  "resume",
  "section2",
  "q1",
  "q2",
  "q3",
  "section_track",
  "top_track",
  "q4",
  "section3",
  "q5",
  "q6",
  "q7",
  // "volunteer",
  "q_team_matching_1",
  "q_team_matching_2",
  "section4",
  "gender",
  "race",
  "accept_terms",
  "accept_share",
  "accept_conditions",
  "beginner_info",
];
export const applicationDisplayFieldsStanford = applicationDisplayFields;

export const VERTICALS = ["health", "safety", "awareness"];

export const FLOORS = [0, 1, 2, 3];

export const logo = settings.logo;
export const favicon = settings.favicon;
export const dashboardBackground = settings.dashboard_background;
