import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { STATUS, HACKATHON_YEAR_STRING } from '../constants';
import lolex from "lolex";

const _doc = {
    reviews: [],
    status: STATUS.INCOMPLETE,
    transportation_status: null,
    forms: {
        application_info: {
            
        }
    },
    year: HACKATHON_YEAR_STRING,
};

const docs = [
    { ..._doc, user: { id: 'applicanttreehacks'} },
    { ..._doc, user: { id: 'applicanttreehacks2'} }
];
beforeAll(() => {
    return Application.insertMany(docs);
});

afterAll(() => {
    return Application.deleteMany({});
})

describe('user form edit by applicant', () => {
    test('edit form with same id - success', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .put("/api/users/applicanttreehacks/forms/application_info")
            .set({ Authorization: 'applicant' })
            .send({'university': 'Univ'})
            .expect(200).then(e => {
                expect(e.body).toEqual({'university': 'Univ'});
            });
        clock.uninstall();
    });
    test('edit form with different id - unauthorized', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .put("/api/users/applicanttreehacks2/forms/application_info")
            .set({ Authorization: 'applicant' })
            .send({ 'university': 'Univ' })
            .expect(403);
        clock.uninstall();
    });
    test('edit form with deadline passed - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/2048") });
        await request(app)
            .put("/api/users/applicanttreehacks/forms/application_info")
            .set({ Authorization: 'applicant' })
            .send({'university': 'Univ'})
            .expect(403);
        clock.uninstall();
    });
});