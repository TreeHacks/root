import { IAdminState } from "./types";
import { Reducer } from 'redux';

const initialState: IAdminState = {
  applicationList: null
};

const admin: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case "SET_APPLICATION_LIST":
      return {
        ...state,
        applicationList: action.applicationList
      };
    default:
      return state;
  }
};

export default admin;