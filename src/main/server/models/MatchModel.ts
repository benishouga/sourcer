import { Types, Document, Schema, Model, model } from 'mongoose';
import { UserDocument } from './UserModel';

export type MatchDocument = Document & {
  _id: Types.ObjectId;
  winner: UserDocument;
  players: UserDocument[];
  dump: string;
  created: Date;
  updated: Date;
};

const schema = new Schema({
  winner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  dump: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}).pre('save', (next) => {
  this.updated = new Date();
  next();
});

// tslint:disable-next-line:variable-name
const MatchModel = model<MatchDocument>('Match', schema);
export default MatchModel;

export class MatchService extends MatchModel {

  public static load(argId: Types.ObjectId | string): Promise<MatchDocument | null> {
    const id = typeof argId === 'string' ? Types.ObjectId.createFromHexString(argId as string) : argId;

    return this.findOne({ _id: id })
      .populate('winner')
      .populate('players')
      .exec();
  }

  public static createAndRegisterToUser(match: MatchDocument): Promise<MatchDocument> {
    return match.save().then(() => {
      console.log('Match saved');
      return this.load(match._id);
    }).then((loaded) => {
      return loaded ? Promise.resolve(loaded) : Promise.reject('save error');
    }).then((loaded) => {
      console.log('Loading for SavedMatch is successful');
      const promises = loaded.players.map((player) => {
        player.matches = player.matches || [];
        player.matches.push(loaded);
        return player.save();
      });
      return Promise.all(promises).then(() => {
        console.log('Players saved');
        return Promise.resolve(loaded);
      });
    });
  }
}
