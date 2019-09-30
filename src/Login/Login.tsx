import React from "react";
import { connect } from 'react-redux';
import "./Login.scss";
import { checkLoginStatus, logout, signIn, signUp, forgotPassword, forgotPasswordSubmit, resendSignup, changePassword, exchangeAuthCode } from "../store/auth/actions";
import {logo} from "../constants";
import AuthPageNavButton from "./AuthPageNavButton";
import Form from "react-jsonschema-form";
import { IAuthState } from "../store/auth/types";
import StanfordLogin from "./StanfordLogin";
import DeadlinesWidget from "../common/DeadlinesWidget";
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
  resendSignup: () => dispatch(resendSignup()),
  changePassword: data => dispatch(changePassword(data)),
  exchangeAuthCode: e => dispatch(exchangeAuthCode(e))
});


export interface ILoginProps extends IAuthState {
  checkLoginStatus: () => void,
  logout: () => void,
  setup: () => void,
  signIn: (e) => void,
  signUp: (e) => void,
  forgotPassword: (e) => void,
  forgotPasswordSubmit: (e) => void,
  resendSignup: () => void,
  changePassword: (e) => void,
  exchangeAuthCode: (e) => void
};

function transformErrors(errors) {
  return errors;
}

function validate(formData, errors) {
  // if (formData.email && ~formData.email.toLowerCase().indexOf("@stanford.edu")) {
  //   errors.email.addError("If you are a Stanford student, please make sure you click 'Sign in with Stanford.'");
  // }
  return errors;
}

function AuthForm(props) {
  return <Form {...props} showErrorList={false} transformErrors={transformErrors} validate={validate} className="treehacks-form" />
}
export class Login extends React.Component<ILoginProps, { formData: any, sponsor: boolean, judge: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      sponsor: false,
      judge: false
    };
  }

  componentDidMount() {

    const search = queryString.parse(window.location.search);
    if (search && search.code) {
      this.props.exchangeAuthCode(search.code);
      // Clear window.location.search without refreshing the page.
      window.history.pushState({}, document.title, window.location.pathname);
      return;
    }

    // Parse ID Token from SAML
    const hash = queryString.parse(window.location.hash);
    if (hash && hash.id_token) {
      localStorage.setItem("jwt", hash.id_token);
      window.location.hash = "";
    }

    this.setState({
      sponsor: this.props.sponsor,
      judge: this.props.judge
    }, () => {
      if (hash && hash["sponsor"]) {
        // https://root.treehacks.com/#sponsor=true
        sessionStorage.setItem('sponsor', 'true');
        this.setState({ sponsor: true });
      }
      else if (hash && hash["judge"]) {
        // https://root.treehacks.com/#judge=true
        sessionStorage.setItem('judge', 'true');
        this.setState({ judge: true });
      }
      else if (sessionStorage.getItem('sponsor') === 'true') {
        sessionStorage.setItem('judge', 'false');
        this.setState({ sponsor: true });
      }
      else if (sessionStorage.getItem('judge') === 'true') {
        sessionStorage.setItem('sponsor', 'false');
        this.setState({ judge: true });
      }
    });

    this.props.checkLoginStatus();
  }

  render() {
    const applicant = !this.state.sponsor && !this.state.judge;
    const isStanfordEmail = (this.state.formData.email || '').indexOf('@stanford.edu') !== -1;
    if (!this.props.loggedIn) {
      return (<div className="treehacks-login">
        <div className="text-center">
          <img src={logo} width="85px" height="65px" style={{ "marginTop": 49 }} />
        </div>
        <h2 className="h3-style">tree<strong>hacks</strong></h2>
        {this.state.sponsor && <h3 className="h3-style">sponsors</h3>}
        {this.state.judge && <h3 className="h3-style">judges</h3>}
        {["signIn", "signUp"].indexOf(this.props.authPage) !== -1 && applicant && <DeadlinesWidget />}
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
              formData={this.state.formData}
              schema={Object.assign({}, this.props.schemas.signIn.schema, isStanfordEmail && { properties: { email: this.props.schemas.signIn.schema.properties.email }, required: ['email'] })}
              uiSchema={Object.assign({}, this.props.schemas.signIn.uiSchema, isStanfordEmail && { 'ui:order': ['email'] })}
              onSubmit={e => this.props.signIn(e.formData)}
              onChange={e => this.setState({ formData: e.formData }) }
            >
              {!isStanfordEmail ?
                <button className="btn btn-info" type="submit">Sign In</button>
                : <div></div>}
            </AuthForm>
            {applicant && !isStanfordEmail && <div className="label-text centered">or</div>}
            {applicant && <StanfordLogin />}
          </div>
        }
        {this.props.authPage == "signUp" &&
          <div className="top-form">
            <AuthForm
              formData={this.state.formData}
              schema={Object.assign({}, this.props.schemas.signUp.schema, isStanfordEmail && { properties: { email: this.props.schemas.signUp.schema.properties.email }, required: ['email'] })}
              uiSchema={Object.assign({}, this.props.schemas.signUp.uiSchema, isStanfordEmail && { 'ui:order': ['email'] })}
              onSubmit={e => this.props.signUp(e.formData)}
              onChange={e => this.setState({ formData: e.formData })}
            >
              {!isStanfordEmail ?
                <button className="btn btn-info" type="submit">Sign Up</button>
                : <div></div>}
            </AuthForm>
            {isStanfordEmail ?
              <div style={{ marginTop: -40 }}><StanfordLogin label="Sign up with Stanford" /></div>
              : null}
          </div>
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
        {this.props.authPage === "changePassword" &&
          <AuthForm
            schema={this.props.schemas.changePassword.schema}
            uiSchema={this.props.schemas.changePassword.uiSchema}
            onSubmit={e => this.props.changePassword(e.formData)}
          >
            <button className="btn btn-info" type="submit">Update password</button>
          </AuthForm>
        }
        {this.props.authPage === "signUp" ?
          <div className="label-text">Already have an account?</div>
          : this.props.authPage === "signIn" && applicant ?
            <div className="label-text">Don't have an account yet?</div>
            : null}
        {this.props.authPage !== "changePassword" &&
          <div className="mt-4 left-btn">
            <AuthPageNavButton current={this.props.authPage} page="signIn" label="Sign In" />
            {applicant && <AuthPageNavButton current={this.props.authPage} page="signUp" label="Sign Up" />}
            <AuthPageNavButton current={this.props.authPage} page="forgotPassword" label="Forgot Password" />
          </div>
        }
      </div>);
    }
    else {
      return (<div className="text-left">
      </div>);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
