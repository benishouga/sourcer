import * as React from 'react';
import Auth from '../../service/Auth';

export default class Logout extends React.Component<{}, {}> {
  componentDidMount() {
    Auth.logout();
  }

  render() {
    return (
      <p>You have been signed out.</p>
    );
  }
}
