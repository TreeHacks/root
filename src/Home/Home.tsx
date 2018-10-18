import React from "react";
import { connect } from 'react-redux';
import { getUserProfile, setPage } from "../store/form/actions";
import { IHomeProps } from "./types";
import "./Home.scss";
import { NavLink } from "react-router-dom";

const mapStateToProps = state => ({
  ...state.home,
  auth: state.auth
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

class Login extends React.Component<IHomeProps, {}> {
  componentDidMount() {
  }

  render() {
    return <div className="nav">
      <ul>
      <div className="header-logo"><NavLink to="/"><img src="/art/header_logo.png" height="50px" /></NavLink></div>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/application_info">Application</NavLink>
      <NavLink to="/additional_info">Travel</NavLink>
      {this.props.auth.admin &&
          <NavLink to="/review">Review</NavLink>
      }
      </ul>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);