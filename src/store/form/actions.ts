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
  const userId = (getState().auth as IAuthState).userId;
  return API.get("treehacks", `/users/${userId}`, {}).then(e => {
    console.log(e);
    // dispatch(setUserProfile(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting user data " + e);
  });
};

export const saveData = () => (dispatch, getState) => {
  const formData = (getState().form as IFormState).formData;
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  return API.put("treehacks", `/users/${userId}/forms/${formName}`, {"body": formData}).then(e => {
    console.log("Data saved", e);
    // dispatch(setData(e));
  }).catch(e => {
    console.error(e);
    alert("Error saving data " + e);
  });
}

export const loadData = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  return API.get("treehacks", `/users/${userId}/forms/${formName}`, {}).then(e => {
    dispatch(setData(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting data " + e);
  });
}
