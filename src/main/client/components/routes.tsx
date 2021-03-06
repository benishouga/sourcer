import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
import Official from './pages/Official';
import Config from '../service/Config';

export interface RouteParams {
  account?: string;
  matchId?: string;
}

const PublishGamesRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.status.authenticated || Config.values.publishGames ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

const RequireAuthRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      Auth.status.authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }
  />
);

const RequireAdminRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      Auth.status.admin ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/logout', state: { from: props.location } }} />
      )
    }
  />
);

const routes = (
  <App>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/logout" component={Logout} />
      <RequireAuthRoute path="/match/new/:account" component={MatchNew} />
      <PublishGamesRoute path="/match/:matchId" component={MatchShow} />
      <RequireAuthRoute path="/edit" component={Edit} />
      <RequireAuthRoute path="/user/:account" component={UserShow} />
      <RequireAdminRoute path="/official" component={Official} />
      <Route component={Top} />
    </Switch>
  </App>
);

export default routes;
