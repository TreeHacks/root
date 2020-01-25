import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { TRANSPORTATION_STATUS, TRANSPORTATION_TYPE } from '../constants';
import lolex from "lolex";

afterEach(() => {
    return Application.deleteMany({});
})


describe('meet form', () => {
    test('view meet info', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' },
            forms: {
                meet_info: {idea: "hello"},
                application_info: {first_name: "ash", last_name: "ram"}
            }
        }).save();
        await request(app)
            .get("/api/users/applicanttreehacks/forms/meet_info")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ idea: "hello", first_name: "ash", last_initial: "r" });
            });
    });
    test('edit meet info', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' }
        }).save();
        await request(app)
            .put("/api/users/applicanttreehacks/forms/meet_info")
            .set({ Authorization: 'applicant' })
            .send({idea: "hello"})
            .then(e => {
                expect(e.body).toEqual({ idea: "hello" });
            });
    });
});