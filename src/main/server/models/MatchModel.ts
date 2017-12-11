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
}).pre('save', next => {
  this.updated = new Date();
  next();
});

// tslint:disable-next-line:variable-name
const MatchModel = model<MatchDocument>('Match', schema);
export default MatchModel;

export class MatchService extends MatchModel {
  public static load(argId: Types.ObjectId | string) {
    const id = typeof argId === 'string' ? Types.ObjectId.createFromHexString(argId as string) : argId;
    return this.findOne({ _id: id }, '-dump')
      .populate('winner', '-source')
      .populate('players', '-source')
      .exec();
  }

  public static loadWithReplay(argId: Types.ObjectId | string) {
    const id = typeof argId === 'string' ? Types.ObjectId.createFromHexString(argId as string) : argId;
    return this.findOne({ _id: id })
      .populate('winner', '-source')
      .populate('players', '-source')
      .exec();
  }

  public static async createAndRegisterToUser(match: MatchDocument) {
    await match.save();
    console.log('Match saved');
    const loaded = await this.load(match._id);
    if (!loaded) {
      throw new Error();
    }
    await Promise.all(
      loaded.players.map(player => {
        player._id.equals(match.winner._id) ? player.wins++ : player.losses++;
        player.matches = player.matches || [];
        player.matches.push(loaded);
        return player.save();
      })
    );
    console.log('Players saved');
    return loaded;
  }

  public static async matches() {
    return await this.find({}, '-dump')
      .populate('winner', '-source')
      .populate('players', '-source')
      .sort({ updated: -1 })
      .limit(10)
      .exec();
  }
}
