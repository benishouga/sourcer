import { FrameDump, ResultDump } from './Dump';

interface TickEventListener {
  waitNextTick(): Promise<void>;
  onPreThink(targetId: number): void;
  onPostThink(targetId: number): void;
  onFrame(field: FrameDump): void;
  onFinished(result: ResultDump): void;
  onEndOfGame(): void;
  onError(error: string): void;
}
export default TickEventListener;
