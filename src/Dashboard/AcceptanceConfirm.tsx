import React from "react";
import { HACKATHON_YEAR } from "../constants";
export default () => <div>
    <h4>Congratulations! You have been selected to attend Treehacks {HACKATHON_YEAR}!</h4>
    <p>You have until February 1st to confirm your attendance at Treehacks {HACKATHON_YEAR}. If you don't confirm by then, we'll assume you can't make it and give your spot to someone else.</p>
    <button className="btn btn-custom inverted">decline spot</button>
    <button className="btn btn-custom">confirm spot</button>
    <p>We are committed to helping every admitted hacker get here! Check out the travel section for details.</p>
</div>;