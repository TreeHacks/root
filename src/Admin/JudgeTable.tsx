import React from "react";
import { connect } from "react-redux";
import { IAdminTableProps } from "./types";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { IAdminState } from "../store/admin/types";
import ApplicationView from "./ApplicationView";
import { IBaseState } from "../store/base/types";
import { getJudgeList } from "../store/admin/actions";

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
            "Header": "Categories",
            "id": "categories",
            "accessor": e => e.categories && e.categories.join(", ")
        }
    ];
    return (
        <div>
            <div className="col-12">
                <h3>Judges</h3>
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
    getApplicationList: (e) => dispatch(getJudgeList(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(JudgeTable);