import { IUserAttributes } from "./types";
import { loadingStart, loadingEnd } from "../base/actions";
import { get } from "lodash";
import Cookies from "js-cookie";

declare const LOGIN_URL: string;

function getJwt() {
  return Cookies.get("jwt");
}

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

export function logout() {
  return dispatch => {
    window.location.href = `${LOGIN_URL}/logout?redirect=${window.location.href}`;
  }
}

export function parseJwt(token) {
  var base64UrlSplit = token.split('.');
  if (!base64UrlSplit) return null;
  const base64Url = base64UrlSplit[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const getCurrentUser = () => async (dispatch) => {
  const jwt = getJwt();
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
    if (!parsed) {
      console.log("JWT invalid");
    }
    else if (new Date().getTime() / 1000 >= parseInt(parsed.exp)) {
      console.log("JWT expired");
      // TODO: add refresh token logic if we want here.
    }
    else {
      let attributes: IUserAttributes = { "name": parsed["name"], "email": parsed["email"], "email_verified": parsed["email_verified"], "cognito:groups": parsed["cognito:groups"] };
      return await {
        "username": parsed["sub"],
        attributes
      };
    }
  }

  // If JWT from SAML has expired, or if there is no JWT in the first place, run this code.
  throw "No current user";
}

export function checkLoginStatus() {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    return dispatch(getCurrentUser())
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
        const applicant = !sponsor && !judge;
        dispatch(loggedIn(user.username, user.attributes, admin, reviewer, sponsor, judge, applicant));
      }).catch(e => {
        window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
        console.error(e);
      }).then(() => dispatch(loadingEnd()));
  }
}