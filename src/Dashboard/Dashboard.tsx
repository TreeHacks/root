import React from "react";
import { connect } from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import { DEADLINES } from '../constants';
import "./Dashboard.scss";

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}


export const Dashboard = (props: IDashboardProps) => {
    const deadline = DEADLINES.find(d => d.key === (props.profile.type || 'oos'));
    const deadlineDate = new Date(deadline.date);
    const dateNow = new Date();
    const diffDays = Math.round(Math.abs((deadlineDate.getTime() - dateNow.getTime()) / (24 * 60 * 60 * 1000)));
    const displayDeadline = deadline.display_date || deadlineDate.toLocaleString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    return (
        <div className="dashboard" style={{ "backgroundImage": `url('${require('../art/combined_circuit.svg')}')` }}>
            <div style={{ position: 'absolute', top: "50%", left: "50%", transform: "translateX(-50%) translateY(-50%)" }}>
                <div className="dashboard-design">
                    {
                        props.profile.status === "submitted" ? (
                            <span>
                                Your application has been received &ndash; you are all good for now!<br /><br />We will email you when decisions are released and will handle any travel questions at that time. Thanks for applying :)</span>
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
