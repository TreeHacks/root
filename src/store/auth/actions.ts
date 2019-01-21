import { IUserAttributes, IAuthState } from "./types";
import { API, Auth } from "aws-amplify";
import { Cache } from 'aws-amplify';
import { loadingStart, loadingEnd } from "../base/actions";
import {get} from "lodash-es";

export const loggedIn = (userId, attributes, admin, reviewer, sponsor, judge, applicant) => ({
  type: 'LOGIN_SUCCESS',
  userId,
  attributes,
  admin,
  reviewer,
  sponsor,
  judge,
  applicant
});

export const notLoggedIn = () => ({
  type: 'LOGIN_FAILURE'
})

export const loggedOut = () => ({
  type: 'LOGOUT_SUCCESS'
});
export const renderProfile = (profileData) => ({
  type: 'RENDER_PROFILE',
  profileData
});

export function logout() {
  return dispatch => {
    loadingStart();
    console.log("signing out");
    Cache.removeItem("federatedInfo");
    localStorage.clear();
    Auth.signOut().then(e => {
      loadingEnd();
      dispatch(loggedOut());
    })
  }
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

async function getCurrentUser() {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    /*
    ud: 
    auth_time: 
    cognito:username: 
    email: 
    email_verified: 
    event_id: 
    exp: 1533331712
    iat: 1533328112
    iss: 
    name: 
    sub: 
    token_use: 
    website: 
    */

    // Verify JWT here.
    const parsed = parseJwt(jwt);
    if (new Date().getTime() / 1000 >= parseInt(parsed.exp)) {
      console.log("JWT expired");
      localStorage.removeItem("jwt");
    }
    else {
      Auth.signOut();
      let attributes: IUserAttributes = { "name": parsed["name"], "email": parsed["email"], "email_verified": parsed["email_verified"], "cognito:groups": parsed["cognito:groups"] };
      return await {
        "username": parsed["sub"],
        attributes
      };
    }
  }

  // If JWT from SAML has expired, or if there is no JWT in the first place, run this code.
  // Need to parse our local JWT as well to get cognito:groups attribute, because Auth.currentAuthenticatedUser() does not return user groups.
  return Promise.all([
    Auth.currentAuthenticatedUser(),
    parseJwt((await Auth.currentSession()).getIdToken().getJwtToken())
  ]).then(([user, token]) => {
    user.attributes["cognito:groups"] = token["cognito:groups"];
    return user;
  });
}

export function checkLoginStatus() {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    return getCurrentUser()
      .then((user: { username: string, attributes: IUserAttributes, "cognito:groups"?: string[] }) => {
        if (!user) throw "No credentials";
        const groups = get(user.attributes, "cognito:groups", []);
        const checkInGroup = group => groups.indexOf(group) > -1;
        const [admin, reviewer, sponsor, judge] = [
          checkInGroup("admin"),
          checkInGroup("reviewer"),
          checkInGroup("sponsor"),
          checkInGroup("judge")
        ];
        const applicant = !admin && !reviewer && !sponsor && !judge;
        dispatch(setAuthPage("signIn"));
        dispatch(loggedIn(user.username, user.attributes, admin, reviewer, sponsor, judge, applicant));
      }).catch(e => {
        dispatch(notLoggedIn());
        console.error(e);
      }).then(() => dispatch(loadingEnd()));
  }
}

export const setAuthPage = (authPage, message = "", error = "") => ({
  type: 'SET_AUTH_PAGE',
  authPage: authPage,
  message: message,
  error: error
})

export const setMessage = (message) => ({
  type: 'SET_MESSAGE',
  message: message
})

export const setUser = (user) => ({
  type: 'SET_USER',
  user
})

export const onAuthError = (error) => ({
  type: 'SET_ERROR',
  error: error
})

export const setAttemptedLoginEmail = (attemptedLoginEmail) => ({
  type: 'SET_ATTEMPTED_LOGIN_EMAIL',
  attemptedLoginEmail
})

export function signIn(data) {
  return dispatch => {
    let email = data.email.toLowerCase().trim();
    dispatch(loadingStart());
    dispatch(setAttemptedLoginEmail(email));
    Auth.signIn(email, data.password)
      .then(user => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          dispatch(setUser(user));
          dispatch(setAuthPage("changePassword", "Welcome to TreeHacks. To finish logging in, please set a new password for your account."));
        } else {
          dispatch(checkLoginStatus());
        }
      })
      .catch(e => dispatch(onAuthError(e.message)))
      .then(() => dispatch(loadingEnd()))
  }
}

export function signUp(data) {
  return dispatch => {
    if (data.password !== data.password2) {
      dispatch(onAuthError("Passwords do not match."));
      return;
    }

    let email = data.email.toLowerCase().trim();

    dispatch(loadingStart());
    Auth.signUp({
      username: email,
      password: data.password,
      attributes: {
        email: email,
        name: "User",
        ["custom:location"]: data.location,
        website: [location.protocol, '//', location.host, location.pathname].join('') // Link for confirmation email
      }
    })
      .then(() => dispatch(setAuthPage("signIn", "Account creation complete. Please check your email for a confirmation link to confirm your email address, then sign in below. If you don't see the email, please check your spam folder.")))
      .catch(e => dispatch(onAuthError(e.message)))
      .then(() => dispatch(loadingEnd()))
  }
}

export function forgotPassword(data) {
  return dispatch => {
    dispatch(loadingStart());
    Auth.forgotPassword(data.email.toLowerCase())
      .then(() => dispatch(setAuthPage("forgotPasswordSubmit", "Verification email sent. Please check your email for a code and enter the code below to change your password. If you don't see the email, please check your spam folder.")))
      .catch(e => dispatch(onAuthError(e.message)))
      .then(() => dispatch(loadingEnd()))
  }
}

export function forgotPasswordSubmit(data) {
  return dispatch => {
    if (data.password !== data.password2) {
      dispatch(onAuthError("Passwords do not match."));
      return;
    }
    dispatch(loadingStart());
    Auth.forgotPasswordSubmit(data.email.toLowerCase(), data.code, data.password)
      .then(() => dispatch(setAuthPage("signIn", "Password changed successfully! Please log in with your new password:")))
      .catch(e => dispatch(onAuthError(e.message)))
      .then(() => dispatch(loadingEnd()))
  }
}

export function resendSignup() {
  return (dispatch, getState) => {
    const attemptedLoginEmail = (getState().auth as IAuthState).attemptedLoginEmail;
    dispatch(loadingStart());
    Auth.resendSignUp(attemptedLoginEmail)
      .then(() => {
        dispatch(setMessage("Verification link sent. Please check your email or spam folder for the verification link."));
        dispatch(onAuthError(""));
      }).catch(e => dispatch(onAuthError("Error sending confirmation email link: " + e)))
      .then(() => dispatch(loadingEnd()));
  }
}

export function changePassword(data) {
  return (dispatch, getState) => {
    const user = (getState().auth as IAuthState).user;
    if (!user) {
      dispatch(onAuthError("No user for whom to change password."));
      return;
    }
    if (data.password !== data.password2) {
      dispatch(onAuthError("Passwords do not match."));
      return;
    }

    dispatch(loadingStart());

    Auth.completeNewPassword(user, data.password, {})
      .then(() => dispatch(checkLoginStatus()))
      .catch(e => dispatch(onAuthError(e.message)))
      .then(() => dispatch(loadingEnd()))
  }
}
