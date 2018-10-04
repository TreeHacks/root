import request from "supertest";
import { createApplication } from "./routes/common";
import { CognitoUser } from "./models/cognitoUser";
import {sinon} from "sinon";
// import {jest} from "jest";

jest.mock("./router/authenticatedRoute");
import app from "./index";



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
  createApplication({sub: userId, email: "a@b.com"});
  return userId;
}

