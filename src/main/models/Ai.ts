import {Schema, Document, model, Types} from 'mongoose';
import * as _ from 'lodash';
// import User from './User';

export interface AiDocument extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  source: string;
  isClosedSource: boolean;
  created: Date;
  updated: Date;
}

let schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    'default': ''
  },
  isClosedSource: {
    type: Boolean,
    'default': false
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}).pre('save', (next: Function) => {
  this.updated = new Date();
  next();
});

let modelBase = model<AiDocument>('Ai', schema);

module models {
  'use strict';

  export class Ai extends modelBase {
    static load(owner: string, ai: string, next: (err: any, res: AiDocument) => void) {
      this.findOne({ owner: owner, id: ai }).populate('owner', '_id').exec(next);
    }

    // static updateOrCreate(owner: User, newAi: AiDocument, next: (err: any, res: AiDocument) => void) {
    //   this.findOne({ owner: owner._id, id: newAi.id }).exec((err, ai) => {
    //     if (err) { return next(err, null); }
    //     if (ai) { return Ai.update(ai, newAi, next); }
    //     Ai.create(owner, newAi, next);
    //   });
    // }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['Ai'] = _.assign(modelBase, space['Ai']);
  })(models);
}

export default models.Ai;
