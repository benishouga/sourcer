import {Types} from 'mongoose';
import {UserDocument} from '../models/User';
import {MatchDocument} from '../models/Match';

export default class ResponseCreator {
  static inflatable(document: any): boolean {
    return document && !(document instanceof Types.ObjectId);
  }

  static user(user: UserDocument): UserResponse {
    return this.inflatable(user) ? {
      account: user.account,
      name: user.name || user.account,
      source: user.source,
      members: user.members,
      matches: user.matches ? user.matches.map((match) => this.match(match)) : [],
      updated: user.updated
    } : user as any;
  }

  static match(match: MatchDocument): MatchResponse {
    return this.inflatable(match) ? {
      _id: match._id.toHexString(),
      winner: this.user(match.winner),
      contestants: match.contestants ? match.contestants.map(v => this.user(v)) : [],
      created: match.created
    } : match as any;
  }
}
