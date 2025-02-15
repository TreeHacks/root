import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { RoutedTabs, NavTab } from 'react-router-tabs';
 
import 'react-router-tabs/styles/react-router-tabs.scss';
import SponsorsTable from './SponsorsTable';
import { HACKATHON_YEAR } from '../constants';
 
const Sponsors = ({ match }) => {
  return (
    <div className="bg-white col-8 offset-2 p-4">
      Welcome to TreeHacks {HACKATHON_YEAR}! We're so excited to have you as a sponsor this year. Please visit <a href="https://meet.treehacks.com">our sponsor Meet portal</a> to learn about this year's hackers.

      {/* <NavTab to={`${match.path}/table`}>Application Table</NavTab>
       
      <Switch>
        <Route exact path={`${match.path}`} render={() => <Redirect replace to={`${match.path}/table`} />} />
        <Route path={`${match.path}/table`} component={SponsorsTable} />
      </Switch> */}
    </div>
  );
};
 
export default Sponsors;