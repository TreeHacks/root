import { API } from "aws-amplify";
import { IAuthState } from "../auth/types";
import { IFormState } from "./types";
import { loadingStart, loadingEnd } from "../base/actions";

export const setUserProfile = (profile) => ({
  type: "SET_USER_PROFILE",
  profile
});

export const setPage = (page: number) => ({
  type: "SET_PAGE",
  page
});

export const setData = (formData: any, userEdited?: boolean) => ({
  type: "SET_DATA",
  formData,
  userEdited: userEdited || false
});

export const setUserEdited = (userEdited: boolean) => ({
  type: "SET_USER_EDITED",
  userEdited
});

export const setFormName = (formName: string) => ({
  type: "SET_NAME",
  formName
});

export const getUserProfile = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  return API.get("treehacks", `/users/${userId}`, {}).then(e => {
    dispatch(setUserProfile(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting user data " + e);
  });
};

export const saveData = () => (dispatch, getState) => {
  const formData = (getState().form as IFormState).formData;
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.put("treehacks", `/users/${userId}/forms/${formName}`, { "body": formData }).then(e => {
    dispatch(setData(e, false));
    dispatch(loadingEnd());
    dispatch(setUserEdited(false));
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error saving data " + e);
  });
}

export const submitForm = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.post("treehacks", `/users/${userId}/forms/${formName}/submit`, {}).then(e => {
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error submitting form " + e);
  });
}

export const loadData = (userId = null) => (dispatch, getState) => {
  userId = userId || (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.get("treehacks", `/users/${userId}/forms/${formName}`, {}).then(e => {
    dispatch(loadingEnd());
    dispatch(setData(e));
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting data " + e);
  });
}