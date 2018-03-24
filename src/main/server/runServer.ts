import express from 'express';
import * as fs from 'fs';

import apis from './api/apis';

import * as bodyParser from 'body-parser';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';

import db from './db';
import Env from './Env';
import { Socket } from 'net';

export interface Closable {
  close(): Promise<void>;
}

export interface Option {
  enableRequestLog?: boolean;
}

export default async (option?: Option): Promise<Closable> => {
  // tslint:disable-next-line:variable-name
  const MongoStore = connectMongo(expressSession);

  if (!Env.instance.mongodbUri) {
    throw new Error('env.MONGODB_URI is not defined.');
  }

  const mongooseConnection = await db(Env.instance.mongodbUri);
  const app = express();

  if (option && option.enableRequestLog) {
    app.use((req, _res, next) => {
      console.log('--------------------------');
      console.log(req.method, req.url);
      console.log(req.headers);
      return next();
    });
  }

  app.use(express.static('docs'));

  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use(
    expressSession({
      secret: Env.instance.sessionSecret || 'seecreeeeet',
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

  const port = Env.instance.port || 5000;
  console.log('listening...' + port);
  const server = app.listen(port);
  const sockets: Socket[] = [];
  server.on('connection', socket => sockets.push(socket));
  return {
    close: () => {
      console.log(`sockets: ${sockets.length}`);
      sockets.forEach(socket => socket.destroy());
      return Promise.all([
        new Promise(resolve => server.close(resolve)).then(() => console.log('server closed')),
        mongooseConnection.close().then(() => console.log('mongoose closed'))
      ]).then(() => {
        console.log('all closed');
        process.exit();
      });
    }
  };
};
