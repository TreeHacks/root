import React from "react";
import { connect } from 'react-redux';
import { checkLoginStatus } from "../store/auth/actions";

declare const LOGIN_URL: string;

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  checkLoginStatus: () => dispatch(checkLoginStatus())
});


export interface ILoginProps {
  checkLoginStatus: () => void
};


export class Login extends React.Component<ILoginProps, {}> {
  componentDidMount() {
    this.props.checkLoginStatus();
  }
  render() {
    return <a href={`${LOGIN_URL}?redirect=${window.location.href}`}>Click here to login</a>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
