import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { isEqual, omit } from "lodash";
import { STATUS, sponsorApplicationDisplayFieldsNoSection, HACKATHON_YEAR_STRING } from '../constants';
import queryString from "query-string";

jest.mock("../constants");

const _doc = {
    reviews: [],
    status: STATUS.INCOMPLETE,
    transportation_status: null,
    user: {
        email: 'test@treehacks'
    },
    year: HACKATHON_YEAR_STRING,
    forms: {
        application_info: {
            first_name: "fir",
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
            q1: "test",
            q2: "test",
            q3: "test",
            q4: "test",
            q5: "test"
        }
    }
};

let docs = [
    { ..._doc, user: { email: 'test@treehacks', id: 'applicanttreehacks'} },
    { ..._doc, user: { email: 'test@treehacks', id: 'applicant-optout-confirmed'}, sponsor_optout: true, status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, user: { email: 'test@treehacks', id: 'applicant-confirmed'}, status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, user: { email: 'test@treehacks', id: 'applicant-confirmed-2'}, status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, user: { email: 'test@treehacks', id: 'applicant-submitted'}, status: STATUS.SUBMITTED },
    {
        ..._doc, user: { email: 'test@treehacks', id: 'applicant-name-thomas'},
        forms: {
            ..._doc.forms, application_info: {
                ..._doc.forms.application_info,
                first_name: 'thomas'
            }
        }
    },
    {
        ..._doc, user: { email: 'test@treehacks', id: 'applicant-name-tracey'},
        forms: {
            ..._doc.forms, application_info: {
                ..._doc.forms.application_info,
                first_name: 'tracey'
            }
        }
    }
];

beforeAll(() => {
    return Application.insertMany(docs);
});

afterAll(() => {
    return Application.deleteMany({});
});

describe('user stats by applicant', () => {
    test('view user stats - fail', () => {
        return request(app)
            .get("/api/users_stats")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('user form list by sponsor', () => {
    test('view user stats - fail', () => {
        return request(app)
            .get("/api/users_stats")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('user form list by admin', () => {
    test('view all forms', async () => {
        return request(app)
            .get("/api/users_stats")
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body).toMatchSnapshot();
            });
    });
});