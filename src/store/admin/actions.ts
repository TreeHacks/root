import API from "@aws-amplify/api";
import { loadingStart, loadingEnd } from "../base/actions";
import { IReactTableState, IReactTableHeader } from "src/Admin/types";
import { get } from "lodash";
import saveAs from 'file-saver';
import { IAdminState } from "./types";
import Papa from "papaparse";
import { STATUS, FLOORS } from "../../constants";
import { custom_header } from "../../index";
import { find, set } from "lodash";
import unwind from "javascript-unwind";

declare const ENDPOINT_URL: string;

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

export const getApplicationResumes = (tableState: IReactTableState) => async (dispatch, getState) => {
  dispatch(loadingStart());
  try {
    // const applicationIds = (getState().admin as IAdminState).applicationList.map(e => e._id);
    let applicationIds = (await dispatch(fetchApplications(tableState, { "_id": 1 }, true))).results.map(e => e._id);
    // Using fetch workaround; once Amplify library supports responseType, we can use the below code instead.
    // return API.post("treehacks", `/users_resumes`, {
    //   body: {
    //     ids: applicationIds
    //   },
    //   responseType: "blob"
    // })
    let headers = await custom_header();
    const options = {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ids: applicationIds })
    };
    let res = await fetch(ENDPOINT_URL + '/users_resumes', options)
    saveAs(await res.blob(), `treehacks-resumes-${Date.now()}.zip`);
    dispatch(loadingEnd());
  }
  catch (e) {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting application resumes " + e);
  }
};

export const getExportedApplications = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchApplications(tableState, {}, true)).then((e: { count: number, results: any[] }) => {
    saveAs(new Blob([JSON.stringify(e.results)]), `treehacks-applications-${Date.now()}.json`);
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
  return dispatch(fetchApplications(tableState, {}, true)).then((e: { count: number, results: any[] }) => {
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
    saveAs(new Blob([Papa.unparse(results)]), `treehacks-applications-${Date.now()}.csv`);
    dispatch(setExportedApplications(results));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting exported applications " + e);
  });
};

export const getExportedHacks = (tableState: IReactTableState, columns?: IReactTableHeader[]) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchHacks(tableState, {}, true)).then((e: { count: number, results: any[] }) => {
    let results = e.results;
    if (columns) {
      results = e.results.map(item => {
        let newItem = {};
        for (let column of columns) {
          let value = "";
          if (typeof column.accessor === "function") {
            value = column.accessor(item);
          }
          else {
            value = get(item, column.accessor);
          }
          newItem[column.accessor] = value;
        }
        return newItem;
      }
      );
    }
    saveAs(new Blob([JSON.stringify(results)]), `treehacks-hacks-${Date.now()}.json`);
    dispatch(setExportedApplications(results));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting exported hacks " + e);
  });
};

export const getExportedHacksCSV = (tableState: IReactTableState, columns: IReactTableHeader[], sheets?: boolean) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchHacks(tableState, {}, true)).then((e: { count: number, results: any[] }) => {
    let results = (sheets ? unwind(e.results, "categories"): e.results).map(item => {
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
    saveAs(new Blob([Papa.unparse(results)]), `treehacks-hacks-${Date.now()}.csv`);
    dispatch(setExportedApplications(results));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting exported hacks " + e);
  });
};

const fetchGenericData = endpoint => (tableState: IReactTableState, project = null, retrieveAllPages = false) => (dispatch, getState) => {
  if (project === null) {
    project = {};
  }
  let sort = {};
  for (let item of tableState.sorted) {
    sort[item.id] = item.desc ? -1 : 1;
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
  return API.get("treehacks", endpoint, { "queryStringParameters": params });
};

const fetchApplications = fetchGenericData(`/users`);

const fetchHacks = fetchGenericData(`/hacks`);

const fetchJudges = fetchGenericData(`/judges`);

export const getHackList = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchHacks(tableState)).then((e: { count: number, results: any[] }) => {
    dispatch(setApplicationList(e.results, Math.ceil(e.count / tableState.pageSize)));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting hack list " + e);
  });
};

