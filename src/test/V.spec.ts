import * as assert from 'assert';
import V from '../main/core/V';

const EPSILON = 10e-12;

describe('V', () => {
  describe('add', () => {
    it('two number arguments', () => {
      const point = new V(10, 20);
      const result = point.add(5, 15);
      assert.ok(result.x === 15);
      assert.ok(result.y === 35);
    });

    it('point arguments', () => {
      const point = new V(10, 20);
      const result = point.add(new V(5, 15));
      assert.ok(result.x === 15);
      assert.ok(result.y === 35);
    });
  });

  describe('subtract', () => {
    it('two number arguments', () => {
      const point = new V(10, 30);
      const result = point.subtract(5, 15);
      assert.ok(result.x === 5);
      assert.ok(result.y === 15);
    });

    it('point arguments', () => {
      const point = new V(10, 30);
      const result = point.subtract(new V(5, 15));
      assert.ok(result.x === 5);
      assert.ok(result.y === 15);
    });
  });

  describe('multiply', () => {
    it('number arguments', () => {
      const point = new V(10, 30);
      const result = point.multiply(3);
      assert.ok(result.x === 30);
      assert.ok(result.y === 90);
    });

    it('point arguments', () => {
      const point = new V(10, 30);
      const result = point.multiply(new V(2, 3));
      assert.ok(result.x === 20);
      assert.ok(result.y === 90);
    });
  });

  describe('divide', () => {
    it('number arguments', () => {
      const point = new V(30, 120);
      const result = point.divide(3);
      assert.ok(result.x === 10);
      assert.ok(result.y === 40);
    });

    it('point arguments', () => {
      const point = new V(30, 120);
      const result = point.divide(new V(3, 4));
      assert.ok(result.x === 10);
      assert.ok(result.y === 30);
    });
  });

  describe('modulo', () => {
    it('number arguments', () => {
      const point = new V(11, 12);
      const result = point.modulo(10);
      assert.ok(result.x === 1);
      assert.ok(result.y === 2);
    });

    it('point arguments', () => {
      const point = new V(11, 13);
      const result = point.modulo(new V(10, 11));
      assert.ok(result.x === 1);
      assert.ok(result.y === 2);
    });
  });

  describe('negate', () => {
    it('negate', () => {
      const point = new V(10, 20);
      const result = point.negate();
      assert.ok(result.x === -10);
      assert.ok(result.y === -20);
    });
  });

  describe('distance', () => {
    it('distance horizontal', () => {
      const point = new V(10, 20);
      const result = point.distance(new V(20, 20));
      assert.ok(result === 10);
    });

    it('distance vertical', () => {
      const point = new V(20, 10);
      const result = point.distance(new V(20, 20));
      assert.ok(result === 10);
    });

    it('distance skew', () => {
      const point = new V(10, 10);
      const result = point.distance(new V(13, 14));
      assert.ok(result === 5);
    });
  });

  describe('length', () => {
    it('length', () => {
      const point = new V(30, 40);
      const result1 = point.length();
      assert.ok(result1 === 50);
      const result2 = point.length();
      assert.ok(result2 === 50);
    });
  });

  describe('normalize', () => {
    it('normalize', () => {
      const point = new V(30, 40);
      const result = point.normalize();
      assert.ok(result.x === 0.6);
      assert.ok(result.y === 0.8);
    });

    it('normalize 0 length', () => {
      const point = new V(0, 0);
      const result = point.normalize();
      assert.ok(result.x === 0);
      assert.ok(result.y === 0);
    });
  });

  describe('angle', () => {
    it('agnle hrizontal', () => {
      const point = new V(10, 0);
      const result = point.angle();
      assert.ok(result === 0);
    });

    it('agnle vertical', () => {
      const point = new V(0, -10);
      const result = point.angle();
      assert.ok(result === 90);
    });

    it('agnle skew', () => {
      const point = new V(10, 10);
      const result = point.angle();
      assert.ok(result === -45);
    });
  });

  describe('angleInRadians', () => {
    it('angleInRadians', () => {
      const point = new V(10, -10);
      const result1 = point.angleInRadians();
      const result2 = point.angleInRadians();
      assert.ok(result1 === result2);
      assert.ok(result1 === 45 * Math.PI / 180);
    });
  });

  describe('dot', () => {
    it('with arguments', () => {
      const point = new V(2, 3);
      const result = point.dot(new V(4, 5));
      assert.ok(result === 23);
    });
    it('without arguments', () => {
      const point = new V(2, 3);
      const result = point.dot();
      assert.ok(result === 13);
    });
  });

  describe('cross', () => {
    it('with arguments', () => {
      const point = new V(2, 3);
      const result = point.cross(new V(4, 5));
      assert.ok(result === -2);
    });
  });

  describe('direction', () => {
    it('zero', () => {
      const result = V.direction(0);
      assert.ok(Math.abs(result.x - 1) < EPSILON);
      assert.ok(Math.abs(result.y) < EPSILON);
    });
    it('positive', () => {
      const result = V.direction(90);
      assert.ok(Math.abs(result.x) < EPSILON);
      assert.ok(Math.abs(result.y - 1) < EPSILON);
    });
    it('180', () => {
      const result = V.direction(180);
      assert.ok(Math.abs(result.x + 1) < EPSILON);
      assert.ok(Math.abs(result.y) < EPSILON);
    });
    it('negative', () => {
      const result = V.direction(-90);
      assert.ok(Math.abs(result.x) < EPSILON);
      assert.ok(Math.abs(result.y + 1) < EPSILON);
    });
  });
});
