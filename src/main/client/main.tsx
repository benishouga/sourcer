import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './components/routes';
import Auth from './service/Auth';

Auth.login().then(() => {
  render(<Router>{routes}</Router>, document.getElementById('app'));
});
