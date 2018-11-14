import * as React from 'react';
import { AbortController } from '../../utils/fetch';
import User from '../../service/User';
import { UserResponse } from '../../../dts/UserResponse';
import Auth from '../../service/Auth';

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
