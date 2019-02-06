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

export class Home extends React.Component<IHomeProps, {}> {
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
        {this.props.auth.applicant && <NavLink to="/" isActive={(_, loc) => loc.pathname === "/"}>dashboard</NavLink>}
        {this.props.auth.applicant && <NavLink to="/application_info">application</NavLink>}
        {this.props.auth.applicant && <NavLink to="/transportation">travel</NavLink>}
        {this.props.auth.admin &&
          <NavLink to="/admin">admin</NavLink>
        }
        {this.props.auth.reviewer &&
          <NavLink to="/review">review</NavLink>
        }
        {this.props.auth.sponsor &&
          <NavLink to="/sponsors">sponsors</NavLink>
        }
        {this.props.auth.judge &&
          <NavLink to="/judge">judge</NavLink>
        }
      </div>
      <div className="logoutText">
        <a onClick={() => this.props.logout()}>log out</a>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
