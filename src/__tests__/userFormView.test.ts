import request from "supertest";
// jest.mock('../../app/photo_model');
import app from "../..";
import { USER_ID } from "../constants";

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
  test('get user application_info', () => {
    return render_json(`/users/${USER_ID}/forms/application_info`, { "ap": "b" });
  });
  test('get user additional_info', () => {
    return render_json(`/users/${USER_ID}/forms/additional_info`, { "ad": "b" })
  });
  test('get user status', () => {
    return render_json(`/users/${USER_ID}/status`, "pending")
  });
});

// todo add authentication here.
describe('user admin view', () => {
  test('get user full details', () => {
    return render_json(`/users/${USER_ID}`, {
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
    });
  });
});
