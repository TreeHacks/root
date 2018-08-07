import React from "react";
import { connect } from 'react-redux';
import { getUserProfile } from "../store/form/actions";
import { IHomeProps } from "./types.d";
import "./Home.scss";

const mapStateToProps = state => ({
  ...state.home
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getUserProfile: () => dispatch(getUserProfile())
});

class Login extends React.Component<IHomeProps, {}> {
  componentDidMount() {
    this.props.getUserProfile();
  }

  render() {
    return <div>
      {this.props.profile && <pre>
        {JSON.stringify(this.props.profile, null, 2)}
      </pre>}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);