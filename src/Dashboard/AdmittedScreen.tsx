import React from "react";
import { connect } from "react-redux";
import { HACKATHON_YEAR, HACKATHON_DATE_RANGE } from "../constants";
import { confirmAdmission, declineAdmission } from "../store/form/actions";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

interface IAdmittedScreenProps {
  confirmAdmission: () => void;
  declineAdmission: () => void;
  confirmedYet: boolean;
  deadline: string;
}
export const AdmittedScreen = (props: IAdmittedScreenProps) => (
  <div className="admitted-content">
    {props.confirmedYet && (
      <div>
        <h4>You're coming to TreeHacks {HACKATHON_YEAR}!</h4>
        <p>Admission confirmed &ndash; see you there!</p>
        <p>Complete the following by <strong>January 24th:</strong> </p>
        <ul>
          <li>Follow the steps in your <Link to="/transportation">travel section</Link> to confirm your travel plans (we have very specific instructions on travelling to TreeHacks, please read carefully)! You must also input a mailing address that will be valid and accessible by you till May 2024 at the end of that page. </li>
          <li>Register through GrantEd: complete this form to register as a vendor (this is required in order to receive a prize or a travel reimbursement)</li>
          <li>Sign the <a href=""> liability waiver </a> (need to print and then sign, virtual signature not accepted) and <a href=""> upload it here </a> </li>
        </ul>
        <p>
          Keep an eye on your inbox in the coming weeks -- we'll be sending more
          details to you shortly!
        </p>
        <button className="btn btn-custom">
          <Link to="/transportation" style={{ color: "white" }}>
            Travel RSVP details
          </Link>
        </button>
        <p>
          Check out {" "}
          <a href="https://docs.google.com/document/d/162lC3yzvkURS1FZcVX-vpMckuWYkbqnoESZcPdxRdHk/edit?usp=sharing">
            Ultimate TreeHacks Guide 🌲
          </a>{" "}
          to learn more!
        </p>
      </div>
    )}
    {!props.confirmedYet && (
      <div>
        <h4>
          Congratulations! You've been accepted to TreeHacks {HACKATHON_YEAR}!
        </h4>
        <p>
          We're so stoked to see you the weekend of {HACKATHON_DATE_RANGE} at
          TreeHacks {HACKATHON_YEAR}! We were blown away by your application and
          know that you’ll be an inspiring hacker. It'll be a super fun weekend
          filled with amazing hacks, and fantastic people. We hope you can join
          us!
        </p>
        <p>
          You have until{" "}
          {moment(props.deadline)
            .tz("America/Los_Angeles")
            .format("LLL z")}{" "}
          to confirm your attendance at TreeHacks {HACKATHON_YEAR}. If you don't
          confirm by then, we'll assume you can't make it and give your spot to
          someone else.
        </p>
        <p>
          By confirming your spot, you agree to let us share the information you
          gave us in your application with our sponsors. If you'd like to opt
          out, send us a message at hello@treehacks.com with the subject "Sponsor Information Opt Out".
        </p>
      </div>
    )}
    <button
      className="btn btn-custom inverted"
      onClick={() =>
        window.confirm(
          `Are you sure you would like to decline your spot at TreeHacks ${HACKATHON_YEAR}? Your decision is final.`
        ) && props.declineAdmission()
      }
    >
      decline spot
    </button>
    <button
      className="btn btn-custom"
      disabled={props.confirmedYet}
      onClick={() => props.confirmAdmission()}
    >
      {props.confirmedYet ? "already confirmed" : "confirm spot"}
    </button>
    {!props.confirmedYet && (
      <>
        <p>
          We are committed to helping every admitted hacker get here! Check out
          the <Link to="/transportation">travel section</Link> for details.
        </p>
      </>
    )}
  </div>
);

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  confirmAdmission: () => dispatch(confirmAdmission()),
  declineAdmission: () => dispatch(declineAdmission()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdmittedScreen);
