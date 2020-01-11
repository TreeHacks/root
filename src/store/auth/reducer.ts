import { Reducer } from 'redux';
import { IAuthState } from './types';

const initialState: IAuthState = {
  loggedIn: undefined,
  user: null,
  userId: null,
  admin: null,
  reviewer: null,
  sponsor: null,
  applicant: null,
  judge: null,
};

const auth: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loggedIn: true,
        user: action.attributes,
        userId: action.userId,
        admin: action.admin,
        reviewer: action.reviewer,
        sponsor: action.sponsor,
        applicant: action.applicant,
        judge: action.judge
      };
    default:
      return state;
  }
};

export default auth;