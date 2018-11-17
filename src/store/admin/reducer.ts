import { IAdminState } from "./types";
import { Reducer } from 'redux';

const initialState: IAdminState = {
  applicationList: null,
  applicationStats: null,
  selectedForm: null
};

const admin: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case "SET_APPLICATION_LIST":
      return {
        ...state,
        applicationList: action.applicationList
      };
    case "SET_SELECTED_FORM":
      return {
        ...state,
        selectedForm: action.selectedForm
      };
    case "SET_APPLICATION_STATS":
      return {
        ...state,
        applicationStats: action.applicationStats
      };
    default:
      return state;
  }
};

export default admin;