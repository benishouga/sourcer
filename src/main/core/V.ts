export default class V {
  private calculatedLength: number;
  private calculatedAngle: number;

  constructor(public x: number, public y: number) {
  }

  public add(v: V): V;
  public add(x: number, y: number): V;
  public add(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x + (v.x || 0), this.y + (v.y || 0));
    } else {
      return new V(this.x + (v || 0), this.y + (y || 0));
    }
  }
  public subtract(v: V): V;
  public subtract(x: number, y: number): V;
  public subtract(v: any, y?: number): V {
    if (v instanceof V) {
      return new V(this.x - (v.x || 0), this.y - (v.y || 0));
    } else {
      return new V(this.x - (v || 0), this.y - (y || 0));
    }
  }
  public multiply(v: V | number): V {
    if (v instanceof V) {
      return new V(this.x * v.x, this.y * v.y);
    } else {
      return new V(this.x * v, this.y * v);
    }
  }
  public divide(v: V | number): V {
    if (v instanceof V) {
      return new V(this.x / v.x, this.y / v.y);
    } else {
      return new V(this.x / v, this.y / v);
    }
  }
  public modulo(v: V | number): V {
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
    if (this.calculatedLength) {
      return this.calculatedLength;
    } else {
      this.calculatedLength = Math.sqrt(this.dot());
      return this.calculatedLength;
    }
  }
  public normalize(): V {
    const current = this.length();
    const scale = current !== 0 ? 1 / current : 0;
    return this.multiply(scale);
  }
  public angle(): number {
    return this.angleInRadians() * 180 / Math.PI;
  }
  public angleInRadians(): number {
    if (this.calculatedAngle) {
      return this.calculatedAngle;
    } else {
      this.calculatedAngle = Math.atan2(-this.y, this.x);
      return this.calculatedAngle;
    }
  }
  public dot(point: V = this): number {
    return this.x * point.x + this.y * point.y;
  }
  public cross(point: V): number {
    return this.x * point.y - this.y * point.x;
  }
  public rotate(degree: number) {
    const radian = degree * (Math.PI / 180);
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    return new V(cos * this.x - sin * this.y, cos * this.y + sin * this.x);
  }
  public static direction(degree: number) {
    return new V(1, 0).rotate(degree);
  }
  public minimize() {
    return { x: Math.round(this.x), y: Math.round(this.y) } as V;
  }
}
