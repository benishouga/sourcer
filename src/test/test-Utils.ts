import Utils from '../main/core/Utils';
import V from '../main/core/V';
import * as assert from 'power-assert';

describe('Utils', () => {

  describe('#side()', () => {
    var RENGE = 5;
    var generateTestTable = () => {
      var result: V[] = [];
      for (var i = -RENGE; i <= RENGE; i++) {
        for (var j = -RENGE; j <= RENGE; j++) {
          result.push(new V(i, j));
        }
      }
      return result;
    };

    var testWithTable = (table: V[], test: (degree: number, sp: (x: number, y: number) => V) => void) => {
      for (var degree = -360; degree <= 360; degree += 15) {
        (() => {
          var radian = Utils.toRadian(degree);
          for (var i = 0; i < table.length; i++) {
            var shift = table[i];
            test(degree, (x: number, y: number) => {
              var cos = Math.cos(radian);
              var sin = Math.sin(radian);
              var a = cos * x - sin * y;
              var b = cos * y + sin * x;

              return new V(a, b).add(shift);
            });
          }
        })();
      }
    };

    testWithTable(generateTestTable(), (degree: number, sp: (x: number, y: number) => V) => {
      // it('degree = ' + degree, () => {
      //   var side = Utils.side(sp(0, 0), degree);
      //   assert.ok(!side(sp(1, 1)));
      //   assert.ok(!side(sp(0, 1)));
      //   assert.ok(!side(sp(-1, 1)));
      //   assert.ok(side(sp(1, 0)));
      //   assert.ok(side(sp(0, 0)));
      //   assert.ok(side(sp(-1, 0)));
      //   assert.ok(side(sp(1, -1)));
      //   assert.ok(side(sp(0, -1)));
      //   assert.ok(side(sp(-1, -1)));
      // });
    });

  });

});
