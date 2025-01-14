import React from "react";
import "./Id.scss";
import { connect } from "react-redux";
import Loading from "../Loading/Loading";
import QRCode from "react-qr-code";
import { IIDProps } from "./types";
import { loadData, getUserProfile } from "../store/form/actions";
import API from "@aws-amplify/api";

const appleWalletButton = require("../art/add_to_apple_wallet.svg") as string;
const googleWalletButton = require("../art/add_to_google_wallet.svg") as string;

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
    this.getAppleID = this.getAppleID.bind(this);
    this.getGoogleID = this.getGoogleID.bind(this);
  }

  async getAppleID() {
    const res = await API.get(
      "treehacks",
      "/users/" +
        this.props.profile.user.id +
        "/" +
        this.props.profile.forms.application_info.full_name +
        "/getAppleID",
      {}
    );

    // Get the base64-encoded binary data
    const base64Data = await res.content;
    const binaryData = atob(base64Data); // Decode base64 to binary data

    // Create a blob
    const blob = new Blob(
      [new Uint8Array(binaryData.split("").map((char) => char.charCodeAt(0)))],
      { type: "application/vnd.apple.pkpass" }
    );
    // trigger file download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let isIOS = [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform);

    if (!isSafari && !isIOS) {
      link.download = "treehacksID.pkpass";
    }
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the Object URL
  }

  async getGoogleID() {
    const res = await API.get(
      "treehacks",
      "/users/" +
        this.props.profile.user.id +
        "/" +
        this.props.profile.forms.application_info.full_name +
        "/getGoogleID",
      {}
    );

    // trigger file download
    const url = res.content;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the Object URL
  }

  render(): React.ReactNode {
    return (
      <div id="outer-box">
        <div id="id-box">
          <div className="id-header-text">Treehacks ID</div>
          <div className="id-full-name">
            {this.props.profile.forms.application_info.full_name}
          </div>

          <div className="qr-container">
            <QRCode value={this.props.profile.user.id} />
          </div>
        </div>
        <div className="wallet-holder">
          <div>
            <img
              className="wallet-btn"
              onClick={this.getAppleID}
              src={appleWalletButton}
            />
          </div>
          <div>
            <img
              className="wallet-btn"
              onClick={this.getGoogleID}
              src={googleWalletButton}
            />
          </div>
        </div>
        <div>
          Your Treehacks ID will be used for check-in and meals! Make sure you
          have this QR code available before arriving!
        </div>
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
