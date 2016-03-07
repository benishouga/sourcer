import * as React from 'react'
import {render} from 'react-dom'
import {browserHistory, Router} from 'react-router'
import Routes from './routes';

var routes = Routes();
render(<Router history={browserHistory}>{routes}</Router>, document.getElementById("app"));
