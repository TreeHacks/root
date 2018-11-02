import { Reducer, createStore, applyMiddleware } from 'redux';
import { reducers } from './store/index';
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware, LOCATION_CHANGE } from 'connected-react-router';
import GoogleAnalyticsGtag, { trackPageView, trackEvent } from '@redux-beacon/google-analytics-gtag';
import { createMiddleware } from "redux-beacon";
import history from "./history";

declare const GA_TRACKING_ID: string;
const ga = GoogleAnalyticsGtag(GA_TRACKING_ID);
const eventsMap = {
  [LOCATION_CHANGE]: trackPageView(action => ({
    path: action.payload.routerState.url
  })),
  '*': trackEvent(action => ({
    category: 'redux',
    action: action.type,
  })),
}
const gaMiddleware = createMiddleware(eventsMap, ga);

const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(thunkMiddleware, routerMiddleware(history), gaMiddleware)
);
export default store;