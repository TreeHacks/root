import request from "supertest";
import app from "../index";
import Application from "../models/Application";
import {
  STATUS,
  TRANSPORTATION_STATUS,
  TYPE,
  AUTO_ADMIT_STANFORD,
} from "../constants";
import lolex from "lolex";
import { omit } from "lodash";

const _doc = {
  reviews: [],
  status: STATUS.INCOMPLETE,
  transportation_status: null,
  user: { id: "applicanttreehacks" },
  forms: {
    application_info: {
      first_name: "test",
      last_name: "test",
      phone: "test",
      dob: "test",
      gender: "test",
      race: ["test"],
      university: "test",
      graduation_year: "test",
      level_of_study: "test",
      major: "test",
      skill_level: 1,
      hackathon_experience: 2,
      resume: "testtesttest",
      accept_terms: true,
      accept_share: true,
      q1: "test",
      q2: "test",
      q3: "test",
      q4: "test",
      q5: "test",
      q6: "test",
    },
  },
};

beforeEach(() => {
  return Application.deleteMany({});
});

afterEach(() => {
  return Application.deleteMany({});
});

describe("user form submit by applicant", () => {
  test("submit form with same id - success", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(200);
    await request(app)
      .get("/api/users/applicanttreehacks/status")
      .set({ Authorization: "applicant" })
      .expect(200)
      .then((e) => {
        expect(e.body.status).toEqual(STATUS.SUBMITTED);
      });
    clock.uninstall();
  });
  test("submit form with different id - unauthorized", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
    await request(app)
      .post("/api/users/applicanttreehacks2/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(403);
    clock.uninstall();
  });
  test("submit form with deadline passed - fail", async () => {
    const clock = lolex.install({ now: new Date("01/01/2048") });
    await new Application({ ..._doc, status: STATUS.INCOMPLETE }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(403);
    clock.uninstall();
  });
  // TODO: Make this test better; mock the value of AUTO_ADMIT_STANFORD to be true
  // or false, and test accordingly.
  if (AUTO_ADMIT_STANFORD) {
    test("submit form before deadline and stanford - success with auto admit", async () => {
      const clock = lolex.install({ now: new Date("01/01/1999") });
      await new Application({
        ..._doc,
        type: TYPE.STANFORD,
        status: STATUS.INCOMPLETE,
      }).save();
      await request(app)
        .post("/api/users/applicanttreehacks/forms/application_info/submit")
        .set({ Authorization: "applicant" })
        .expect(200)
        .then(async (e) => {
          const application = await Application.findOne({
            "user.id": "applicanttreehacks",
          });
          expect(application!.status).toEqual(STATUS.ADMISSION_CONFIRMED);
          expect(application!.transportation_status).toEqual(
            TRANSPORTATION_STATUS.UNAVAILABLE
          );
        });
      clock.uninstall();
    });
  } else {
    test("submit form before deadline and stanford - no auto admit", async () => {
      const clock = lolex.install({ now: new Date("01/01/1999") });
      await new Application({
        ..._doc,
        type: TYPE.STANFORD,
        status: STATUS.INCOMPLETE,
      }).save();
      await request(app)
        .post("/api/users/applicanttreehacks/forms/application_info/submit")
        .set({ Authorization: "applicant" })
        .expect(200)
        .then(async (e) => {
          const application = await Application.findOne({
            "user.id": "applicanttreehacks",
          });
          expect(application!.status).toEqual(STATUS.SUBMITTED);
          expect(application!.transportation_status).toEqual(null);
        });
      clock.uninstall();
    });
  }
  test("submit form with not all fields complete - fail", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({
      ..._doc,
      status: STATUS.INCOMPLETE,
      forms: {
        ..._doc.forms,
        application_info: {
          first_name: "test",
        },
      },
    }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(403);
    clock.uninstall();
  });
  test("submit stanford form with not all fields complete - fail", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({
      ..._doc,
      status: STATUS.INCOMPLETE,
      type: TYPE.STANFORD,
      forms: {
        ..._doc.forms,
        application_info: {
          first_name: "test",
        },
      },
    }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(403);
    clock.uninstall();
  });
  test("submit stanford form with only stanford-required fields complete - success", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({
      ..._doc,
      status: STATUS.INCOMPLETE,
      type: TYPE.STANFORD,
      forms: {
        ..._doc.forms,
        application_info: {
          ..._doc.forms.application_info,
          first_name: "test",
          last_name: "test",
          phone: "test",
          dob: "test",
          gender: "test",
          race: ["test"],
          university: "test",
          graduation_year: "test",
          level_of_study: "test",
          major: "test",
          skill_level: 1,
          hackathon_experience: 2,
          resume: "testtesttest",
          accept_terms: true,
          accept_share: true,
          q5: "test",
          q6: "test",
          volunteer: true,
        },
      },
    }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(200);
    clock.uninstall();
  });
  test("submit form with application already submitted - fail", async () => {
    const clock = lolex.install({ now: new Date("01/01/1999") });
    await new Application({
      ..._doc,
      status: STATUS.SUBMITTED,
    }).save();
    await request(app)
      .post("/api/users/applicanttreehacks/forms/application_info/submit")
      .set({ Authorization: "applicant" })
      .expect(403);
    clock.uninstall();
  });
});
