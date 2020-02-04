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
    forms: {
        application_info: {
            first_name: "First",
            last_name: "Last",
            phone: "1234567890"
        }
    },
    user: { id: 'applicanttreehacks' }
};

afterEach(() => {
    return Application.deleteMany({});
})

describe('user profile endpoint info', () => {
    beforeEach(async () => {
        await new Application({ ..._doc }).save();
    });
    test('applicant - should return expected fields', async () => {
        await request(app)
            .get("/api/user_profile")
            .set({ Authorization: 'applicant' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({
                    status: STATUS.INCOMPLETE,
                    groups: [],
                    first_name: "First",
                    last_name: "Last",
                    email: "applicant@treehacks",
                    id: "applicanttreehacks",
                    phone: "1234567890"
                });
            });
    });
    test('admin - should include correct groups and not include application fields if they don\'t exist', async () => {
        await request(app)
            .get("/api/user_profile")
            .set({ Authorization: 'admin' })
            .expect(200)
            .then(e => {
                expect(e.body).toEqual({
                    groups: ['admin'],
                    email: "admin@treehacks",
                    id: "admintreehacks"
                });
            });
    });
    test('should give error with invalid jwt', async () => {
        await request(app)
            .get("/api/user_profile")
            .set({ Authorization: 'invalid' })
            .expect(401);
    });

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