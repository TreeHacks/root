import React from "react";
import { connect } from "react-redux";
import { IAdminTableProps } from "./types";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { IAdminState } from "../store/admin/types";
import ApplicationView from "./ApplicationView";
import { IBaseState } from "../store/base/types";
import { getJudgeList, editRow } from "../store/admin/actions";
import Form from "react-jsonschema-form";
import { VERTICALS } from "../constants";
import "./AdminTable.scss";

const JudgeTable = (props: IAdminTableProps) => {
    const columns = [
        {
            "Header": "ID",
            "accessor": "_id"
        },
        {
            "Header": "Email",
            "accessor": "email"
        },
        {
            "Header": "Verticals",
            "accessor": "verticals",
            "Cell": p => <div>
                <Form schema={{
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": VERTICALS
                    },
                    "uniqueItems": true
                }} uiSchema={{
                    "ui:widget": "checkboxes",
                    "ui:options": {
                        "inline": true
                    },
                    "classNames": "treehacks-admin-table-form"
                }} formData={p.value}
                onChange={e => props.editRow("judges", p.row._id, {"verticals": e.formData})}
                ><div></div></Form>
            </div>
        },
        {
            "Header": "Floor",
            "accessor": "floor",
            "Cell": p => <div>
                <Form schema={{
                    "type": "string",
                    "enum": [1, 2]
                }} uiSchema={{
                }} formData={p.value}
                onChange={e => props.editRow("judges", p.row._id, {"floor": e.formData})}
                ><div></div></Form>
            </div>
        }
    ];
    return (
        <div>
            <div className="col-12">
                <ReactTable filterable columns={columns} data={props.applicationList} minRows={0}
                    pages={props.pages}
                    manual
                    // loading={props.base.loading}
                    // defaultPageSize={1}
                    onFetchData={(state, instance) => props.getApplicationList && props.getApplicationList(state)}
                />
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
    getApplicationList: (e) => dispatch(getJudgeList(e)),
    editRow: (a, b, c) => dispatch(editRow(a, b, c))
});

export default connect(mapStateToProps, mapDispatchToProps)(JudgeTable);