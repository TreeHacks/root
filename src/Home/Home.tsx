import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { getUserProfile, setPage } from "../store/form/actions";
import { IHomeProps } from "./types.d";
import "./Home.scss";
import { cloneDeep, set } from "lodash-es";

const mapStateToProps = state => ({
  ...state.home,
  schemas: state.form.schemas,
  page: state.form.page
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getUserProfile: () => dispatch(getUserProfile()),
  setPage: (e) => dispatch(setPage(e))
});

class Login extends React.Component<IHomeProps, {}> {
  componentDidMount() {
    this.props.getUserProfile();
  }

  render() {
    const uiOrder = [...this.props.schemas.application.pages[this.props.page], "*"];
    const schema = this.props.schemas.application.schema;
    let uiSchema = cloneDeep(this.props.schemas.application.uiSchema);
    uiSchema["ui:order"] = uiOrder;
    for (let item in schema.properties) {
      if (!~uiOrder.indexOf(item)) {
        set(uiSchema, `${item}.ui:widget`, "hidden");
      }
    }
    return <div>
      {this.props.profile && <pre>
        {JSON.stringify(this.props.profile, null, 2)}
      </pre>}
      <div>
        <Form schema={schema} uiSchema={uiSchema}>
          <button className="btn"
            disabled={this.props.page - 1 < 0}
            onClick={() => this.props.setPage(this.props.page - 1)}>Previous page</button>
          <button className="btn"
            disabled={this.props.page + 1 >= this.props.schemas.application.pages.length}
            onClick={() => this.props.setPage(this.props.page + 1)}>Next page</button>
          {this.props.page == this.props.schemas.application.pages.length - 1 &&
            <input className="btn btn-primary" type="submit" />
          }
        </Form>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);