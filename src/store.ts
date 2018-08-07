import { Reducer, createStore, applyMiddleware } from 'redux';
import { reducers } from './store/index';
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router';
import history from "./history";

const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(thunkMiddleware, routerMiddleware(history))
);
export default store;