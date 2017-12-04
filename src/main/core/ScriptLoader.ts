
export interface ScriptLoaderConstructor {
  new(): ScriptLoader;
  readonly prototype: ScriptLoader;
}

export default interface ScriptLoader {
  isDebuggable(): boolean;
  getExposedConsole(): ConsoleLike | null;
  load(script: string): any;
}

export interface ConsoleLike {
  log: (...message: string[]) => void;
}
