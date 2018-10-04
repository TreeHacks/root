import React from "react";
import { connect } from 'react-redux';
import { getUserProfile, setPage } from "../store/form/actions";
import { IHomeProps } from "./types";
import "./Home.scss";
import {NavLink} from "react-router-dom";

const mapStateToProps = state => ({
  ...state.home
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

class Login extends React.Component<IHomeProps, {}> {
  componentDidMount() {
  }

  render() {
    return <div>
      <ul>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/application_info">Application</NavLink>
      <NavLink to="/additional_info">Travel</NavLink>
      </ul>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);