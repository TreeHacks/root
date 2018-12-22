import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { RoutedTabs, NavTab } from 'react-router-tabs';
 
import 'react-router-tabs/styles/react-router-tabs.scss';
import SponsorsTable from './SponsorsTable';
 
const Sponsors = ({ match }) => {
  return (
    <div className="bg-white col-8 offset-2 p-4">
      <NavTab to={`${match.path}/table`}>Application Table</NavTab>
       
      <Switch>
        <Route exact path={`${match.path}`} render={() => <Redirect replace to={`${match.path}/table`} />} />
        <Route path={`${match.path}/table`} component={SponsorsTable} />
      </Switch>
    </div>
  );
};
 
export default Sponsors;