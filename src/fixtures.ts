import { USER_ID } from "./constants";
const fixtures:any = {};
fixtures.applications = [
  {
    user: USER_ID,
    forms: {
      additional_info: { "test": "hee" }
    }
  }
];

export default fixtures;