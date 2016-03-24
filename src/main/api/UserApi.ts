import { Request, Response } from 'express';
import User, {UserDocument} from '../models/User';
import Validator from '../utils/Validator';

export function show(req: Request, res: Response, next: Function) {
  let userId: string = null;
  if (!req.body.userId) {
    let user = req.session['account'] as UserDocument;
    userId = user.account;
  }
  User.loadWithMatchees(userId).then((user) => {
    if (user) {
      return res.status(404).send('');
    } else {
      return res.status(200).send({
        account: user.account,
        source: user.source,
        matches: user.matches
      });
    }
  }, () => {
    return res.status(404).send('');
  });
}

export function create(req: Request, res: Response, next: Function) {
  let userId: string = Validator.validateUserId(req.body.userId);
  let password: string = Validator.validatePassword(req.body.password);

  User.loadByAccount(userId).then((user) => {
    if (user) {
      return res.status(409).send('');
    } else {
      User.createFromAccount(userId, 'own', User.hash(userId, password)).then((user) => {
        req.session['authenticated'] = true;
        req.session['account'] = user;
        res.status(200).send({ authenticated: true });
      });
    }
  });
}

export function update(req: Request, res: Response, next: Function) {
  var userId: string = req.param('userId');
  console.log('userId', userId);
}
