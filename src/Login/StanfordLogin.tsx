import React from "react";
import { Types } from "aws-sdk/clients/configservice";
declare const COGNITO_CLIENT_ID: string;
declare const COGNITO_ENDPOINT_URL: string;

interface StanfordLoginProps {
  label?: string
}

export default (props: StanfordLoginProps) => (
  <React.Fragment>
    <form action={`${COGNITO_ENDPOINT_URL}/oauth2/authorize`} method="GET" className="login-btn-style">
        <input type="hidden" name="response_type" value="code" />
        <input type="hidden" name="client_id" value={COGNITO_CLIENT_ID} />
        <input type="hidden" name="redirect_uri" value={window.location.origin} />
        <input type="hidden" name="scope" value="aws.cognito.signin.user.admin email openid phone profile" />
        <input type="hidden" name="identity_provider" value="Stanford" />
        <input type="submit" className="btn btn-stanford" value={props.label || 'Sign in with Stanford'} />
        <p className="text-white">
          <i>Note: By signing up with Stanford, I have read and agree to the <a className="form-link" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" target="_blank" onClick={e => e.stopPropagation()}>MLH Code of Conduct</a>. Additionally, you agree to let us share the information you gave us in your application with our sponsors. If you'd like to opt out, send us a message at hello@treehacks.com.</i>
        </p>
    </form>
    </React.Fragment>
);
