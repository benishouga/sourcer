import { Request, Response } from 'express';

import ResponseCreator from './ResponseCreator';

import UserModel, { UserDocument, UserService } from '../models/UserModel';

import config from '../config';

export function show(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }
  return res.send({ authenticated: req.session.authenticated }).end();
}

export async function create(req: Request, res: Response) {
  const account = req.body.account;
  const password = req.body.password;

  if (!req.session) {
    return res.status(400).end('Bad Request');
  }

  if (!account || !password) {
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    return res.status(400).type('json').end(ResponseCreator.auth(req.session));
  }

  if (account === 'admin') {
    if (password === config.app.admin) {
      req.session.authenticated = true;
      req.session.admin = true;
      req.session.user = null;
      return res.status(200).type('json').end(ResponseCreator.auth(req.session));
    }

    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    return res.status(200).type('json').end(ResponseCreator.auth(req.session));
  }

  const hash = UserService.hash(account, password);

  const user = await UserService.findByOAuthAccount({ service: 'own', account: hash });
  if (!user) {
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    return res.status(403).end(ResponseCreator.auth(req.session));
  }

  req.session.authenticated = true;
  req.session.admin = false;
  req.session.user = user;
  return res.status(200).type('json').end(ResponseCreator.auth(req.session));
}

export function destroy(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }

  req.session.destroy(() => {
    if (!req.session) {
      return res.status(400).end('Bad Request');
    }

    res.send(ResponseCreator.auth(req.session));
  });
}
