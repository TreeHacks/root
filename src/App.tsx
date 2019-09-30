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
import Dashboard from "./Dashboard/Dashboard";
import Rooms from "./Rooms/Rooms";
import Transportation from "./Transportation/Transportation";
import "./App.scss";
import Review from "./Review/Review";
import Admin from "./Admin/Admin";
import Verify from "./Verify";
import Helmet from "react-helmet";
import FormPageWrapper from "./FormPage/FormPageWrapper";
import Sponsors from "./Sponsors/Sponsors";
import Judge from "./Judge/Judge";
import { favicon } from "./constants";

const mapStateToProps = state => ({
  ...state.base,
  loggedIn: (state.auth as IAuthState).loggedIn,
  sponsor: (state.auth as IAuthState).sponsor,
  judge: (state.auth as IAuthState).judge
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

interface IAppProps extends IBaseState {
  loggedIn: boolean,
  sponsor: boolean,
  judge: boolean
}

const App = (props: IAppProps) => (
  <ConnectedRouter history={history}>
    <div className="treehacks-main">
      <Helmet>
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>
      {props.loading && <Loading />}
      <Switch>
        <Route path="/verify" component={Verify} />
        <Route render={() => <MainRoutes {...props} />} />
      </Switch>
    </div>
  </ConnectedRouter>);
const MainRoutes = (props: IAppProps) => (
  <div>
    <Login />
    {props.loggedIn === false &&
      <Switch>
        <Route exact={true} path='/' component={null} />
        <Redirect to="/" />
      </Switch>
    }
    {props.loggedIn === true &&
      <div>
        <Route path="" component={Home} />
        <Switch>
          {props.sponsor ? <Redirect exact path="/" to="/sponsors" /> :
          props.judge ? <Redirect exact path="/" to="/judge" /> :
            <Route path="/" exact component={Dashboard} />
          }
          <Route path="/application_info" render={() => { return <FormPageWrapper incomingFormName="application_info" />; }} />
          <Route path="/rooms" exact component={Rooms} />
          <Route path="/transportation" component={Transportation} />
          <Route path="/admin" component={Admin} />
          <Route path="/review" exact component={Review} />
          <Route path="/sponsors" component={Sponsors} />
          <Route path="/judge" exact component={Judge} />
        </Switch>
      </div>
    }
  </div>);

export default connect(mapStateToProps, mapDispatchToProps)(App);
