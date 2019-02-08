import request from "supertest";
import app from "../index";
import RoomReservation from "../models/RoomReservation";
import { isEqual, omit } from "lodash";
import { STATUS, TYPE, hackReviewDisplayFields, AVAILABLE_ROOMS } from '../constants';
import * as constants from "../constants";

(constants as any).AVAILABLE_ROOMS = [
    {
        "id": "007",
        "name": "007 The Leo Chan",
        "description": ""
    },
    {
        "id": "008",
        "name": "008 The George Tang",
        "description": ""
    }
];

afterEach(async () => {
    await RoomReservation.deleteMany({});
})

describe('room endpoint permissions', () => {
    test.skip('GET /rooms/status as anonymous - pass', () => {
        return request(app)
            .get("/rooms/status")
            .expect(200);
    });
    test('GET /rooms as anonymous - fail', () => {
        return request(app)
            .get("/rooms")
            .expect(401);
    });
    test('POST /rooms as anonymous - fail', () => {
        return request(app)
            .post("/rooms")
            .expect(401);
    });
    test('DELETE /rooms as anonymous - fail', () => {
        return request(app)
            .delete("/rooms")
            .expect(401);
    });
});

describe('get rooms endpoint', () => {
    test('get rooms default', async () => {
        await request(app)
            .get("/rooms")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.current_room).toEqual(null);
                expect(e.body.rooms.map(e => e.id)).toEqual(["007", "008"]);
            })
    });
    test('get rooms with room already reserved', async () => {
        let expiryDate = Date.now() + 10000;
        await RoomReservation.insertMany([
            {
                "room_id": "007",
                "user": "applicanttreehacks",
                "expiry": expiryDate
            }
        ]);
        await request(app)
            .get("/rooms")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.current_room).toEqual({"description": "", "error": "you've already reserved this room rather recently", "expiry": new Date(expiryDate).toISOString(), "id": "007", "name": "007 The Leo Chan"});
                expect(e.body.rooms.map(e => e.id)).toEqual(["007", "008"]);
            });
    });
    test('get rooms with room recently reserved', async () => {
        await RoomReservation.insertMany([
            {
                "room_id": "007",
                "user": "applicanttreehacks",
                "expiry": Date.now() - 10000
            }
        ]);
        await request(app)
            .get("/rooms")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.current_room).toEqual(null);
                expect(e.body.rooms.map(e => e.id)).toEqual(["007", "008"]);
                expect(e.body.rooms[0]).toEqual({"description": "", "error": "you've already reserved this room rather recently", "expiry": null, "id": "007", "name": "007 The Leo Chan"})
            })
    });
});