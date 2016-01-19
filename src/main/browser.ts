import { render } from "react-dom";
import Routes from './routes';

var routes = Routes();

// var initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

render(routes, document.getElementById("app"));
