import React, { useState, useEffect } from 'react';
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

const UserShow: React.FC<UserShowProps> = (props) => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);

  const abortController = new AbortController();

  const loadUser = async (account?: string) => {
    const signal = abortController.signal;
    setUser(undefined);
    const user = await User.select({ signal, account }).catch(error => console.log(error));
    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    loadUser(props.match.params.account);

    return () => {
      abortController.abort();
    };
  }, [props.match.params.account]);

  useEffect(() => {
    if (Auth.status.authenticated && props.match.params.account !== props.match.params.account) {
      abortController.abort();
      loadUser(props.match.params.account);
    }
  }, [props.match.params.account]);

  const resource = strings();

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
};

export default UserShow;
