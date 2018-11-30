import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps, IBulkChangeProps } from "./types";
import { performBulkChange, setBulkChangeIds, setBulkChangeStatus } from "../store/admin/actions";
import { IAdminState } from "../store/admin/types";
import { STATUS, TRANSPORTATION_BUS_ROUTES } from "../constants";
import { IAuthState } from "src/store/auth/types";

const BulkChange = (props: IBulkChangeProps) => {
    return <div>
        <div className="row">
            <div className="form-group col-12 col-sm-6">
                <form onSubmit={e => { e.preventDefault(); props.performBulkChange() }} >
                    <textarea required className="form-control" placeholder="Enter CSV value"
                        value={props.bulkChange.ids}
                        onChange={e => props.setBulkChangeIds(e.target.value)}>
                    </textarea>
                    <select required className="form-control" value={props.bulkChange.status} onChange={e => props.setBulkChangeStatus(e.target.value)}>
                        <option disabled value="">Change status to...</option>
                        {Object.keys(STATUS).map(statusName => <option key={statusName} value={STATUS[statusName]}>{statusName}</option>)};
                    </select>
                    <input className="form-control" type="submit" />
                </form>
            </div>
            <div className="col-12 col-sm-6"><small>
                <div>Note: this won't send an email automatically. If you are accepting a batch of users, make sure you send the emails yourself using MailChimp.</div>
                <hr />
                <div>
                    Note: For admitted status, enter in the following format:
                        <pre>
                        "id", "acceptanceDeadline", "transportationType", "transportationDeadline", "transportationAmount", "transportationId"{"\n"}
                        {props.userId}, 2048-11-28T04:39:47.512Z, flight, 2048-11-28T04:39:47.512Z, 500,{"\n"}
                        {props.userId}, 2048-11-28T04:39:47.512Z, bus, 2048-11-28T04:39:47.512Z, 0, {TRANSPORTATION_BUS_ROUTES.TEST}{"\n"}
                        {props.userId}, 2048-11-28T04:39:47.512Z, other, 2048-11-28T04:39:47.512Z, 300,{"\n"}
                        {props.userId}, 2048-11-28T04:39:47.512Z, , , ,{"\n"}
                        ...{"\n"}
                    </pre>
                </div>
                <hr />
                <div>
                    Note: For all other statuses, please enter application IDs, separated by newlines. 
                        <pre>
                        ["id"]{"\n"}
                        {props.userId}{"\n"}
                        {props.userId}{"\n"}
                        ...{"\n"}
                    </pre>
                </div>
            </small></div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState),
    userId: (state.auth as IAuthState).userId
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    performBulkChange: () => dispatch(performBulkChange()),
    setBulkChangeIds: e => dispatch(setBulkChangeIds(e)),
    setBulkChangeStatus: e => dispatch(setBulkChangeStatus(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkChange);