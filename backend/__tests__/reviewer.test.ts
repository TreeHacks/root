import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { isEqual, omit } from "lodash";
import { STATUS, HACKATHON_YEAR_STRING, applicationReviewDisplayFieldsNoSection, TYPE } from '../constants';

jest.mock("../constants");

afterEach(() => {
    return Application.deleteMany({});
})

describe('review endpoint permissions', () => {
    test('/review/leaderboard as an applicant - fail', () => {
        return request(app)
            .get("/api/review/leaderboard")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/review/rate as an applicant - fail', () => {
        return request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/review/stats as an applicant - fail', () => {
        return request(app)
            .get("/api/review/stats")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/review/next_application as an applicant - fail', () => {
        return request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
});

describe('review next application', () => {
    test('review application gets the right fields', async () => {
        await new Application({
            type: TYPE.OUT_OF_STATE,
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
                    q1: "test",
                    q2: "test",
                    q3: "test",
                    q4: "test",
                    q5: "test",
                    q_team_matching_1: "test",
                    q_team_matching_2: "test"
                }
            },
            status: STATUS.SUBMITTED,
            user: { id: 'applicanttreehacks' }
        }).save();
        return request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(Object.keys(e.body)).toEqual(["_id", "forms", "user"]);
                expect(Object.keys(e.body.forms.application_info).sort()).toEqual(applicationReviewDisplayFieldsNoSection.sort());
            });
    });
    test('review application gets oos before is', async () => {
        await Application.insertMany([
            { user: { id: "applicationOos" }, year: HACKATHON_YEAR_STRING, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED },
            ...Array(100).fill({ year: HACKATHON_YEAR_STRING, type: TYPE.IN_STATE, STATUS: STATUS.SUBMITTED })
        ]);
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/api/review/next_application")
                .set({ Authorization: 'reviewer' })
                .expect(200)
                .then(e => {
                    expect(e.body.user.id).toEqual("applicationOos");
                });
        }
    });
    test('review application gets is application', async () => {
        await new Application({ user: { id: "applicationIs" }, type: TYPE.IN_STATE, status: STATUS.SUBMITTED }).save();
        await request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body.user.id).toEqual("applicationIs");
            });
    });
    test('review application does not get stanford', async () => {
        await new Application({ user: {id: "applicationOos" }, type: TYPE.STANFORD, status: STATUS.SUBMITTED }).save();
        await request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('review application does not get application with 3+ reviews', async () => {
        await new Application({ user: { id: "applicationOos" }, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED, reviews: [{}, {}, {}] }).save();
        await request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('review application does not get application already reviewed by current user', async () => {
        await new Application({
            user: { id: "applicationIs" }, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED,
            reviews: [{
                reader: {
                    id: 'reviewertreehacks',
                    email: 'reviewer@treehacks'
                },
                cultureFit: 1,
                experience: 2,
                passion: 3,
            }]
        }).save();
        await request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('review application does not get incomplete applications', async () => {
        await new Application({ user: { id: "applicationOos" }, type: TYPE.OUT_OF_STATE, status: STATUS.INCOMPLETE }).save();
        await request(app)
            .get("/api/review/next_application")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
});
describe('rate applications', () => {
    test('rate an application', async () => {
        await new Application({
            user: { id: 'applicationToReview' },
            reviews: [],
            status: STATUS.SUBMITTED,
        }).save();
        await request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'reviewer' })
            .send({
                application_id: 'applicationToReview',
                cultureFit: 1,
                experience: 2,
                passion: 3,
            })
            .expect(200)
            .then(e => {
                expect(e.body.results.status).toEqual("success");
            })
        let application = (await Application.findOne({'user.id': 'applicationToReview'}))!.toObject();
        expect(application.reviews.length).toEqual(1);
        expect(application.reviews[0]).toEqual({
            reader: {
                id: 'reviewertreehacks',
                email: 'reviewer@treehacks'
            },
            cultureFit: 1,
            experience: 2,
            passion: 3,
        });
    });
    test('rate an application with an existing review', async () => {
        await new Application({
            user: { id: 'applicationToReview' },
            reviews: [{
                reader: {
                    id: 'reviewertreehacks2',
                    email: 'reviewer2@treehacks'
                },
                cultureFit: 1,
                experience: 2,
                passion: 3,
            }],
            status: STATUS.SUBMITTED,
        }).save();
        await request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'reviewer' })
            .send({
                application_id: 'applicationToReview',
                cultureFit: 1,
                experience: 2,
                passion: 3,
            })
            .expect(200);
    });
    test('rate an application that is not found - fail', async () => {
        await request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'reviewer' })
            .send({
                application_id: 'applicationNotFound',
                cultureFit: 1,
                experience: 2,
                passion: 3,
            })
            .expect(404)
            .then(e => {
                expect(e.text).toContain("Application to rate not found");
            });
    });
    test('rate an application twice - fail', async () => {
        await new Application({
            user: { id: 'applicationToReview' },
            reviews: [{
                reader: {
                    id: 'reviewertreehacks',
                    email: 'reviewer@treehacks'
                },
                cultureFit: 1,
                experience: 2,
                passion: 3,
            }],
            status: STATUS.SUBMITTED,
        }).save();
        await request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'reviewer' })
            .send({
                application_id: 'applicationToReview',
                cultureFit: 1,
                experience: 2,
                passion: 3,
            })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("already has a review");
            });
    });
    test('rate an application with three reviews already - fail', async () => {
        await new Application({
            user: { id: 'applicationToReview' },
            reviews: [{}, {}, {}],
            status: STATUS.SUBMITTED,
        }).save();
        await request(app)
            .post("/api/review/rate")
            .set({ Authorization: 'reviewer' })
            .send({
                application_id: 'applicationToReview',
                cultureFit: 1,
                experience: 2,
                passion: 3,
            })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("already has 3 reviews");
            });
    });
});

describe('review leaderboard', () => {
    test('simple leaderboard test', async () => {
        await Application.insertMany([
            { user: { id: "applicationOos" }, year: HACKATHON_YEAR_STRING, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED, reviews: [{ reader: { email: "reviewer1@treehacks" } }] },
            { user: { id: "applicationOos2" }, year: HACKATHON_YEAR_STRING, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED, reviews: [{ reader: { email: "reviewer1@treehacks" } }, { reader: { email: "reviewer2@treehacks" } }] },
        ]);
        await request(app)
            .get("/api/review/leaderboard")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body.sort()).toEqual([{ "_id": "reviewer1@treehacks", "count": 2 }, { "_id": "reviewer2@treehacks", "count": 1 }]);
            })
    });
});

describe('review stats', () => {
    test('simple stats test', async () => {
        await Application.insertMany([
            { user: { id: "applicationOos" }, year: HACKATHON_YEAR_STRING, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED, reviews: [] },
            { user: { id: "applicationOos2" }, year: HACKATHON_YEAR_STRING, type: TYPE.OUT_OF_STATE, status: STATUS.SUBMITTED, reviews: [{}, {}, {}] },
            { user: { id: "applicationIss" }, year: HACKATHON_YEAR_STRING, type: TYPE.IN_STATE, status: STATUS.SUBMITTED, reviews: [{}] },
            { user: { id: "applicationProgress" }, year: HACKATHON_YEAR_STRING, type: TYPE.IN_STATE, status: STATUS.INCOMPLETE },
        ]);
        await request(app)
            .get("/api/review/stats")
            .set({ Authorization: 'reviewer' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ "results": { "num_remaining": 2, "num_remaining_is": 1, "num_remaining_oos": 1 } });
            })
    });
});