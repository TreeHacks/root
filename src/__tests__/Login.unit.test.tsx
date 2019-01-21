import React from "react";
import { shallow, mount, render } from 'enzyme';
import {Login, ILoginProps} from "../Login/Login";
import AuthPageNavButton from "../Login/AuthPageNavButton";

const props: ILoginProps = {
    loggedIn: false,
    user: null,
    userId: "test",
    schemas: {
        signIn: {schema: {}, uiSchema: {}},
        signUp: {schema: {}, uiSchema: {}},
        forgotPassword: {schema: {}, uiSchema: {}},
        forgotPasswordSubmit: {schema: {}, uiSchema: {}},
        changePassword: {schema: {}, uiSchema: {}}
    },
    error: "",
    message: "",
    admin: false,
    reviewer: false,
    sponsor: false,
    judge: false,
    applicant: false,
    authPage: "signIn",
    attemptedLoginEmail: null,
    checkLoginStatus: () => null,
    logout: () => null,
    setup: () => null,
    signIn: (e) => null,
    signUp: (e) => null,
    forgotPassword: (e) => null,
    forgotPasswordSubmit: (e) => null,
    resendSignup: () => null,
    changePassword: (e) => null
};

describe('Login screen tests', () => {
    it('login screen applicant', () => {
        const wrapper = shallow(
            <Login {...{ ...props, applicant: true }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find("button").text()).toContain("Sign In");
        expect(wrapper.text()).toContain("Don't have an account yet?");
        expect(wrapper.text()).not.toContain("judges");
        expect(wrapper.text()).not.toContain("sponsors");
    });
    it('login screen sponsor', () => {
        const wrapper = shallow(
            <Login {...{ ...props, sponsor: true }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find("button").text()).toContain("Sign In");
        expect(wrapper.text()).not.toContain("Don't have an account yet?");
        expect(wrapper.text()).not.toContain("judges");
        expect(wrapper.text()).toContain("sponsors");
    });
    it('login screen judge', () => {
        const wrapper = shallow(
            <Login {...{ ...props, judge: true }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find("button").text()).toContain("Sign In");
        expect(wrapper.text()).not.toContain("Don't have an account yet?");
        expect(wrapper.text()).toContain("judges");
        expect(wrapper.text()).not.toContain("sponsors");
    });
});