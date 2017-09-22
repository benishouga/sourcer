import V from './V';
import Consts from './Consts';

const EPSILON = 10e-12;

export default class Utils {
  public static wait() {
    return new Promise<void>(resolve => setTimeout(resolve, 0));
  }

  public static createRadar(c: V, direction: number, angle: number, renge: number): (t: V) => boolean {
    const checkDistance = (t: V) => c.distance(t) <= renge;

    if (360 <= angle) {
      return checkDistance;
    }

    const checkLeft = Utils.side(c, direction + angle / 2);
    const checkRight = Utils.side(c, direction + 180 - angle / 2);

    if (angle < 180) {
      return t => checkLeft(t) && checkRight(t) && checkDistance(t);
    } else {
      return t => (checkLeft(t) || checkRight(t)) && checkDistance(t);
    }
  }

  public static side(base: V, degree: number): (t: V) => boolean {
    const radian = Utils.toRadian(degree);
    const direction = new V(Math.cos(radian), Math.sin(radian));
    const previously = base.x * direction.y - base.y * direction.x - EPSILON;
    return (target: V) => {
      return 0 <= target.x * direction.y - target.y * direction.x - previously;
    };
  }

  public static calcDistance(f: V, t: V, p: V): number {
    const toFrom = t.subtract(f);
    const pFrom = p.subtract(f);
    if (toFrom.dot(pFrom) < EPSILON) {
      return pFrom.length();
    }

    const fromTo = f.subtract(t);
    const pTo = p.subtract(t);
    if (fromTo.dot(pTo) < EPSILON) {
      return pTo.length();
    }

    return Math.abs(toFrom.cross(pFrom) / toFrom.length());
  }

  public static toRadian(degree: number): number {
    return degree * (Math.PI / 180);
  }

  public static toOpposite(degree: number): number {
    const normalized = Utils.normalizeDegree(degree);
    if (normalized <= 180) {
      return (90 - normalized) * 2 + normalized;
    }
    return (270 - normalized) * 2 + normalized;
  }

  private static normalizeDegree(degree: number) {
    const remainder = degree % 360;
    return remainder < 0 ? remainder + 360 : remainder;
  }

  public static rand(renge: number): number {
    return Math.random() * renge;
  }
}
