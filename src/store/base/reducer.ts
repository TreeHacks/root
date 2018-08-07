import {IBaseState} from "./types";
import { Reducer } from 'redux';

const initialState: IBaseState = {
  loading: false
};

const auth: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        loading: true
      };
    case 'LOADING_END':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default auth;