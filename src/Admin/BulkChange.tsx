import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps, IBulkChangeProps } from "./types";
import { performBulkChange, setBulkChangeIds, setBulkChangeStatus } from "../store/admin/actions";
import { IAdminState } from "../store/admin/types";
import { STATUS } from "../constants";

const BulkChange = (props: IBulkChangeProps) => {
    return <div>
        <div className="row">
            <div className="form-group col-12 col-sm-6">
                <form onSubmit={e => {e.preventDefault(); props.performBulkChange()}} >
                    <textarea className="form-control" placeholder="Enter application IDs, separated by newlines."
                        value={props.bulkChange.ids}
                        onChange={e => props.setBulkChangeIds(e.target.value)}>
                    </textarea>
                    <small>Note: this won't send an email automatically. If you are accepting a batch of users, make sure you send the emails yourself using MailChimp.</small>
                    <select className="form-control" value={props.bulkChange.status} onChange={e => props.setBulkChangeStatus(e.target.value)}>
                        <option disabled value="">Change status to...</option>
                        {Object.keys(STATUS).map(statusName => <option key={statusName} value={STATUS[statusName]}>{statusName}</option>)};
                    </select>
                    <input className="form-control" type="submit" />
                </form>
            </div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    performBulkChange: () => dispatch(performBulkChange()),
    setBulkChangeIds: e => dispatch(setBulkChangeIds(e)),
    setBulkChangeStatus: e => dispatch(setBulkChangeStatus(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkChange);