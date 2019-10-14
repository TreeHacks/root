import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import ApplicationAnyYear from "../models/Application";
import { isEqual, omit } from "lodash";
import { STATUS, HACKATHON_YEAR_STRING, sponsorApplicationDisplayFields } from '../constants';

const _doc = {
    reviews: [],
    status: STATUS.INCOMPLETE,
    transportation_status: null,
    year: HACKATHON_YEAR_STRING,
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

const docs = [
    {..._doc, user: { id: 'applicanttreehacks' } },
    {..._doc, user: { id: 'applicanttreehacks2' } },
    {..._doc, user: { id: 'applicant-optout-confirmed' }, sponsor_optout: true, status: STATUS.ADMISSION_CONFIRMED },
    {..._doc, user: { id: 'applicant-confirmed' }, status: STATUS.ADMISSION_CONFIRMED },
    {..._doc, user: { id: 'applicant-admitted' }, status: STATUS.ADMITTED }
];

describe('userformview', () => {

    beforeAll(() => {
        return Application.insertMany(docs);
    });
    
    afterAll(() => {
        return Application.deleteMany({});
    })

describe('user form view by applicant', () => {
    test('view form with same id - success', () => {
        return request(app)
            .get("/api/users/applicanttreehacks/forms/application_info")
            .set({ Authorization: 'applicant' })
            .expect(200).then(e => {
                expect(e.body["race"]).toEqual(["test"]);
                expect(e.body.reviews).toBeFalsy();
            });
    });
    test('view form with different id - unauthorized', () => {
        return request(app)
            .get("/api/users/applicanttreehacks2/forms/application_info")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('user form view by admin', () => {
    test('view any form - success', () => {
        return request(app)
            .get("/api/users/applicanttreehacks/forms/application_info")
            .set({ Authorization: 'admin' })
            .expect(200);
    });
});

describe('user form view by sponsor', () => {
    test('view a form with opt out - fail', () => {
        return request(app)
            .get("/api/users/applicant-optout-confirmed/forms/application_info")
            .set({ Authorization: 'sponsor' })
            .expect(404); // Todo: should be 401 when implementation changes.
    });
    test('view a form with status admitted - fail', () => {
        return request(app)
            .get("/api/users/applicant-incomplete/forms/application_info")
            .set({ Authorization: 'sponsor' })
            .expect(404); // Todo: should be 401 when implementation changes.
    });
    test('view a form with status confirmed - pass', () => {
        return request(app)
            .get("/api/users/applicant-confirmed/forms/application_info")
            .set({ Authorization: 'sponsor' })
            .expect(200).then(e => {
                expect(Object.keys(e.body).sort()).toEqual(sponsorApplicationDisplayFields.sort());
            });
    });

});

});

describe('user form view last year\'s application - fail', () => {
    test('test', async () => {
        await new ApplicationAnyYear({..._doc, user: { id: 'applicanttreehacks' }, year: "1999" }).save();
        return request(app)
            .get("/api/users/applicanttreehacks/forms/application_info")
            .set({ Authorization: 'applicant' })
            .expect(404);
    });
})