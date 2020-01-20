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
            forms: {meet_info: {first_name: "hello"} }
        }).save();
        await request(app)
            .get("/api/users/applicanttreehacks/forms/meet_info")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ first_name: "hello" });
            });
    });
    test('submitted user edits other transportation - fail', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' }
        }).save();
        await request(app)
            .put("/api/users/applicanttreehacks/forms/meet_info")
            .set({ Authorization: 'applicant' })
            .send({first_name: "hello"})
            .then(e => {
                expect(e.body).toEqual({ first_name: "hello" });
            });
    });
});