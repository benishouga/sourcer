import Sourcer from './Sourcer';
import {FieldDump, ResultDump} from './Dump';

interface TickEventListener {
  onPreThink(targetId: number): void;
  onPostThink(targetId: number): void;
  onFrame(field: FieldDump): void;
  onFinished(result: ResultDump): void;
  onEndOfGame(): void;
  onLog(targetId: number, ...message: any[]): void;
}
export default TickEventListener;
