import * as React from 'react';
import {IndexRoute, Router, Route, RouterState, RedirectFunction} from 'react-router'
import App from './pages/App';
import MatchNew from './pages/MatchNew';
import MatchShow from './pages/MatchShow';
import UserShow from './pages/UserShow';
import Edit from './pages/Edit';
import Top from './pages/Top';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';
import Auth from '../service/Auth';

// function requireAuth(nextState: RouterState, replaceState: RedirectFunction, callback?: Function): any {
//   if (!Auth.loggedIn()) {
//     replace({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

function requireAuth(nextState: RouterState, replaceState: any) {
  if (!Auth.authenticated) {
    replaceState({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export interface RouteParams {
  userId?: string;
  matchId?: string;
}

export default function() {
  "use strict";
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Top} />
      <Route path='login' component={Login} />
      <Route path='signup' component={SignUp} />
      <Route path='logout' component={Logout} />
      <Route path='match/new' component={MatchNew} onEnter={requireAuth} />
      <Route path='match/new/:userId' component={MatchNew} onEnter={requireAuth} />
      <Route path='match/:matchId' component={MatchShow} onEnter={requireAuth} />
      <Route path='edit' component={Edit} onEnter={requireAuth} />
      <Route path='user/:userId' component={UserShow} onEnter={requireAuth} />
    </Route>
  );
};
