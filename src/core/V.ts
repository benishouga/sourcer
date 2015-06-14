class V {
  public _length: number = null;
  public _angle: number = null;

  constructor(public x: number, public y: number) {
  }

  public add(v: V): V;
  public add(x: number, y: number): V;
  public add(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x + v.x, this.y + v.y);
    } else {
      return new V(this.x + v, this.y + y);
    }
  }
  public subtract(v: V): V;
  public subtract(x: number, y: number): V;
  public subtract(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x - v.x, this.y - v.y);
    } else {
      return new V(this.x - v, this.y - y);
    }
  }
  public multiply(v: V): V;
  public multiply(n: number): V;
  public multiply(v: any): V {
    if (v instanceof V) {
      return new V(this.x * v.x, this.y * v.y);
    } else {
      return new V(this.x * v, this.y * v);
    }
  }
  public divide(v: V): V;
  public divide(n: number): V;
  public divide(v: any): V {
    if (v instanceof V) {
      return new V(this.x / v.x, this.y / v.y);
    } else {
      return new V(this.x / v, this.y / v);
    }
  }
  public modulo(v: V): V;
  public modulo(n: number): V;
  public modulo(v: any): V {
    if (v instanceof V) {
      return new V(this.x % v.x, this.y % v.y);
    } else {
      return new V(this.x % v, this.y % v);
    }
  }
  public negate(): V {
    return new V(-this.x, -this.y);
  }
  public distance(v: V): number {
    return this.subtract(v).length();
  }
  public length(): number {
    if (this._length) {
      return this._length;
    } else {
      this._length = Math.sqrt(this.dot());
      return this._length;
    }
  }
  public normalize(): V {
    var current = this.length();
    var scale = current !== 0 ? 1 / current : 0;
    return this.multiply(scale);
  }
  public angle(): number {
    return this.angleInRadians() * 180 / Math.PI;
  }
  public angleInRadians(): number {
    if (this._angle) {
      return this._angle;
    } else {
      this._angle = Math.atan2(-this.y, this.x);
      return this._angle;
    }
  }
  public dot(point?: V): number {
    if (point === undefined) {
      point = this;
    }
    return this.x * point.x + this.y * point.y;
  }
  public cross(point: V): number {
    return this.x * point.y - this.y * point.x
  }
  public rotate(degree: number) {
    var radian = degree * (Math.PI / 180);
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);
    return new V(cos * this.x - sin * this.y, cos * this.y + sin * this.x);
  }
  public static direction(degree: number) {
    return new V(1, 0).rotate(degree);
  }
}

export = V;
