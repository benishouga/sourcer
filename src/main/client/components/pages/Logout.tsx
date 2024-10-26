import React, { useEffect } from 'react';
import { strings } from '../resources/Strings';
import Auth from '../../service/Auth';
import { Cell, Grid } from 'react-mdl';

const Logout: React.FC = () => {
  useEffect(() => {
    Auth.logout();
  }, []);

  const resource = strings();
  return (
    <Grid>
      <Cell col={12}>{resource.logoutMessage}</Cell>
    </Grid>
  );
};

export default Logout;
