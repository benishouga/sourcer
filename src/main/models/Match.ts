import {Schema, Document, model, Types} from 'mongoose';
import {UserDocument} from './User';
import Ai, {AiDocument} from './Ai';
import * as _ from 'lodash';

export interface MatchDocument extends Document {
  _id: Types.ObjectId;
  winner: {
    owner: UserDocument;
    ai: AiDocument;
  };
  timeout: boolean;
  contestants: [{
    owner: UserDocument;
    ai: AiDocument;
  }];
  path: string;
  created: Date;
  updated: Date;
}

let schema = new Schema({
  winner: {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ai: { type: Schema.Types.ObjectId, ref: 'Ai', required: true }
  },
  timeout: { type: Boolean, 'default': false },
  contestants: [{
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ai: { type: Schema.Types.ObjectId, ref: 'Ai', required: true }
  }],
  path: { type: String, required: true },
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', (next: Function) => {
  this.updated = new Date();
  next();
});

let modelBase = model<MatchDocument>('Match', schema);

module models {
  'use strict';

  export class Match extends modelBase {

    static load(id: Types.ObjectId, next: (err: any, res: MatchDocument) => void) {
      this.findOne({ _id: id })
        .populate('winner.owner')
        .populate('winner.ai')
        .populate('contestants.owner')
        .populate('contestants.ai')
        .exec(next);
    }

    static createAndRegisterToAi(match: MatchDocument, next: (err: any, res: MatchDocument) => void) {
      match.save((err) => {
        this.load(match._id, (err, match) => {
          let promises = match.contestants.map((contestant) => {
            return new Promise<{}>((resolve, reject) => {
              let ai = contestant.ai;
              ai.matches = ai.matches || [];
              ai.matches.push(match);
              ai.save((err) => {
                if (err) { reject(err); }
                resolve();
              });
            });
          });
          Promise.all(promises).then(() => {
            next(null, match);
          });
        });
      });
    }
  }

  // FIXME: もっと良い方法があれば検討する。
  // やりたいことは ts として Model の static メソッドを実体ともに引き継げ、独自の static メソッドを追加できること
  (function(space: any) {
    space['Match'] = _.assign(modelBase, space['Match']);
  })(models);
}

export default models.Match;
