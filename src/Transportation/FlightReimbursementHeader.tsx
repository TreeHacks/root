import React from "react";
import { HACKATHON_YEAR } from "../constants";

export default () => (
  <div>
    <h4>You have received a flight reimbursement!</h4>
    <p style={{ maxWidth: 575, margin: "20px auto" }}>
      We have calculated your flight cap based on the location in your
      application. We will reimburse the cost of your flight, up to this amount.{" "}
      <strong>
        If you do not upload your receipts by the deadline, we will assume you
        are declining the reimbursement, and you will not be reimbursed.
      </strong>
    </p>
    <p style={{ maxWidth: 575, margin: "20px auto" }}>
      Here are the guidelines you need to follow in order to receive a
      reimbursement:
    </p>
    <ul style={{ textAlign: "left", margin: "20px auto", maxWidth: 575 }}>
      <li>Attend TreeHacks {HACKATHON_YEAR} :)</li>
      <li>Submit a project by the project deadline the weekend-of.</li>
      <li>
        Submit your flight receipts by the deadline listed on this page. We will
        only be able to reimburse your reimbursement if they are submitted by
        then.
      </li>
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
    <p style={{ maxWidth: 575, margin: "20px auto" }}>
      If you are booking a flight, we recommend flying into SJC, SFO, or OAK;
      these are the closest airports to Stanford (in that order). Please arrange
      for transportation to bring you to the venue from the airport on Friday
      and to the airport from the venue on Sunday. Plan for your flight to
      arrive Friday afternoon by 3 PM PST. This will allow for you to get to
      Stanford on time for the opening ceremony, dinner, and the hacker mixer.
      On Sunday (2/19), expect to leave the venue around 4 PM PST, after the
      closing ceremony.
    </p>
    <p style={{ maxWidth: 575, margin: "20px auto" }}>
      In the case that your current flight cap prevents you from attending
      TreeHacks or is significantly off the mark of flight prices that you're
      able to find, please reach out to us at hello@treehacks.com, and we will
      work something out. Our hope is to remove any and all barriers that could
      prevent you from coming out to TreeHacks!
    </p>
  </div>
);
