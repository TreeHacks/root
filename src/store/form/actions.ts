import { API } from "aws-amplify";
import { IAuthState } from "../auth/types";

export const setUserProfile = (profile) => ({
  type: "SET_USER_PROFILE",
  profile
});

export const setPage = (page: number) => ({
  type: "SET_PAGE",
  page
})

export const getUserProfile = () => (dispatch, getState) => {
  let userId = (getState().auth as IAuthState).userId;
  return API.get("treehacks", `/users/${userId}`, {}).then(e => {
    console.log(e);
    // dispatch(setUserProfile(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting user data " + e);
  });
};
