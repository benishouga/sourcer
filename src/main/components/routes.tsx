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
import Admin from './pages/Admin';

function requireAuth(nextState: RouterState, replaceState: any) {
  if (!Auth.authResponse.authenticated) {
    replaceState({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireAdmin(nextState: RouterState, replaceState: any) {
  if (!Auth.authResponse.admin) {
    replaceState({
      pathname: '/logout',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export interface RouteParams {
  account?: string;
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
      <Route path='match/new/:account' component={MatchNew} onEnter={requireAuth} />
      <Route path='match/:matchId' component={MatchShow} onEnter={requireAuth} />
      <Route path='edit' component={Edit} onEnter={requireAuth} />
      <Route path='user/:account' component={UserShow} onEnter={requireAuth} />
      <Route path='official' component={Admin} onEnter={requireAdmin} />
    </Route>
  );
};
