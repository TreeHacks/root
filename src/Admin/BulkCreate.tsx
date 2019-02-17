import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps, IBulkCreateProps } from "./types";
import { performBulkCreate, setBulkCreateEmails, setBulkCreateGroup, setBulkCreatePassword } from "../store/admin/actions";
import { IAdminState } from "../store/admin/types";
import { GROUPS } from "../constants";

const BulkCreate = (props: IBulkCreateProps) => {
    return <div>
        <div className="row">
            <div className="form-group col-12 col-sm-6">
                <form onSubmit={e => { e.preventDefault(); props.performBulkCreate() }} >
                    <textarea required className="form-control" placeholder="Enter email addresses, separated by newlines"
                        value={props.bulkCreate.emails}
                        onChange={e => props.setBulkCreateEmails(e.target.value)}>
                    </textarea>
                    <select required className="form-control" value={props.bulkCreate.group} onChange={e => props.setBulkCreateGroup(e.target.value)}>
                        <option disabled value="">Set group to...</option>
                        {Object.keys(GROUPS).map(statusName => <option key={statusName} value={statusName}>{GROUPS[statusName]}</option>)};
                    </select>
                    <input className="form-control" type="text" placeholder="Password (optional)"
                        value={props.bulkCreate.password}
                        onChange={e => props.setBulkCreatePassword(e.target.value)}
                    />
                    <input className="form-control" type="submit" />
                </form>
            </div>
            <div className="col-12 col-sm-6"><small>
                <div>Note: this won't send an email automatically. After submitting, you will receive a CSV containing email addresses and passwords for the newly created accounts.</div>
                <hr />
                <div>
                    Please enter email addresses, separated by newlines. 
                        <pre>
                        {"foo@bar.com"}{"\n"}
                        {"baz@wam.org"}{"\n"}
                        ...{"\n"}
                    </pre>
                </div>
            </small></div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    performBulkCreate: () => dispatch(performBulkCreate()),
    setBulkCreateEmails: e => dispatch(setBulkCreateEmails(e)),
    setBulkCreateGroup: e => dispatch(setBulkCreateGroup(e)),
    setBulkCreatePassword: e => dispatch(setBulkCreatePassword(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkCreate);
