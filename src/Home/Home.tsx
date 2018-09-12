import React from "react";
import { connect } from 'react-redux';
import { getUserProfile, setPage } from "../store/form/actions";
import { IHomeProps } from "./types";
import "./Home.scss";
import FormPage from "../FormPage/FormPage";

const mapStateToProps = state => ({
  ...state.home,
  schemas: state.form.schemas
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getUserProfile: () => dispatch(getUserProfile()),
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
      <div>
        <FormPage />
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);