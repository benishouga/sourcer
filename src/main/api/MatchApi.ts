import { Request, Response } from 'express';
import { arena } from '../arena/nodeArena';
import { GameDump } from '../core/Dump';
import User, {UserDocument} from '../models/User';
import * as fs from 'fs';

const colors = ['#866', '#262', '#c55', '#44b'];
const matches: { [id: string]: GameDump } = {};
let used = 0;

function register(result: GameDump): string {
  const id = 'match' + (++used);
  matches[id] = result;
  return id;
}

export function list(req: Request, res: Response) {
  "use strict";
}

export function show(req: Request, res: Response) {
  "use strict";
  const matchId: string = req.params['id'];
  return res.status(200).send(matches[matchId]);
}

export function create(req: Request, res: Response) {
  "use strict";
  const user = req.session['account'] as UserDocument;
  if (!user) {
    return res.status(403).send('');
  }
  const userId = user.account;
  const againstId: string = req.params['id'];
  if (!againstId) {
    return res.status(400).send('');
  }

  Promise.all([
    User.loadByAccount(userId),
    User.loadByAccount(againstId)
  ]).then((contestants: UserDocument[]) => {
    arena([
      { name: contestants[0].account, color: colors[0], ai: contestants[0].source },
      { name: contestants[1].account, color: colors[1], ai: contestants[1].source }
    ]).then((matchResult) => {
      let id = register(matchResult);
      res.status(201).send({ _id: id });
    });
  }).catch((error) => {
    console.log(error);
    return res.status(400).send('');
  });
}
