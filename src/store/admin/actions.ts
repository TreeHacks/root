import { API } from "aws-amplify";
import { loadingStart, loadingEnd } from "../base/actions";
import { IReactTableState, IReactTableHeader } from "src/Admin/types";
import { get } from "lodash-es";
import saveAs from 'file-saver';
import { IAdminState } from "./types";
import Papa from "papaparse";
import { STATUS } from "../../constants";
import {pick} from "lodash-es";

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

export const getApplicationResumes = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchApplications(tableState, { "forms.application_info.resume": 1 }, true)).then((e: { count: number, results: any[] }) => {
    let emails = e.results.map(e => get(e, "forms.application_info.resume"));
    // dispatch(setApplicationEmails(emails));
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

/*
 * Get exported applications as CSV.
 */
export const getExportedApplicationsCSV = (tableState: IReactTableState, columns: IReactTableHeader[]) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchApplications(tableState, {"forms.application_info.resume": 0}, true)).then((e: { count: number, results: any[] }) => {
    let results = e.results.map(item => {
      let newItem = {};
      for (let column of columns) {
        let value = "";
        if (typeof column.accessor === "function") {
          value = column.accessor(item);
        }
        else {
          value = get(item, column.accessor);
        }
        newItem[column.Header] = value;
      }
      return newItem;
    }
    );
    saveAs(new Blob([Papa.unparse(results)]), "data.csv");
    dispatch(setExportedApplications(results));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting exported applications " + e);
  });
};

const fetchApplications = (tableState: IReactTableState, project=null, retrieveAllPages = false) => (dispatch, getState) => {
  if (project === null) {
    project = {"forms.application_info.resume": 0};
  }
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


export const setBulkChangeStatus = (status) => ({
  type: "SET_BULK_CHANGE_STATUS",
  status
});

export const setBulkChangeIds = (ids) => ({
  type: "SET_BULK_CHANGE_IDS",
  ids
});


const headersAdmitted = ["id", "acceptanceDeadline", "transportationType", "transportationDeadline", "transportationAmount", "transportationId"];
const headers = ["id"];
export const performBulkChange = () => (dispatch, getState) => {
  const {ids, status} = (getState().admin as IAdminState).bulkChange;
  let csvData = null;
  const opts = {header: true, skipEmptyLines: true};
  if (status === STATUS.ADMITTED) {
    csvData = Papa.parse(headersAdmitted.join(",") + "\n" + ids, opts).data;
  }
  else {
    csvData = Papa.parse(headers.join(",") + "\n" + ids, opts).data;
  }
  for (let item of csvData) {
    if (item.__parsed_extra) {
      alert("Error: Too many fields are in a line. Please reformat the data.");
      return;
    }
  }
  dispatch(loadingStart());
  return API.post("treehacks", `/users_bulkchange`, {
    body: {
      ids: csvData,
      status: status
    }
  }).then(e => {
    dispatch(setBulkChangeIds(""));
    dispatch(setBulkChangeStatus(""));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error performing bulk change: " + e);
  });
}

export const setBulkCreateGroup = (group) => ({
  type: "SET_BULK_CREATE_GROUP",
  group
});

export const setBulkCreateEmails = (emails) => ({
  type: "SET_BULK_CREATE_EMAILS",
  emails
});

export const performBulkCreate = () => (dispatch, getState) => {
  const {group, emails} = (getState().admin as IAdminState).bulkCreate;
  dispatch(loadingStart());
  return API.post("treehacks", `/users_bulkcreate`, {
    body: {
      emails: emails.split('\n').map(e => e.trim()),
      group
    }
  }).then(e => {
    saveAs(new Blob([Papa.unparse(e.users)]), `bulk-creation-${Date.now()}.csv`);
    dispatch(setBulkCreateGroup(""));
    dispatch(setBulkCreateEmails(""));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error performing bulk creation: " + e);
  });
}

export const setApplicationStatus = (status, userId) => (dispatch, getState) => {
  // todo
}