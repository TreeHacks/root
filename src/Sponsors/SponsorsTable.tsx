import React from "react";
import { connect } from "react-redux";
import { ISponsorsTableProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationList, setApplicationStatus, setSelectedForm, getApplicationEmails, getExportedApplications, getApplicationResumes } from "../store/admin/actions";
import ReactTable from "react-table";
import { get, values } from "lodash-es";
import 'react-table/react-table.css';
import { STATUS, TYPE } from "../constants";
import { IAdminState } from "../store/admin/types";
import ApplicationView from "../Admin/ApplicationView";
import { IBaseState } from "src/store/base/types";

const defaultFilterMethod = (filter, row) => {
    if (filter.value == "all") {
        return true;
    }
    return row[filter.id] == filter.value;
};

const createFilterSelect = (values) => ({ filter, onChange }) =>
    <select
        className="form-control"
        value={filter ? filter.value : "all"}
        onChange={event => onChange(event.target.value)}
    >
        {values.map(e =>
            <option key={e}>{e}</option>
        )}
        <option>all</option>
    </select>;

const SponsorsTable = (props: ISponsorsTableProps) => {
    const columns = [
        {
            "Header": "Preview",
            "accessor": "_id",
            "id": "view",
            "Cell": (p) => <div onClick={(e) => {
                e.preventDefault(); props.setSelectedForm && props.setSelectedForm({ "id": p.value, "name": "application_info" })
            }}><a href="#">View</a></div>
        },
        {
            "Header": "ID",
            "accessor": "_id"
        },
        {
            "Header": "email",
            "accessor": "user.email"
        },
        {
            "Header": "type",
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(TYPE)),
            "accessor": "type"
        },
        {
            "Header": "Location",
            "accessor": "location"
        },
        {
            "Header": "University",
            "accessor": "forms.application_info.university"
        }
    ];
    return (
        <div>
            <div className="col-12">
                <h3>Applications</h3>
                <ReactTable filterable columns={columns} data={props.applicationList} minRows={0}
                    pages={props.pages}
                    manual
                    // loading={props.base.loading}
                    // defaultPageSize={1}
                    onFetchData={(state, instance) => props.getApplicationList && props.getApplicationList(state)}
                >
                    {(state, makeTable, instance) => {
                        return (
                            <div>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state)}>Export</button> (Export all pages of filtered results as CSV)</p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getApplicationResumes(state)}>Get resumes</button> (Get resumes of all pages of filtered results)</p>
                                {props.applicationEmails && <div>
                                    <textarea
                                        readOnly
                                        className="form-control"
                                        style={{ width: "100%" }}
                                    >
                                        {props.applicationEmails.join(", ")}
                                    </textarea></div>}
                                {makeTable()}
                            </div>
                        );
                    }}
                </ReactTable>
            </div>
            {props.selectedForm && <ApplicationView />}
        </div>
    );
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState),
    base: state.base as IBaseState
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getApplicationList: (e) => dispatch(getApplicationList(e)),
    setApplicationStatus: (a, b) => dispatch(setApplicationStatus(a, b)),
    setSelectedForm: e => dispatch(setSelectedForm(e)),
    getApplicationResumes: e => dispatch(getApplicationResumes(e)),
    getExportedApplications: e => dispatch(getExportedApplications(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(SponsorsTable);