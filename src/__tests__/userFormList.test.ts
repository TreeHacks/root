import mockingoose from 'mockingoose';
import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { isEqual, omit } from "lodash";
import { STATUS, sponsorApplicationDisplayFields } from '../constants';

const _doc = {
    _id: null,
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

const docs = [
    { ..._doc, _id: 'applicanttreehacks' },
    { ..._doc, _id: 'applicant-optout-confirmed', sponsor_optout: true, status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, _id: 'applicant-confirmed', status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, _id: 'applicant-confirmed-2', status: STATUS.ADMISSION_CONFIRMED }
];

beforeAll(() => {
    return Application.insertMany(docs);
});

afterAll(() => {
    return Application.deleteMany({});
});

describe('user form list by applicant', () => {
    test('view form with applicant - fail', () => {
        return request(app)
            .get("/users")
            .set({ Authorization: 'applicant' })
            .expect(401);
    });
});

describe('user form list by sponsor', () => {
    test('view only application confirmed forms with no opt out', () => {
        return request(app)
            .get("/users")
            .set({ Authorization: 'sponsor' })
            .expect(200).then(e => {
                expect(e.body.results.map(item => item._id).sort()).toEqual(['applicant-confirmed', 'applicant-confirmed-2'].sort());
                for (let result of e.body.results) {
                    expect(Object.keys(result.forms.application_info).sort()).toEqual(sponsorApplicationDisplayFields.sort());
                }
            });
    });

});

describe('user form list by admin', () => {
    test('view all forms', () => {
        return request(app)
            .get("/users")
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.map(item => omit(item, "__v"))).toEqual(docs);
            });
    });
});