import { createRandomApplication, post_expect_json, get_expect_json } from "../testUtils";

describe('user form view', () => {
  let userId: string;
  beforeAll(() => {
    userId = createRandomApplication();
  })
  test('get user application_info', () => {
    return get_expect_json(`/users/${userId}/forms/application_info`, { "university": "stanford" });
  });
  test('get user additional_info', () => {
    return get_expect_json(`/users/${userId}/forms/additional_info`, { "bus_confirmed_spot": true })
  });
  test('get user status', () => {
    return get_expect_json(`/users/${userId}/status`, { "status": "incomplete" })
  });
  // todo add authentication here:
  test('get user full details', () => {
    return get_expect_json(`/users/${userId}`, {
      "_id": userId,
      "forms": {
        "application_info": {"university": "stanford"},
        "additional_info": {"bus_confirmed_spot": true}
      },
      "admin_info": {"reimbursement_amount": null},
      "reviews": [],
      "user": { "name": "default_user", "email": "default_email@default_email.com" },
      "type": "oos",
      "status": "incomplete"
    });
  });
});
