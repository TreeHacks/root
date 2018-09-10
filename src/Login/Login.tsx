import React from "react";
import { connect } from 'react-redux';
import "./Login.scss";
import { checkLoginStatus, logout, signIn, signUp, forgotPassword, forgotPasswordSubmit } from "../store/auth/actions";
import { withFederated } from 'aws-amplify-react';
import AuthPageNavButton from "./AuthPageNavButton";
import Form from "react-jsonschema-form";
import { IAuthState } from "../store/auth/types";

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
});


interface ILoginProps extends IAuthState {
  checkLoginStatus: () => void,
  logout: () => void,
  setup: () => void,
  signIn: (e) => void,
  signUp: (e) => void,
  forgotPassword: (e) => void,
  forgotPasswordSubmit: (e) => void
};
class Login extends React.Component<ILoginProps, {}> {
  componentDidMount() {
    this.props.checkLoginStatus();
  }

  render() {
    if (!this.props.loggedIn) {
      return (<div className="treehacks-login">
        <h1>TreeHacks Application Portal</h1>
        {this.props.message && <div className="alert alert-info" role="alert">
          {this.props.message}
        </div>
        }
        {this.props.error && <div className="alert alert-danger" role="alert">
          {this.props.error}
        </div>}
        {this.props.authPage == "signIn" &&
          <Form
            schema={this.props.schemas.signIn.schema}
            uiSchema={this.props.schemas.signIn.uiSchema}
            onSubmit={e => this.props.signIn(e.formData)} />
        }
        {this.props.authPage == "signUp" &&
          <Form
            schema={this.props.schemas.signUp.schema}
            uiSchema={this.props.schemas.signUp.uiSchema}
            onSubmit={e => this.props.signUp(e.formData)} />
        }
        {this.props.authPage == "forgotPassword" &&
          <Form
            schema={this.props.schemas.forgotPassword.schema}
            uiSchema={this.props.schemas.forgotPassword.uiSchema}
            onSubmit={e => this.props.forgotPassword(e.formData)} />
        }
        {this.props.authPage == "forgotPasswordSubmit" &&
          <Form
            schema={this.props.schemas.forgotPasswordSubmit.schema}
            uiSchema={this.props.schemas.forgotPasswordSubmit.uiSchema}
            onSubmit={e => this.props.forgotPasswordSubmit(e.formData)} />
        }
        <div className="mt-4">
          <AuthPageNavButton current={this.props.authPage} page="signIn" label="Sign In" />
          <AuthPageNavButton current={this.props.authPage} page="signUp" label="Sign Up" />
          <AuthPageNavButton current={this.props.authPage} page="forgotPassword" label="Forgot Password" />
        </div>
      </div>);
    }
    else {
      return (<div className="text-left">
        {/* <img src={require("src/img/logo.png")} style={{ "width": 40, "marginRight": 40 }} /> */}
        <div style={{ "display": "inline-block", "verticalAlign": "middle" }}>
          <strong>Treehacks</strong><br />
          Welcome, {this.props.user.email}
        </div>
        <div className="float-right"><button className="btn" onClick={() => this.props.logout()}>Logout</button></div>
      </div>);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);