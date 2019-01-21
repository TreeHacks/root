import { Reducer } from 'redux';
import { IAuthState, IUserAttributes } from './types';

const initialState: IAuthState = {
  loggedIn: undefined,
  user: null,
  userId: null,
  schemas: require("./schemas.json"),
  error: null,
  message: null,
  authPage: 'signIn',
  admin: null,
  reviewer: null,
  sponsor: null,
  applicant: null,
  judge: null,
  attemptedLoginEmail: null
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
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loggedIn: false,
        user: null,
        userId: null,
        admin: null,
        reviewer: null,
        sponsor: null,
        applicant: null,
        judge: null
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        loggedIn: false
      };
    case "SET_AUTH_PAGE":
      return {
        ...state,
        authPage: action.authPage,
        message: action.message,
        error: action.error
      }
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.message
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.error
      }
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }
    case "SET_ATTEMPTED_LOGIN_EMAIL":
      return {
        ...state,
        attemptedLoginEmail: action.attemptedLoginEmail
      }
    default:
      return state;
  }
};

export default auth;