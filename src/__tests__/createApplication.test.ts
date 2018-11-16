import { createApplication } from "../routes/common";
import { IApplication } from "../models/Application.d";

// describe('create application', () => {

//     test('should create stanford user application', async () => {
//         expect.assertions(1);
//         const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123123" });
//         expect(application.type).toEqual("stanford");
//     });

//     test('should create stanford user application with in-state', async () => {
//         // Should never be called; stanford users should use SAML for SSO.
//         const application: IApplication = await createApplication({ email: "test@stanford.edu", sub: "123124", "custom:location": "California" });
//         expect(application.type).toEqual("stanford");
//     });

//     test('should create user application in-state', async () => {
//         const application: IApplication = await createApplication({ email: "test@berkeley.edu", sub: "123125", "custom:location": "California" });
//         expect(application.type).toEqual("is");

//     });

//     test('should create user application out-of-state', async () => {
//         const application: IApplication = await createApplication({ email: "test@gatech.edu", sub: "123126", "custom:location": "Georgia" });
//         expect(application.type).toEqual("oos");
//     });

// });