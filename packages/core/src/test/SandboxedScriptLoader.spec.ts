import * as assert from 'assert';
import { describe, it } from 'vitest';
import SandboxedScriptLoader from '../SandboxedScriptLoader';

describe('SandboxedScriptLoader', () => {
  it('load', () => {
    const loader = new SandboxedScriptLoader();
    assert.strictEqual(loader.load('return 1 + 1;'), 2);
    assert.strictEqual(loader.load('return Math.max(1, 2);'), 2);
  });

  it('load return function', () => {
    const loader = new SandboxedScriptLoader();
    assert.strictEqual(
      loader.load(`
return function() {
  return Math.max(1, 2);
};
    `)(),
      2
    );
  });
});
