import { IAdminState } from "./types";
import { Reducer } from 'redux';

const initialState: IAdminState = {
  applicationList: [],
  pages: null,
  applicationStats: null,
  selectedForm: null,
  applicationEmails: null,
  exportedApplications: null,
  bulkChange: {
    status: "",
    ids: ""
  }
};

const admin: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case "SET_APPLICATION_LIST":
      return {
        ...state,
        applicationList: action.applicationList,
        pages: action.pages
      };
    case "SET_APPLICATION_EMAILS":
      return {
        ...state,
        applicationEmails: action.applicationEmails
      };
    case "SET_EXPORTED_APPLICATIONS":
      return {
        ...state,
        exportedApplications: action.exportedApplications
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
    case "SET_BULK_CHANGE_STATUS":
      return {
        ...state,
        bulkChange: {
          ...state.bulkChange,
          status: action.status
        }
      };
    case "SET_BULK_CHANGE_IDS":
      return {
        ...state,
        bulkChange: {
          ...state.bulkChange,
          ids: action.ids
        }
      };
    default:
      return state;
  }
};

export default admin;