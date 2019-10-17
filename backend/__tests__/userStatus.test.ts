import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { STATUS } from '../constants';
import lolex from "lolex";

const _doc = {
    reviews: [],
    status: STATUS.INCOMPLETE,
    admin_info: {
        acceptance: {
            deadline: "2048-01-30T04:39:47.512Z"
        }
    },
    user: {id: 'applicanttreehacks'}
};

afterEach(() => {
    return Application.deleteMany({});
})

describe('user status before deadline', () => {
    let clock;
    beforeAll(() => {
        clock = lolex.install({ now: new Date("01/01/1999") });
    });
    afterAll(() => {
        clock.uninstall();
    });
    test('admitted user confirms - success', async () => {
        await new Application({ ..._doc, status: STATUS.ADMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/confirm")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/api/users/applicanttreehacks/status")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.status).toEqual(STATUS.ADMISSION_CONFIRMED);
            });
    });
    test('admitted user declines - success', async () => {
        await new Application({ ..._doc, status: STATUS.ADMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/decline")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/api/users/applicanttreehacks/status")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.status).toEqual(STATUS.ADMISSION_DECLINED);
            });
    });
    test('submitted user confirms - fail', async () => {
        await new Application({ ..._doc, status: STATUS.SUBMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/confirm")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
    test('submitted user declines - fail', async () => {
        await new Application({ ..._doc, status: STATUS.SUBMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/decline")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
    test('admission_confirmed user declines - success', async () => {
        await new Application({ ..._doc, status: STATUS.ADMISSION_CONFIRMED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/decline")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/api/users/applicanttreehacks/status")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.status).toEqual(STATUS.ADMISSION_DECLINED);
            });
    });
    test('admission_declined user confirms - fail', async () => {
        await new Application({ ..._doc, status: STATUS.ADMISSION_DECLINED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/confirm")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
});

describe('user status after deadline', () => {
    let clock;
    beforeAll(() => {
        clock = lolex.install({ now: new Date("01/01/9999") });
    });
    afterAll(() => {
        clock.uninstall();
    });
    test('admitted user confirms - fail', async () => {
        await new Application({ ..._doc, status: STATUS.ADMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/confirm")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
    test('admitted user declines - fail', async () => {
        await new Application({ ..._doc, status: STATUS.ADMITTED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/decline")
            .set({ Authorization: 'applicant' })
            .expect(403);
    });
    test('admission_confirmed user declines - success', async () => {
        await new Application({ ..._doc, status: STATUS.ADMISSION_CONFIRMED }).save();
        await request(app)
            .post("/api/users/applicanttreehacks/status/decline")
            .set({ Authorization: 'applicant' })
            .expect(200);
        await request(app)
            .get("/api/users/applicanttreehacks/status")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body.status).toEqual(STATUS.ADMISSION_DECLINED);
            });
    });
});