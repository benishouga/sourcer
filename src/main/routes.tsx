import * as React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './components/pages/App';
import Top from './components/pages/Top';
import MatchNew from './components/pages/MatchNew';
import MatchShow from './components/pages/MatchShow';
import UserShow from './components/pages/UserShow';
import UserEdit from './components/pages/UserEdit';
import AiNew from './components/pages/AiNew';
import AiShow from './components/pages/AiShow';
import AiEdit from './components/pages/AiEdit';

export default function() {
  "use strict";
  return (
    <Route name="app" path="/" handler={App}>
      <Route name='matchNew' path='/match/new' handler={MatchNew} />
      <Route name='matchShow' path='/match/:matchId' handler={MatchShow} />
      <Route name='aiNew' path='/ai/new' handler={AiNew} />
      <Route name='userEdit' path='/edit' handler={UserEdit} />
      <Route name='userShow' path='/:userId' handler={UserShow} />
      <Route name='aiShow' path='/:userId/:aiId' handler={AiShow} />
      <Route name='aiEdit' path='/:userId/:aiId/edit' handler={AiEdit} />
      <DefaultRoute handler={Top} />
    </Route>
  );
};
