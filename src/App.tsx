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
import Review from "./Review/Review";
import Admin from "./Admin/Admin";
import Verify from "./Verify";
import Helmet from "react-helmet";

const mapStateToProps = state => ({
  ...state.base,
  loggedIn: (state.auth as IAuthState).loggedIn
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

interface IAppProps extends IBaseState {
  loggedIn: boolean
}

const App = (props: IAppProps) => (
  <ConnectedRouter history={history}>
    <div className="treehacks-main">
      <Helmet>
        <link rel="icon" type="image/png" href={require("./art/favicon.png")} />
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
      <Redirect to="/" />
    }
    {props.loggedIn === true &&
      <div>
        <Route path="" component={Home} />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/application_info" render={() => { return <FormPage incomingFormName="application_info" />; }} />
          <Route path="/additional_info" render={() => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '500px', marginTop: '60px', padding: '20px', color: 'white', textAlign: 'center' }}>
                  There are no travel options at this time. Check back after you have received a decision about your application.
                    </div>
              </div>);
          }} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/review" exact component={Review} />
        </Switch>
      </div>
    }
  </div>);

export default connect(mapStateToProps, mapDispatchToProps)(App);
