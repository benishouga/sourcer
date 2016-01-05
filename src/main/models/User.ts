import {Schema, Document, model, Types} from 'mongoose';
import {MatchDocument} from './Match';
import * as _ from 'lodash';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  account: string;
  providers: [{ provider: string, account: string }];
  source: string;
  isClosedSource: boolean;
  matches: MatchDocument[];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  account: { type: String, required: true },
  providers: [{
    provider: String,
    account: String
  }],
  source: { type: String, 'default': '' },
  isClosedSource: { type: Boolean, 'default': false },
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', (next: Function) => {
  this.updated = new Date();
  next();
});

let modelBase = model<UserDocument>('User', schema);

module models {
  'use strict';

  export class User extends modelBase {
    static loadByAccount(account: string, next: (err: any, res: UserDocument) => void) {
      this.findOne({ account: account }).exec(next);
    }

    static loadWithMatchees(account: string, next: (err: any, res: UserDocument) => void) {
      this.findOne({ account: account })
        .populate('matches')
        .exec()
        .then<UserDocument>((res) => {
           // model は this で参照する必要がある。
          return this.populate(res, { path: 'matches.winner', model: this });
        })
        .then<UserDocument>((res) => {
          // model は this で参照する必要がある。
          return this.populate(res, { path: 'matches.contestants', model: this });
        })
        .then((res) => { next(null, res); }, (err) => { next(err, null); });
    }

    static loadById(id: Types.ObjectId, next: (err: any, res: UserDocument) => void) {
      this.findOne({ _id: id }).exec(next);
    }

    static findByOAuthAccount(oauth: { provider: string, account: string }, next?: (err: any, res: UserDocument) => void) {
      let provider = oauth.provider;
      let account = oauth.account;
      return this.findOne({ providers: { provider: provider, account: account } }).exec(next);
    }

    static createFromAccount(account: string, oauthProvider: string, oauthAccount: string, next: (err: any, res: UserDocument) => void) {
      let user = new User();
      user.account = account;
      user.providers = [{
        provider: oauthProvider,
        account: oauthAccount
      }];
      user.save(next);
    }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['User'] = _.assign(modelBase, space['User']);
  })(models);
}

export default models.User;
