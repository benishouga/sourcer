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

    return {
      account: user.account,
      name: user.name || user.account,
      source: user.source,
      members: user.members,
      matches: user.matches ? user.matches.map(match => this.match(match)) : [],
      wins: user.wins,
      losses: user.losses,
      updated: user.updated
    };
  }

  public static match(match: MatchDocument): MatchResponse {
    return this.inflated(match)
      ? {
          _id: match._id.toHexString(),
          winner: this.user(match.winner),
          players: match.players ? match.players.map(v => this.user(v)) : [],
          created: match.created
        }
      : (match as MatchResponse);
  }

  public static auth(session: Express.Session): AuthResponse {
    return {
      authenticated: session.authenticated,
      admin: session.admin
    };
  }

  public static config(): ConfigResponse {
    return {
      requireAppKey: !!Env.instance.appKey,
      teamGame: Env.instance.isTeamGame,
      envMessages: Env.instance.envMessages,
      publishGames: Env.instance.isPublishGames
    };
  }

  public static error(errors: (ResourceId)[]): ErrorResponse {
    return { errors };
  }
}
