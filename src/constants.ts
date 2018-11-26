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
}