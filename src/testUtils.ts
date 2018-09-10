import request from "supertest";
import app from "./index";
import { createApplication } from "./routes/common";


export function get_expect_json(url: string, value: any) {
  return request(app)
    .get(url)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual(value);
    });
}

export function post_expect_json(url: string, formData: { [x: string]: any }, value: any) {
  return request(app)
    .put(url)
    .send(formData)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual(value);
    });
}

export function createRandomApplication() {
  let userId = Math.random() + "";
  createApplication(userId);
  return userId;
}