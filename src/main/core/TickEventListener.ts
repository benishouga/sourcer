import Sourcer from './Sourcer';
import {FieldDump, ResultDump} from './Dump';

export default class TickEventListener {
  onPreThink: (targetId: string) => void;
  onPostThink: (targetId: string) => void;
  onFrame: (field: FieldDump) => void;
  onFinished: (result: ResultDump) => void;
  onEndOfGame: () => void;
  onLog: (targetId: string, ...message: any[]) => void;
}
