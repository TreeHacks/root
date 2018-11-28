import React from "react";
import { HACKATHON_YEAR } from "../constants";
import { Link } from "react-router-dom";

export default () => <div className="admitted-content">
  <h4>You're coming to Treehacks {HACKATHON_YEAR}!</h4>
  <p>Admission confirmed &ndash; see you there! Make sure to review and confirm your <Link to="/additional_info">travel information</Link>.</p>
</div>;