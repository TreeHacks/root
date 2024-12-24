import React from "react";
import { connect } from "react-redux";
import Loading from "../Loading/Loading";
import { IIDProps } from "./types";
import { loadData, getUserProfile } from "../store/form/actions";
import API from "@aws-amplify/api";

const mapStateToProps = (state) => ({
  ...state.form,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: () => {
    dispatch(loadData());
  },
  getUserProfile: () => dispatch(getUserProfile()),
});

export class ID extends React.Component<IIDProps> {
  constructor(props) {
    super(props);
    this.getID = this.getID.bind(this);
    console.log(this.props);
  }

  async getID() {
    const res = await API.get(
      "treehacks",
      "/users/" +
        this.props.profile.user.id +
        "/" +
        this.props.profile.forms.application_info.full_name +
        "/getDigitalID",
      {}
    );

    // Get the base64-encoded binary data
    const base64Data = await res.content;
    const binaryData = atob(base64Data); // Decode base64 to binary data

    // Create a blob
    const blob = new Blob([
      new Uint8Array(binaryData.split("").map((char) => char.charCodeAt(0))),
    ]);
    // trigger file download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "treehacksID.pkpass";
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the Object URL
  }

  render(): React.ReactNode {
    return (
      <div>
        <a onClick={this.getID}>Click to add ID to Apple Wallet</a>
      </div>
    );
  }
}

// necessary to get user profile once page loads
class IDWrapper extends React.Component<IIDProps> {
  componentDidMount() {
    this.props.getUserProfile();
  }
  render() {
    if (!this.props.profile) {
      return <Loading />;
    }
    return <ID {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IDWrapper);
