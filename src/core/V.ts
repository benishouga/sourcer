export default class V {
  _length: number = null;
  _angle: number = null;

  constructor(public x: number, public y: number) {
  }

  add(v: V): V;
  add(x: number, y: number): V;
  add(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x + v.x, this.y + v.y);
    } else {
      return new V(this.x + v, this.y + y);
    }
  }
  subtract(v: V): V;
  subtract(x: number, y: number): V;
  subtract(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x - v.x, this.y - v.y);
    } else {
      return new V(this.x - v, this.y - y);
    }
  }
  multiply(v: V): V;
  multiply(n: number): V;
  multiply(v: any): V {
    if (v instanceof V) {
      return new V(this.x * v.x, this.y * v.y);
    } else {
      return new V(this.x * v, this.y * v);
    }
  }
  divide(v: V): V;
  divide(n: number): V;
  divide(v: any): V {
    if (v instanceof V) {
      return new V(this.x / v.x, this.y / v.y);
    } else {
      return new V(this.x / v, this.y / v);
    }
  }
  modulo(v: V): V;
  modulo(n: number): V;
  modulo(v: any): V {
    if (v instanceof V) {
      return new V(this.x % v.x, this.y % v.y);
    } else {
      return new V(this.x % v, this.y % v);
    }
  }
  negate(): V {
    return new V(-this.x, -this.y);
  }
  distance(v: V): number {
    return this.subtract(v).length();
  }
  length(): number {
    if (this._length) {
      return this._length;
    } else {
      this._length = Math.sqrt(this.dot());
      return this._length;
    }
  }
  normalize(): V {
    var current = this.length();
    var scale = current !== 0 ? 1 / current : 0;
    return this.multiply(scale);
  }
  angle(): number {
    return this.angleInRadians() * 180 / Math.PI;
  }
  angleInRadians(): number {
    if (this._angle) {
      return this._angle;
    } else {
      this._angle = Math.atan2(-this.y, this.x);
      return this._angle;
    }
  }
  dot(point?: V): number {
    if (point === undefined) {
      point = this;
    }
    return this.x * point.x + this.y * point.y;
  }
  cross(point: V): number {
    return this.x * point.y - this.y * point.x
  }
  rotate(degree: number) {
    var radian = degree * (Math.PI / 180);
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);
    return new V(cos * this.x - sin * this.y, cos * this.y + sin * this.x);
  }
  static direction(degree: number) {
    return new V(1, 0).rotate(degree);
  }
}
