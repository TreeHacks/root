import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { getUserProfile } from "../store/form/actions";
import { IHomeProps } from "./types.d";
import "./Home.scss";

const mapStateToProps = state => ({
  ...state.home,
  schemas: state.form.schemas
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
      {this.props.schemas &&
        <Form schema={this.props.schemas.application1.schema} uiSchema={this.props.schemas.application2.schema} />
      }
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);