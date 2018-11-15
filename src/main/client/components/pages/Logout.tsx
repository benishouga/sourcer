import * as React from 'react';
import { strings } from '../resources/Strings';
import Auth from '../../service/Auth';
import { Cell, Grid } from 'react-mdl';

export default function Logout() {
  React.useEffect(() => {
    Auth.logout();
  }, []);

  const resource = strings();
  return (
    <Grid>
      <Cell col={12}>{resource.logoutMessage}</Cell>
    </Grid>
  );
}
