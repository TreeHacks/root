import React from "react";
import { connect } from "react-redux";
import { IAdminTableProps } from "./types";
import { getHackList, getExportedHacks, getExportedApplicationsCSV, getExportedHacksCSV } from "../store/admin/actions";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { IAdminState } from "../store/admin/types";
import ApplicationView from "./ApplicationView";
import { IBaseState } from "src/store/base/types";

const HackTable = (props: IAdminTableProps) => {
    const columns = [
        {
            "Header": "ID / Table",
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
        }
    ];
    const columnsToExport = columns.filter(e => e.accessor !== "devpostUrl");
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
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplications(state)}>Export</button> (Export all pages of filtered results as JSON)</p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state, columnsToExport)}>Export</button> (Export all pages of filtered results as CSV)</p>
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
    getExportedApplications: e => dispatch(getExportedHacks(e)),
    getExportedApplicationsCSV: (e, b) => dispatch(getExportedHacksCSV(e, b))
});

export default connect(mapStateToProps, mapDispatchToProps)(HackTable);