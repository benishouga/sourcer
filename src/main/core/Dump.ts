import V from './V';

interface ActorDump {
  id: string;
  position: V;
  speed: V;
  direction: number;
}

export interface SourcerDump extends ActorDump {
  shield: number;
  temperature: number;
  missileAmmo: number;
  fuel: number;
  name: string;
  color: string;
}

export interface ShotDump extends ActorDump {
  type: string;
  color: string;
}

export interface FxDump {
  id: string;
  position: V;
  frame: number;
  length: number;
}

export interface FieldDump {
  frame: number;
  sourcers: SourcerDump[];
  shots: ShotDump[];
  fxs: FxDump[];
}

export interface GameDump {
  result: ResultDump;
  frames: FieldDump[];
}

export interface ResultDump {
  isDraw: boolean;
  winner: SourcerDump;
  frame: number;
}
