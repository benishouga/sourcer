import express, { RequestHandler } from 'express';
import * as path from 'path';

import apis from './api/apis';

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import { MongoClient } from 'mongodb';

import db from './db';
import Env from './Env';

(async () => {
  const mongoDbUri = Env.mongodbUri;
  if (!mongoDbUri) {
    throw new Error('env.MONGODB_URI is not defined.');
  }

  const mongooseConnection = await db(mongoDbUri);
  const sessionClient = (mongooseConnection.getClient() as unknown) as MongoClient;
  const sessionStore = connectMongo.create({
    client: sessionClient,
    collectionName: 'session'
  });
  const docsDir = path.resolve(__dirname, '../../..', 'docs');
  const app = express();

  app.use((req, _res, next) => {
    console.log('--------------------------');
    console.log(req.method, req.url);
    console.log(req.headers);
    return next();
  });

  app.use(express.static(docsDir));

  const cookieParserMiddleware = cookieParser() as RequestHandler;
  const jsonParser = bodyParser.json() as RequestHandler;

  app.use(cookieParserMiddleware);
  app.use(jsonParser);

  app.use(
    expressSession({
      secret: Env.sessionSecret || 'seecreeeeet',
      resave: false,
      saveUninitialized: true,
      store: sessionStore
    })
  );

  apis(app);

  app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  const port = Env.port || 5000;
  console.log(`http://localhost:${port}`);
  app.listen(port);
})();
