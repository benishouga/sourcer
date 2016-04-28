import { Request, Response } from 'express';
import { arena } from '../arena/nodeArena';
import { GameDump } from '../core/Dump';
import User, {UserDocument} from '../models/User';
import Match, {MatchDocument} from '../models/Match';
import Storage from '../utils/Storage';

const colors = ['#866', '#262', '#c55', '#44b'];
let used = 0;

export function list(req: Request, res: Response) {
  "use strict";
}

export function show(req: Request, res: Response) {
  "use strict";
  const matchId: string = req.params['id'];
  Storage.get(matchId).then((match) => {
    return res.status(200).type('json').send(match);
  });
}

export function create(req: Request, res: Response) {
  "use strict";
  const user = req.session['user'] as UserDocument;
  if (!user) {
    return res.status(403).send('');
  }
  const account = user.account;
  const againstId: string = req.params['id'];
  if (!againstId) {
    return res.status(400).send('');
  }

  Promise.all([
    User.loadByAccount(account),
    User.loadByAccount(againstId)
  ]).then((contestants: UserDocument[]) => {
    arena([
      { name: contestants[0].account, color: colors[0], ai: contestants[0].source },
      { name: contestants[1].account, color: colors[1], ai: contestants[1].source }
    ]).then((matchResult) => {
      let match = new Match();
      match.winner = contestants[matchResult.result.winnerId];
      match.contestants = contestants;
      return Match.createAndRegisterToUser(match).then(() => {
        let id = match._id.toHexString();
        return Storage.put(id, matchResult).then(() => id);
      }).then((id) => {
        res.status(200).type('json').send({ _id: id });
      }).catch((error) => {
        res.status(500).send('');
      });
    });
    return Promise.resolve();
  }).catch((error) => {
    console.log(error);
    return res.status(400).send('');
  });
}
