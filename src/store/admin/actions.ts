import { API } from "aws-amplify";
import { loadingStart, loadingEnd } from "../base/actions";

export const setApplicationList = (applicationList) => ({
  type: "SET_APPLICATION_LIST",
  applicationList
});

export const setSelectedForm = (selectedForm) => ({
  type: "SET_SELECTED_FORM",
  selectedForm
});

export const setApplicationStats = (applicationStats) => ({
  type: "SET_APPLICATION_STATS",
  applicationStats
});

export const getApplicationList = () => (dispatch, getState) => {
  dispatch(loadingStart());
  return API.get("treehacks", `/users`, {}).then(e => {
    dispatch(setApplicationList(e));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting application list " + e);
  });
};

export const getApplicationStats = () => (dispatch, getState) => {
  dispatch(loadingStart());
  return API.get("treehacks", `/users_stats`, {}).then(e => {
    dispatch(setApplicationStats(e));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting application stats " + e);
  });
};

export const setApplicationStatus = (status, userId) => (dispatch, getState) => {
  // todo
}