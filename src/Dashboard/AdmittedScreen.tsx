import React from "react";
import { connect } from "react-redux";
import { HACKATHON_YEAR } from "../constants";
import { confirmAdmission, declineAdmission } from "../store/form/actions";
import { Link } from "react-router-dom";

interface IAdmittedScreenProps {
    confirmAdmission: () => void,
    declineAdmission: () => void,
    confirmedYet: boolean
}
const AdmittedScreen = (props: IAdmittedScreenProps) => <div className="admitted-content">
    {props.confirmedYet && <div>
        <h4>You're coming to Treehacks {HACKATHON_YEAR}!</h4>
        <p>Admission confirmed &ndash; see you there! Make sure to review and confirm your <Link to="/additional_info">travel information</Link>.</p>
    </div>}
    {!props.confirmedYet && <div>
        <h4>Congratulations! You have been selected to attend Treehacks {HACKATHON_YEAR}!</h4>
        <p>You have until February 1st to confirm your attendance at Treehacks {HACKATHON_YEAR}. If you don't confirm by then, we'll assume you can't make it and give your spot to someone else.</p>
    </div>}
    <button className="btn btn-custom inverted" onClick={() => window.confirm(`Are you sure you would like to decline your spot at Treehacks ${HACKATHON_YEAR}? Your decision is final.`) && props.declineAdmission()}>decline spot</button>
    <button className="btn btn-custom" disabled={props.confirmedYet} onClick={() => props.confirmAdmission()}>{props.confirmedYet ? "already confirmed": "confirm spot"}</button>
    {!props.confirmedYet &&
        <p>We are committed to helping every admitted hacker get here! Check out the <Link to="/additional_info">travel section</Link> for details.</p>
    }
</div>;

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    confirmAdmission: () => dispatch(confirmAdmission()),
    declineAdmission: () => dispatch(declineAdmission())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdmittedScreen);