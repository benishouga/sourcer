import V = require('./V');
import Consts = require('./Consts');

var EPSILON = 10e-12;

class Utils {
  public static createRadar(c: V, direction: number, angle: number, renge: number): (t: V) => boolean {
    var checkDistance = (t: V) => c.distance(t) <= renge;

    if (360 <= angle) {
      return checkDistance
    }

    var checkLeft = Utils.side(c, direction + angle / 2)
    var checkRight = Utils.side(c, direction + 180 - angle / 2)

    if (angle < 180) {
      return (t) => checkLeft(t) && checkRight(t) && checkDistance(t);
    } else {
      return (t) => (checkLeft(t) || checkRight(t)) && checkDistance(t);
    }
  }

  public static side(base: V, degree: number): (t: V) => boolean {
    var radian = Utils.toRadian(degree);
    var direction = new V(Math.cos(radian), Math.sin(radian));
    var previously = base.x * direction.y - base.y * direction.x - EPSILON;
    return (target: V) => {
      return 0 <= target.x * direction.y - target.y * direction.x - previously;
    };
  }

  public static calcDistance(f: V, t: V, p: V): number {
    var toFrom = t.subtract(f);
    var pFrom = p.subtract(f);
    if (toFrom.dot(pFrom) < EPSILON) {
      return pFrom.length();
    }

    var fromTo = f.subtract(t);
    var pTo = p.subtract(t);
    if (fromTo.dot(pTo) < EPSILON) {
      return pTo.length();
    }

    return Math.abs(toFrom.cross(pFrom) / toFrom.length());
  }

  public static toRadian(degree: number): number {
    return degree * (Math.PI / 180);
  }

  public static toOpposite(degree: number): number {
    degree = degree % 360;
    if (degree < 0) {
      degree = degree + 360;
    }
    if (degree <= 180) {
      return (90 - degree) * 2 + degree;
    } else {
      return (270 - degree) * 2 + degree;
    }
  }
}

export = Utils;
