import React from "react";
import {connect} from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import "./Dashboard.scss";

export const Dashboard = (props: IDashboardProps) => (
    <div className="dashboard">
        <h1 className="dashboard-design">Dashboard</h1>
        <div className="dashboard-design">My Dashboard!!!</div>
        <div className="dashboard-design">My status: <strong>{props.profile.status}</strong></div>
    </div>
);

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getUserProfile: () => dispatch(getUserProfile())
});

class DashboardWrapper extends React.Component<IDashboardWrapperProps, {}> {
    componentDidMount() {
        this.props.getUserProfile();
    }
    render() {
        if (!this.props.profile) {
            return <Loading />;
        }
        return <Dashboard profile={this.props.profile} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper);