import { Schema, Document, model, Types } from 'mongoose';

import * as crypto from 'crypto';

import { defaultBot } from './defaultBot';
import { MatchDocument } from './MatchModel';

export type UserDocument = Document & {
  _id: Types.ObjectId;
  account: string;
  name: string;
  provider: { service: string, account: string };
  source: string;
  isClosedSource: boolean;
  members: string[];
  matches: MatchDocument[];
  wins: number;
  losses: number;
  created: Date;
  updated: Date;
};

const schema = new Schema({
  account: { type: String, required: true },
  name: { type: String },
  provider: {
    service: { type: String, required: true },
    account: { type: String, required: true }
  },
  source: { type: String, default: defaultBot },
  members: [{ type: String }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}).pre('save', (next) => {
  this.updated = new Date();
  next();
});

// tslint:disable-next-line:variable-name
const UserModel = model<UserDocument>('User', schema);
export default UserModel;

export class UserService extends UserModel {
  public static loadByAccount(account: string, withSource: boolean) {
    return UserService.findOne({ account }, withSource ? '' : '-source').exec();
  }

  public static async loadWithMatches(account: string, withSource: boolean) {
    let res = await UserService.findOne({ account }, withSource ? '' : '-source')
      .populate({ path: 'matches', select: '-dump', options: { sort: { created: -1 }, limit: 8 } })
      .exec();
    if (!res) {
      throw new Error('find user error');
    }
    res = await UserService.populate<UserDocument>(res, { path: 'matches.winner', model: 'User', select: '-source' });
    res = await UserService.populate<UserDocument>(res, { path: 'matches.players', model: 'User', select: '-source' });
    return res;
  }

  public static loadById(id: Types.ObjectId) {
    return UserService.findOne({ _id: id }).exec();
  }

  public static findByOAuthAccount(oauth: { service: string, account: string }) {
    const service = oauth.service;
    const account = oauth.account;
    return UserService.findOne({ provider: { service, account } }).exec();
  }

  public static createFromAccount(account: string, name: string, members: string[], oauthService: string, oauthAccount: string) {
    const user = new UserModel();
    user.account = account;
    user.name = name;
    user.members = members;
    user.provider = {
      service: oauthService,
      account: oauthAccount
    };
    return user.save();
  }

  public static async recent(excludeUser: string) {
    const query = { account: { $ne: excludeUser } };
    const res = await UserService.find(query, '-source')
      .populate({ path: 'matches', select: '-dump' })
      .sort({ updated: -1 })
      .limit(10)
      .exec();

    return UserService.populate(res, { path: 'matches.winner', model: 'User', select: '-source' });
  }

  public static hash(account: string, password: string) {
    return crypto.createHash('sha256').update(account + '+' + password, 'utf8').digest('hex');
  }
}
