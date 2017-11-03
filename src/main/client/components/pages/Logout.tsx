import * as React from 'react';
import { strings } from '../resources/Strings';
import Auth from '../../service/Auth';
import { AbortController } from '../../utils/fetch';

export default class Logout extends React.Component<{}, {}> {
  public componentDidMount() {
    Auth.logout();
  }

  public render() {
    const resources = strings();
    return (
      <p>{resources.logoutMessage}</p>
    );
  }
}
