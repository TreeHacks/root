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
          <img src={require("../art/header_logo.png")} height="70px" />
          <span className="logo-text-tree">tree</span>
          <span className="logo-text-hacks">hacks</span>
        </NavLink>
      </div>
      <div style={{}}>
        <NavLink to="/">dashboard</NavLink>
        <NavLink to="/application_info">application</NavLink>
        <NavLink to="/additional_info">travel</NavLink>
        {this.props.auth.admin &&
          <NavLink to="/review">review</NavLink>
        }
      </div>
      <button style={{ marginLeft: 'auto', marginRight: '30px', backgroundColor: 'transparent', color: 'white', border: '0px', cursor: 'pointer' }} onClick={() => this.props.logout()}>log out</button>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);