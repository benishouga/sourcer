import { Request, Response } from 'express';
import UserModel, { UserDocument, UserService } from '../models/UserModel';
import Validator from '../utils/Validator';
import config from '../config';
import ResponseCreator from './ResponseCreator';

export function show(req: Request, res: Response) {
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }

  let account: string = req.params.id;
  if (!account) {
    const user = req.session.user as UserDocument;
    if (!user) {
      return res.status(403).send('');
    }
    account = user.account;
  }
  UserService.loadWithMatchees(account).then((user) => {
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
    const account = Validator.validateAccount(req.body.account);
    const name = Validator.validateName(req.body.name);
    const password = Validator.validatePassword(req.body.password);
    const members = Validator.validateMembers(req.body.members);

    UserService.loadByAccount(account).then((userExist) => {
      if (userExist) {
        return res.status(409).send('');
      } else {
        UserService.createFromAccount(account, name, members, 'own', UserService.hash(account, password)).then((user) => {
          if (!req.session) {
            res.status(400);
            res.end('Bad Request');
            return;
          }
          req.session.authenticated = true;
          req.session.user = user;
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
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }
  const sessionUser = req.session.user as UserDocument;
  if (!sessionUser) {
    return res.status(403).send('');
  }
  const account = sessionUser.account;
  UserService.loadWithMatchees(account).then((user) => {
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
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }
  const isAdmin = req.session.admin as boolean;
  if (!isAdmin) {
    return res.status(403).send('');
  }

  UserService.find({}).exec().then((users) => {
    return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user)));
  });
}

export function recent(req: Request, res: Response) {
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }
  const sessionUser = req.session.user as UserDocument;
  if (!sessionUser) {
    return res.status(403).send('');
  }

  UserService.recent(sessionUser.account).then((users) => {
    return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user)));
  });
}
