import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import Auth from '../../service/Auth';
import User from '../../service/User';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import ProfileCard from '../parts/ProfileCard';
import Config from '../../service/Config';

interface TopState {
  user?: UserResponse;
}

export default class Top extends React.Component<{}, TopState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }
  private abortController: AbortController;

  public async componentDidMount() {
    this.abortController = new AbortController();
    if (Auth.status.authenticated) {
      const signal = this.abortController.signal;
      const user = await User.select({ signal }).catch(error => console.log(error));
      if (user) { this.setState({ user }); }
    }
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    const resource = strings();
    const configStrings = Config.strings();
    if (!Auth.status.authenticated) {
      const topMessage = configStrings.topMessage ? <div dangerouslySetInnerHTML={{ __html: configStrings.topMessage }}></div> : null;

      return (
        <Grid>
          <Cell col={12}>
            <h2>Sourcer</h2>
            <p>{resource.serviceDescription}<br />
              {resource.serviceBenefit}</p>
            {topMessage}
          </Cell>
        </Grid>
      );
    }

    if (Auth.status.admin) {
      return <Redirect to="/official" />;
    }

    const user = this.state.user;

    if (!user) {
      return (<Grid><Cell col={12}>{resource.loading}</Cell></Grid>);
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
