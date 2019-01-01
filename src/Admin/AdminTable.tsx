import React from "react";
import { connect } from "react-redux";
import { IAdminTableProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationList, setApplicationStatus, setSelectedForm, getApplicationEmails, getExportedApplications } from "../store/admin/actions";
import ReactTable from "react-table";
import { get, values } from "lodash-es";
import 'react-table/react-table.css';
import { STATUS, TYPE, TRANSPORTATION_STATUS, TRANSPORTATION_TYPES, TRANSPORTATION_BUS_ROUTES, LOCATIONS } from "../constants";
import { IAdminState } from "../store/admin/types";
import ApplicationView from "./ApplicationView";
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

const AdminTable = (props: IAdminTableProps) => {
    const columns = [
        {
            "Header": "Preview",
            "accessor": "_id",
            "id": "preview",
            "filterable": false,
            "Cell": (p) => <div><a onClick={(e) => {
                e.preventDefault(); props.setSelectedForm && props.setSelectedForm({ "id": p.value, "name": "application_info" })
            }} href="#">View</a> | <a onClick={(e) => {
                e.preventDefault(); props.setSelectedForm && props.setSelectedForm({ "id": p.value, "name": "travel" })
            }} href="#">Travel</a></div>
        },
        {
            "Header": "ID",
            "accessor": "_id"
        },
        {
            "Header": "Email",
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
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(LOCATIONS)),
            "accessor": "location"
        },
        {
            "Header": "Status",
            "accessor": "status",
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(STATUS)),
            "Cell": (props) => <div>{props.value}</div>
        },
        {
            "Header": "Transportation Status",
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(TRANSPORTATION_STATUS)),
            "accessor": "transportation_status"
        },
        {
            "Header": "Acceptance Deadline",
            "accessor": "admin_info.acceptance.deadline"
        },
        {
            "Header": "Transportation Deadline",
            "accessor": "admin_info.transportation.deadline"
        },
        {
            "Header": "Transportation Type",
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(TRANSPORTATION_TYPES)),
            "accessor": "admin_info.transportation.type"
        },
        {
            "Header": "Bus ID",
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect(values(TRANSPORTATION_BUS_ROUTES)),
            "accessor": "admin_info.transportation.id"
        },
        {
            "Header": "Number of Reviews",
            "id": "reviews",
            "accessor": e => e.reviews.length,
            "filterMethod": defaultFilterMethod,
            "Filter": createFilterSelect([0, 1, 2, 3])
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
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplications(state)}>Export</button> (Export all pages of filtered results as JSON)</p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getApplicationEmails(state)}>Get emails</button> (Get emails of all pages of filtered results)</p>
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
    getApplicationEmails: e => dispatch(getApplicationEmails(e)),
    getExportedApplications: e => dispatch(getExportedApplications(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminTable);