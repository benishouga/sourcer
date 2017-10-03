import { Request, Response } from 'express';
import { arena } from '../Arena';
import { GameDump } from '../../core/Dump';
import UserModel, { UserDocument, UserService } from '../models/UserModel';
import MatchModel, { MatchDocument, MatchService } from '../models/MatchModel';
import ResponseCreator from './ResponseCreator';
import Zip from '../utils/Zip';

const colors = ['#866', '#262', '#c55', '#44b'];

export function list(req: Request, res: Response) {
  throw new Error('Not Implemented');
}

export function show(req: Request, res: Response) {
  const matchId: string = req.params.id;
  MatchService.load(matchId).then((match) => {
    if (!match) {
      res.status(400);
      res.end('Bad Request');
      return;
    }
    res.status(200).type('json').send(ResponseCreator.match(match));
  });
}

export function replay(req: Request, res: Response) {
  const matchId: string = req.params.id;
  MatchService.load(matchId).then((match) => {
    if (!match) {
      res.status(400);
      res.end('Bad Request');
      return;
    }
    Zip.unzip(match.dump).then((unziped) => {
      res.status(200).type('json').send(JSON.parse(unziped));
    });
  });
}

export function create(req: Request, res: Response) {
  if (!req.session) {
    res.status(400);
    res.end('Bad Request');
    return;
  }

  let player1: string;
  let player2: string;
  if (req.params.player1 && req.params.player2 && req.session.admin) {
    player1 = req.params.player1;
    player2 = req.params.player2;
  } else {
    const user = req.session.user as UserDocument;
    if (!user) {
      return res.status(403).send('');
    }
    player1 = user.account;
    player2 = req.params.id;
    if (!player2) {
      return res.status(400).send('');
    }
  }

  Promise.all([
    UserService.loadByAccount(player1),
    UserService.loadByAccount(player2)
  ]).then(([user1, user2]) => {
    if (!user1 || !user2) {
      res.status(400).send('');
      return;
    }

    arena([
      { account: user1.account, name: user1.name, color: colors[0], ai: user1.source },
      { account: user2.account, name: user2.name, color: colors[1], ai: user2.source }
    ]).then((matchResult) => {
      return Zip.deflate(JSON.stringify(matchResult)).then((deflated) => {
        return { matchResult, dump: deflated };
      });
    }).then(({ matchResult, dump }) => {
      const match = new MatchModel();
      if (matchResult.result) {
        match.winner = matchResult.result.winnerId === 0 ? user1 : user2;
      }
      match.dump = dump;
      match.players = [user1, user2];
      return MatchService.createAndRegisterToUser(match);
    }).then((id) => {
      res.status(200).type('json').send({ _id: id });
    }).catch((error) => {
      res.status(500).send('');
    });
  }).catch((error) => {
    console.log(error);
    return res.status(400).send('');
  });
}
