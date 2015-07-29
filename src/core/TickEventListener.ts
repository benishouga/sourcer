import Sourcer from './Sourcer';

export default class TickEventListener {
  onPreThink: (targetId: string) => void;
  onPostThink: (targetId: string) => void;
}
