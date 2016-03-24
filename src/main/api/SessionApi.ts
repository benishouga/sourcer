import { Request, Response } from 'express';

import User, {UserDocument} from '../models/User';

export function show(req: Request, res: Response, next: Function) {
  "use strict";
  res.send({ authenticated: req.session['authenticated'] });
}

export function create(req: Request, res: Response, next: Function) {
  "use strict";
  let userId = req.body.userId;
  let password = req.body.password;
  if (!userId || !password) {
    req.session['authenticated'] = false;
    res.send({ authenticated: false });
    return;
  }
  let hash = User.hash(userId, password);

  User.findByOAuthAccount({ service: 'own', account: hash }).then((user: UserDocument) => {
    if (!user) {
      return Promise.reject({});
    }
    return Promise.resolve(user);
  }, () => {
    return Promise.reject({});
  }).then((user) => {
    req.session['authenticated'] = true;
    req.session['account'] = user;
    res.status(200).send({ authenticated: true });
  }, (err: any) => {
    req.session['authenticated'] = false;
    req.session['account'] = null;
    res.status(403).send({ authenticated: false });
  });
}

export function destroy(req: Request, res: Response, next: Function) {
  "use strict";
  req.session.destroy(() => {
    res.send({ authenticated: false });
  });
}
