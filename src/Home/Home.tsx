import React from "react";
import { connect } from 'react-redux';
import { getUserProfile, setPage } from "../store/form/actions";
import { logout } from "../store/auth/actions";

import { IHomeProps } from "./types";
import "./Home.scss";
import { NavLink } from "react-router-dom";

const mapStateToProps = state => ({
  ...state.home,
  auth: state.auth
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => dispatch(logout()),
});

class Login extends React.Component<IHomeProps, {}> {
  componentDidMount() {
  }

  render() {
    return <div className="nav">
      <div className="header-logo">
        <NavLink to="/">
          <img src={require("../art/logo.svg")} height="40px" />
          <span className="logo-text-tree">tree</span>
          <span className="logo-text-hacks">hacks</span>
        </NavLink>
      </div>
      <div className="treehacks-navbar-links">
        <NavLink to="/" isActive={(_, loc) => loc.pathname === "/"}>dashboard</NavLink>
        <NavLink to="/application_info">application</NavLink>
        <NavLink to="/transportation">travel</NavLink>
        {this.props.auth.admin &&
          <NavLink to="/admin">admin</NavLink>
        }
        {this.props.auth.reviewer &&
          <NavLink to="/review">review</NavLink>
        }
      </div>
      <div className="logoutText">
        <a onClick={() => this.props.logout()}>log out</a>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