export const getJudgeList = (tableState: IReactTableState) => (dispatch, getState) => {
  dispatch(loadingStart());
  return dispatch(fetchJudges(tableState)).then((e: { count: number, results: any[] }) => {
    dispatch(setApplicationList(e.results, Math.ceil(e.count / tableState.pageSize)));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error getting judge list " + e);
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


export const setBulkChangeStatus = (status) => ({
  type: "SET_BULK_CHANGE_STATUS",
  status
});

export const setBulkChangeIds = (ids) => ({
  type: "SET_BULK_CHANGE_IDS",
  ids
});

export const performBulkChange = () => (dispatch, getState) => {
  const headersAdmitted = ["id", "acceptanceDeadline", "transportationType", "transportationDeadline", "transportationAmount", "transportationId"];
  const headers = ["id"];
  const { ids, status } = (getState().admin as IAdminState).bulkChange;
  let csvData = null;
  const opts = { header: true, skipEmptyLines: true };
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

export const editRow = (endpoint, rowId, data) => (dispatch, getState) => {
  dispatch(loadingStart());
  return API.patch("treehacks", `/${endpoint}/${rowId}`, {
    body: data
  }).then(e => {
    const adminState = (getState().admin as IAdminState);
    const applicationList = adminState.applicationList;
    let application = find(applicationList, { "_id": rowId });
    for (let key in data) {
      set(application, key, data[key]);
    }
    dispatch(setApplicationList(applicationList, adminState.pages)); // So that the table refreshes
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error performing edit row " + e);
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

export const setBulkCreatePassword = (password) => ({
  type: "SET_BULK_CREATE_PASSWORD",
  password
});

export const performBulkCreate = () => (dispatch, getState) => {
  const { group, emails, password } = (getState().admin as IAdminState).bulkCreate;
  dispatch(loadingStart());
  return API.post("treehacks", `/users_bulkcreate`, {
    body: {
      emails: emails.split('\n').map(e => e.trim()),
      group,
      password
    }
  }).then(e => {
    saveAs(new Blob([Papa.unparse(e.users)]), `bulk-creation-${Date.now()}.csv`);
    dispatch(setBulkCreateGroup(""));
    dispatch(setBulkCreateEmails(""));
    dispatch(setBulkCreateGroup(""));
    dispatch(loadingEnd());
  }).catch(e => {
    console.error(e);
    dispatch(loadingEnd());
    alert("Error performing bulk creation: " + e);
  });
}

export const setBulkImportHacks = (bulkImportHacks) => ({
  type: "SET_BULK_IMPORT_HACKS",
  bulkImportHacks
});

export const setBulkImportHacksFloor = (bulkImportHacksFloor) => ({
  type: "SET_BULK_IMPORT_HACKS_FLOOR",
  bulkImportHacksFloor
});

export const performBulkImportHacks = () => (dispatch, getState) => {

  const headers = ["title", "devpostUrl", "description", "video", "website", "fileUrl", "categories"];
  const bulkImportHacks = (getState().admin as IAdminState).bulkImportHacks;
  const bulkImportHacksFloor = (getState().admin as IAdminState).bulkImportHacksFloor;
  const opts = { header: true, skipEmptyLines: true };
  const csvData = Papa.parse(headers.join(",") + "\n" + bulkImportHacks, opts).data.map(e => ({
    ...e,
    categories: (e.categories || "").split(", ")
  }));
  dispatch(loadingStart());
  return API.post("treehacks", `/hacks_import`, {
    body: {
      items: csvData,
      floor: bulkImportHacksFloor
    }
  }).then(e => {
    dispatch(setBulkImportHacks(""));
    dispatch(setBulkImportHacksFloor(FLOORS[0]));
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
