import React from "react";
import { connect } from 'react-redux';
import "./Login.scss";
import { checkLoginStatus, logout, signIn, signUp, forgotPassword, forgotPasswordSubmit, resendSignup } from "../store/auth/actions";
import { withFederated } from 'aws-amplify-react';
import AuthPageNavButton from "./AuthPageNavButton";
import Form from "react-jsonschema-form";
import { IAuthState } from "../store/auth/types";
import StanfordLogin from "./StanfordLogin";
import queryString from "query-string";

const mapStateToProps = state => ({
  ...state.auth
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  checkLoginStatus: () => dispatch(checkLoginStatus()),
  logout: () => dispatch(logout()),
  signIn: data => dispatch(signIn(data)),
  signUp: data => dispatch(signUp(data)),
  forgotPassword: data => dispatch(forgotPassword(data)),
  forgotPasswordSubmit: data => dispatch(forgotPasswordSubmit(data)),
  resendSignup: () => dispatch(resendSignup())
});


interface ILoginProps extends IAuthState {
  checkLoginStatus: () => void,
  logout: () => void,
  setup: () => void,
  signIn: (e) => void,
  signUp: (e) => void,
  forgotPassword: (e) => void,
  forgotPasswordSubmit: (e) => void,
  resendSignup: () => void
};

function transformErrors(errors) {
  return errors;
}

function validate(formData, errors) {
  if (formData.email && ~formData.email.toLowerCase().indexOf("@stanford.edu")) {
    errors.email.addError("If you are a Stanford student, please make sure you click 'Sign in with Stanford.'");
  }
  return errors;
}

function AuthForm(props) {
  return <Form {...props} showErrorList={false} transformErrors={transformErrors} validate={validate} />
}
class Login extends React.Component<ILoginProps, {}> {
  componentDidMount() {

    // Parse ID Token from SAML
    const hash = queryString.parse(window.location.hash);
    if (hash && hash.id_token) {
      localStorage.setItem("jwt", hash.id_token);
      window.location.hash = "";
    }

    this.props.checkLoginStatus();
  }

  stanfordLogin() {

  }

  render() {
    if (!this.props.loggedIn) {
      return (<div className="treehacks-login">
       <img src={require('../art/logo.png')} width="85px" height="65px" style={{ "marginLeft": 207 , "marginTop":49 }} />
        <h2 className="h3-style">tree<strong>hacks</strong></h2>
        {this.props.message && <div className="alert alert-info" role="alert">
          {this.props.message}
        </div>
        }
        {this.props.error && <div className="alert alert-danger" role="alert">
          {this.props.error}
          {this.props.error == "User is not confirmed." && 
            <div>
              <a href="#" onClick={() => this.props.resendSignup()}>Resend email confirmation link</a>
            </div>
          }
        </div>}
        {this.props.authPage == "signIn" &&
          <div className="top-form">
            <AuthForm
              schema={this.props.schemas.signIn.schema}
              uiSchema={this.props.schemas.signIn.uiSchema}
              onSubmit={e => this.props.signIn(e.formData)}
             >
               <button className="btn btn-info" type="submit">Sign In</button>
             </AuthForm>
             <div className="label-text centered">or</div>
              <StanfordLogin />
          </div>
        }
        {this.props.authPage == "signUp" &&
          <AuthForm
            schema={this.props.schemas.signUp.schema}
            uiSchema={this.props.schemas.signUp.uiSchema}
            onSubmit={e => this.props.signUp(e.formData)}
            >
              <button className="btn btn-info" type="submit">Sign Up</button>
            </AuthForm>
        }
        {this.props.authPage == "forgotPassword" &&
          <AuthForm
            schema={this.props.schemas.forgotPassword.schema}
            uiSchema={this.props.schemas.forgotPassword.uiSchema}
            onSubmit={e => this.props.forgotPassword(e.formData)}
            >
              <button className="btn btn-info" type="submit">Send reset instructions</button>
            </AuthForm>
        }
        {this.props.authPage == "forgotPasswordSubmit" &&
          <AuthForm
            schema={this.props.schemas.forgotPasswordSubmit.schema}
            uiSchema={this.props.schemas.forgotPasswordSubmit.uiSchema}
            onSubmit={e => this.props.forgotPasswordSubmit(e.formData)} />
        }
        {this.props.authPage === "signUp" ?
          <div className="label-text">Already have an account?</div>
        : this.props.authPage === "signIn" ?
          <div className="label-text">Don't have an account yet?</div>
        : null}
        <div className="mt-4 left-btn">
          <AuthPageNavButton current={this.props.authPage} page="signIn" label="Sign In"  />
          <AuthPageNavButton current={this.props.authPage} page="signUp" label="Sign Up" />
          <AuthPageNavButton current={this.props.authPage} page="forgotPassword" label="Forgot Password"/>
        </div>
      </div>);
    }
    else {
      return (<div className="text-left">
      </div>);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
