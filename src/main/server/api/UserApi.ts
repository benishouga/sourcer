import { Request, Response } from 'express';
import { UserDocument, UserService } from '../models/UserModel';
import Validator from '../utils/Validator';
import ResponseCreator from './ResponseCreator';
import Normalizer from '../utils/Normalizer';
import Env from '../Env';
import { ResourceId } from '../../dts/StringResource';

export async function show(req: Request, res: Response) {
  if (!req.session) {
    return res
      .status(400)
      .send('Bad Request')
      .end();
  }

  let account: string = req.params.id;
  let withSource = false;
  if (!account) {
    const sessionUser = req.session.user as UserDocument;
    if (!sessionUser) {
      return res
        .status(403)
        .send('')
        .end();
    }
    account = sessionUser.account;
    withSource = true;
  }

  const user = await UserService.loadWithMatches(account, withSource);
  if (!user) {
    return res
      .status(404)
      .send('')
      .end();
  }

  return res
    .status(200)
    .type('json')
    .send(ResponseCreator.user(user))
    .end();
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
    return res
      .status(400)
      .send(ResponseCreator.error(validationResults))
      .end();
  }

  const userExist = await UserService.loadByAccount(account, false);

  if (userExist) {
    return res
      .status(409)
      .send(ResponseCreator.error(['invalidAccountExist']))
      .end();
  }

  const user = await UserService.createFromAccount(account, name, members, 'own', UserService.hash(account, password));
  if (!req.session) {
    return res
      .status(503)
      .send('Internal Server Error')
      .end();
  }

  req.session.admin = false;
  req.session.authenticated = true;
  req.session.user = user;
  return res
    .status(201)
    .type('json')
    .send('{}')
    .end();
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
  const source = req.body.source;
  const user = await UserService.findOneAndUpdate({ account }, { source }).exec();

  if (!user) {
    return res.status(404).end('');
  }

  return res
    .status(200)
    .type('json')
    .send(ResponseCreator.user(user))
    .end();
}

export async function all(req: Request, res: Response) {
  if (!req.session) {
    return res.status(400).end('Bad Request');
  }
  const isAdmin = req.session.admin as boolean;
  if (!isAdmin) {
    return res.status(403).end('');
  }

  const users = await UserService.find({})
    .sort({ updated: -1 })
    .exec();
  return res
    .status(200)
    .type('json')
    .send(users.map(user => ResponseCreator.user(user)))
    .end();
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
  return res
    .status(200)
    .type('json')
    .send(users.map(user => ResponseCreator.user(user)))
    .end();
}
