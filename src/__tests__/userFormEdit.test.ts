import request from "supertest";
import app from "../..";
import {createApplication} from "../routes/user_create";

function post_expect_json(url: string, formData: {[x:string]: any}, value: any) {
  return request(app)
    .put(url)
    .send(formData)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual(value);
    });
}

describe('user form update', () => {
  let userId:string;
  beforeAll(() => {
    userId = Math.random() + "";
    createApplication(userId);
  })
  test('set user application_info', () => {
    return post_expect_json(`/users/${userId}/forms/application_info`, { "university": "berkeley" }, { "university": "berkeley" });
  });
  test('set user additional_info', () => {
    return post_expect_json(`/users/${userId}/forms/additional_info`, { "bus_confirmed_spot": false }, { "bus_confirmed_spot": false })
  });

  test('set user status', () => {
    return post_expect_json(`/users/${userId}/status`, {"status": "admitted"}, {"status": "admitted"})
  });
});

describe('admin user edit', () => {
  let userId:string;
  beforeAll(() => {
    userId = Math.random() + "";
    createApplication(userId);
  })
  test('set user admin_info', () => {
    return post_expect_json(`/users/${userId}/admin_info`, { "reimbursement_amount": 500 }, { "reimbursement_amount": 500 });
  });
});