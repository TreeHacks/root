import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import Judge from "../models/Judge";

afterEach(async () => {
    await Application.deleteMany({});
    await Judge.deleteMany({});
})

describe('bulk create users endpoint', () => {
    test.skip('bulk create users', () => {
        // todo
    });
    test('bulk create judges', async () => {
        let result = await request(app)
            .post("/api/users_bulkcreate")
            .set({ Authorization: 'admin' })
            .send({
                emails: ["j1@treehacks.com", "j2@treehacks.com"],
                group: "judge"
            })
            .expect(200);
        expect(result.body.users.length).toEqual(2);
        for (let user of result.body.users) {
            expect(user.id).not.toEqual("ERROR");
        }
        let judges = await Judge.find({});
        expect(judges.length).toEqual(2);
        expect(judges.map(j => j.email)).toEqual(["j2@treehacks.com", "j1@treehacks.com"]);
        expect(judges.map(j => j._id)).toEqual(result.body.users.map(u => u.id));
    });
});