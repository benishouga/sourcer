import * as React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './components/pages/App';
import MatchNew from './components/pages/MatchNew';
import MatchShow from './components/pages/MatchShow';
import UserShow from './components/pages/UserShow';
import Edit from './components/pages/Edit';
import Top from './components/pages/Top';
import SignIn from './components/pages/SignIn';

export default function() {
  "use strict";
  return (
    <Route name="app" path="/" handler={App}>
      <Route name='signin' path='/signin' handler={SignIn} />
      <Route name='matchNew' path='/match/new' handler={MatchNew} />
      <Route name='matchAgainst' path='/match/new/:userId' handler={MatchNew} />
      <Route name='matchShow' path='/match/:matchId' handler={MatchShow} />
      <Route name='edit' path='/edit' handler={Edit} />
      <Route name='userShow' path='/:userId' handler={UserShow} />
      <DefaultRoute handler={Top} />
    </Route>
  );
};
