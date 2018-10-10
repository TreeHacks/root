import { combineReducers, Reducer } from 'redux';

import auth from './auth/reducer';
import base from './base/reducer';
import form from './form/reducer';
import review from './review/reducer';

export const reducers: Reducer = combineReducers({
  auth,
  base,
  form,
  review
});
