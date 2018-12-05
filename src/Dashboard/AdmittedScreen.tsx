import React from "react";
import { connect } from "react-redux";
import { HACKATHON_YEAR, HACKATHON_DATE_RANGE } from "../constants";
import { confirmAdmission, declineAdmission } from "../store/form/actions";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

interface IAdmittedScreenProps {
    confirmAdmission: () => void,
    declineAdmission: () => void,
    confirmedYet: boolean,
    deadline: string
}
export const AdmittedScreen = (props: IAdmittedScreenProps) => <div className="admitted-content">
    {props.confirmedYet && <div>
        <h4>You're coming to TreeHacks {HACKATHON_YEAR}!</h4>
        <p>Admission confirmed &ndash; see you there! Make sure to review and confirm your <Link to="/transportation">travel information</Link>.</p>
    </div>}
    {!props.confirmedYet && <div>
        <h4>Congratulations! You've been accepted to TreeHacks {HACKATHON_YEAR}!</h4>
        <p>We're so stoked to see you the weekend of {HACKATHON_DATE_RANGE} at Stanford. We were blown away by your application and know that you’ll be an inspiring hacker. It'll be a super fun weekend filled with amazing hacks, delicious food, and fantastic people. We hope you can join us!</p>
        <p>You have until {moment(props.deadline).tz("America/Los_Angeles").format("LLL z")} to confirm your attendance at TreeHacks {HACKATHON_YEAR}. If you don't confirm by then, we'll assume you can't make it and give your spot to someone else.</p>
        <p>By confirming your spot, you agree to let us share your information with our sponsors. If you'd like to opt out, send us a message at hello@treehacks.com.</p>
    </div>}
    <button className="btn btn-custom inverted" onClick={() => window.confirm(`Are you sure you would like to decline your spot at TreeHacks ${HACKATHON_YEAR}? Your decision is final.`) && props.declineAdmission()}>decline spot</button>
    <button className="btn btn-custom" disabled={props.confirmedYet} onClick={() => props.confirmAdmission()}>{props.confirmedYet ? "already confirmed": "confirm spot"}</button>
    {!props.confirmedYet &&
        <p>We are committed to helping every admitted hacker get here! Check out the <Link to="/transportation">travel section</Link> for details.</p>
    }
</div>;

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    confirmAdmission: () => dispatch(confirmAdmission()),
    declineAdmission: () => dispatch(declineAdmission())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdmittedScreen);