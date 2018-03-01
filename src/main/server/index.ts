import express from 'express';
import * as fs from 'fs';

import apis from './api/apis';

import * as bodyParser from 'body-parser';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';

import db from './db';
import Env from './Env';

(async () => {
  // tslint:disable-next-line:variable-name
  const MongoStore = connectMongo(expressSession);

  const mongoDbUri = Env.mongodbUri;
  if (!mongoDbUri) {
    throw new Error('env.MONGODB_URI is not defined.');
  }

  const mongooseConnection = await db(mongoDbUri);
  const app = express();

  app.use((req, _res, next) => {
    console.log('--------------------------');
    console.log(req.method, req.url);
    console.log(req.headers);
    return next();
  });

  app.use(express.static('docs'));

  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use(
    expressSession({
      secret: Env.sessionSecret || 'seecreeeeet',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection, collection: 'session' })
    })
  );

  apis(app);

  app.use((_req, res) => {
    fs.readFile(__dirname + '/index.html', (error, text) => {
      if (error) {
        return res.status(503).end();
      }
      res.end(text);
    });
  });

  const port = Env.port || 5000;
  console.log('listening...' + port);
  app.listen(port);
})();
