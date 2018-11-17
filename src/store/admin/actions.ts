import { API } from "aws-amplify";
import { loadingStart, loadingEnd } from "../base/actions";
import { IReactTableState } from "src/Admin/types";

export const setApplicationList = (applicationList, pages) => ({
  type: "SET_APPLICATION_LIST",
  applicationList,
  pages
});

export const setSelectedForm = (selectedForm) => ({
  type: "SET_SELECTED_FORM",
  selectedForm
});

export const setApplicationStats = (applicationStats) => ({
  type: "SET_APPLICATION_STATS",
  applicationStats
});

export const getApplicationList = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  let sorted = {};
  for (let item of tableState.sorted) {
    sorted[item.id] = item.desc ? 1 : 0;
  }
  let filtered = {};
  for (let item of tableState.filtered) {
    filtered[item.id] = item.value;
  }
  return API.get("treehacks", `/users`, {"queryStringParameters": {
    filtered: JSON.stringify(filtered),
    page: tableState.page,
    pageSize: tableState.pageSize,
    sorted: JSON.stringify(sorted)
  }}).then((e: {count: number, results: any[]}) => {
    dispatch(setApplicationList(e.results, Math.ceil(e.count / tableState.pageSize)));
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