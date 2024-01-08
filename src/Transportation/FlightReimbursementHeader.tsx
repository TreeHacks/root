import React from "react";
import { HACKATHON_YEAR } from "../constants";
import { Link } from "react-router-dom";

export default () => (
  <div>
    <p style={{ maxWidth: 575, margin: "20px auto" }}>
      We have calculated your flight cap based on the location in your
      application, and above is the amount up to which we can reimburse the cost of your flight.
      <strong>
         If you do not book your flight through Egencia (details below) by the deadline, we will assume you
        are declining the reimbursement, and you will not be reimbursed. 
      </strong>
    See the detailed steps below that walk you through booking a flight using Egencia! This should take about 15-20 minutes and must 
      be completed by the deadline above. 
    </p>
    <ul style={{ textAlign: "left", margin: "20px auto", maxWidth: 575 }}>
        <li>
            <button className="btn btn-custom">
              <Link to="https://www.egencia.com/pub/agent.dll?qscr=mtgd&mgid=84861&miid=87A6AC6D9057&gpid=9AE927F23FE9" style={{ color: "white" }}>
                Egencia
              </Link>
            </button>
            <ul>
                <li>Select “Create an account for TreeHacks 2024”.</li>
                <li>Your name must match your government ID exactly.</li>
                <li>For Egencia user name, use the email address you applied to TreeHacks with.</li>
                <li>Select “Use password sign-in”.</li>
                <li>For SUNet ID, put “N/A”.</li>
                <li>For email, use the email address you applied to TreeHacks with.</li>
                <li>For Affiliation, put “Guest”.</li>
                <li>For Employee ID, put “0”.</li>
                <li>For Budget Unit, select “University General”.</li>
                <li>Click “Submit user account request”.</li>
                <li>You will then receive an email to create your password.</li>
            </ul>
        </li>
        <li>
            Book flight through Egencia
            <ul>
                <li>On your profile, select “Add a flight”.</li>
                <li>The name of your traveler must match your government ID exactly.</li>
                <li>Fly into SFO or SJC.</li>
                <li>Be sure to book a flight that will let you arrive at Stanford campus BEFORE 6:30pm on Friday, Feb 16.</li>
                <li>Be sure to book a flight that will let you leave campus no earlier than 2:30pm on Sunday, Feb 18.</li>
                <li>Leaving earlier than 2:30pm may mean you will not be able to receive your prize.</li>
                <li>Upon checkout:</li>
                <ul>
                    <li>Use your own credit card to pay for your flight. If you meet all reimbursement criteria, you will be reimbursed after the event.</li>
                    <li>Select “No” when responding to the ‘Is this trip Federally Funded?’ question.</li>
                    <li>Select “Business” when responding to the ‘Business or Personal Travel’ question.</li>
                    <li>Include “Test Event” in the ‘Expense Notes’ field.</li>
                    <li>Read the flight reimbursement criteria below.</li>
                    <li>Complete this form confirming your travel plans.</li>
                </ul>
            </ul>
        </li>
    </ul>
    <p style={{ textAlign: "left", margin: "20px auto", maxWidth: 575 }}>
      Your reimbursement will be rejected if you don't:
    </p>
    <ul style={{ textAlign: "left", margin: "20px auto", maxWidth: 575 }}>
      <li>Check-in at the event in person</li>
      <li>Submit a qualified project to the Devpost before hacking closes. A qualified project is one where: </li>
      <ul>
        <li>it is clear that thought and effort went into the project</li>
        <li>it contains original code and is not a fork/clone of an existing repo</li>
        <li>it adheres to the rules of the hackathon, which require all coding to be done during the 36 hours</li>
      </ul>
      <li>
        Follow any and all TreeHacks rules &amp; the{" "}
        <a
          target="_blank"
          href="https://github.com/TreeHacks/policies/blob/master/code-of-conduct.md"
        >
          TreeHacks Code of Conduct.
        </a>
      </li>
    </ul>
  </div>
);
