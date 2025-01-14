import React from "react";
import "./Dashboard.scss";
import "../common/Aesthetics.scss";
import WaitlistedScreen from "./WaitlistedScreen";
import RejectedScreen from "./RejectedScreen";
import Loading from "../Loading/Loading";
import AdmittedScreen from "./AdmittedScreen";
import AdmittedStanford from "./AdmittedStanford";
import AdmissionExpiredScreen from "./AdmissionExpiredScreen";
import AdmissionDeclinedScreen from "./AdmissionDeclinedScreen";
import { AUTO_ADMIT_STANFORD } from "../../backend/constants";
import { DEADLINES, STATUS, TYPE } from "../constants";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IDashboardProps, IDashboardWrapperProps } from "./types";

export const Dashboard = (props: IDashboardProps) => {
  const deadline = DEADLINES.find(d => d.key === (props.profile.type || "oos"));
  var currentDate = Date.now();
  var deadlineDate = new Date(deadline.date);
  var deadlineDay = deadlineDate.getUTCDate() - 1; // Subtract 1 to account for UTC offset (+8 hours)
  var deadlineMonth = deadlineDate.getUTCMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var dayEndings = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
  if (Math.floor(deadlineDay / 10) == 1) {
    dayEndings = ["th", "th", "th", "th", "th", "th", "th", "th", "th", "th"];
  }
  var minuteDiff = (deadlineDate.getTime() - currentDate) / (1000 * 60);
  var daysLeft =  Math.round(minuteDiff / (60 * 24)); // Add 1 since it is inclusive
  var timeLeft = daysLeft;
  var unit = "days";
  if (minuteDiff <= 60 * 24 && minuteDiff > 0) {
    var hoursLeft = Math.round(minuteDiff / 60);
    timeLeft = hoursLeft;
    unit = "hours";
    if (hoursLeft <= 1) {
      var minutesLeft = Math.round(minuteDiff);
      timeLeft = minutesLeft;
      unit = "minutes";
      if (minutesLeft === 1) {
        unit = "minute";
      }
    }
  } else if (minuteDiff <= 0) {
    timeLeft = 0;
  }

  const displayDeadline =
    deadline.display_date ||
    deadlineDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });
  const acceptanceConfirmDeadline = get(
    props.profile,
    "admin_info.acceptance.deadline"
  );
  const acceptanceConfirmDeadlineObject = new Date(acceptanceConfirmDeadline);
  const laptop = require("../art/laptop.svg") as string;
  const hoover = require("../art/hoover.svg") as string;
  return (
    <div className="dashboard">
      <div className="stripe accent-blue" />
      <div className="stripe accent-orange bottom" />
      <div className="floating-illustration hoover">
        <img src={hoover} />
      </div>
      <div className="floating-illustration laptop">
        <img src={laptop} />
      </div>
      <div className="treehacks-dashboard-message-container">
        {false && props.profile.status === STATUS.ADMISSION_CONFIRMED ? (
          <div className="dashboard-design notice">
            Time to hack! Looking to <Link to="/rooms">reserve a room</Link> for
            your team?
          </div>
        ) : null}
        <div className="dashboard-design">
          {props.profile.status === STATUS.REJECTED ? (
            <RejectedScreen />
          ) : props.profile.status === STATUS.WAITLISTED ? (
            <WaitlistedScreen />
          ) : (props.profile.status === STATUS.ADMISSION_CONFIRMED && props.profile.type === TYPE.STANFORD) ? (
            <AdmittedScreen confirmedYet={true} stanford={true} />
          ): props.profile.status === STATUS.ADMISSION_CONFIRMED ? (
            <AdmittedScreen confirmedYet={true} />
          ) : props.profile.status === STATUS.ADMISSION_DECLINED ? (
            <AdmissionDeclinedScreen />
          ) : props.profile.status === STATUS.ADMITTED &&
            currentDate > acceptanceConfirmDeadlineObject.getTime() ? (
            <AdmissionExpiredScreen />
          ) : props.profile.status === STATUS.ADMITTED ? (
            <AdmittedScreen
              confirmedYet={false}
              deadline={acceptanceConfirmDeadline}
            />
          ) : (props.profile.status === STATUS.SUBMITTED || props.profile.status === STATUS.DONTREVIEW)? (
            <span>
              Your application has been received &ndash; you are all good for
              now!
              <br />
              <br />
              We will email you when decisions are released and will handle any
              travel questions at that time. Thanks for applying :)
            </span>
          ) : currentDate > deadlineDate.getTime() ? (
            <span>Sorry, the application window has closed.</span>
          ) : (
            <div>
              {AUTO_ADMIT_STANFORD && props.profile.type === TYPE.STANFORD && <div>All Stanford students who register by the deadline will be accepted to the event.<br /><br />
              </div>}
              <div>
                You haven't submitted your{" "}
                <Link to="/application_info">application</Link> yet. You have
              </div>
              <div className="days-left">{timeLeft}</div>
              <div>
                {unit} to submit your application before the deadline:
                <br />
                <strong>{displayDeadline}</strong>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardWrapper);
