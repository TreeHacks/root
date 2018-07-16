import { USER_ID } from "./constants";
const fixtures:any = {};
fixtures.applications = [
  {
    user: USER_ID,
    forms: {
      additional_info: { "ad": "b" },
      application_info: { "ap": "b" },
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
  }
];

export default fixtures;