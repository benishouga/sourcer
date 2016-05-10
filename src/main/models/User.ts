import {Schema, Document, model, Types} from 'mongoose';
import * as _ from 'lodash';

import * as crypto from 'crypto';

import {defaultAi} from './defaultAi';
import {MatchDocument} from './Match';

export interface UserDocument extends Document {
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
}

let schema = new Schema({
  account: { type: String, required: true },
  name: { type: String },
  provider: {
    service: { type: String, required: true },
    account: { type: String, required: true }
  },
  source: { type: String, 'default': defaultAi },
  isClosedSource: { type: Boolean, 'default': false },
  members: [{ type: String }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', function(next: Function) {
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
        .populate({ path: 'matches', options: { sort: { 'created': -1 } } })
        .exec()
        .then<UserDocument>((res) => {
          // model は this で参照する必要があるっぽい
          return this.populate(res, { path: 'matches.winner', model: this });
        })
        .then<UserDocument>((res) => {
          // model は this で参照する必要があるっぽい
          return this.populate(res, { path: 'matches.players', model: this });
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

    static createFromAccount(account: string, name: string, members: string[], oauthService: string, oauthAccount: string) {
      let user = new User();
      user.account = account;
      user.name = name;
      user.members = members;
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
      return this.find(query)
        .populate({ path: 'matches' })
        .sort({ "updated": -1 })
        .limit(10)
        .exec()
        .then<UserDocument[]>((res) => {
          // model は this で参照する必要があるっぽい
          return this.populate(res, { path: 'matches.winner', model: this });
        });
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
