import request from "supertest";
// jest.mock('../../app/photo_model');
import app from "../..";
import {Response} from "express";

describe('index route', () => {
  // afterEach(() => {
  //   app.server.close();
  // });

  test('should respond with a 200 with no query parameters', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .then(response => {
        expect(response.text).toEqual('Welcome to treehacks.');
      });
  });
  test('should respond with a 200 with no query parameters', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .then(response => {
        expect(response.text).toEqual('Welcome to treehacks.');
      });
  });
});
