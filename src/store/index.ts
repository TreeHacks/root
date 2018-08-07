import { combineReducers, Reducer } from 'redux';

import authReducer from './auth/reducer';
import baseReducer from './base/reducer';

export const reducers: Reducer = combineReducers({
  auth: authReducer,
  base: baseReducer
});
