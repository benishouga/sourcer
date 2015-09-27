import {Schema, Document, model, Types} from 'mongoose';
import * as _ from 'lodash';

interface UserDocument extends Document {
  _id: Types.ObjectId;
  account: string;
  providers: [{ provider: string, id: string }];
  ais: [Types.ObjectId];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  account: { type: String, required: true, index: { unique: true } },
  providers: [{
    provider: String,
    id: String
  }],
  ais: [{ type: Schema.Types.ObjectId, ref: 'Ai' }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}).pre('save', (next: Function) => {
  this.updated = new Date();
  next();
});

let modelBase = model<UserDocument>('User', schema);

module models {
  'use strict';

  export class User extends modelBase {
    static load(id: string, next: (err: any, res: UserDocument) => void) {
      this.findOne({ id: id }).populate('ais').exec(next);
    }

    static findByAccount(account: { provider: string, id: string }, next?: (err: any, res: UserDocument) => void) {
      let provider = account.provider;
      let id = account.id;
      return this.findOne({ providers: { provider: provider, id: id } }).populate('ais', '_id').exec(next);
    }

    static createFromAccount(provider: string, authorId: string, id: string, next: (err: any, res: UserDocument) => void) {
      new User({
        provider: provider,
        authorId: authorId,
        id: id
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
