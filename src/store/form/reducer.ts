import {IFormState} from "./types";
import { Reducer } from 'redux';

const initialState: IFormState = {
  profile: null,
  schemas: require("./schemas.json"),
  page: 0,
  formData: null,
  formName: null,
  subformName: null,
  userEdited: false
};

const form: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.page
      };
    case "SET_NAME":
      return {
        ...state,
        formName: action.formName,
        subformName: null
      };
    case "SET_SUBNAME":
      return {
        ...state,
        subformName: action.subformName
      };
    case "SET_DATA":
      return {
        ...state,
        formData: action.formData,
        userEdited: action.userEdited
      };
    case "SET_USER_EDITED":
      return {
        ...state,
        userEdited: action.userEdited
      };
    case "SET_USER_PROFILE":
      return {
        ...state,
        profile: action.profile
      };
    default:
      return state;
  }
};

export default form;