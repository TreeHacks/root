import React from "react";
import { connect } from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import { DEADLINES, STATUS } from '../constants';
import "./Dashboard.scss";
import AdmittedScreen from "./AdmittedScreen";
import AdmissionExpiredScreen from "./AdmissionExpiredScreen";
import AdmissionDeclinedScreen from "./AdmissionDeclinedScreen";
import { get } from "lodash";
import WaitlistedScreen from "./WaitlistedScreen";
import RejectedScreen from "./RejectedScreen";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

export const Dashboard = (props: IDashboardProps) => {
    const deadline = DEADLINES.find(d => d.key === (props.profile.type || 'oos'));
    const deadlineDate = moment(deadline.date);
    const dateNow = moment();
    // const diffDays = deadlineDate.diff(dateNow, "days");
    const diffDays = Math.round(Math.abs((deadlineDate.valueOf() - dateNow.valueOf()) / (24 * 60 * 60 * 1000)));
    const displayDeadline = deadline.display_date || deadlineDate.toLocaleString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    const acceptanceConfirmDeadline = get(props.profile, "admin_info.acceptance.deadline");
    const acceptanceConfirmDeadlineObject = moment(acceptanceConfirmDeadline);
    return (
        <div className="dashboard" style={{ "backgroundImage": `url('${require('../art/combined_circuit.svg')}')` }}>
            <div className="treehacks-dashboard-message-container">
                {props.profile.status === STATUS.ADMISSION_CONFIRMED ?
                    <div className="dashboard-design notice">
                        Time to hack! Looking to <Link to="/rooms">reserve a room</Link> for your team?
                    </div>
                : null}
                <div className="dashboard-design">
                    {
                        props.profile.status === STATUS.REJECTED ? <RejectedScreen /> :
                        props.profile.status === STATUS.WAITLISTED ? <WaitlistedScreen /> :
                        props.profile.status === STATUS.ADMISSION_CONFIRMED ? <AdmittedScreen confirmedYet={true} /> :
                        props.profile.status === STATUS.ADMISSION_DECLINED ? <AdmissionDeclinedScreen /> :
                        props.profile.status === STATUS.ADMITTED && dateNow > acceptanceConfirmDeadlineObject ? <AdmissionExpiredScreen /> :
                        props.profile.status === STATUS.ADMITTED ? <AdmittedScreen confirmedYet={false} deadline={acceptanceConfirmDeadline} /> :
                        props.profile.status === STATUS.SUBMITTED ? (
                                <span>
                                    Your application has been received &ndash; you are all good for now!<br /><br />We will email you when decisions are released and will handle any travel questions at that time. Thanks for applying :)
                                </span>
                            ) : dateNow > deadlineDate ? (
                                <span>Sorry, the application window has closed.</span>
                            ) : (
                                        <div>
                                            <div>
                                                You haven't submitted your application yet. You have
                                            </div>
                                            <div style={{ color: "#00E073", fontSize: '70px', marginBottom: -15 }}>
                                                {diffDays}
                                            </div>
                                            <div>
                                                days to submit your application before the deadline:<br /><strong>{displayDeadline}</strong>.
                                </div>
                                        </div>
                                    )
                    }
                </div>
            </div>
        </div>
    );
}

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
