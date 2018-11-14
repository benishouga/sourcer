import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import { RouteParams } from '../routes';
import { useUser } from '../hooks/api-hooks';
import Matches from '../parts/Matches';
import ProfileCard from '../parts/ProfileCard';

export type UserShowProps = RouteComponentProps<RouteParams>;

export interface UserShowState {
  user?: UserResponse;
}

export default function UserShow(props: UserShowProps) {
  const user = useUser(props.match.params.account);

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
}
