import * as express from 'express';
import * as fs from 'fs';
import * as Handlebars  from  'handlebars';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import * as history from 'history';

import Routes from './routes';
import apis from './api/apis';

import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

var routes = Routes();
var app = express();
var template = Handlebars.compile(fs.readFileSync('./index.hbs').toString());

app.use(express.static('dist'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'seecreeeeet' }));

apis(app);

app.use(function(req, res, next) {
  const location = history.createLocation(req.url);

  match({ routes, location }, (error: any, redirectLocation: any, renderProps: any) => {
    var html = renderToString(<RouterContext {...renderProps} />);
    return res.send(template({ markup: html }));
  });
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
