import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import Auth from '../../service/Auth';
import User from '../../service/User';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import ProfileCard from '../parts/ProfileCard';

interface TopStats {
  user?: UserResponse;
}

export default class Top extends React.Component<{}, TopStats> {
  constructor() {
    super();
    this.state = {};
  }
  private abortController: AbortController;

  public async componentDidMount() {
    this.abortController = new AbortController();
    if (Auth.status.authenticated) {
      const signal = this.abortController.signal;
      const user = await User.select({ signal });
      this.setState({ user });
    }
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    const resource = strings();
    if (!Auth.status.authenticated) {
      return (
        <div>
          <h2>Sourcer</h2>
          <p>{resource.serviceDescription}<br />
            {resource.serviceBenefit}</p>
        </div>
      );
    }

    const user = this.state.user;

    if (!user) {
      return (<p>{resource.loading}</p>);
    }

    return (
      <Grid>
        <Cell col={4}>
          <ProfileCard user={user} showWriteCode={true} />
        </Cell>
        <Cell col={8}>
          <Matches matches={user.matches} />
          <RecentUpdatedUsers />
        </Cell>
      </Grid>
    );
  }
}
