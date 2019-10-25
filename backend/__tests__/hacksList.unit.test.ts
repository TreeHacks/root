import request from "supertest";
import app from "../index";
import Hack from "../models/Hack";
import { omit } from "lodash";
import { hackReviewDisplayFields } from "../constants";

jest.mock("../constants");

let docs = [
    { _id: 1, floor: 1, title: 'test1', categories: [], devpostUrl: "abc", numSkips: 0, reviews: [{ reader: { id: "test", email: "test@test" } }] },
    { _id: 2, floor: 2, title: 'test2', categories: [], devpostUrl: "abc", numSkips: 0, reviews: [] },
    { _id: 3, floor: 3, title: 'test3', categories: [], devpostUrl: "abc", numSkips: 0, reviews: [] }
];

beforeAll(() => {
    return Hack.insertMany(docs);
});

afterAll(() => {
    return Hack.deleteMany({});
});

describe('hack list by applicant', () => {
    test('view hack list with applicant - pass', () => {
        return request(app)
            .get("/api/hacks")
            .set({ Authorization: 'applicant' })
            .expect(200);
    });
});

describe('hack list by anyone', () => {
    test('view hack list with no authorization', () => {
        return request(app)
            .get("/api/hacks")
            .expect(200).then(e => {
                expect(e.body.count).toEqual(3);
                expect(e.body.results.map(item => item.title).sort()).toEqual(['test1', 'test2', 'test3'].sort());
                for (let result of e.body.results) {
                    expect(Object.keys(result).sort()).toEqual(hackReviewDisplayFields.sort());
                }
            });
    });
});

describe('hack list by admin', () => {
    test('view all forms', () => {
        return request(app)
            .get("/api/hacks")
            .set({ Authorization: 'admin' })
            .expect(200).then(e => {
                expect(e.body.results.map(item => omit(item, "__v")).sort()).toEqual(docs.sort());
            });
    });
});