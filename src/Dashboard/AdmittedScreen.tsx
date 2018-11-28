import React from "react";
import {connect} from "react-redux";
import { HACKATHON_YEAR } from "../constants";
import { confirmAdmission, declineAdmission } from "../store/form/actions";

interface IAdmittedScreenProps {
    confirmAdmission: () => void,
    declineAdmission: () => void
}
const AdmittedScreen = (props: IAdmittedScreenProps) => <div>
    <h4>Congratulations! You have been selected to attend Treehacks {HACKATHON_YEAR}!</h4>
    <p>You have until February 1st to confirm your attendance at Treehacks {HACKATHON_YEAR}. If you don't confirm by then, we'll assume you can't make it and give your spot to someone else.</p>
    <button className="btn btn-custom inverted" onClick={() => props.declineAdmission()}>decline spot</button>
    <button className="btn btn-custom" onClick={() => props.confirmAdmission()}>confirm spot</button>
    <p>We are committed to helping every admitted hacker get here! Check out the travel section for details.</p>
</div>;

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    confirmAdmission: () => dispatch(confirmAdmission()),
    declineAdmission: () => dispatch(declineAdmission())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdmittedScreen);