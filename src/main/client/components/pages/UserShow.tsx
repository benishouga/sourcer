import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import Matches from '../parts/Matches';
import Auth from '../../service/Auth';
import User from '../../service/User';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

export interface UserShowProps extends RouteComponentProps<RouteParams> {
  user?: UserResponse;
}

export interface UserShowState {
  user?: UserResponse;
}

export default class UserShow extends React.Component<UserShowProps, UserShowState> {
  constructor(props: UserShowProps) {
    super(props);
    this.state = {};
  }

  private abortController: AbortController = new AbortController();

  private async loadUser(account?: string) {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.setState({ user: undefined });
    const user = await User.select({ signal, account }).catch(error => console.log(error));
    if (user) {
      this.setState({ user });
    }
  }

  public async componentDidMount() {
    this.loadUser(this.props.match.params.account);
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public async componentWillUpdate(nextProps: UserShowProps) {
    if (Auth.status.authenticated && nextProps.match.params.account !== this.props.match.params.account) {
      this.abortController.abort();
      this.loadUser(nextProps.match.params.account);
    }
  }

  public render() {
    const resource = strings();

    const user = this.state.user;

    if (!user) {
      return (
        <Grid>
          <Cell col={12}>{resource.loading}</Cell>
        </Grid>
      );
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
