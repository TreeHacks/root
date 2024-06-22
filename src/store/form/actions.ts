import API from "@aws-amplify/api";
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
  dispatch(loadingStart());
  return API.get("treehacks", `/users/${userId}`, {}).then(e => {
    dispatch(setUserProfile(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting user data " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
};

export const saveData = () => (dispatch, getState) => {
  const formData = (getState().form as IFormState).formData;
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.put("treehacks", `/users/${userId}/forms/${formName}`, { "body": formData }).then(e => {
    dispatch(setData(e, false));
    dispatch(setUserEdited(false));
  }).catch(e => { // catches 401 and other errors
    console.error(e);
    alert("Error saving data " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
}

export const submitForm = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.post("treehacks", `/users/${userId}/forms/${formName}/submit`, {}).then(e => {
  }).catch(e => {
    console.error(e);
    alert("Error submitting form " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
}

export const loadData = (userId = null) => (dispatch, getState) => {
  userId = userId || (getState().auth as IAuthState).userId;
  const formName = (getState().form as IFormState).formName;
  dispatch(loadingStart());
  return API.get("treehacks", `/users/${userId}/forms/${formName}`, {}).then(e => {
    dispatch(setData(e));
  }).catch(e => {
    console.error(e);
    alert("Error getting data " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
}

export const confirmAdmission = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  dispatch(loadingStart());
  return API.post("treehacks", `/users/${userId}/status/confirm`, {}).then(e => {
    dispatch(getUserProfile());
  }).catch(e => {
    console.error(e);
    alert("Error " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
}

export const declineAdmission = () => (dispatch, getState) => {
  const userId = (getState().auth as IAuthState).userId;
  dispatch(loadingStart());
  return API.post("treehacks", `/users/${userId}/status/decline`, {}).then(e => {
    dispatch(getUserProfile());
  }).catch(e => {
    console.error(e);
    alert("Error " + e);
  }).finally(() => {
    dispatch(loadingEnd());
  });
}
