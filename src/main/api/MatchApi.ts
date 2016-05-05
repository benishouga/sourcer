import { Request, Response } from 'express';
import { arena } from '../arena/nodeArena';
import { GameDump } from '../core/Dump';
import User, {UserDocument} from '../models/User';
import Match, {MatchDocument} from '../models/Match';
import Storage from '../utils/Storage';
import ResponseCreator from './ResponseCreator';

const colors = ['#866', '#262', '#c55', '#44b'];
let used = 0;

export function list(req: Request, res: Response) {
  "use strict";
}

export function show(req: Request, res: Response) {
  "use strict";
  const matchId: string = req.params['id'];
  Match.load(matchId).then((match) => {
    return res.status(200).type('json').send(ResponseCreator.match(match));
  });
}

export function replay(req: Request, res: Response) {
  "use strict";
  const matchId: string = req.params['id'];
  Storage.get(matchId).then((match) => {
    return res.status(200).type('json').send(match);
  });
}

export function create(req: Request, res: Response) {
  "use strict";
  let player1: string;
  let player2: string;
  if (req.params['player1'] && req.params['player2'] && req.session['admin']) {
    player1 = req.params['player1'];
    player2 = req.params['player2'];
  } else {
    const user = req.session['user'] as UserDocument;
    if (!user) {
      return res.status(403).send('');
    }
    player1 = user.account;
    player2 = req.params['id'];
    if (!player2) {
      return res.status(400).send('');
    }
  }

  Promise.all([
    User.loadByAccount(player1),
    User.loadByAccount(player2)
  ]).then((players: UserDocument[]) => {
    arena([
      { account: players[0].account, name: players[0].name, color: colors[0], ai: players[0].source },
      { account: players[1].account, name: players[1].name, color: colors[1], ai: players[1].source }
    ]).then((matchResult) => {
      let match = new Match();
      match.winner = players[matchResult.result.winnerId];
      match.players = players;
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
