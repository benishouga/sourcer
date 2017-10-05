import { Schema, Document, model, Types } from 'mongoose';

import * as crypto from 'crypto';

import { defaultAi } from './defaultAi';
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
  source: { type: String, default: defaultAi },
  isClosedSource: { type: Boolean, default: false },
  members: [{ type: String }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
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
  public static loadByAccount(account: string) {
    return UserService.findOne({ account }).exec();
  }

  public static async loadWithMatchees(account: string) {
    let res = await UserService.findOne({ account })
      .populate({ path: 'matches', options: { sort: { created: -1 } } })
      .exec();
    if (!res) {
      throw new Error('find user error');
    }
    res = await UserService.populate<UserDocument>(res, { path: 'matches.winner', model: 'User' });
    res = await UserService.populate<UserDocument>(res, { path: 'matches.players', model: 'User' });
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
    const res = await UserService.find(query)
      .populate({ path: 'matches' })
      .sort({ updated: -1 })
      .limit(10)
      .exec();

    return UserService.populate(res, { path: 'matches.winner', model: 'User' });
  }

  public static hash(account: string, password: string) {
    return crypto.createHash('sha256').update(account + '+' + password, 'utf8').digest('hex');
  }
}
