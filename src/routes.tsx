import * as React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './views/screens/App';
import Aaa from './views/screens/Aaa';
import Top from './views/screens/Top';

export default function() {
  return (
    <Route name="app" path="/" handler={App}>
      <Route name="aaa" handler={Aaa} />
      <DefaultRoute handler={Top} />
    </Route>
  );
};
