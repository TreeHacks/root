export var GROUPS = {
  'admin': 'Administrator',
  'reviewer': 'Reviewer',
  'sponsor': 'Sponsor',
  'judge': 'Judge'
};

export var STATUS = {
  INCOMPLETE: "incomplete",
  SUBMITTED: "submitted",
  WAITLISTED: "waitlisted",
  REJECTED: "rejected",
  ADMITTED: "admitted",
  ADMISSION_CONFIRMED: "admission_confirmed",
  ADMISSION_DECLINED: "admission_declined"
}

export var TYPE = {
  IN_STATE: "is",
  OUT_OF_STATE: "oos",
  STANFORD: "stanford"
}

export var DEADLINES = [
  {
    "key": "oos",
    "label": "out-of-state",
    "date": "2018-11-20T07:59:00.000Z",
    "display_date": "November 19, 2018"
  },
  {
    "key": "is",
    "label": "in-state",
    "date": "2018-11-27T07:59:00.000Z",
    "display_date": "November 26, 2018"
  },
  {
    "key": "stanford",
    "label": "Stanford student",
    "date": "2019-02-14T07:59:00.000Z",
    "display_date": "February 13, 2019"
  }
];

export var TRANSPORTATION_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  SUBMITTED: "submitted",
  REJECTED: "rejected",
  APPROVED: "approved",
  PAID: "paid"
};

export var TRANSPORTATION_TYPES = {
  BUS: "bus",
  FLIGHT: "flight",
  OTHER: "other"
};

export var TRANSPORTATION_BUS_ROUTES = {
  TEST: "test",
  TEST_NO_COORDINATOR: "test_no_coordinator",
  USC: "usc",
  UCLA: "ucla",
  SANDIEGO: "sandiego",
  UCI: "uci",
  POMONA: "pomona",
  BERKELEY: "berkeley"
};

export var TRANSPORTATION_DEADLINES = {
  [TRANSPORTATION_TYPES.FLIGHT]: 'December 9th at 11:59pm PST',
  [TRANSPORTATION_TYPES.BUS]: 'January 10th at 11:59pm PST',
  [TRANSPORTATION_TYPES.OTHER]: 'February 19th at 11:59pm PST'
};


export type IBusRoute = {
  day?: string,
  time?: string,
  stop?: string,
  location?: string,
  hack?: boolean
};

