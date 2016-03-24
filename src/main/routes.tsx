import * as React from 'react';
import {IndexRoute, Router, Route} from 'react-router'
import App from './components/pages/App';
import MatchNew from './components/pages/MatchNew';
import MatchShow from './components/pages/MatchShow';
import UserShow from './components/pages/UserShow';
import Edit from './components/pages/Edit';
import Top from './components/pages/Top';
import Login from './components/pages/Login';
import Logout from './components/pages/Logout';
import SignUp from './components/pages/SignUp';
import Auth from './service/Auth';

// function requireAuth(nextState: RouterState, replaceState: RedirectFunction, callback?: Function): any {
//   if (!Auth.loggedIn()) {
//     replace({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

function requireAuth() { }

export default function() {
  "use strict";
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Top} />
      <Route path='login' component={Login} />
      <Route path='signup' component={SignUp} />
      <Route path='logout' component={Logout} />
      <Route path='match/new' component={MatchNew} />
      <Route path='match/new/:userId' component={MatchNew} />
      <Route path='match/:matchId' component={MatchShow} />
      <Route path='edit' component={Edit} />
      <Route path='user/:userId' component={UserShow} onEnter={requireAuth} />
    </Route>
  );
};
