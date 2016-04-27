import {Schema, Document, model, Types} from 'mongoose';
import {UserDocument} from './User';
import * as _ from 'lodash';

export interface MatchDocument extends Document {
  _id: Types.ObjectId;
  winner: UserDocument;
  contestants: UserDocument[];
  created: Date;
  updated: Date;
}

let schema = new Schema({
  winner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contestants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  created: { type: Date, 'default': Date.now },
  updated: { type: Date, 'default': Date.now }
}).pre('save', function(next: Function) {
  this.updated = new Date();
  next();
});

let modelBase = model<MatchDocument>('Match', schema);

module models {
  'use strict';

  export class Match extends modelBase {

    static load(id: Types.ObjectId): Promise<MatchDocument> {
      return new Promise<MatchDocument>((resolve, reject) => {
        this.findOne({ _id: id })
          .populate('winner')
          .populate('contestants')
          .exec((err, res) => {
            if (err) { return reject(err); }
            resolve(res);
          });
      });
    }

    static createAndRegisterToUser(match: MatchDocument): Promise<MatchDocument> {
      return new Promise<MatchDocument>((resolve, reject) => {
        match.save((err) => {
          if (err) { return reject(err); }

          this.load(match._id).then((match) => {

            let promises = match.contestants.map((contestant) => {
              return new Promise<{}>((resolve, reject) => {
                contestant.matches = contestant.matches || [];
                contestant.matches.push(match);
                contestant.save((err) => {
                  if (err) { reject(err); }
                  resolve();
                });
              });
            });

            Promise.all(promises).then(() => {
              resolve(match);
            }).then(reject);
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
