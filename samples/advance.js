var Consts = (function () {
    function Consts() {
    }
    Consts.STIR = 3;
    Consts.MISSILE_AMMO = 20;
    return Consts;
})();
var MissilePod = (function () {
    function MissilePod() {
        this.index = 0;
    }
    MissilePod.prototype.fire = function () {
        return new MissileAi(this.index++);
    };
    return MissilePod;
})();
var MissileAi = (function () {
    function MissileAi(index) {
        var _this = this;
        this.frame = 0;
        this.port = function (ctrl) {
            _this.frame++;
            _this.think(ctrl);
        };
        this.odd = index % 2 ? 1 : -1;
        this.stir = (Consts.MISSILE_AMMO - index) * this.odd * Consts.STIR;
    }
    MissileAi.prototype.think = function (ctrl) {
        if (ctrl.scanEnemy(90 + this.stir, 180)) {
            ctrl.turnLeft();
        }
        else {
            ctrl.turnRight();
        }
        var warn = Math.max(0, (100 - ctrl.altitude()) / 30);
        if (this.frame % (warn + 2) < 1) {
            ctrl.speedUp();
        }
        if (0 < this.stir * this.odd) {
            this.stir -= this.odd * 0.5;
        }
        else {
            this.stir = 0;
        }
    };
    return MissileAi;
})();
var ActionQueue = (function () {
    function ActionQueue() {
        this.queue = [];
    }
    ActionQueue.prototype.push = function (action) {
        this.queue.push(action);
    };
    ActionQueue.prototype.next = function (ctrl) {
        if (this.queue.length === 0) {
            return false;
        }
        var action = this.queue.shift();
        action(ctrl);
        return true;
    };
    return ActionQueue;
})();
var SourcerAi = (function () {
    function SourcerAi() {
        var _this = this;
        this.frame = 0;
        this.pod = new MissilePod();
        this.queue = new ActionQueue();
        this.port = function (ctrl) {
            _this.frame++;
            if (_this.queue.next(ctrl)) {
                return;
            }
            _this.think(ctrl);
        };
    }
    SourcerAi.prototype.think = function (ctrl) {
        var _this = this;
        if (!ctrl.scanEnemy(0, 180)) {
            ctrl.turn();
            return;
        }
        if (ctrl.temperature() < 60) {
            if (this.frame % 2 === 0 && ctrl.missileAmmo() !== 0) {
                this.queue.push(function (ctrl) {
                    ctrl.fireMissile(_this.pod.fire().port);
                });
                ctrl.turn();
                return;
            }
            var direction = this.scanEnemyDirection(ctrl, 6);
            this.queue.push(function (ctrl) {
                ctrl.fireLaser(direction, 100);
            });
            for (var i = 1; i <= 2; i++) {
                (function () {
                    var stir = i * 6;
                    _this.queue.push(function (ctrl) {
                        ctrl.fireLaser(direction + stir, 100);
                    });
                    _this.queue.push(function (ctrl) {
                        ctrl.fireLaser(direction - stir, 100);
                    });
                })();
            }
            return;
        }
        if (!(this.frame % 4)) {
            for (var i = 1; i <= 3; i++) {
                this.queue.push(function (ctrl) {
                    if (ctrl.altitude() < _this.frame * 3 % 250 + 40) {
                        ctrl.ascent();
                    }
                    else {
                        ctrl.descent();
                    }
                    ctrl.ahead();
                });
            }
        }
    };
    SourcerAi.prototype.scanEnemyDirection = function (ctrl, precision) {
        var currentAngle = 180;
        var currentDirection = 0;
        for (var i = 0; i < precision; i++) {
            currentAngle /= 2;
            var up = currentDirection + currentAngle / 2;
            var down = currentDirection - currentAngle / 2;
            if (ctrl.scanEnemy(up, currentAngle)) {
                currentDirection = up;
            }
            else {
                currentDirection = down;
            }
        }
        return currentDirection;
    };
    return SourcerAi;
})();
module.exports = new SourcerAi().port;
