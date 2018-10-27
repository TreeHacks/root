import { API } from "aws-amplify";
import { loadingStart, loadingEnd } from "../base/actions";

export const setApplicationList = (applicationList) => ({
  type: "SET_APPLICATION_LIST",
  applicationList
});

// export const setApplicationStatus = (status, userId) => ({
//   type: "SET_APPLICATION_STATUS",
//   status,
//   userId
// });

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

export const setApplicationStatus = (status, userId) => (dispatch, getState) => {
  // todo
}