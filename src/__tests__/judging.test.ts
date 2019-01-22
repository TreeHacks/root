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

describe('rate hacks', () => {
    test('rate a hack', async () => {
        await new Hack({
            _id: 'applicationToReview',
            reviews: [],
        }).save();
        await request(app)
            .post("/judge/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 'applicationToReview',
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200)
            .then(e => {
                expect(e.body.results.status).toEqual("success");
            })
        let application = (await Hack.findById('applicationToReview'))!.toObject();
        expect(application.reviews.length).toEqual(1);
        expect(application.reviews[0]).toEqual({
            reader: {
                id: 'judgetreehacks',
                email: 'judge@treehacks'
            },
            creativity: 2,
            technicalComplexity: 2,
            socialImpact: 3,
            comments: "test"
        });
    });
    test('rate a hack with an existing review', async () => {
        await new Hack({
            _id: 'applicationToReview',
            reviews: [{
                reader: {
                    id: 'judgetreehacks2',
                    email: 'reviewer2@treehacks'
                },
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            }],
        }).save();
        await request(app)
            .post("/judge/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 'applicationToReview',
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200);
    });
    test('rate a hack that is not found - fail', async () => {
        await request(app)
            .post("/judge/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 'applicationNotFound',
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(404)
            .then(e => {
                expect(e.text).toContain("Hack to rate not found");
            });
    });
    test('rate a hack twice - fail', async () => {
        await new Hack({
            _id: 'applicationToReview',
            reviews: [{
                reader: {
                    id: 'judgetreehacks',
                    email: 'judge@treehacks'
                },
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            }],
        }).save();
        await request(app)
            .post("/judge/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 'applicationToReview',
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("already has a review");
            });
    });
    test('rate a hack with three reviews already - fail', async () => {
        await new Hack({
            _id: 'applicationToReview',
            reviews: [{}, {}, {}],
        }).save();
        await request(app)
            .post("/judge/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 'applicationToReview',
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("already has 3 reviews");
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
                expect(e.body).toEqual({ "results": { "num_remaining": 2 } });
            })
    });
});