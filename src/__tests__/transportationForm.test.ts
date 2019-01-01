import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { TRANSPORTATION_STATUS, TRANSPORTATION_TYPE } from '../constants';
import lolex from "lolex";

afterEach(() => {
    return Application.deleteMany({});
})

describe('transportation form before deadline', () => {
    let clock;
    beforeAll(() => {
        clock = lolex.install({ now: new Date("01/01/1999") });
    });
    afterAll(() => {
        clock.uninstall();
    });
    test('available user view transportation', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {vendor: "vendor"} }
        }).save();
        await request(app)
            .get("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ vendor: "vendor" });
            });
    });
    test('submitted user edits other transportation - fail', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
            forms: {transportation: {vendor: "vendor"} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.OTHER, amount: 500, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({accept: true})
            .expect(403);
    });
    test('submitted user submits other transportation - fail', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
            forms: {transportation: {vendor: "vendor"} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.OTHER, amount: 500, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('flight transportation rsvp', () => {
    beforeEach(async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.FLIGHT, amount: 500, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
    });
    test('available user edits flight transportation', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ accept: true })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: true });
            });
        clock.uninstall();
    });

    test('available user submits flight transportation', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/users/applicanttreehacks")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.transportation_status).toEqual(TRANSPORTATION_STATUS.SUBMITTED);
            })
        clock.uninstall();
    });

    test('available user edits flight transportation after deadline - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ accept: true })
            .expect(403);
        clock.uninstall();
    });

    test('available user submits flight transportation after deadline - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
});

describe('other transportation rsvp', () => {
    beforeEach(async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.OTHER, amount: 500, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
    });
    test('available user edits other transportation', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ accept: true })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: true });
            });
        clock.uninstall();
    });

    test('available user submits other transportation', async () => {
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/users/applicanttreehacks")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.transportation_status).toEqual(TRANSPORTATION_STATUS.SUBMITTED);
            })
        clock.uninstall();
    });

    test('available user edits other transportation after deadline - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ accept: true })
            .expect(403);
        clock.uninstall();
    });

    test('available user submits other transportation after deadline - fail', async () => {
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
});

describe('bus transportation rsvp', () => {
    test('available user bus rsvp change yes to no to yes before deadline', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.BUS, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ 'accept': true })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: true });
            });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ 'accept': false })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: false });
            });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ 'accept': true })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: true });
            });
        clock.uninstall();
    });
    test('available user submits bus transportation - fail', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.BUS, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        const clock = lolex.install({ now: new Date("01/01/1999") });
        await request(app)
            .post("/users/applicanttreehacks/forms/transportation/submit")
            .set({ Authorization: 'applicant' })
            .expect(403);
        clock.uninstall();
    });
    test('available user bus rsvp change yes to no after deadline', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {accept: true} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.BUS, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ 'accept': false })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({ accept: false });
            });
        clock.uninstall();
    });
    test('available user bus rsvp change no to yes after deadline - fail', async () => {
        await new Application({
            _id: 'applicanttreehacks',
            transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
            forms: {transportation: {accept: false} },
            admin_info: {transportation: {type: TRANSPORTATION_TYPE.BUS, deadline: "2018-11-27T07:59:00.000Z"}}
        }).save();
        const clock = lolex.install({ now: new Date("01/01/9999") });
        await request(app)
            .put("/users/applicanttreehacks/forms/transportation")
            .set({ Authorization: 'applicant' })
            .send({ 'accept': true })
            .expect(403);
        clock.uninstall();
    });
});