"use strict";
var V_1 = require('./V');
var EPSILON = 10e-12;
var Utils = (function () {
    function Utils() {
    }
    Utils.createRadar = function (c, direction, angle, renge) {
        var checkDistance = function (t) { return c.distance(t) <= renge; };
        if (360 <= angle) {
            return checkDistance;
        }
        var checkLeft = Utils.side(c, direction + angle / 2);
        var checkRight = Utils.side(c, direction + 180 - angle / 2);
        if (angle < 180) {
            return function (t) { return checkLeft(t) && checkRight(t) && checkDistance(t); };
        }
        else {
            return function (t) { return (checkLeft(t) || checkRight(t)) && checkDistance(t); };
        }
    };
    Utils.side = function (base, degree) {
        var radian = Utils.toRadian(degree);
        var direction = new V_1.default(Math.cos(radian), Math.sin(radian));
        var previously = base.x * direction.y - base.y * direction.x - EPSILON;
        return function (target) {
            return 0 <= target.x * direction.y - target.y * direction.x - previously;
        };
    };
    Utils.calcDistance = function (f, t, p) {
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
    };
    Utils.toRadian = function (degree) {
        return degree * (Math.PI / 180);
    };
    Utils.toOpposite = function (degree) {
        degree = degree % 360;
        if (degree < 0) {
            degree = degree + 360;
        }
        if (degree <= 180) {
            return (90 - degree) * 2 + degree;
        }
        else {
            return (270 - degree) * 2 + degree;
        }
    };
    Utils.rand = function (renge) {
        return Math.random() * renge;
    };
    return Utils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;
