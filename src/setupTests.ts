import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Save the original method.


const toLocaleString = Date.prototype.toLocaleString;
Date.prototype.toLocaleString = function(locale = 'en-US', ...args) {
  return toLocaleString.call(this, locale, {...args, timeZone: "UTC"});
};
Date.prototype.getTimezoneOffset = function () {
    return 0;
}