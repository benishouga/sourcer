import {Schema, Document, model, Types} from 'mongoose';
import {MatchDocument} from './Match';
import * as _ from 'lodash';

import * as crypto from 'crypto';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  account: string;
  provider: { service: string, account: string };
  source: string;
  isClosedSource: boolean;
  matches: MatchDocument[];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  account: { type: String, required: true },
  provider: {
    service: { type: String, required: true },
    account: { type: String, required: true }
  },
  source: { type: String, 'default': '' },
  isClosedSource: { type: Boolean, 'default': false },
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', function(next: Function) {
  this.updated = new Date();
  next();
});

let modelBase = model<UserDocument>('User', schema);

module models {
  'use strict';

  export class User extends modelBase {
    static loadByAccount(account: string) {
      return this.findOne({ account: account }).exec();
    }

    static loadWithMatchees(account: string) {
      return this.findOne({ account: account })
        .populate('matches')
        .exec()
        .then<UserDocument>((res) => {
          // model は this で参照する必要があるっぽい
          return this.populate(res, { path: 'matches.winner', model: this });
        })
        .then<UserDocument>((res) => {
          // model は this で参照する必要があるっぽい
          return this.populate(res, { path: 'matches.contestants', model: this });
        });
    }

    static loadById(id: Types.ObjectId) {
      return this.findOne({ _id: id }).exec();
    }

    static findByOAuthAccount(oauth: { service: string, account: string }) {
      let service = oauth.service;
      let account = oauth.account;
      return this.findOne({ provider: { service: service, account: account } }).exec();
    }

    static createFromAccount(account: string, oauthService: string, oauthAccount: string) {
      let user = new User();
      user.account = account;
      user.provider = {
        service: oauthService,
        account: oauthAccount
      };
      return new Promise<UserDocument>((resolve, reject) => {
        user.save((err: any, res: UserDocument) => {
          return err ? reject(err) : resolve(res);
        });
      });
    }

    static recent(excludeUser: string) {
      let query = { account: { $ne: excludeUser } };
      return this.find(query).sort({ "updated": -1 }).limit(10).exec();
    }

    static hash(account: string, password: string) {
      return crypto.createHash('sha256').update(account + password, 'utf8').digest('hex');
    }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['User'] = _.assign(modelBase, space['User']);
  })(models);
}

export default models.User;
