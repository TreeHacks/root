import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { STATUS } from '../constants';
import lolex from "lolex";

const _doc = {
    _id: 'applicanttreehacks',
    reviews: [],
    status: STATUS.INCOMPLETE,
    transportation_status: null,
    forms: {
        application_info: {
            first_name: "test",
            last_name: "test",
            phone: "test",
            dob: "test",
            gender: "test",
            race: ["test"],
            university: "test",
            graduation_year: "test",
            level_of_study: "test",
            major: "test",
            skill_level: 1,
            hackathon_experience: 2,
            resume: "testtesttest",
            accept_terms: true,
            accept_share: true,
            q1_goodfit: "test",
            q2_experience: "test",
            q3: "test",
            q4: "test"
        }
    }
};

afterAll(() => {
    return Application.deleteMany({});
})

beforeEach(() => {
    return Application.deleteMany({});
})

describe('user form submit by applicant', () => {
    test('submit form with same id - success', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
        await request(app)
            .post("/users/applicanttreehacks/forms/application_info/submit")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/users/applicanttreehacks/status")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.status).toEqual(STATUS.SUBMITTED);
            })
        clock.uninstall();
    });
    test('submit form with different id - unauthorized', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
        await request(app)
            .post("/users/applicanttreehacks2/forms/application_info/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
    test('submit form with deadline passed - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/2048") });
        await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
        await request(app)
            .post("/users/applicanttreehacks/forms/application_info/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
    test('submit form with not all fields complete - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await new Application({
            ..._doc, status: STATUS.INCOMPLETE, forms: {
                ..._doc.forms,
                application_info: {
                    first_name: "test"
                }
            }
        }).save();
        await request(app)
            .post("/users/applicanttreehacks/forms/application_info/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
    test('submit form with application already submitted - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await new Application({
            ..._doc, status: STATUS.SUBMITTED
        }).save();
        await request(app)
            .post("/users/applicanttreehacks/forms/application_info/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });

});