import * as assert from 'assert';
import ExposedScriptLoader from '../main/core/ExposedScriptLoader';

describe('ExposedScriptLoader', () => {
  it('load', () => {
    const loader = new ExposedScriptLoader();
    assert.strictEqual(loader.load('return 1 + 1;'), 2);
    assert.strictEqual(loader.load('return Math.max(1, 2);'), 2);
  });
});
