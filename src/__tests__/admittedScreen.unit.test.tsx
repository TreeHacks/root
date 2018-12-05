import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import lolex from "lolex";
import {Dashboard} from "../Dashboard/Dashboard";
import { STATUS, TYPE, DEADLINES } from "../constants";
import {AdmittedScreen} from "../Dashboard/AdmittedScreen";

const defaultProps = {
    confirmAdmission: () => null,
    declineAdmission: () => null,
    confirmedYet: true,
    deadline: "2048-11-28T04:39:47.512Z"
}

it('Format admission deadline with PST time zone', () => {
    const wrapper = shallow(
        <AdmittedScreen {...defaultProps} confirmedYet={false} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have until November 27, 2048 8:39 PM PST to confirm your attendance");
    expect(wrapper.text()).toContain("Congratulations! You've been accepted to TreeHacks 2019!");
});

it('Admission confirmed screen', () => {
    const wrapper = shallow(
        <AdmittedScreen {...defaultProps} confirmedYet={true} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("Admission confirmed – see you there!");
    expect(wrapper.text()).toContain("decline spot");
    expect(wrapper.text()).toContain("already confirmed");
});