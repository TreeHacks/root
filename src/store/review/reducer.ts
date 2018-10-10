import { IReviewState } from "./types";
import { Reducer } from 'redux';

const initialState: IReviewState = {
  applicationList: null
};

const review: Reducer<any> = (state: any = initialState, action): any => {
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

export default review;