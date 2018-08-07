import React from "react";
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from "./history";
import { Switch, Route } from "react-router-dom";
import { IBaseState } from "./store/base/types";
import Login from "./Login/Login";
import Loading from "./Loading/Loading";
import "bootstrap/dist/css/bootstrap.css";
import { IAuthState } from "./store/auth/types";
import Home from "./Home/Home";

// function Home() {
//   return <div>
//     <h1>Treehacks</h1>
//     <Authenticator />
//   </div>;
// }

const mapStateToProps = state => ({
  ...state.base,
  loggedIn: (state.auth as IAuthState).loggedIn
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

interface IAuthStateProps extends IBaseState {
  loggedIn: boolean
}

const App = (props: IAuthStateProps) => (
  <ConnectedRouter history={history}>
    <div className="treehacks-main">
      {props.loading && <Loading />}
      <Login />
      {props.loggedIn &&
      <Switch>
        <Route path="" component={Home} />
      </Switch>
      }
    </div>
  </ConnectedRouter>);

export default connect(mapStateToProps, mapDispatchToProps)(App);