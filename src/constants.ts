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
  PENDING: "pending",
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
  USC: "usc"
};

export var TRANSPORTATION_DEADLINES = {
  [TRANSPORTATION_TYPES.FLIGHT]: 'December 9th at 11:59pm PST',
  [TRANSPORTATION_TYPES.BUS]: 'January 10th at 11:59pm PST',
  [TRANSPORTATION_TYPES.OTHER]: 'February 19th at 11:59pm PST'
};

export var TRANSPORTATION_BUS_ROUTE_DETAILS = {
  [TRANSPORTATION_BUS_ROUTES.USC]: [
    {
      day: 'Friday, February 15th',
      time: '8:00am',
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
      time: '4:00pm',
      stop: 'Check in at Panama St. & Via Ortega',
      location: 'Stanford'
    },
    {
      day: 'Sunday, February 17th',
      time: '11:00pm',
      stop: '37th & McClintock',
      location: 'Los Angeles'
    }
  ],
  // FIXME: NEED TO ADD OTHER ROUTES
};

export const HACKATHON_YEAR = 2019;