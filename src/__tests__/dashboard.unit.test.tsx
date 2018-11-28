import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import {Dashboard} from "../Dashboard/Dashboard";

it('renders dashboard', () => {
    //   store.dispatch(action())
    //   const wrapper = render(
    //     <Provider store={store}><PaymentHistory /></Provider>
    //   );
    const profile = {

    };
    const wrapper = render(
        <Dashboard  profile={ profile } />
    );
    expect(wrapper).toMatchSnapshot();
    //   expect(wrapper.text()).toContain("No rows found");
});