import request from "supertest";
import app from "../index";
import Judge from "../models/Judge";

afterEach(async () => {
    await Judge.deleteMany({});
})

describe('judge endpoint permissions', () => {
    test('GET /judges as an applicant - fail', () => {
        return request(app)
            .get("/judges")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
    test('PUT /judges/1 as an applicant - fail', async () => {
        await new Judge({_id: 1}).save();
        return request(app)
            .put("/judges/1")
            .set({ Authorization: 'applicant' })
            .expect(403)
            .then(e => {
                expect(e.text).toContain("Unauthorized");
            });
    });
});

describe('judge list', () => {
    test('judge list simple test', async () => {
        const docs = [
            {_id: "a", email: "1", verticals: ["1"]},
            {_id: "b", email: "1", verticals: ["1"]},
            {_id: "c", email: "1", verticals: ["1"]}
        ]
        await Judge.insertMany(docs);
        return request(app)
            .get("/judges")
            .set({ Authorization: 'admin' })
            .expect(200)
            .then(async e => {
                expect(e.body.count).toEqual(3);
                expect(e.body.results.map(a => a._id)).toEqual(["a", "b", "c"]);
            });
    });
});

describe('judge modify', () => {
    test('judge modify simple test', async () => {
        const docs = [
            {_id: "a", email: "1", verticals: ["1"]}
        ]
        await Judge.insertMany(docs);
        return request(app)
            .put("/judges/a")
            .set({ Authorization: 'admin' })
            .send({
                email: "newemail",
                verticals: ["new"]
            })
            .expect(200)
            .then(async e => {
                let judge = await Judge.findById("a");
                expect(judge!.verticals.length).toEqual(1);
                expect(judge!.verticals[0]).toEqual("new");
                expect(judge!.email).toEqual("newemail");
            });
    });
});