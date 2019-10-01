import request from "supertest";
import app from "../index";
import Hack from "../models/Hack";
import {isEqual} from "lodash";

afterEach(() => {
    return Hack.deleteMany({});
})

describe('import hacks', () => {
    test('import hacks test with no floor - FAIL', async () => {
        let result = await request(app)
            .post("/api/hacks_import")
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
            .expect(400);
    });
    test('import hacks test simple', async () => {
        let result = await request(app)
            .post("/api/hacks_import")
            .set({ Authorization: 'admin' })
            .send({
                floor: 2,
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
        expect(hacks[0]._id).toEqual(1);
        expect(hacks[1]._id).toEqual(2);
        expect(hacks[0].floor).toEqual(2);
        expect(hacks[1].floor).toEqual(2);
    });
    test('import hacks multiple times should increment starting with highest-numbered hack', async () => {
        await new Hack({
            "_id": 999,
            "devpostUrl": "devpostUrl1",
            "title": "title1",
            "categories": ["cat11", "cat12", "cat13"]
        }).save();

        let result = await request(app)
        .post("/api/hacks_import")
        .set({ Authorization: 'admin' })
        .send({
            floor: 1,
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
        expect(hacks[0]._id).toEqual(999);
        expect(hacks[1].floor).toEqual(1);
        expect(hacks[1]._id).toEqual(1000);
        expect(hacks[2]._id).toEqual(1001);
    });
});

describe('hack modify', () => {
    test('hack modify simple test', async () => {
        await new Hack({
            "_id": 999,
            "devpostUrl": "devpostUrl1",
            "title": "title1",
            "categories": ["cat11", "cat12", "cat13"]
        }).save();
        return request(app)
            .patch("/api/hacks/999")
            .set({ Authorization: 'admin' })
            .send({
                "disabled": true
            })
            .expect(200)
            .then(async e => {
                let hack = await Hack.findById(999);
                expect(hack!.disabled).toEqual(true);
            });
    });
});