import ScriptLoader, { ConsoleLike } from './ScriptLoader';

function construct(constructor: any, args: string[]) {
  function fun() {
    return constructor.apply(this, args);
  }
  fun.prototype = constructor.prototype;
  return new (fun as any)();
}

export default class ExposedScriptLoader implements ScriptLoader {
  private argValues: any[];
  private argNames: string[];
  private banlist: string[];
  private console: ConsoleLike;

  constructor() {
    this.console = {
      log: (...message) => {
        /* nothing.. */
      }
    };
    const allowLibs = {
      Object,
      String,
      Number,
      Boolean,
      Array,
      Date,
      Math,
      RegExp,
      JSON,
      NaN,
      Infinity,
      undefined,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      console: this.console
    };

    this.argNames = Object.keys(allowLibs);
    this.argValues = this.argNames.map(key => (allowLibs as any)[key]);
  }

  public isDebuggable(): boolean {
    return true;
  }

  public getExposedConsole(): ConsoleLike | null {
    return this.console;
  }

  public load(script: string): any {
    let argNames: string[] = [];
    argNames = argNames.concat(this.argNames);
    argNames.push('"use strict";\n' + script);
    return construct(Function, argNames).apply(undefined, this.argValues);
  }
}
