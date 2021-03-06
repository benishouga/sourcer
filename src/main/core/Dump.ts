import V from './V';

export interface ActorDump {
  /** Id */
  i: number;
  /** Position */
  p: V;
  /** Direction */
  d: number;
}

export interface SourcerDump extends ActorDump {
  /** sHield */
  h: number;
  /** Temperature */
  t: number;
  /** MissileAmmo */
  a: number;
  /** Fuel */
  f: number;
  /** for debugging on the client */
  debug?: DebugDump;
}

export interface ShotDump extends ActorDump {
  /** Owner id */
  o: number;
  /** Shot type */
  s: string;
  /** for debugging on the client */
  debug?: DebugDump;
}

export interface FxDump {
  /** Id */
  i: number;
  /** Position */
  p: V;
  /** Frame */
  f: number;
  /** Length */
  l: number;
}

export interface FrameDump {
  /** Frame */
  f: number;
  /** Sourcers */
  s: SourcerDump[];
  /** shots (Bullets) */
  b: ShotDump[];
  /** fXs */
  x: FxDump[];
}

export interface GameDump {
  /** Result */
  result: ResultDump | null;
  /** Players */
  players: PlayersDump;
  /** Frames */
  frames: FrameDump[];
  /** isDemo */
  isDemo: boolean;
}

export interface PlayersDump {
  [id: number]: ProfileDump;
}

export interface ProfileDump {
  name: string;
  account: string;
  color: string;
}

export interface ResultDump {
  isDraw: boolean | null;
  timeout: string | null;
  winnerId: number | null;
  frame: number;
}

export interface DebugDump {
  logs: Message[];
  arcs: DebugArc[];
}

export interface DebugArc {
  direction: number;
  angle: number;
  renge?: number;
}

export interface Message {
  message: string;
  color?: string;
}
