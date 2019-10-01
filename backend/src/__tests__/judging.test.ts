import request from "supertest";
import app from "../index";
import Hack from "../models/Hack";
import Judge from "../models/Judge";
import { isEqual, omit } from "lodash";
import { STATUS, TYPE, hackReviewDisplayFields } from '../constants';

const _doc = {
    "title": "sample title",
    "devpostUrl": "sample url",
    "floor": 0
};

afterEach(async () => {
    await Hack.deleteMany({});
    await Judge.deleteMany({});
})

describe('judge endpoint permissions', () => {
    test('/judging/rate as an applicant - fail', () => {
        return request(app)
            .post("/judging/rate")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judging/next_hack as an applicant - fail', () => {
        return request(app)
            .get("/judging/next_hack")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judging/stats as an applicant - fail', () => {
        return request(app)
            .get("/judging/next_hack")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('/judging/leaderboard as an applicant - fail', () => {
        return request(app)
            .get("/judging/leaderboard")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
});

describe('review next hack', () => {
    test('gets the right fields', async () => {
        await new Hack({ ..._doc, _id: 1, reviews: [{}, {}] }).save();
        return request(app)
            .get("/judging/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(async e => {
                expect(Object.keys(e.body).sort()).toEqual(hackReviewDisplayFields.sort());
            });
    });
    test('does not get hack with 3+ reviews', async () => {
        await new Hack({ _id: 1, verticals: ["test1"], reviews: [{}, {}, {}] }).save();
        await request(app)
            .get("/judging/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('does not get hack that is disabled', async () => {
        await new Hack({ _id: 1, verticals: ["test1"], reviews: [], disabled: true }).save();
        await request(app)
            .get("/judging/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('prioritizes verticals for judges assigned to one vertical', async () => {
        await Hack.insertMany([
            { _id: 1, categories: ['test1', 'test2'], reviews: [] },
            ...Array(100).fill({ categories: ['test3'], reviews: [] })
        ]);
        await new Judge({ _id: 'judgetreehacks', verticals: ['test1'] }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body._id).toEqual(1);
                });
        }
    });
    test('prioritizes verticals for judges assigned to more than one vertical', async () => {
        await Hack.insertMany([
            { _id: 1, categories: ['test1', 'test2'], reviews: [] },
            { _id: 2, categories: ['test1'], reviews: [] },
            ...Array(100).fill({ categories: ['test3'], reviews: [] })
        ]);
        await new Judge({ _id: 'judgetreehacks', verticals: ['test1', 'test2'] }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body._id === 1 || e.body._id === 2).toBe(true);
                });
        }
    });
    test('gives non-vertical hacks for judges assigned to one vertical when vertical hacks have run out', async () => {
        await Hack.insertMany([
            { _id: 1, categories: ['test2', 'test3'], reviews: [] },
            ...Array(100).fill({ categories: ['test1'], reviews: [{}, {}, {}] })
        ]);
        await new Judge({ _id: 'judgetreehacks', categories: ['test1'] }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body._id).toEqual(1);
                });
        }
    });
    test('only gives hacks with same floor for judges assigned to a different floor', async () => {
        await Hack.insertMany([
            ...Array(100).fill({ categories: [], reviews: [], floor: 1 })
        ]);
        await new Judge({ _id: 'judgetreehacks', floor: 0 }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body).toEqual("");
                });
        }
    });
    test('does not get hack already reviewed by current user', async () => {
        await new Hack({
            _id: 1,
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
            .get("/judging/next_hack")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual("");
            });
    });
    test('prefers to pick hacks with less reviews as opposed to more reviews', async () => {
        await Hack.insertMany([
            { _id: 0, reviews: [{}] },
            ...Array(100).fill({ reviews: [{}, {}] })
        ]);  
        
        await new Judge({ _id: 'judgetreehacks' }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body._id).toEqual(0);
                });
        }
    });
    test('prioritizes verticals over # of reviews for judges assigned to one vertical', async () => {
        await Hack.insertMany([
            { _id: 1, categories: ['test1', 'test2'], reviews: [{}, {}] },
            ...Array(100).fill({ categories: ['test3'], reviews: [] })
        ]);
        await new Judge({ _id: 'judgetreehacks', verticals: ['test1'] }).save();
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(e => {
                    expect(e.body._id).toEqual(1);
                });
        }
    });
    test('by custom hack_id', async () => {
        await Hack.insertMany([
            { _id: 0, reviews: [{}] },
            ...Array(100).fill({ reviews: [{}, {}] })
        ]);
        for (let i = 0; i < 10; i++) {
            await request(app)
                .get("/judging/next_hack?hack_id=0")
                .set({ Authorization: 'judge' })
                .expect(200)
                .then(async e => {
                    expect(e.body._id).toEqual(0);
                });
        }
    });
    test('by custom hack_id should fail when not found', async () => {
        await Hack.insertMany([
            { _id: 0, reviews: [{}] }
        ]);
        await request(app)
        .get("/judging/next_hack?hack_id=1")
        .set({ Authorization: 'judge' })
        .expect(404)
        .then(e => {
            expect(e.text).toContain("not found");
        });
    });
    test('by custom hack_id should fail when already rated', async () => {
        await Hack.insertMany([
            { _id: 0, reviews: [{reader: {id: "judgetreehacks"}}] }
        ]);
        await request(app)
        .get("/judging/next_hack?hack_id=0")
        .set({ Authorization: 'judge' })
        .expect(404)
        .then(e => {
            expect(e.text).toContain("not found"); // todo: change this error message?
        });
    });
});

