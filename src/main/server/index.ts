import * as express from 'express';
import * as fs from 'fs';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'react-router-dom';
import * as history from 'history';

import apis from './api/apis';

import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as connectMongo from 'connect-mongo';

import db from './db';

// tslint:disable-next-line:variable-name
const MongoStore = connectMongo(session);

const mongoDbUri = process.env.MONGODB_URI;
if (!mongoDbUri) {
  throw new Error('env.MONGODB_URI is not defined.');
}

db(mongoDbUri).then((mongooseConnection) => {
  const app = express();

  app.use((req, res, next) => {
    console.log('--------------------------');
    console.log(req.method, req.url);
    console.log(req.headers);
    return next();
  });

  app.use(express.static('dist'));

  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'seecreeeeet',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection, collection: 'session' })
  }));

  apis(app);

  app.use((req, res) => {
    fs.readFile(__dirname + '/index.html', (error, text) => {
      console.error(error);
      if (error) {
        return res.status(503).end();
      }
      res.end(text);
    });
  });

  const port = process.env.PORT || 5000;
  console.log('listening...' + port);
  app.listen(port);
}).catch((error) => {
  console.log(error);
});
