import {Schema, Document, model, Types} from 'mongoose';
import * as _ from 'lodash';
import User, {UserDocument} from './User';
import {MatchDocument} from './Match';

export interface AiDocument extends Document {
  _id: Types.ObjectId;
  owner: UserDocument;
  name: string;
  source: string;
  isClosedSource: boolean;
  matches: MatchDocument[];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  name: { type: String, 'default': 'ai' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, 'default': '' },
  isClosedSource: { type: Boolean, 'default': false },
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', (next: Function) => {
  this.updated = new Date();
  next();
});

let modelBase = model<AiDocument>('Ai', schema);

module models {
  'use strict';

  export class Ai extends modelBase {
    static load(user: UserDocument, aiName: string, next: (err: any, res: AiDocument) => void) {
      this.findOne({ owner: user._id, name: aiName }).populate('owner', '_id').exec(next);
    }

    static loadWithMatchees(user: UserDocument, aiName: string, next: (err: any, res: AiDocument) => void) {
      this.findOne({ owner: user._id, name: aiName })
        .populate('owner')
        .populate('matches')
        .exec()
        .then<AiDocument>((res) => {
          return this.populate(res, { path: 'matches.winner.owner', model: User });
        }).then<AiDocument>((res) => {
          return this.populate(res, { path: 'matches.winner.ai', model: this });
        }).then<AiDocument>((res) => {
          return this.populate(res, { path: 'matches.contestants.owner', model: User });
        }).then<AiDocument>((res) => {
          return this.populate(res, { path: 'matches.contestants.ai', model: this });
        }).then((res) => { next(null, res); }, (err) => { next(err, null); });
    }

    static updateOrCreate(newAi: AiDocument, next: (err: any, res: AiDocument) => void) {
      this.findOne({ owner: newAi._id, _id: newAi._id }).exec((err, ai) => {
        if (err) { return next(err, null); }
        if (ai) { return this.update(ai, newAi, next); }
        return this.createAndRegisterToOwner(newAi, next);
      });
    }

    static createAndRegisterToOwner(ai: AiDocument, next: (err: any, res: AiDocument) => void) {
      User.loadById(ai.owner._id, (err, user) => {
        if (err) { return next(err, null); }
        if (!user) { return next(null, null); }
        this.create(ai, (err, res) => {
          user.ais.push(res);
          user.save(() => {
            next(null, res);
          });
        });
      });
    }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['Ai'] = _.assign(modelBase, space['Ai']);
  })(models);
}

export default models.Ai;
