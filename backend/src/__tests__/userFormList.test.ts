import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { isEqual, omit } from "lodash";
import { STATUS, sponsorApplicationDisplayFields } from '../constants';
import queryString from "query-string";
import { merge, cloneDeep } from "lodash";

const _doc = {
    _id: null,
    reviews: [],
    status: STATUS.INCOMPLETE,
    transportation_status: null,
    user: {
        email: 'test@treehacks'
    },
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
            q1_goodfit: "test",
            q2_experience: "test",
            q3: "test",
            q4: "test"
        }
    }
};

let docs = [
    { ..._doc, _id: 'applicanttreehacks' },
    { ..._doc, _id: 'applicant-optout-confirmed', sponsor_optout: true, status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, _id: 'applicant-confirmed', status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, _id: 'applicant-confirmed-2', status: STATUS.ADMISSION_CONFIRMED },
    { ..._doc, _id: 'applicant-submitted', status: STATUS.SUBMITTED },
    {
        ..._doc, _id: 'applicant-name-thomas',
        forms: {
            ..._doc.forms, application_info: {
                ..._doc.forms.application_info,
                first_name: 'thomas'
            }
        }
    },
    {
        ..._doc, _id: 'applicant-name-tracey',
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

describe('user form list by applicant', () => {
    test('view form list with applicant - fail', () => {
        return request(app)
            .get("/users")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('user form list by sponsor', () => {
    test('view only application confirmed forms with no opt out', () => {
        return request(app)
            .get("/users")
            .set({ Authorization: 'sponsor' })
            .expect(200).then(e => {
                expect(e.body.count).toEqual(2);
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
                expect(e.body.results.map(item => omit(item, "__v")).sort()).toEqual(docs.sort());
            });
    });
    test('filter by status', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'status': STATUS.SUBMITTED })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(1);
                expect(e.body.results[0]._id).toEqual('applicant-submitted');
            });
    });
    test('filter by status and project email', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'status': STATUS.SUBMITTED }),
                project: JSON.stringify(['user.email']),
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(1);
                expect(e.body.results[0]).toEqual({ _id: 'applicant-submitted', user: { email: 'test@treehacks' } });
            });
    });
    test('filter by name (partial filter)', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'forms.application_info.first_name': 't' })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(2);
                expect(e.body.results.map(item => item.forms.application_info.first_name).sort()).toEqual(["thomas", "tracey"]);
            });
    });
    test('filter by name (partial filter) should only match beginning of the word', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'forms.application_info.first_name': 'a' })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(0);
            });
    });
    test('filter by name (partial filter) and sort asc', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'forms.application_info.first_name': 't' }),
                sort: JSON.stringify({ 'forms.application_info.first_name': 1 })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(2);
                expect(e.body.results.map(item => item.forms.application_info.first_name)).toEqual(["thomas", "tracey"]);
            });
    });
    test('filter by name (partial filter) and sort desc', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'forms.application_info.first_name': 't' }),
                sort: JSON.stringify({ 'forms.application_info.first_name': -1 })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(2);
                expect(e.body.results.map(item => item.forms.application_info.first_name)).toEqual(["tracey", "thomas"]);
            });
    });
    test('filter by boolean value', () => {
        return request(app)
            .get("/users?" + queryString.stringify({
                filter: JSON.stringify({ 'sponsor_optout': true })
            }))
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.length).toEqual(1);
                expect(e.body.results[0]._id).toEqual('applicant-optout-confirmed');
            });
    });
});