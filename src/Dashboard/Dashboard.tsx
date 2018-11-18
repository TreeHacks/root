import React from "react";
import { connect } from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import "./Dashboard.scss";

function getDeadline(type) {
    switch (type) {
        case "is":
            return new Date("2018-11-27T07:59:00.000Z");
        case "stanford":
            return new Date("2019-02-14T07:59:00.000Z");
        case "oos":
        default:
            return new Date("2018-11-20T07:59:00.000Z");
    }
  }

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
    let date = getDeadline(props.profile.type);
    const dateNow = new Date();
    const diffDays = Math.round(Math.abs((date.getTime() - dateNow.getTime()) / (24 * 60 * 60 * 1000)));
    const deadline = formatDate(date);
    return (
        <div className="dashboard" style={{ "backgroundImage": `url('${require('../art/combined_circuit.svg')}')` }}>
            <div style={{ position: 'absolute', top: "50%", left: "50%", transform: "translateX(-50%) translateY(-50%)" }}>
                <div className="dashboard-design">
                    {
                        props.profile.status === "submitted" ? (
                            <span>
                                Your application has been received &ndash; you are all good for now!<br /><br />We will email you when decisions are released and will handle any travel questions at that time. Thanks for applying :)</span>
                        ) : (
                                <div>
                                    <div>
                                        You haven't submitted your application yet. You have
                            </div>
                                    <div style={{ color: "#00E073", fontSize: '70px', marginBottom: -15 }}>
                                        {diffDays}
                                    </div>
                                    <div>
                                        days to submit your application before the deadline:<br /><strong>{deadline}</strong>.
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
