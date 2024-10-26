import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';
import { MatchResponse } from '../../../dts/MatchResponse';

import Auth from '../../service/Auth';
import User from '../../service/User';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import ProfileCard from '../parts/ProfileCard';
import Config from '../../service/Config';
import PublishGames from '../parts/PublishGames';
import Match from '../../service/Match';

const Top: React.FC = () => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const [matches, setMatches] = useState<MatchResponse[] | undefined>(undefined);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      if (Auth.status.authenticated) {
        const signal = abortController.signal;
        const user = await User.select({ signal }).catch(error => console.log(error));
        if (user) {
          setUser(user);
        }
      }
    };

    const fetchMatches = async () => {
      if (!Auth.status.authenticated && Config.values.publishGames) {
        const signal = abortController.signal;
        const matches = await Match.matches({ signal }).catch(error => console.log(error));
        if (matches) {
          setMatches(matches);
        }
      }
    };

    fetchUser();
    fetchMatches();

    return () => {
      abortController.abort();
    };
  }, []);

  const resource = strings();
  const configStrings = Config.strings();

  if (!Auth.status.authenticated) {
    const topMessage = configStrings.topMessage ? (
      <div dangerouslySetInnerHTML={{ __html: configStrings.topMessage }} />
    ) : null;
    let matchesElement: JSX.Element | null = null;
    if (matches && Config.values.publishGames) {
      matchesElement = <PublishGames matches={matches} />;
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
          {matchesElement}
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
};

export default Top;
