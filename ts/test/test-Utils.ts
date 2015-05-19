import Utils = require('../main/Utils');
import V = require('../main/V');
import assert = require('power-assert');

describe('Utils', function() {
  describe('#side()', function() {
    it('fire!!', function() {
      var radar = Utils.createRadar(new V(0, 0), 0, 90, 100);
      assert.ok(radar(new V(1, 0)));
    });
  });
});
