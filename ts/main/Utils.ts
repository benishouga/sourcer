import V = require('./V');
import Consts = require('./Consts');

var EPS = 10e-12;

class Utils {
  public static createRadar(c: V, direction: number, angle: number, renge: number): (t: V) => boolean {
    var checkDistance = (t: V) => c.distance(t) <= renge;

    if (360 <= angle) {
      return checkDistance
    }

    var checkLeft = Utils.side(c, direction + angle / 2)
    var checkRight = Utils.side(c, direction + 180 - angle / 2)

    if (angle < 180) {
      return (t) => checkDistance(t) && checkLeft(t) && checkRight(t);
    } else {
      return (t) => checkDistance(t) && (checkLeft(t) || checkRight(t));
    }
  }

  public static side(p2: V, degree: number): (t: V) => boolean {
    var radian = Utils.toRadian(degree);
    var p3 = new V(p2.x + Math.cos(radian), p2.y + Math.sin(radian));
    var a = p2.y - p3.y;
    var b = p2.x * p3.y - p3.x * p2.y;
    var d = p2.x + p3.x;

    return (p1: V) => {
      return 0 <= p1.x * a - d * p1.y + b;
    };
  }

  public static calcDistance(f: V, t: V, p: V): number {
    var toFrom = t.subtract(f);
    var pFrom = p.subtract(f);
    if (toFrom.dot(pFrom) < EPS) {
      return pFrom.length();
    }

    var fromTo = f.subtract(t);
    var pTo = p.subtract(t);
    if (fromTo.dot(pTo) < EPS) {
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
