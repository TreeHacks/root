import { createApplication } from "../routes/common";
import { IApplication } from "../models/Application.d";

describe('create application', () => {

    test('should create stanford user application', () => {
        expect.assertions(1);
        return createApplication({ email: "test@stanford.edu", sub: "123123" }).then((application: IApplication) => {
            expect(application.type).toEqual("stanford");
        });
    });

    test('should create regular user application', () => {
        expect.assertions(1);
        return createApplication({ email: "test@gatech.edu", sub: "123124" }).then((application: IApplication) => {
            expect(application.type).toEqual("oos");
        });
    });

});