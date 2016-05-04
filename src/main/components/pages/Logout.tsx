import * as React from 'react';
import {strings} from '../resources/Strings';
import Auth from '../../service/Auth';

export default class Logout extends React.Component<{}, {}> {
  componentDidMount() {
    Auth.logout();
  }

  render() {
    let resources = strings();
    return (
      <p>{resources.logout_message}</p>
    );
  }
}
