import { Request, Response } from 'express';
import User, {UserDocument} from '../models/User';
import Validator from '../utils/Validator';
import config from '../config';
import ResponseCreator from './ResponseCreator';

export function show(req: Request, res: Response) {
  let account: string = req.params['id'];
  if (!account) {
    let user = req.session['user'] as UserDocument;
    if (!user) {
      return res.status(403).send('');
    }
    account = user.account;
  }
  User.loadWithMatchees(account).then((user) => {
    if (!user) {
      return res.status(404).send('');
    } else {
      return res.status(200).type('json').send(ResponseCreator.user(user));
    }
  }, () => {
    return res.status(404).send('');
  });
}

export function create(req: Request, res: Response) {
  if (req.body.appKey !== config.app.key) {
    return res.status(403).send('');
  }
  try {
    let account = Validator.validateAccount(req.body.account);
    let name = Validator.validateName(req.body.name);
    let password = Validator.validatePassword(req.body.password);
    let members = Validator.validateMembers(req.body.members);

    User.loadByAccount(account).then((user) => {
      if (user) {
        return res.status(409).send('');
      } else {
        User.createFromAccount(account, name, members, 'own', User.hash(account, password)).then((user) => {
          req.session['authenticated'] = true;
          req.session['user'] = user;
          return res.status(201).type('json').send({});
        }).catch((error) => {
          console.log('create account failed', error);
          return res.status(503).type('json').send({});
        });
      }
    });

  } catch (error) {
    return res.status(400).send('');
  }
}

export function update(req: Request, res: Response) {
  let user = req.session['user'] as UserDocument;
  if (!user) {
    return res.status(403).send('');
  }
  let account = user.account;
  User.loadWithMatchees(account).then((user) => {
    if (!user) {
      return res.status(404).send('');
    } else {
      user.source = req.body.source;
      user.updated = new Date();
      user.save((err) => {
        if (err) {
          return res.status(503).send('User update failed...');
        }
        return res.status(200).type('json').send(ResponseCreator.user(user));
      });
    }
  }, () => {
    return res.status(404).send('');
  });
}

export function all(req: Request, res: Response) {
  let user = req.session['admin'] as boolean;
  if (!user) {
    return res.status(403).send('');
  }

  User.find({}).exec().then((users) => {
    return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user)));
  });
}

export function recent(req: Request, res: Response) {
  let user = req.session['user'] as UserDocument;
  if (!user) {
    return res.status(403).send('');
  }

  User.recent(user.account).then((users) => {
    return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user)));
  });
}
