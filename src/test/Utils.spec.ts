import * as assert from 'assert';
import Utils from '../main/core/Utils';
import V from '../main/core/V';

// describe('Utils', () => {

//   describe('#side()', () => {
//     const RENGE = 5;
//     const generateTestTable = () => {
//       const result: V[] = [];
//       for (let i = -RENGE; i <= RENGE; i++) {
//         for (let j = -RENGE; j <= RENGE; j++) {
//           result.push(new V(i, j));
//         }
//       }
//       return result;
//     };

//     const testWithTable = (table: V[], test: (d: number, shift: V, sp: (x: number, y: number) => V) => void) => {
//       for (let degree = -360; degree <= 360; degree += 15) {
//         (() => {
//           const radian = Utils.toRadian(degree);
//           table.forEach((shift) => {
//             test(degree, shift, (x: number, y: number) => {
//               const cos = Math.cos(radian);
//               const sin = Math.sin(radian);
//               const a = cos * x - sin * y;
//               const b = cos * y + sin * x;
//               return new V(a, b).add(shift);
//             });
//           });
//         })();
//       }
//     };

//     testWithTable(generateTestTable(), (degree: number, shift: V, sp: (x: number, y: number) => V) => {
//       it(`degree = ${degree}, shift.x = ${shift.x}, shift.y = ${shift.y}`, () => {
//         const side = Utils.side(sp(0, 0), degree);
//         assert.ok(!side(sp(1, 1)));
//         assert.ok(!side(sp(0, 1)));
//         assert.ok(!side(sp(-1, 1)));
//         assert.ok(side(sp(1, 0)));
//         assert.ok(side(sp(0, 0)));
//         assert.ok(side(sp(-1, 0)));
//         assert.ok(side(sp(1, -1)));
//         assert.ok(side(sp(0, -1)));
//         assert.ok(side(sp(-1, -1)));
//       });
//     });
//   });
// });
