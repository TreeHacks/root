import React from "react";
import { HACKATHON_YEAR } from "../constants";

export default () => <div className="admitted-content">
    <h4>You are on the waitlist for TreeHacks {HACKATHON_YEAR}.</h4>
    <p>We were really impressed by your application, but we unfortunately cannot offer you a spot at this time.</p>
    <p>We will contact you by the end of January with more information if we're able to offer you a confirmed spot at TreeHacks. Stay tuned and be on the lookout for updates from us in the future.</p>
    <p>Hacker love,</p>
    <p>The TreeHacks Team</p>
</div>;
