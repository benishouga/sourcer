import { Request, Response } from 'express';
import UserModel, { UserDocument, UserService } from '../models/UserModel';
import Validator from '../utils/Validator';
import ResponseCreator from './ResponseCreator';
import Normalizer from '../utils/Normalizer';
import Env from '../Env';

export async function show(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).send('Bad Request').end();
  }

  let account: string = req.params.id;
  if (!account) {
    const sessionUser = req.session.user as UserDocument;
    if (!sessionUser) {
      return res.status(403).send('').end();
    }
    account = sessionUser.account;
  }

  const user = await UserService.loadWithMatchees(account);
  if (!user) {
    return res.status(404).send('').end();
  }

  return res.status(200).type('json').send(ResponseCreator.user(user)).end();
}

export async function create(req: Request, res: Response) {
  if (!!Env.appKey && req.body.appKey !== Env.appKey) {
    return res.status(403).end();
  }

  const account = Normalizer.normalize(req.body.account);
  const name = Normalizer.normalize(req.body.name);
  const password = Normalizer.normalize(req.body.password);
  const members = Normalizer.normalizeArray(req.body.members);

  const validationResults: ResourceId[] = [];
  Validator.validateAccount(validationResults, account);
  Validator.validateName(validationResults, name);
  Validator.validatePassword(validationResults, password);

  if (validationResults.length) {
    return res.status(400).send(ResponseCreator.error(validationResults)).end();
  }

  const userExist = await UserService.loadByAccount(account);

  if (userExist) {
    return res.status(409).send(ResponseCreator.error(['invalidAccountExist'])).end();
  }

  const user = await UserService.createFromAccount(account, name, members, 'own', UserService.hash(account, password));
  if (!req.session) {
    return res.status(503).send('Internal Server Error').end();
  }

  req.session.admin = false;
  req.session.authenticated = true;
  req.session.user = user;
  return res.status(201).type('json').end();
}

export async function update(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }

  const sessionUser = req.session.user as UserDocument;
  if (!sessionUser) {
    return res.status(403).end('');
  }

  const account = sessionUser.account;
  const user = await UserService.loadWithMatchees(account);
  if (!user) {
    return res.status(404).end('');
  }

  user.source = req.body.source;
  user.updated = new Date();
  user.save();
  return res.status(200).type('json').send(ResponseCreator.user(user)).end();
}

export async function all(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }
  const isAdmin = req.session.admin as boolean;
  if (!isAdmin) {
    return res.status(403).end('');
  }

  const users = await UserService.find({}).sort({ updated: -1 }).exec();
  return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user))).end();
}

export async function recent(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }
  const sessionUser = req.session.user as UserDocument;
  if (!sessionUser) {
    return res.status(403).end('');
  }

  const users = await UserService.recent(sessionUser.account);
  return res.status(200).type('json').send(users.map(user => ResponseCreator.user(user))).end();
}
