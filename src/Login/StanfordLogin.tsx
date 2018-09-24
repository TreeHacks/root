import React from "react";
declare const COGNITO_CLIENT_ID: string;
declare const COGNITO_ENDPOINT_URL: string;
export default () => (
    <form action={`${COGNITO_ENDPOINT_URL}/oauth2/authorize`} method="GET">
        <input type="hidden" name="identity_provider" value="Stanford" />
        <input type="hidden" name="response_type" value="TOKEN" />
        <input type="hidden" name="client_id" value={COGNITO_CLIENT_ID} />
        <input type="hidden" name="scope" value="aws.cognito.signin.user.admin email openid phone profile" />
        <input type="hidden" name="redirect_uri" value={window.location.origin} />
        <input type="submit" className="btn btn-danger" value="Log in with Stanford" />
    </form>
);