import * as React from 'react';
import { AbortController } from '../../utils/fetch';
import { UserResponse } from '../../../dts/UserResponse';
import { GameDump } from '../../../core/Dump';
import User from '../../service/User';
import Auth from '../../service/Auth';
import Match from '../../service/Match';

export function useUser(account?: string) {
  const [user, setUser] = React.useState<UserResponse | null>(null);
  React.useEffect(
    () => {
      if (!Auth.status.authenticated) {
        return;
      }
      const abortController = new AbortController();
      const signal = abortController.signal;
      setUser(null);
      User.select({ signal, account })
        .then(res => setUser(res))
        .catch(error => console.log(error));
      return () => abortController && abortController.abort();
    },
    [account]
  );
  return user;
}

export function useRecentUsers() {
  const [users, setUsers] = React.useState<UserResponse[] | null>(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    User.recent({ signal })
      .then(res => setUsers(res))
      .catch(error => console.log(error));
    return () => abortController.abort();
  }, []);

  return users;
}

export function useMatchDump(matchId?: string) {
  const [gameDump, setGameDump] = React.useState<GameDump | null>(null);
  React.useEffect(
    () => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      if (!matchId) {
        console.log(`matchId: ${matchId}`);
        return;
      }
      Match.replay({ signal, matchId })
        .then(res => setGameDump(res))
        .catch(error => console.log(error));

      return () => {
        abortController.abort();
      };
    },
    [matchId]
  );
  return gameDump;
}