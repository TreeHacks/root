import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { RoutedTabs, NavTab } from 'react-router-tabs';
 
import 'react-router-tabs/styles/react-router-tabs.scss';
import Stats from './Stats';
import AdminTable from './AdminTable';
import BulkChange from './BulkChange';
 import BulkCreate from './BulkCreate';
import BulkImportHacks from './BulkImportHacks';
import HackTable from './HackTable';
import JudgeTable from './JudgeTable';
import JudgeLeaderboard from './JudgeLeaderboard';

const Admin = ({ match }) => {
  return (
    <div className="bg-white col-8 offset-2 p-4">
      <NavTab to={`${match.path}/table`}>Application Table</NavTab>
      <NavTab to={`${match.path}/hack_table`}>Hack Table</NavTab>
      <NavTab to={`${match.path}/judge_table`}>Judge Table</NavTab>
      <NavTab to={`${match.path}/judge_leaderboard`}>Judge Leaderboard</NavTab>
      <NavTab to={`${match.path}/bulkchange`}>Bulk Change Status</NavTab>
      <NavTab to={`${match.path}/bulkcreate`}>Bulk Create Users</NavTab>
      <NavTab to={`${match.path}/bulk_import_hacks`}>Bulk Import Hacks</NavTab>
      <NavTab to={`${match.path}/stats`}>Application Stats</NavTab>

      <Switch>
        <Route exact path={`${match.path}`} render={() => <Redirect replace to={`${match.path}/table`} />} />
        <Route path={`${match.path}/table`} component={AdminTable} />
        <Route path={`${match.path}/stats`} component={Stats} />
        <Route path={`${match.path}/bulkchange`} component={BulkChange} />
        <Route path={`${match.path}/bulkcreate`} component={BulkCreate} />
        <Route path={`${match.path}/hack_table`} component={HackTable} />
        <Route path={`${match.path}/bulk_import_hacks`} component={BulkImportHacks} />
        <Route path={`${match.path}/judge_table`} component={JudgeTable} />
        <Route path={`${match.path}/judge_leaderboard`} component={JudgeLeaderboard} />
      </Switch>
    </div>
  );
};
 
export default Admin;