import { Types } from 'mongoose';
import { UserDocument } from '../models/UserModel';
import { MatchDocument } from '../models/MatchModel';
import Env from '../Env';

export default class ResponseCreator {
  public static inflated(document: any): boolean {
    return document && !(document instanceof Types.ObjectId);
  }

  public static user(user: UserDocument): UserResponse {
    if (!this.inflated(user)) {
      return user as UserResponse;
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
      wins,
      losses,
      account: user.account,
      name: user.name || user.account,
      source: user.source,
      members: user.members,
      matches: user.matches ? user.matches.map(match => this.match(match)) : [],
      updated: user.updated
    };
  }

  public static match(match: MatchDocument): MatchResponse {
    return this.inflated(match) ? {
      _id: match._id.toHexString(),
      winner: this.user(match.winner),
      players: match.players ? match.players.map(v => this.user(v)) : [],
      created: match.created
    } : match as any;
  }

  public static auth(session: Express.Session): AuthResponse {
    return {
      authenticated: session.authenticated,
      admin: session.admin
    };
  }

  public static config(): ConfigResponse {
    return {
      requireAppKey: !!Env.appKey,
      teamGame: Env.isTeamGame
    };
  }

  public static error(errors: (ResourceId)[]): ErrorResponse {
    return { errors };
  }
}
