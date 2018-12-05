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
  TEST: "test",
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

export var TRANSPORTATION_BUS_ROUTE_DETAILS: { [x: string]: IBusRoute[] } = {
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
  [TRANSPORTATION_BUS_ROUTES.TEST]: [
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
  ],
  [TRANSPORTATION_BUS_ROUTES.TEST]: [
    {
      day: 'Friday, February 15th',
      time: '9:00am',
      stop: 'Check in at 10 Charles E. Young',
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
      time: '10:30pm',
      stop: '10 Charles E. Young',
      location: 'Los Angeles'
    }
  ],
  [TRANSPORTATION_BUS_ROUTES.SANDIEGO]: [
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
      location: 'Los Angeles'
    }
  ],
  [TRANSPORTATION_BUS_ROUTES.UCI]: [
    {
      day: 'Friday, Februrary 15th',
      time: '8:45am',
      stop: 'Check in at UCI (location added later)',
      location: 'Irvine'
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
      time: '11:00pm',
      stop: 'UCI',
      location: 'Irvine'
    }
  ],
  [TRANSPORTATION_BUS_ROUTES.POMONA]: [
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
  ],
  [TRANSPORTATION_BUS_ROUTES.BERKELEY]: [
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
      time: '10:00pm',
      stop: 'West Circle / University Drive',
      location: 'Berkeley'
    }
  ]
};

export const HACKATHON_YEAR = 2019;
export const HACKATHON_DATE_RANGE = "February 15-17";