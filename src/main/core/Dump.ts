import V from './V';

interface ActorDump {
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
}

export interface ShotDump extends ActorDump {
  /** Owner id */
  o: number;
  /** Shot type */
  s: string;
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

export interface FieldDump {
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
  result: ResultDump;
  /** Frames */
  members: MembersDump;
  /** Frames */
  frames: FieldDump[];
}

export interface MembersDump {
  [id: number]: ProfileDump;
}

export interface ProfileDump {
  name: string;
  color: string;
}

export interface ResultDump {
  isDraw: boolean;
  winnerId: number;
  frame: number;
}
