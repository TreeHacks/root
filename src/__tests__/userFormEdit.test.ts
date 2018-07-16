import request from "supertest";
// jest.mock('../../app/photo_model');
import app from "../..";
import { USER_ID_UPDATE } from "../constants";

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

describe('user form edit', () => {
  test('set user application_info', () => {
    return post_expect_json(`/users/${USER_ID_UPDATE}/forms/application_info`, { "university": "stanford" }, { "university": "stanford" });
  });
  test('set user additional_info', () => {
    return post_expect_json(`/users/${USER_ID_UPDATE}/forms/additional_info`, { "bus_confirmed_spot": true }, { "bus_confirmed_spot": true })
  });

  // Todo: add auth here.
  test('edit user status', () => {
    return post_expect_json(`/users/${USER_ID_UPDATE}/status`, {"status": "complete"}, {"status": "complete"})
  });
});