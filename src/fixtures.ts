import { USER_ID, USER_ID_UPDATE } from "./constants";
const fixtures:any = {};
fixtures.applications = [
  {
    _id: USER_ID,
    user: {
      name: "Test",
      email: "a@b.com"
    },
    forms: {
      additional_info: { "ad": "b" },
      application_info: { "ap": "b" }
    },
    admin_info: {
      "transportation": {"t": "b"},
      "reimbursement amount": {"r": "b"}
    },
    reviews: [
      {"r1": "b"},
      {"r2": "b"}
    ],
    "status": "pending",
    "type": "oos"
  },
  {
    _id: USER_ID_UPDATE,
    user: {
      name: "Test",
      email: "a2@b.com"
    },
    forms: {
      additional_info: { "ad": "b" },
      application_info: { "ap": "b" }
    },
    admin_info: {
      "transportation": {"t": "b"},
      "reimbursement amount": {"r": "b"}
    },
    reviews: [
      {"r1": "b"},
      {"r2": "b"}
    ],
    "status": "pending",
    "type": "oos"
  }
];

export default fixtures;