describe('rate hacks', () => {
    test('rate a hack', async () => {
        await new Hack({
            _id: 1,
            reviews: [],
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200)
            .then(e => {
                expect(e.body.results.status).toEqual("success");
            })
        let application = (await Hack.findById(1))!.toObject();
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
    test('rate a hack that is disabled - enable it', async () => {
        await new Hack({
            _id: 1,
            reviews: [],
            disabled: true
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200)
            .then(e => {
                expect(e.body.results.status).toEqual("success");
            })
        let application = (await Hack.findById(1))!.toObject();
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
        expect(application.disabled).toEqual(false);
    });
    test('rate a hack with an existing review', async () => {
        await new Hack({
            _id: 1,
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
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200);
    });
    test('rate a hack that is not found - fail', async () => {
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 0,
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
            _id: 1,
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
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200);
    });
    test('rate a hack with three reviews already - success', async () => {
        await new Hack({
            _id: 1,
            reviews: [{}, {}, {}],
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                creativity: 2,
                technicalComplexity: 2,
                socialImpact: 3,
                comments: "test"
            })
            .expect(200);
    })
});
describe('skip hack', () => {
    test('skip a hack with three reviews and disabled and skips 0 - success', async () => {
        await new Hack({
            _id: 1,
            reviews: [{}, {}, {}],
            numSkips: 0,
            disabled: true
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                skip_hack: true
            })
            .expect(200);
        let hack = (await Hack.findById(1))!.toObject();
        expect(hack.numSkips).toEqual(1);
        expect(hack.disabled).toEqual(true);
    });
    test('skip a hack with three reviews and not disabled and skips 0 - success', async () => {
        await new Hack({
            _id: 1,
            reviews: [{}, {}, {}],
            numSkips: 0
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                skip_hack: true
            })
            .expect(200);
        let hack = (await Hack.findById(1))!.toObject();
        expect(hack.numSkips).toEqual(1);
        expect(hack.disabled).toEqual(true);
    });
    test('skip a hack with three reviews and not disabled and skips 1 - success', async () => {
        await new Hack({
            _id: 1,
            reviews: [{}, {}, {}],
            numSkips: 1
        }).save();
        await request(app)
            .post("/judging/rate")
            .set({ Authorization: 'judge' })
            .send({
                hack_id: 1,
                skip_hack: true
            })
            .expect(200);
        let hack = (await Hack.findById(1))!.toObject();
        expect(hack.numSkips).toEqual(2);
        expect(hack.disabled).toEqual(true);
    });
});

describe('judge leaderboard', () => {
    test('simple leaderboard test', async () => {
        await Hack.insertMany([
            { _id: 1, reviews: [{ reader: { email: "reviewer1@treehacks" } }] },
            { _id: 2, reviews: [{ reader: { email: "reviewer1@treehacks" } }, { reader: { email: "reviewer2@treehacks" } }] },
        ]);
        await request(app)
            .get("/judging/leaderboard")
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
            { _id: 1, reviews: [] },
            { _id: 2, reviews: [{}, {}, {}] },
            { _id: 3, reviews: [{}] }
        ]);
        await request(app)
            .get("/judging/stats")
            .set({ Authorization: 'judge' })
            .expect(200)
            .then(e => {
                expect(e.body.results.num_remaining).toEqual(2);
            })
    });
});