import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
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

  private abortController: AbortController;

  private async loadUser(account?: string) {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.setState({ user: undefined });
    const user = await User.select({ signal, account }).catch(error => console.log(error));
    if (user) { this.setState({ user }); }
  }

  public async componentDidMount() {
    this.loadUser(this.props.match.params.account);
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public async componentWillUpdate(nextProps: UserShowProps, nextState: UserShowStats) {
    if (Auth.status.authenticated && nextProps.match.params.account !== this.props.match.params.account) {
      this.abortController.abort();
      this.loadUser(nextProps.match.params.account);
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
