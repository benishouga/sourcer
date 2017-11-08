import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './components/routes';
import Auth from './service/Auth';
import Config from './service/Config';

Promise.all([Auth.login(), Config.load()]).then(() => {
  render(<Router>{routes}</Router>, document.getElementById('app'));
});
