import V = require('../core/V');
import assert = require('power-assert');

var EPSILON = 10e-12;

describe('V', () => {
  describe('add', () => {
    it('two number arguments', () => {
      var point = new V(10, 20);
      var result = point.add(5, 15);
      assert.ok(result.x === 15);
      assert.ok(result.y === 35);
    });

    it('point arguments', () => {
      var point = new V(10, 20);
      var result = point.add(new V(5, 15));
      assert.ok(result.x === 15);
      assert.ok(result.y === 35);
    });
  });

  describe('subtract', () => {
    it('two number arguments', () => {
      var point = new V(10, 30);
      var result = point.subtract(5, 15);
      assert.ok(result.x === 5);
      assert.ok(result.y === 15);
    });

    it('point arguments', () => {
      var point = new V(10, 30);
      var result = point.subtract(new V(5, 15));
      assert.ok(result.x === 5);
      assert.ok(result.y === 15);
    });
  });

  describe('multiply', () => {
    it('number arguments', () => {
      var point = new V(10, 30);
      var result = point.multiply(3);
      assert.ok(result.x === 30);
      assert.ok(result.y === 90);
    });

    it('point arguments', () => {
      var point = new V(10, 30);
      var result = point.multiply(new V(2, 3));
      assert.ok(result.x === 20);
      assert.ok(result.y === 90);
    });
  });

  describe('divide', () => {
    it('number arguments', () => {
      var point = new V(30, 120);
      var result = point.divide(3);
      assert.ok(result.x === 10);
      assert.ok(result.y === 40);
    });

    it('point arguments', () => {
      var point = new V(30, 120);
      var result = point.divide(new V(3, 4));
      assert.ok(result.x === 10);
      assert.ok(result.y === 30);
    });
  });

  describe('modulo', () => {
    it('number arguments', () => {
      var point = new V(11, 12);
      var result = point.modulo(10);
      assert.ok(result.x === 1);
      assert.ok(result.y === 2);
    });

    it('point arguments', () => {
      var point = new V(11, 13);
      var result = point.modulo(new V(10, 11));
      assert.ok(result.x === 1);
      assert.ok(result.y === 2);
    });
  });

  describe('negate', () => {
    it('negate', () => {
      var point = new V(10, 20);
      var result = point.negate();
      assert.ok(result.x === -10);
      assert.ok(result.y === -20);
    });
  });

  describe('distance', () => {
    it('distance horizontal', () => {
      var point = new V(10, 20);
      var result = point.distance(new V(20, 20));
      assert.ok(result === 10);
    });

    it('distance vertical', () => {
      var point = new V(20, 10);
      var result = point.distance(new V(20, 20));
      assert.ok(result === 10);
    });

    it('distance skew', () => {
      var point = new V(10, 10);
      var result = point.distance(new V(13, 14));
      assert.ok(result === 5);
    });
  });

  describe('length', () => {
    it('length', () => {
      var point = new V(30, 40);
      var result = point.length();
      assert.ok(result === 50);
      var result = point.length();
      assert.ok(result === 50);
    });
  });

  describe('normalize', () => {
    it('normalize', () => {
      var point = new V(30, 40);
      var result = point.normalize();
      assert.ok(result.x === 0.6);
      assert.ok(result.y === 0.8);
    });

    it('normalize 0 length', () => {
      var point = new V(0, 0);
      var result = point.normalize();
      assert.ok(result.x === 0);
      assert.ok(result.y === 0);
    });
  });

  describe('angle', () => {
    it('agnle hrizontal', () => {
      var point = new V(10, 0);
      var result = point.angle();
      assert.ok(result === 0);
    });

    it('agnle vertical', () => {
      var point = new V(0, -10);
      var result = point.angle();
      assert.ok(result === 90);
    });

    it('agnle skew', () => {
      var point = new V(10, 10);
      var result = point.angle();
      assert.ok(result === -45);
    });
  });

  describe('angleInRadians', () => {
    it('angleInRadians', () => {
      var point = new V(10, -10);
      var result1 = point.angleInRadians();
      var result2 = point.angleInRadians();
      assert.ok(result1 === result2);
      assert.ok(result1 === (45 * Math.PI / 180));
    });
  });

  describe('dot', () => {
    it('with arguments', () => {
      var point = new V(2, 3);
      var result = point.dot(new V(4, 5));
      assert.ok(result === 23);
    });
    it('without arguments', () => {
      var point = new V(2, 3);
      var result = point.dot();
      assert.ok(result === 13);
    });
  });

  describe('cross', () => {
    it('with arguments', () => {
      var point = new V(2, 3);
      var result = point.cross(new V(4, 5));
      assert.ok(result === -2);
    });
  });

  describe.only('direction', () => {
    it('zero', () => {
      var result = V.direction(0);
      assert.ok(Math.abs(result.x - 1) < EPSILON);
      assert.ok(Math.abs(result.y) < EPSILON);
    });
    it('positive', () => {
      var result = V.direction(90);
      assert.ok(Math.abs(result.x) < EPSILON);
      assert.ok(Math.abs(result.y - 1) < EPSILON);
    });
    it('180', () => {
      var result = V.direction(180);
      assert.ok(Math.abs(result.x + 1) < EPSILON);
      assert.ok(Math.abs(result.y) < EPSILON);
    });
    it('negative', () => {
      var result = V.direction(-90);
      assert.ok(Math.abs(result.x) < EPSILON);
      assert.ok(Math.abs(result.y + 1) < EPSILON);
    });
  });
});
