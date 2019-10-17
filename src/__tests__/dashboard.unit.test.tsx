import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import lolex from "lolex";
import {Dashboard} from "../Dashboard/Dashboard";
import { STATUS, TYPE, DEADLINES } from "../constants";
import AdmittedScreen from "../Dashboard/AdmittedScreen";
import AdmissionDeclinedScreen from "../Dashboard/AdmissionDeclinedScreen";
import AdmissionExpiredScreen from "../Dashboard/AdmissionExpiredScreen";
import RejectedScreen from "../Dashboard/RejectedScreen";
import WaitlistedScreen from "../Dashboard/WaitlistedScreen";

it('dashboard incomplete after deadline', () => {
    const profile = {
        status: STATUS.INCOMPLETE,
        type: TYPE.OUT_OF_STATE
    };
    const clock = lolex.install({now: new Date("01/01/2048")});
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("Sorry, the application window has closed.");
});

it('dashboard incomplete before deadline', () => {
    const profile = {
        status: STATUS.INCOMPLETE,
        type: TYPE.OUT_OF_STATE
    };
    const clock = lolex.install({now: new Date("01/01/1999")});
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You haven't submitted your application yet.");
    expect(wrapper.text()).toContain("before the deadline:November 18,");
});

it('dashboard submitted', () => {
    const profile = {
        status: STATUS.SUBMITTED,
        type: TYPE.OUT_OF_STATE
    };
  
    const wrapper = render(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("Your application has been received");
});

it('dashboard admission confirmed', () => {
    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: TYPE.OUT_OF_STATE
    };
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<AdmittedScreen confirmedYet={true} />)).toBe(true);
});

it('dashboard admission declined', () => {
    const profile = {
        status: STATUS.ADMISSION_DECLINED,
        type: TYPE.OUT_OF_STATE
    };
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<AdmissionDeclinedScreen />)).toBe(true);
});

it('dashboard admitted', () => {
    const DEADLINE = "2048-01-30T04:39:47.512Z";
    const profile = {
        status: STATUS.ADMITTED,
        type: TYPE.OUT_OF_STATE,
        admin_info: {
            acceptance: {
                deadline: DEADLINE
            }
        }
    };
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<AdmittedScreen confirmedYet={false} deadline={DEADLINE} />)).toBe(true);
});

it('dashboard admission confirm expired', () => {
    const profile = {
        status: STATUS.ADMITTED,
        type: TYPE.OUT_OF_STATE,
        admin_info: {
            acceptance: {
                deadline: "2018-01-30T04:39:47.512Z"
            }
        }
    };
    const clock = lolex.install({now: new Date("2018-01-30T04:39:48.512Z") });
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<AdmissionExpiredScreen />)).toBe(true);
});

it('dashboard rejected', () => {
    const profile = {
        status: STATUS.REJECTED,
        type: TYPE.OUT_OF_STATE,
        admin_info: {}
    };
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<RejectedScreen />)).toBe(true);
});

it('dashboard waitlisted', () => {
    const profile = {
        status: STATUS.WAITLISTED,
        type: TYPE.OUT_OF_STATE,
        admin_info: {}
    };
  
    const wrapper = shallow(
        <Dashboard profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<WaitlistedScreen />)).toBe(true);
});