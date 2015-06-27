import Sourcer = require('./Sourcer');

interface TickEventListener {
  onPreThink: (targetId: string) => void;
  onPostThink: (targetId: string) => void;
}

export = TickEventListener;
