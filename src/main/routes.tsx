import * as React from 'react';
import { Router, Route } from 'react-router';
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
    <Route path="/" component={App}>
      <Route path='signin' component={SignIn} />
      <Route path='match/new' component={MatchNew} />
      <Route path='match/new/:userId' component={MatchNew} />
      <Route path='match/:matchId' component={MatchShow} />
      <Route path='edit' component={Edit} />
      <Route path='user/:userId' component={UserShow} />
      <Route path="*" component={Top} />
      </Route>
  );
};
