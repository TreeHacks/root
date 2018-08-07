import React from "react";
import { Authenticator } from "aws-amplify-react";
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from "./history";
import { Switch, Route } from "react-router-dom";
import { IBaseState } from "./store/base/types";
import Login from "./Login/Login";
import Loading from "./Loading/Loading";
import "bootstrap/dist/css/bootstrap.css";

// function Home() {
//   return <div>
//     <h1>Treehacks</h1>
//     <Authenticator />
//   </div>;
// }

const mapStateToProps = state => ({
  ...state.base
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

const App = (props: IBaseState) => (
  <ConnectedRouter history={history}>
    <div className="ccmt-cff-Wrapper-Bootstrap">
      {props.loading && <Loading />}
      <Switch>
        <Route path="" component={Login} />
      </Switch>
    </div>
  </ConnectedRouter>);

export default connect(mapStateToProps, mapDispatchToProps)(App);