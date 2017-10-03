import { Request, Response } from 'express';

import ResponseCreator from './ResponseCreator';

import UserModel, { UserDocument, UserService } from '../models/UserModel';

import config from '../config';

export function show(req: Request, res: Response) {
  if (req.session) {
    res.send({ authenticated: req.session.authenticated });
  }
}

export function create(req: Request, res: Response) {
  const account = req.body.account;
  const password = req.body.password;
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }

  if (!account || !password) {
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    res.status(400).type('json').send(ResponseCreator.auth(req.session));
    return;
  }

  if (account === 'admin') {
    if (password === config.app.admin) {
      req.session.authenticated = true;
      req.session.admin = true;
      req.session.user = null;
      res.status(200).type('json').send(ResponseCreator.auth(req.session));
    } else {
      req.session.authenticated = false;
      req.session.admin = false;
      req.session.user = null;
      res.status(200).type('json').send(ResponseCreator.auth(req.session));
    }
    return;
  }

  const hash = UserService.hash(account, password);

  UserService.findByOAuthAccount({ service: 'own', account: hash }).then((user: UserDocument) => {
    if (!user) {
      return Promise.reject({});
    }
    return Promise.resolve(user);
  }, () => {
    return Promise.reject({});
  }).then((user) => {
    if (!req.session) {
      res.status(400);
      res.end('Bad Request');
      return;
    }
    req.session.authenticated = true;
    req.session.admin = false;
    req.session.user = user;
    return res.status(200).type('json').send(ResponseCreator.auth(req.session));
  }, (err: any) => {
    if (!req.session) {
      res.status(400);
      res.end('Bad Request');
      return;
    }
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    res.status(403).send(ResponseCreator.auth(req.session));
  });
}

export function destroy(req: Request, res: Response) {
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }
  req.session.destroy(() => {
    if (!req.session) {
      res.status(400);
      res.end('Bad Request');
      return;
    }
    res.send(ResponseCreator.auth(req.session));
  });
}
