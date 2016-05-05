import * as React from 'react';
import {Link} from 'react-router';
import {Grid, Cell} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import Auth from '../../service/Auth';
import User from '../../service/User';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import ProfileCard from '../parts/ProfileCard';

interface TopProps extends React.Props<Top> {
}

interface TopStats {
  user?: UserResponse;
}

export default class Top extends React.Component<TopProps, TopStats> {
  constructor() {
    super();
    this.state = {};
  }
  request: RequestPromise<UserResponse>;

  componentDidMount() {
    if (Auth.info.authenticated) {
      this.request = User.select();
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

  render() {
    let resource = strings();
    if (!Auth.info.authenticated) {
      return (
        <div>
          <h2>Sourcer</h2>
          <p>{resource.service_description}<br />
            {resource.service_benefit}</p>
        </div>
      );
    }

    let user = this.state.user;

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
