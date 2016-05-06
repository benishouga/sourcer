import {Types} from 'mongoose';
import {UserDocument} from '../models/User';
import {MatchDocument} from '../models/Match';

export default class ResponseCreator {
  static inflated(document: any): boolean {
    return document && !(document instanceof Types.ObjectId);
  }

  static user(user: UserDocument): UserResponse {
    if (!this.inflated(user)) {
      return user as any;
    }

    let wins = 0;
    let losses = 0;
    if (user.matches) {
      user.matches.forEach((match) => {
        if (match.winner) {
          if (match.winner.account === user.account) {
            wins++;
          } else {
            losses++;
          }
        }
      });
    }

    return {
      account: user.account,
      name: user.name || user.account,
      source: user.source,
      members: user.members,
      matches: user.matches ? user.matches.map((match) => this.match(match)) : [],
      wins: wins,
      losses: losses,
      updated: user.updated
    };
  }

  static match(match: MatchDocument): MatchResponse {
    return this.inflated(match) ? {
      _id: match._id.toHexString(),
      winner: this.user(match.winner),
      players: match.players ? match.players.map(v => this.user(v)) : [],
      created: match.created
    } : match as any;
  }

  static auth(session: Express.Session): AuthResponse {
    return {
      authenticated: session['authenticated'],
      admin: session['admin']
    };
  }
}
