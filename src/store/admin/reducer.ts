import { IAdminState } from "./types";
import { Reducer } from 'redux';

const initialState: IAdminState = {
  applicationList: null,
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
    default:
      return state;
  }
};

export default admin;