import request from "supertest";
// jest.mock('../../app/photo_model');
import app from "../..";
import {USER_ID} from "../constants";

describe('user form view', () => {
  test('get user application_info', () => {
    return request(app)
      .get(`/users/${USER_ID}/forms/application_info`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual('Welcome to treehacks.');
      });
  });
  test('get user additional_info', () => {
    return request(app)
      .get(`/users/${USER_ID}/forms/additional_info`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({ "test": "hee" });
      });
  });
});
