import ScriptLoader from './ScriptLoader';

import { VM, VMScript } from 'vm2';

export default class SandboxedScriptLoader implements ScriptLoader {
  private vm: VM;

  constructor() {
    this.vm = new VM();
  }

  public load(script: string): any {
    return this.vm.run(`(function(){\n"use strict";\n${script}\n})();`);
  }
}
