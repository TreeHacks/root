import React from "react";
import { shallow } from 'enzyme';
import { IHomeProps } from "../Home/types";
import { Home } from "../Home/Home";
import {NavLink} from "react-router-dom";

const props: IHomeProps = {
    profile: null,
    schemas: null,
    page: null,
    formData: null,
    formName: null,
    userEdited: null,
    auth: {
        loggedIn: false,
        user: null,
        userId: "test",
        admin: false,
        reviewer: false,
        sponsor: false,
        judge: false,
        applicant: false,
    },
    getUserProfile: () => null,
    logout: () => null,
};

describe.only('Home screen tests', () => {
    it('home screen applicant', () => {
        const wrapper = shallow(
            <Home {...{ ...props, auth: { ...props.auth, applicant: true } }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(NavLink).length).toEqual(4);
        // expect(wrapper.find(NavLink).at(1).text()).toEqual("dashboard");
        // expect(wrapper.find(NavLink).at(2).text()).toEqual("application");
        // expect(wrapper.find(NavLink).at(3).text()).toEqual("travel");
    });
    it('home screen admin', () => {
        const wrapper = shallow(
            <Home {...{ ...props, auth: { ...props.auth, applicant: true, admin: true } }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(NavLink).length).toEqual(5);
        // expect(wrapper.find(NavLink).at(4).text()).toEqual("admin");
    });
    it('home screen reviewer', () => {
        const wrapper = shallow(
            <Home {...{ ...props, auth: { ...props.auth, applicant: true, reviewer: true } }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(NavLink).length).toEqual(5);
        // expect(wrapper.find(NavLink).at(4).text()).toEqual("reviewer");
    });
    it('home screen sponsor', () => {
        const wrapper = shallow(
            <Home {...{ ...props, auth: { ...props.auth, sponsor: true } }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(NavLink).length).toEqual(2);
        // expect(wrapper.find(NavLink).at(1).text()).toEqual("sponsor");
    });
    it('home screen judge', () => {
        const wrapper = shallow(
            <Home {...{ ...props, auth: { ...props.auth, judge: true } }} />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(NavLink).length).toEqual(2);
        // expect(wrapper.find(NavLink).at(1).text()).toEqual("judge");
    });
});