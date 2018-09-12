import { API } from "aws-amplify";
import { IAuthState } from "../auth/types";
import { IFormState } from "./types";

export const setUserProfile = (profile) => ({
  type: "SET_USER_PROFILE",
  profile
});

export const setPage = (page: number) => ({
  type: "SET_PAGE",
  page
});

export const setData = (formData: any) => ({
  type: "SET_DATA",
  formData
});

export const setFormName = (formName: string) => ({
  type: "SET_NAME",
  formName
});

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

export const saveData = () => (dispatch, getState) => {
  const data = (getState() as IFormState).formData;
  alert("Save data" + data);
}

export const loadData = () => (dispatch, getState) => {
  const data = (getState() as IFormState).formData;
  // alert("Save data" + data);
  dispatch(setData({"first_name": "Ashwin"}));
}
