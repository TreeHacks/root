import request from "supertest";
// jest.mock('../../app/photo_model');
import app from "../..";
import { createApplication } from "../routes/user_create";

function render_json(url: string, value: any) {
  return request(app)
    .get(url)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual(value);
    });
}

describe('user form view', () => {
  let userId: string;
  beforeAll(() => {
    userId = Math.random() + "";
    createApplication(userId);
  })
  test('get user application_info', () => {
    return render_json(`/users/${userId}/forms/application_info`, { "university": "stanford" });
  });
  test('get user additional_info', () => {
    return render_json(`/users/${userId}/forms/additional_info`, { "bus_confirmed_spot": true })
  });
  test('get user status', () => {
    return render_json(`/users/${userId}/status`, { "status": "incomplete" })
  });
  // todo add authentication here:
  test('get user full details', () => {
    return render_json(`/users/${userId}`, {
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
