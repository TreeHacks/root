import request from "supertest";
import app from "../index";
import Hack from "../models/Hack";
import { isEqual, omit } from "lodash";
import { STATUS, TYPE, hackReviewDisplayFields } from '../constants';

const _doc = {
    "title": "sample title",
    "devpostUrl": "sample url",
    "table": "tabletable"
};

afterEach(() => {
    return Hack.deleteMany({});
})

describe('judge endpoint permissions', () => {
    test('/judge/rate as an applicant - fail', () => {
        return request(app)
            .post("/judge/rate")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judge/next_hack as an applicant - fail', () => {
        return request(app)
            .get("/judge/next_hack")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judge/stats as an applicant - fail', () => {
        return request(app)
            .get("/judge/next_hack")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judge/leaderboard as an applicant - fail', () => {
        return request(app)
            .get("/judge/leaderboard")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
});

describe('review next hack', () => {
    test('review hack gets the right fields', async () => {
        await new Hack({ ..._doc, _id: 'hacktreehacks' }).save();
        return request(app)
            .get("/judge/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(async e => {
                expect(Object.keys(e.body).sort()).toEqual(["_id", ...hackReviewDisplayFields].sort());
            });
    });
    test('review hack does not get hack with 3+ reviews', async () => {
        await new Hack({ _id: "hackOos", reviews: [{}, {}, {}] }).save();
        await request(app)
            .get("/judge/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('review hack does not get hack already reviewed by current user', async () => {
        await new Hack({
            _id: "hackIs",
            reviews: [{
                reader: {
                    id: 'judgetreehacks',
                    email: 'judge@treehacks'
                },
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            }]
        }).save();
        await request(app)
            .get("/judge/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
});

describe('judge leaderboard', () => {
    test('simple leaderboard test', async () => {
        await Hack.insertMany([
            { _id: "applicationOos", reviews: [{ reader: { email: "reviewer1@treehacks" } }] },
            { _id: "applicationOos2", reviews: [{ reader: { email: "reviewer1@treehacks" } }, { reader: { email: "reviewer2@treehacks" } }] },
        ]);
        await request(app)
            .get("/judge/leaderboard")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body.sort()).toEqual([{ "_id": "reviewer1@treehacks", "count": 2 }, { "_id": "reviewer2@treehacks", "count": 1 }]);
            })
    });
});

describe('judge stats', () => {
    test('simple stats test', async () => {
        await Hack.insertMany([
            { _id: "applicationOos", reviews: [] },
            { _id: "applicationOos2", reviews: [{}, {}, {}] },
            { _id: "applicationIss", reviews: [{}] }
        ]);
        await request(app)
            .get("/judge/stats")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ "results": { "num_remaining": 2} });
            })
    });
});