export var TRANSPORTATION_BUS_ROUTE_DETAILS: { [x: string]: { coordinator: { name: string, email: string }, route: IBusRoute[] } } = {
  [TRANSPORTATION_BUS_ROUTES.USC]: {
    coordinator: { 'name': 'Caleb Thomas', 'email': 'calebtho@usc.edu' },
    route: [
      {
        day: 'Friday, February 15th',
        time: '8:30am',
        stop: 'Check in at 37th & McClintock',
        location: 'Los Angeles'
      },
      {
        day: 'Friday, February 15th',
        time: '4:30pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },
      {
        hack: true
      },
      {
        day: 'Sunday, February 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },
      {
        day: 'Sunday, February 17th',
        time: '10:30pm',
        stop: '37th & McClintock',
        location: 'Los Angeles'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.TEST]: {
    coordinator: { 'name': 'Tree Hack', 'email': 'treehack@treehacks.com' },
    route: [
      {
        day: 'Friday, February 15th',
        time: '8:00am',
        stop: 'Check in at 37th & McClintock',
        location: 'Atlanta'
      },
      {
        hack: true
      },
      {
        day: 'Sunday, February 17th',
        time: '11:00pm',
        stop: '37th & McClintock',
        location: 'Los Angeles'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.TEST_NO_COORDINATOR]: {
    coordinator: null,
    route: [
      {
        day: 'Friday, February 15th',
        time: '8:00am',
        stop: 'Check in at 37th & McClintock',
        location: 'Atlanta'
      },
      {
        hack: true
      },
      {
        day: 'Sunday, February 17th',
        time: '11:00pm',
        stop: '37th & McClintock',
        location: 'Los Angeles'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.UCLA]: {
    coordinator: { 'name': 'Meera Rachamallu', 'email': 'mrachamallu@g.ucla.edu' },
    route: [
      {
        day: 'Friday, February 15th',
        time: '9:00am',
        stop: 'Check in at 10 Charles E. Young N',
        location: 'Los Angeles'
      },

      {
        day: 'Friday, February 15th',
        time: '4:30pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        hack: true
      },

      {
        day: 'Sunday, February 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        day: 'Sunday, February 17th',
        time: '10:30pm',
        stop: '10 Charles E. Young N',
        location: 'Los Angeles'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.SANDIEGO]: {
    coordinator: null,
    route: [
      {
        day: 'Friday, February 15th',
        time: '7:30am',
        stop: 'Check in at UCSD (location added later)',
        location: 'Los Angeles'
      },

      {
        day: 'Friday, February 15th',
        time: '6:00pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        hack: true
      },

      {
        day: 'Sunday, February 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        day: 'Sunday, February 17th',
        time: '11:45pm',
        stop: 'UCSD',
        location: 'San Diego'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.UCI]: {
    coordinator: { 'name': 'Tara Porter', 'email': 'tporter@caltech.edu' },
    route: [
      {
        day: 'Friday, Februrary 15th',
        time: '7:30am',
        stop: 'Check-in in front of Avery House (293 S Holliston Ave, Pasadena, CA)',
        location: 'Pasadena'
      },

      {
        day: 'Friday, Feburary 15th',
        time: '4:30pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        hack: true
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '11:00pm',
        stop: 'In front of Avery House (293 S Holliston Ave, Pasadena, CA)',
        location: 'Pasadena'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.POMONA]: {
    coordinator: { 'name': 'Meera Rachamallu', 'email': 'mrachamallu@g.ucla.edu' },
    route: [
      {
        day: 'Friday, Februrary 15th',
        time: '10:45am',
        stop: 'Check in at Harvey Mudd (location added later)',
        location: 'Claremont'
      },

      {
        day: 'Friday, Feburary 15th',
        time: '6:00pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        hack: true
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '10:00pm',
        stop: 'Harvey Mudd',
        location: 'Claremont'
      }
    ]
  },
  [TRANSPORTATION_BUS_ROUTES.BERKELEY]: {
    coordinator: { 'name': 'Adhiv Dhar', 'email': 'adhiv@calhacks.io' },
    route: [
      {
        day: 'Friday, Februrary 15th',
        time: '2:30pm',
        stop: 'Check in at West Circle / University Drive',
        location: 'Berkeley'
      },

      {
        day: 'Friday, Feburary 15th',
        time: '4:30pm',
        stop: 'Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        hack: true
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '3:30pm',
        stop: 'Check in at Panama St. & Via Ortega',
        location: 'Stanford'
      },

      {
        day: 'Sunday, Februrary 17th',
        time: '5:30pm',
        stop: 'West Circle / University Drive',
        location: 'Berkeley'
      }
    ]
  }
};

export const HACKATHON_YEAR = 2019;
export const HACKATHON_DATE_RANGE = "February 15-17";
export const LOCATIONS = ["Outside USA", "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "US Territories"];
export const applicationReviewDisplayFields = ["first_name", "last_name", "university", "graduation_year", "level_of_study", "major", "skill_level", "hackathon_experience", "resume", "q1_goodfit", "q2_experience", "q3", "q4"];
export const sponsorApplicationDisplayFields = ["first_name", "last_name", "university", "graduation_year", "level_of_study", "major", "resume", "q2_experience", "q4"];
export const stanfordApplicationDisplayFields = [
  "first_name",
  "last_name",
  "phone",
  "dob",
  "gender",
  "race",
  "university",
  "graduation_year",
  "level_of_study",
  "major",
  "skill_level",
  "hackathon_experience",
  "resume",
  "section2",
  // "q1_goodfit",
  // "q2_experience",
  // "q3",
  "q4",
  "accept_terms",
  "accept_share"
];

export const VERTICALS = ["health", "safety", "awareness"];
