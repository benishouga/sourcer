import { Types, Document, Schema, model, Model } from 'mongoose';
import { UserDocument, UserService } from './UserModel';

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
}).pre<MatchDocument>('save', function(next) {
  this.updated = new Date();
  next();
});

// tslint:disable-next-line:variable-name
export const MatchModel = model<MatchDocument>('Match', schema);
export default MatchModel as Model<MatchDocument>;

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
        const win = player._id.equals(match.winner._id);
        return UserService.findByIdAndUpdate(player._id, {
          $inc: {
            wins: win ? 1 : 0,
            losses: win ? 0 : 1
          },
          $push: { matches: match }
        }).exec();
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
