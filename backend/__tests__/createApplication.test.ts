import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import { createApplication } from "../routes/common";
import { IApplication } from "../models/Application.d";
import lolex from "lolex";
import { STATUS, TRANSPORTATION_STATUS, TYPE, HACKATHON_YEAR_STRING } from "../constants";

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

    test('should create stanford user application', async () => {
        const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123123" });
        expect(application.type).toEqual("stanford");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
    });

    test('should create stanford user application and copy from existing application', async () => {
        const doc = {
            forms: { application_info: { "first_name": "b" } },
            user: { email: "test@stanford.edu", id: "test" },
            type: TYPE.STANFORD,
            status: STATUS.ADMISSION_CONFIRMED,
            TRANSPORTATION_STATUS: TRANSPORTATION_STATUS.UNAVAILABLE
        };
        const oldApplication = await new Application(doc).save();
        const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123123" });
        expect(application.type).toEqual("stanford");
        expect(application.status).toEqual(STATUS.ADMISSION_CONFIRMED);
        expect(application.toJSON().forms).toEqual(oldApplication!.toJSON().forms);
        expect(application.toJSON().user).toEqual(oldApplication!.toJSON().user);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
    });

    test('should create user application in-state', async () => {
        const application: IApplication = await createApplication({ email: "test@berkeley.edu", sub: "123125", "custom:location": "California" });
        expect(application.type).toEqual("is");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
    });

    test('should create user application out-of-state', async () => {
        const application: IApplication = await createApplication({ email: "test@gatech.edu", sub: "123126", "custom:location": "Georgia" });
        expect(application.type).toEqual("oos");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
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

    test('should create user application in-state', async () => {
        const application: IApplication = await createApplication({ email: "test@berkeley.edu", sub: "123125", "custom:location": "California" });
        expect(application.type).toEqual("is");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
    });

    test('should create user application out-of-state', async () => {
        const application: IApplication = await createApplication({ email: "test@gatech.edu", sub: "123126", "custom:location": "Georgia" });
        expect(application.type).toEqual("oos");
        expect(application.status).toEqual(STATUS.INCOMPLETE);
        expect(application.year).toEqual(HACKATHON_YEAR_STRING);
    });

});