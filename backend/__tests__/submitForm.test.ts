import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { TRANSPORTATION_STATUS, TRANSPORTATION_TYPE } from '../constants';
import lolex from "lolex";

afterEach(() => {
    return Application.deleteMany({});
})


describe('submit form', () => {
    test('view submit info', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' },
            forms: {
                submit_info: {members: ["a", "b", "c"], url: "d"},
                application_info: {first_name: "ash", last_name: "ram"}
            }
        }).save();
        await request(app)
            .get("/api/users/applicanttreehacks/forms/submit_info")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({members: ["a", "b", "c"], url: "d"});
            });
    });
    test('view submit info should work and show empty result when submit info is not defined', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' },
            forms: {
                application_info: {first_name: "ash", last_name: "ram"}
            }
        }).save();
        await request(app)
            .get("/api/users/applicanttreehacks/forms/submit_info")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({});
            });
    });
    test('edit submit info', async () => {
        await new Application({
            user: { id: 'applicanttreehacks' }
        }).save();
        await request(app)
            .put("/api/users/applicanttreehacks/forms/submit_info")
            .set({ Authorization: 'applicant' })
            .send({members: ["a", "b", "c"], url: "d"})
            .then(e => {
                expect(e.body).toEqual({members: ["a", "b", "c"], url: "d"});
            });
    });
});
