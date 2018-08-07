import React from "react";
import { connect } from "react-redux";
import { setAuthPage } from "../store/auth/actions";

const mapStateToProps = state => ({
  currentPage: state.auth.authPage
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setAuthPage: p => dispatch(setAuthPage(p))
});

interface IAuthPageNavButtonProps {
  currentPage: string,
  label: string,
  page: string,
  setAuthPage: (a, b?, c?) => void
}

function AuthPageNavButton(props: IAuthPageNavButtonProps) {
  if (props.currentPage != props.page) {
    return <button className="btn btn-dark mx-2" onClick={() => props.setAuthPage(props.page)}>{props.label}</button>;
  }
  else {
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPageNavButton);