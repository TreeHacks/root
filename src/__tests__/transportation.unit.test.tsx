import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Transportation } from "../Transportation/Transportation";
import { TRANSPORTATION_STATUS, STATUS, TRANSPORTATION_BUS_ROUTES } from "../constants";

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const deadline = "2048-11-28T04:39:47.512Z";

const schemas = { application_info: { schema: {}, uiSchema: {} }, additional_info: { schema: {}, uiSchema: {} }, reimbursement_info: { schema: {}, uiSchema: {} } };


it('no reimbursement', () => {
    // const store = mockStore({ form: {} })
    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: ""
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} page={0} formData={{}} formName="" subformName="" incomingFormName="" userEdited={false}
            schemas={schemas} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have not been given a travel reimbursement");
});

it('reimbursement screen when admission not yet confirmed', () => {
    // const store = mockStore({ form: {} })
    const profile = {
        status: STATUS.ADMITTED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} page={0} formData={{}} formName="" subformName="" incomingFormName="" userEdited={false}
            schemas={schemas} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement");
    expect(wrapper.text()).toContain("After you confirm your spot using the dashboard, you can use this page to upload your receipts and request reimbursement");
});

it('flight reimbursement', () => {
    // const store = mockStore({ form: {} })
    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} page={0} formData={{}} formName="" subformName="" incomingFormName="" userEdited={false}
            schemas={schemas} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

it('bus reimbursement', () => {
    // const store = mockStore({ form: {} })
    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.USC,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} page={0} formData={{}} formName="" subformName="" incomingFormName="" userEdited={false}
            schemas={schemas} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have been placed on a bus!");
});

it('other reimbursement', () => {
    // const store = mockStore({ form: {} })
    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} page={0} formData={{}} formName="" subformName="" incomingFormName="" userEdited={false}
            schemas={schemas} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

// todo: ADMISSION_DECLINED