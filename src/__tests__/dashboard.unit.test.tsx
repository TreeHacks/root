import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import {Dashboard} from "../Dashboard/Dashboard";

const literallyJustDateNow = () => Date.now();

// test('It should call and return Date.now()', () => {
//   const realDateNow = Date.now.bind(global.Date);
//   const dateNowStub = jest.fn(() => 1530518207007);
//   global.Date.now = dateNowStub;

//   expect(literallyJustDateNow()).toBe(1530518207007);
//   expect(dateNowStub).toHaveBeenCalled();

//   global.Date.now = realDateNow;
// });

it('renders dashboard', () => {
    //   store.dispatch(action())
    //   const wrapper = render(
    //     <Provider store={store}><PaymentHistory /></Provider>
    //   );
    const profile = {

    };
    const wrapper = render(
        <Dashboard profile={ profile } />
    );
    // expect(wrapper).toMatchSnapshot();
    //   expect(wrapper.text()).toContain("No rows found");
});