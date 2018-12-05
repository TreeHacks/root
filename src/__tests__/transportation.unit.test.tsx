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

const schemas = { application_info: { schema: {}, uiSchema: {} }, reimbursement_info: { schema: {}, uiSchema: {} } };

const commonProps = {
    page: 0,
    formData: {},
    formName: "",
    incomingFormName: "",
    userEdited: false,
    schemas: schemas
}

it('no reimbursement before submitting form', () => {

    const profile = {
        status: STATUS.INCOMPLETE,
        type: "oos",
        admin_info: {
        },
        applications: [],
        transportation_status: null,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("There are no travel options at this time.");
});


it('no reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have not been given a travel reimbursement");
});

it('reimbursement screen when admission not yet confirmed', () => {

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
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement");
    expect(wrapper.text()).toContain("After you confirm your spot using the dashboard, you can use this page to upload your receipts and request reimbursement");
});

it('flight reimbursement', () => {

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
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

it('bus reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have been placed on a bus!");
    expect(wrapper.text()).toContain("Hack, hack, hack!");
    expect(wrapper.text()).toContain("Charles E. Young");
});

it('other reimbursement', () => {

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
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

it('flight reimbursement with accept=true', () => {

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
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
    expect(wrapper.text()).toContain("Thanks, we've received your receipt");
});

it('bus reimbursement with accept=true', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have been placed on a bus!");
    expect(wrapper.text()).toContain("Hack, hack, hack!");
    expect(wrapper.text()).toContain("Charles E. Young");
    expect(wrapper.text()).toContain("We've received your RSVP! You can change your status");
});

it('other reimbursement with accept=true', () => {

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
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
    expect(wrapper.text()).toContain("Thanks, we've received your reimbursement request");
});

it('don\'t show reimbursement if status is unavailable, even if reimbursement is defined', () => {

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
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have not been given a travel reimbursement");
    expect(wrapper.text()).not.toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).not.toContain("$500.30");
});


it('reimbursement screen when admission declined -- don\'t show reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_DECLINED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
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
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).not.toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("You have declined your admission");
    expect(wrapper.text()).not.toContain("$500.30");
});