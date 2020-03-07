import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import Config from '../../service/Config';
import { useUser } from '../hooks/api-hooks';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import ProfileCard from '../parts/ProfileCard';
import RecentPublishMatches from '../parts/RecentPublishMatches';

export default function Top() {
  const user = useUser();

  const resource = strings();
  const configStrings = Config.strings();
  if (!Auth.status.authenticated) {
    const topMessage = configStrings.topMessage ? (
      <div dangerouslySetInnerHTML={{ __html: configStrings.topMessage }} />
    ) : null;

    let matches: JSX.Element | null = null;
    if (Config.values.publishGames) {
      matches = <RecentPublishMatches />;
    }

    return (
      <Grid>
        <Cell col={12}>
          <h2>Sourcer</h2>
          <p>
            {resource.serviceDescription}
            <br />
            {resource.serviceBenefit}
          </p>
          {topMessage}
          {matches}
        </Cell>
      </Grid>
    );
  }

  if (Auth.status.admin) {
    return <Redirect to="/official" />;
  }

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
        <ProfileCard user={user} showWriteCode={true} />
      </Cell>
      <Cell col={8}>
        <Matches matches={user.matches} />
        <RecentUpdatedUsers />
      </Cell>
    </Grid>
  );
}
