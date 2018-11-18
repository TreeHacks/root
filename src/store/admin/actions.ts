import { API } from "aws-amplify";
import { loadingStart, loadingEnd } from "../base/actions";
import { IReactTableState } from "src/Admin/types";
import { get } from "lodash-es";
import saveAs from 'file-saver';

export const setApplicationList = (applicationList, pages) => ({
  type: "SET_APPLICATION_LIST",
  applicationList,
  pages
});

export const setApplicationEmails = (applicationEmails) => ({
  type: "SET_APPLICATION_EMAILS",
  applicationEmails
});

export const setExportedApplications = (exportedApplications) => ({
  type: "SET_EXPORTED_APPLICATIONS",
  exportedApplications
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
  dispatch(setApplicationEmails(null));
  dispatch(setExportedApplications(null));
  return dispatch(fetchApplications(tableState)).then((e: { count: number, results: any[] }) => {
    dispatch(setApplicationList(e.results, Math.ceil(e.count / tableState.pageSize)));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting application list " + e);
  });
};

export const getApplicationEmails = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchApplications(tableState, { "user.email": 1 }, true)).then((e: { count: number, results: any[] }) => {
    let emails = e.results.map(e => get(e, "user.email"));
    dispatch(setApplicationEmails(emails));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting application emails " + e);
  });
};

export const getExportedApplications = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchApplications(tableState, {"forms.application_info.resume": 0}, true)).then((e: { count: number, results: any[] }) => {
    saveAs(new Blob([JSON.stringify(e.results)]), "data.json");
    dispatch(setExportedApplications(e.results));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting exported applications " + e);
  });
};

const fetchApplications = (tableState: IReactTableState, project = {"forms.application_info.resume": 0}, retrieveAllPages = false) => (dispatch, getState) => {
  let sort = {};
  for (let item of tableState.sorted) {
    sort[item.id] = item.desc ? 1 : 0;
  }
  let filter = {};
  for (let item of tableState.filtered) {
    filter[item.id] = item.value;
  }
  let params: any = {
    filter: JSON.stringify(filter),
    sort: JSON.stringify(sort),
    project: JSON.stringify(project)
  };
  if (!retrieveAllPages) {
    params.page = tableState.page,
      params.pageSize = tableState.pageSize
  }
  return API.get("treehacks", `/users`, { "queryStringParameters": params });
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