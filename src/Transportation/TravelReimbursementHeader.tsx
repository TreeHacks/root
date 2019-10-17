import React from "react";
import { HACKATHON_YEAR } from "../constants";

export default () => <div>
<h4>You have received a travel reimbursement!</h4>
<p style={{maxWidth: 575, margin: '20px auto'}}>We have calculated your reimbursement amount based on the location in your application. We will reimburse the cost of your travel, up to this amount. It is up to you to decide how you get to Stanford, whether that's driving, public transportation, or another method. You must upload your receipts by the deadline listed on this page, or we will not be able to process your reimbursement.</p>
<p style={{maxWidth: 575, margin: '20px auto'}}>Here are the guidelines you need to follow in order to receive a reimbursement:</p>
<ul style={{textAlign: 'left', margin: '20px auto', maxWidth: 575}}>
  <li>Attend TreeHacks {HACKATHON_YEAR} :)</li>
  <li>Submit a project by the project deadline the weekend-of.</li>
  <li>Submit your receipts by the deadline listed on this page. We will only be able to reimburse your reimbursement if they are submitted by then.</li>
  <li>Follow any and all TreeHacks rules &amp; the <a target="_blank" href="https://www.treehacks.com/code-of-conduct">TreeHacks Code of Conduct.</a></li>
</ul>
</div>;