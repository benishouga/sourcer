import {Schema, Document, model, Types} from 'mongoose';
import {AiDocument} from './Ai';
import * as _ from 'lodash';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  account: string;
  providers: [{ provider: string, account: string }];
  ais: AiDocument[];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  account: { type: String, required: true },
  providers: [{
    provider: String,
    account: String
  }],
  ais: [{ type: Schema.Types.ObjectId, ref: 'Ai' }],
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
      this.findOne({ account: account }).populate('ais').exec(next);
    }

    static loadById(id: Types.ObjectId, next: (err: any, res: UserDocument) => void) {
      this.findOne({ _id: id }).populate('ais').exec(next);
    }

    static findByOAuthAccount(oauth: { provider: string, account: string }, next?: (err: any, res: UserDocument) => void) {
      let provider = oauth.provider;
      let account = oauth.account;
      return this.findOne({ providers: { provider: provider, account: account } }).populate('ais', '_id').exec(next);
    }

    static createFromAccount(account: string, oauthProvider: string, oauthAccount: string, next: (err: any, res: UserDocument) => void) {
      new User({
        account: account,
        providers: [{
          provider: oauthProvider,
          account: oauthAccount
        }]
      }).save(next);
    }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['User'] = _.assign(modelBase, space['User']);
  })(models);
}

export default models.User;
