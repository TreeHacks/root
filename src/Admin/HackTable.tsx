import React from "react";
import { connect } from "react-redux";
import { IAdminTableProps } from "./types";
import { getHackList, getExportedHacks, getExportedApplicationsCSV, getExportedHacksCSV, editRow } from "../store/admin/actions";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { IAdminState } from "../store/admin/types";
import ApplicationView from "./ApplicationView";
import Form from "react-jsonschema-form";
import { IBaseState } from "src/store/base/types";

const HackTable = (props: IAdminTableProps) => {
    const columns = [
        {
            "Header": "Floor",
            "accessor": "floor",
        },
        {
            "Header": "Table",
            "accessor": "_id",
        },
        {
            "Header": "Title",
            "accessor": "title"
        },
        {
            "Header": "Devpost URL",
            "accessor": "devpostUrl",
            "Cell": p => p.value && <div><a target="_blank" href={p.value}>Link</a></div>
        },
        {
            "Header": "Categories",
            "accessor": "categories"
        },
        {
            "Header": "Disabled",
            "accessor": "disabled",
            "Cell": p => <div>
                <Form schema={{
                    "type": "boolean"
                }} uiSchema={{
                    "ui:widget": "checkbox",
                    "ui:options": {
                        "inline": true
                    }
                }} formData={p.value}
                onChange={e => e.formData !== undefined && props.editRow("hacks", p.row._id, {"disabled": e.formData})}
                ><div></div></Form></div>
        },
        {
            "Header": "Reviews",
            "id": "numReviews",
            "accessor": e => (e.reviews || []).length
        },
        {
            "Header": "Skips",
            "accessor": "numSkips"
        },
    ];
    const columnsToExport = columns.filter(e => ~["floor", "_id", "title", "categories", "devpostUrl"].indexOf(String(e.accessor))  );
    return (
        <div>
            <div className="col-12">
                <ReactTable filterable columns={columns} data={props.applicationList} minRows={0}
                    pages={props.pages}
                    manual
                    // loading={props.base.loading}
                    // defaultPageSize={1}
                    onFetchData={(state, instance) => props.getApplicationList && props.getApplicationList(state)}
                >
                    {(state, makeTable, instance) => {
                        return (
                            <React.Fragment>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplications(state)}>Export all + reviews as JSON (for final judging scripts)</button></p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplications(state, columnsToExport)}>Export public data as JSON (for hacks.treehacks.com)</button></p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state, columnsToExport, true)}>Export as CSV, unwound (for MLH Google Sheets backup plan)</button></p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state, columnsToExport)}>Export public data as CSV (not in use for now)</button></p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state, columnsToExport)}>Export all + reviews as CSV (for emergency backup)</button></p>
                                {makeTable()}
                            </React.Fragment>
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
    getApplicationList: (e) => dispatch(getHackList(e)),
    getExportedApplications: (e, b) => dispatch(getExportedHacks(e, b)),
    getExportedApplicationsCSV: (e, b, c) => dispatch(getExportedHacksCSV(e, b, c)),
    editRow: (a, b, c) => dispatch(editRow(a, b, c))
});

export default connect(mapStateToProps, mapDispatchToProps)(HackTable);