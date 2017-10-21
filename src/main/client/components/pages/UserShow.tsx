import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { RequestPromise } from '../../utils/fetch';
import Matches from '../parts/Matches';
import Auth from '../../service/Auth';
import User from '../../service/User';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface UserShowProps extends RouteComponentProps<RouteParams> {
  user?: UserResponse;
}

interface UserShowStats {
  user?: UserResponse;
}

export default class UserShow extends React.Component<UserShowProps, UserShowStats> {

  constructor() {
    super();
    this.state = {};
  }

  private request: RequestPromise<UserResponse>;

  public componentDidMount() {
    if (Auth.authResponse.authenticated) {
      this.request = User.select(this.props.match.params.account);
      this.request.then((user) => {
        this.setState({ user });
      });
    }
  }

  public componentWillUnmount() {
    if (this.request) {
      this.request.abort();
    }
  }

  public componentWillUpdate(nextProps: UserShowProps, nextState: UserShowStats) {
    if (Auth.authResponse.authenticated && nextProps.match.params.account !== this.props.match.params.account) {
      if (this.request) {
        this.request.abort();
      }
      this.request = User.select(nextProps.match.params.account);
      this.setState({ user: undefined });
      this.request.then((user) => {
        this.setState({ user });
      });
    }
  }

  public render() {
    const resource = strings();

    const account = this.props.match.params.account;
    const user = this.state.user;

    if (!user) {
      return (<p>Loading...</p>);
    }

    return (
      <Grid>
        <Cell col={4}>
          <ProfileCard user={user} showFight />
        </Cell>
        <Cell col={8}>
          <Matches matches={user.matches} />
        </Cell>
      </Grid>
    );
  }
}
