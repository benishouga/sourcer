import * as React from 'react';
import { strings } from '../resources/Strings';
import Auth from '../../service/Auth';
import { Cell, Grid } from 'react-mdl';

export default class Logout extends React.Component<{}, {}> {
  public componentDidMount() {
    Auth.logout();
  }

  public render() {
    const resource = strings();
    return (
      <Grid data-test="page-logout">
        <Cell col={12} data-test="logoutMessage">
          {resource.logoutMessage}
        </Cell>
      </Grid>
    );
  }
}
