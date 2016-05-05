import { Request, Response } from 'express';

import User, {UserDocument} from '../models/User';

import config from '../config';

export function show(req: Request, res: Response, next: Function) {
  "use strict";
  res.send({ authenticated: req.session['authenticated'] });
}

export function create(req: Request, res: Response, next: Function) {
  "use strict";
  let account = req.body.account;
  let password = req.body.password;
  if (!account || !password) {
    req.session['authenticated'] = false;
    req.session['admin'] = false;
    req.session['user'] = null;
    res.status(400).type('json').send({ authenticated: false, admin: false });
    return;
  }

  if (account === 'admin') {
    if (password === config.app.admin) {
      req.session['authenticated'] = true;
      req.session['admin'] = true;
      req.session['user'] = null;
      res.status(200).type('json').send({ authenticated: true, admin: true });
    } else {
      req.session['authenticated'] = false;
      req.session['admin'] = false;
      req.session['user'] = null;
      res.status(200).type('json').send({ authenticated: false, admin: false });
    }
    return;
  }

  let hash = User.hash(account, password);

  User.findByOAuthAccount({ service: 'own', account: hash }).then((user: UserDocument) => {
    if (!user) {
      return Promise.reject({});
    }
    return Promise.resolve(user);
  }, () => {
    return Promise.reject({});
  }).then((user) => {
    req.session['authenticated'] = true;
    req.session['admin'] = false;
    req.session['user'] = user;
    return res.status(200).type('json').send({ authenticated: true, admin: false });
  }, (err: any) => {
    req.session['authenticated'] = false;
    req.session['admin'] = false;
    req.session['user'] = null;
    res.status(403).send({ authenticated: false, admin: false });
  });
}

export function destroy(req: Request, res: Response, next: Function) {
  "use strict";
  req.session.destroy(() => {
    res.send({ authenticated: false, admin: false });
  });
}
