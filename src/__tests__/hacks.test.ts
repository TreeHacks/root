import request from "supertest";
import app from "../index";
import Hack from "../models/Hack";
import {isEqual} from "lodash";

describe('import hacks', () => {
    test('/review/leaderboard as an applicant - fail', async () => {
        let result = await request(app)
            .post("/hacks_import")
            .set({ Authorization: 'admin' })
            .send({
                items: [{
                    "devpostUrl": "devpostUrl1",
                    "title": "title1",
                    "categories": ["cat11", "cat12", "cat13"]
                },
                {
                    "devpostUrl": "devpostUrl2",
                    "title": "title2",
                    "categories": ["cat21", "cat22", "cat23"]
                }]
            })
            .expect(200);
        expect(result.body.status).toEqual("Bulk hack import successful.");
        let hacks = await Hack.find({});
        expect(hacks.map(h => h.devpostUrl).sort()).toEqual(["devpostUrl1", "devpostUrl2"].sort());
        expect(hacks.map(h => h.title).sort()).toEqual(["title1", "title2"].sort());
        expect(isEqual(hacks.map(h => h.categories).sort(), [["cat11", "cat12", "cat13"], ["cat21", "cat22", "cat23"]])).toBe(true);
    });
});