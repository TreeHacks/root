import React from "react";
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from "./history";
import { Switch, Route, Redirect } from "react-router-dom";
import { IBaseState } from "./store/base/types";
import Login from "./Login/Login";
import Loading from "./Loading/Loading";
import "bootstrap/dist/css/bootstrap.css";
import { IAuthState } from "./store/auth/types";
import Home from "./Home/Home";
import FormPage from "./FormPage/FormPage";
import Dashboard from "./Dashboard/Dashboard";
import "./App.scss";
import { setFormName } from "./store/form/actions";
import Review from "./Review/Review";
import Verify from "./Verify";
import './favicons/favicons';

const mapStateToProps = state => ({
  ...state.base,
  loggedIn: (state.auth as IAuthState).loggedIn
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFormName: (e: string) => dispatch(setFormName(e))
});

interface IAppProps extends IBaseState {
  loggedIn: boolean,
  setFormName: (e: string) => void
}

const App = (props: IAppProps) => (
  <ConnectedRouter history={history}>
    <div className="treehacks-main">
      {props.loading && <Loading />}
      <Switch>
        <Route path="/verify" component={Verify} />
        <div>
          <Login />
          {props.loggedIn === false &&
            <Redirect to="/" />
          }
          {props.loggedIn === true &&
            <div>
              <Route path="" component={Home} />
              <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/application_info" render={() => { props.setFormName("application_info"); return <FormPage />; }} />
                <Route path="/additional_info" render={() => { return <div>Not available yet.</div>/* props.setFormName("additional_info"); return <FormPage />; */ }} />
                <Route path="/review" exact component={Review} />
              </Switch>
            </div>
          }
        </div>
      </Switch>
    </div>
  </ConnectedRouter>);

export default connect(mapStateToProps, mapDispatchToProps)(App);
