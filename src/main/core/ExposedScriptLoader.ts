import ScriptLoader from './ScriptLoader';

const allowLibs = { Object, String, Number, Boolean, Array, Date, Math, RegExp, JSON, NaN, Infinity, undefined, parseInt, parseFloat, isNaN, isFinite };

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

  constructor() {
    // tslint:disable-next-line:no-function-constructor-with-string-args
    const global = new Function('return this')();
    this.banlist = ['__proto__', 'prototype'];

    // tslint:disable-next-line:forin
    for (const target in global) {
      this.banlist.push(target);
    }
    let argNames = Object.keys(allowLibs);
    argNames = argNames.concat(this.banlist.filter(value => argNames.indexOf(value) >= 0));
    this.argNames = argNames;
    this.argValues = Object.keys(allowLibs).map(key => (allowLibs as any)[key]);
  }

  public load(script: string): any {
    let argNames: string[] = [];
    argNames = argNames.concat(this.argNames);
    argNames.push('"use strict";\n' + script);
    return construct(Function, argNames).apply(undefined, this.argValues);
  }
}
