import * as React from 'react';
import { strings } from '../resources/Strings';
import Auth from '../../service/Auth';
import { AbortController } from '../../utils/fetch';
import { Cell, Grid } from 'react-mdl';

export default class Logout extends React.Component<{}, {}> {
  public componentDidMount() {
    Auth.logout();
  }

  public render() {
    const resource = strings();
    return (<Grid><Cell col={12}>{resource.logoutMessage}</Cell></Grid>);
  }
}
