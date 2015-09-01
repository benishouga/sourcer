import * as React from 'react';
import * as Router from 'react-router';
import Routes from './routes';

var routes = Routes();

var initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(React.createElement(Handler, {"datas": initialData}), document.getElementById("app"));
});
