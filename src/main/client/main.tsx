import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './components/routes';
import Auth from './service/Auth';
import Config from './service/Config';

(async () => {
  await Promise.all([Auth.login(), Config.load()]);
  render(<Router>{routes}</Router>, document.getElementById('app'));
})();
