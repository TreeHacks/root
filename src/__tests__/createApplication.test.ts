import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { createApplication } from "../routes/common";
import { IApplication } from "../models/Application.d";
import lolex from "lolex";
import { STATUS, TRANSPORTATION_STATUS } from "../constants";

beforeAll(async () => {
    await request(app);
});

afterEach(() => {
    return Application.deleteMany({});
})


describe('create application before deadline', () => {
    let clock;
    beforeEach(() => {
        clock = lolex.install({ now: new Date("01/01/1999") });
    })
    afterEach(() => {
        clock.uninstall();
    })

    test.skip('should create stanford user application', async () => {
        const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123123" });
        expect(application.type).toEqual("stanford");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
    });

    test('should create user application in-state', async () => {
        const application: IApplication = await createApplication({ email: "test@berkeley.edu", sub: "123125", "custom:location": "California" });
        expect(application.type).toEqual("is");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
    });

    test('should create user application out-of-state', async () => {
        const application: IApplication = await createApplication({ email: "test@gatech.edu", sub: "123126", "custom:location": "Georgia" });
        expect(application.type).toEqual("oos");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
    });

});

describe('create application after deadline', () => {
    let clock;
    beforeEach(() => {
        clock = lolex.install({ now: new Date("01/01/9999") });
    })
    afterEach(() => {
        clock.uninstall();
    })

    test('should create stanford user application and auto-admit them', async () => {
        const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123123" });
        expect(application.type).toEqual("stanford");
        expect(application.status).toEqual(STATUS.ADMISSION_CONFIRMED);
        expect(application.transportation_status).toEqual(TRANSPORTATION_STATUS.UNAVAILABLE);
    });

    test('should create user application in-state', async () => {
        const application: IApplication = await createApplication({ email: "test@berkeley.edu", sub: "123125", "custom:location": "California" });
        expect(application.type).toEqual("is");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
    });

    test('should create user application out-of-state', async () => {
        const application: IApplication = await createApplication({ email: "test@gatech.edu", sub: "123126", "custom:location": "Georgia" });
        expect(application.type).toEqual("oos");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
    });

});