import { Request, Response } from 'express';

import ResponseCreator from './ResponseCreator';

import UserModel, { UserDocument, UserService } from '../models/UserModel';

export function show(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }

  if (!req.session.admin && !req.session.user) {
    return req.session.destroy(() => res.send({ admin: false, authenticated: false }).end());
  }

  return res.send({ admin: req.session.admin, authenticated: req.session.authenticated }).end();
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
    return res.status(400).type('json').send(ResponseCreator.auth(req.session)).end();
  }

  if (account === 'admin') {
    if (password === process.env.ADMIN_PASSWORD) {
      req.session.authenticated = true;
      req.session.admin = true;
      req.session.user = null;
      return res.status(200).type('json').send(ResponseCreator.auth(req.session)).end();
    }

    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    return res.status(200).type('json').send(ResponseCreator.auth(req.session)).end();
  }

  const hash = UserService.hash(account, password);

  const user = await UserService.findByOAuthAccount({ service: 'own', account: hash });
  if (!user) {
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = null;
    return res.status(403).send(ResponseCreator.auth(req.session)).end();
  }

  req.session.authenticated = true;
  req.session.admin = false;
  req.session.user = user;
  return res.status(200).type('json').send(ResponseCreator.auth(req.session)).end();
}

export function destroy(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }

  req.session.destroy(() => {
    res.status(200).end();
  });
}
