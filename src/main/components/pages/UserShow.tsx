import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {Grid, Cell} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import Matches from '../parts/Matches';
import Auth from '../../service/Auth';
import User from '../../service/User';
import {RouteParams} from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface UserShowProps extends RouteComponentProps<RouteParams, {}> {
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

  request: RequestPromise<UserResponse>;

  componentDidMount() {
    if (Auth.authenticated) {
      this.request = User.select(this.props.params.account);
      this.request.then((user) => {
        this.setState({
          user: user
        });
      });
    }
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  componentWillUpdate(nextProps: UserShowProps, nextState: UserShowStats) {
    if (Auth.authenticated && nextProps.params.account !== this.props.params.account) {
      this.request && this.request.abort();
      this.request = User.select(nextProps.params.account);
      this.setState({ user: null });
      this.request.then((user) => {
        this.setState({
          user: user
        });
      });
    }
  }

  render() {
    let resource = strings();

    let account = this.props.params.account;
    let user = this.state.user;

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
