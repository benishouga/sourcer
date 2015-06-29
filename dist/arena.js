(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Field = require('./core/Field');
var Sourcer = require('./core/Sourcer');
var Utils = require('./core/Utils');
onmessage = function (e) {
    var field = new Field();
    var sourcer1 = new Sourcer(field, Utils.rand(320) - 160, Utils.rand(320) - 160, e.data.sources[0]);
    var sourcer2 = new Sourcer(field, Utils.rand(320) - 160, Utils.rand(320) - 160, e.data.sources[1]);
    field.addSourcer(sourcer1);
    field.addSourcer(sourcer2);
    var listener = {
        onPreThink: function (sourcerId) {
            postMessage({
                command: "PreThink",
                index: sourcer1.id == sourcerId ? 0 : 1
            });
        },
        onPostThink: function (sourcerId) {
            postMessage({
                command: "PostThink",
                index: sourcer1.id == sourcerId ? 0 : 1
            });
        }
    };
    for (var i = 0; i < 2000 && !field.isFinish(); i++) {
        field.tick(listener);
        postMessage({
            command: "Frame",
            field: field.dump()
        });
    }
    postMessage({
        command: "EndOfGame"
    });
};

},{"./core/Field":7,"./core/Sourcer":15,"./core/Utils":18}],2:[function(require,module,exports){
var V = require('./V');
var Configs = require('./Configs');
var Actor = (function () {
    function Actor(field, x, y) {
        this.field = field;
        this.size = Configs.COLLISION_SIZE;
        this.wait = 0;
        this.wait = 0;
        this.position = new V(x, y);
        this.speed = new V(0, 0);
    }
    Actor.prototype.think = function () {
        if (this.wait <= 0) {
            this.wait = 0;
            this.onThink();
        }
        else {
            this.wait--;
        }
    };
    Actor.prototype.onThink = function () {
    };
    Actor.prototype.action = function () {
    };
    Actor.prototype.move = function () {
        this.position = this.position.add(this.speed);
    };
    Actor.prototype.onHit = function (shot) {
    };
    Actor.prototype.dump = function () {
        return {
            id: this.id,
            position: this.position,
            speed: this.speed,
            direction: this.direction
        };
    };
    return Actor;
})();
module.exports = Actor;

},{"./Configs":4,"./V":19}],3:[function(require,module,exports){
var Command = (function () {
    function Command() {
        this.isAccepted = false;
    }
    Command.prototype.validate = function () {
        if (!this.isAccepted) {
            throw new Error("Invalid command. ");
        }
    };
    Command.prototype.accept = function () {
        this.isAccepted = true;
    };
    Command.prototype.unaccept = function () {
        this.isAccepted = false;
    };
    return Command;
})();
module.exports = Command;

},{}],4:[function(require,module,exports){
var Configs = (function () {
    function Configs() {
    }
    Configs.INITIAL_SHIELD = 100;
    Configs.INITIAL_FUEL = 100;
    Configs.INITIAL_MISSILE_AMMO = 20;
    Configs.FUEL_COST = 0.24;
    Configs.COLLISION_SIZE = 4;
    Configs.SCAN_WAIT = 0.35;
    Configs.SPEED_RESISTANCE = 0.96;
    Configs.GRAVITY = 0.08;
    Configs.TOP_INVISIBLE_HAND = 480;
    Configs.DISTANCE_BORDAR = 400;
    Configs.DISTANCE_INVISIBLE_HAND = 0.008;
    Configs.OVERHEAT_BORDER = 100;
    Configs.OVERHEAT_DAMAGE_LINEAR_WEIGHT = 0.05;
    Configs.OVERHEAT_DAMAGE_POWER_WEIGHT = 0.012;
    Configs.GROUND_DAMAGE_SCALE = 1;
    Configs.COOL_DOWN = 0.5;
    Configs.ON_HIT_SPEED_GIVEN_RATE = 0.4;
    return Configs;
})();
module.exports = Configs;

},{}],5:[function(require,module,exports){
var Consts = (function () {
    function Consts() {
    }
    Consts.DIRECTION_RIGHT = 1;
    Consts.DIRECTION_LEFT = -1;
    Consts.VERTICAL_UP = "vertial_up";
    Consts.VERTICAL_DOWN = "vertial_down";
    return Consts;
})();
;
module.exports = Consts;

},{}],6:[function(require,module,exports){
var Controller = (function () {
    function Controller(actor) {
        var _this = this;
        this.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message, optionalParams);
        };
        this.field = actor.field;
        this.frame = function () { return _this.field.frame; };
        this.altitude = function () { return actor.position.y; };
        this.wait = function (frame) {
            if (0 < frame) {
                actor.wait += frame;
            }
        };
    }
    return Controller;
})();
module.exports = Controller;

},{}],7:[function(require,module,exports){
var Utils = require('./Utils');
var Field = (function () {
    function Field() {
        this.id = 0;
        this.frame = 0;
        this.sourcers = [];
        this.shots = [];
        this.fxs = [];
    }
    Field.prototype.addSourcer = function (sourcer) {
        sourcer.id = "sourcer" + (this.id++);
        this.sourcers.push(sourcer);
    };
    Field.prototype.addShot = function (shot) {
        shot.id = "shot" + (this.id++);
        this.shots.push(shot);
    };
    Field.prototype.removeShot = function (target) {
        for (var i = 0; i < this.shots.length; i++) {
            var actor = this.shots[i];
            if (actor === target) {
                this.shots.splice(i, 1);
                return;
            }
        }
    };
    Field.prototype.addFx = function (fx) {
        fx.id = "fx" + (this.id++);
        this.fxs.push(fx);
    };
    Field.prototype.removeFx = function (target) {
        for (var i = 0; i < this.fxs.length; i++) {
            var fx = this.fxs[i];
            if (fx === target) {
                this.fxs.splice(i, 1);
                return;
            }
        }
    };
    Field.prototype.tick = function (listener) {
        this.center = this.computeCenter();
        this.sourcers.forEach(function (sourcer) {
            listener.onPreThink(sourcer.id);
            sourcer.think();
            listener.onPostThink(sourcer.id);
        });
        this.shots.forEach(function (shot) {
            listener.onPreThink(shot.owner.id);
            shot.think();
            listener.onPostThink(shot.owner.id);
        });
        this.sourcers.forEach(function (actor) {
            actor.action();
        });
        this.shots.forEach(function (actor) {
            actor.action();
        });
        this.fxs.forEach(function (fx) {
            fx.action();
        });
        this.sourcers.forEach(function (actor) {
            actor.move();
        });
        this.shots.forEach(function (actor) {
            actor.move();
        });
        this.fxs.forEach(function (fx) {
            fx.move();
        });
        this.sourcers.forEach(function (sourcer) {
            if (sourcer.shield <= 0) {
                sourcer.alive = false;
            }
        });
        this.frame++;
    };
    Field.prototype.scanEnemy = function (owner, radar) {
        for (var i = 0; i < this.sourcers.length; i++) {
            var sourcer = this.sourcers[i];
            if (sourcer.alive && sourcer !== owner && radar(sourcer.position)) {
                return true;
            }
        }
        return false;
    };
    Field.prototype.scanAttack = function (owner, radar) {
        var ownerPosition = owner.position;
        for (var i = 0; i < this.shots.length; i++) {
            var shot = this.shots[i];
            var actorPosition = shot.position;
            if (shot.owner !== owner && radar(actorPosition)) {
                var currentDistance = ownerPosition.distance(actorPosition);
                var nextDistance = ownerPosition.distance(actorPosition.add(shot.speed));
                if (nextDistance < currentDistance) {
                    return true;
                }
            }
        }
        return false;
    };
    Field.prototype.checkCollision = function (shot) {
        var f = shot.position;
        var t = shot.position.add(shot.speed);
        for (var i = 0; i < this.shots.length; i++) {
            var actor = this.shots[i];
            if (actor.breakable && actor.owner !== shot.owner) {
                var distance = Utils.calcDistance(f, t, actor.position);
                if (distance < shot.size + actor.size) {
                    return actor;
                }
            }
        }
        for (var i = 0; i < this.sourcers.length; i++) {
            var sourcer = this.sourcers[i];
            if (sourcer.alive && sourcer !== shot.owner) {
                var distance = Utils.calcDistance(f, t, sourcer.position);
                if (distance < shot.size + actor.size) {
                    return sourcer;
                }
            }
        }
        return null;
    };
    Field.prototype.checkCollisionEnviroment = function (shot) {
        return shot.position.y < 0;
    };
    Field.prototype.computeCenter = function () {
        var count = 0;
        var sumX = 0;
        this.sourcers.forEach(function (sourcer) {
            if (sourcer.alive) {
                sumX += sourcer.position.x;
                count++;
            }
        });
        return sumX / count;
    };
    Field.prototype.isFinish = function () {
        var finished = false;
        if (!this.finishedFrame) {
            for (var i = 0; i < this.sourcers.length; i++) {
                var sourcer = this.sourcers[i];
                if (!sourcer.alive) {
                    finished = true;
                    this.finishedFrame = this.frame;
                }
            }
            return false;
        }
        if (this.finishedFrame < this.frame - 90) {
            return true;
        }
        return false;
    };
    Field.prototype.dump = function () {
        var sourcersDump = [];
        var shotsDump = [];
        var fxDump = [];
        this.sourcers.forEach(function (actor) {
            sourcersDump.push(actor.dump());
        });
        this.shots.forEach(function (actor) {
            shotsDump.push(actor.dump());
        });
        this.fxs.forEach(function (fx) {
            fxDump.push(fx.dump());
        });
        return {
            frame: this.frame,
            sourcers: sourcersDump,
            shots: shotsDump,
            fxs: fxDump
        };
    };
    return Field;
})();
module.exports = Field;

},{"./Utils":18}],8:[function(require,module,exports){
var Fx = (function () {
    function Fx(field, position, speed, length) {
        this.field = field;
        this.position = position;
        this.speed = speed;
        this.length = length;
        this.frame = 0;
    }
    Fx.prototype.action = function () {
        this.frame++;
        if (this.length <= this.frame) {
            this.field.removeFx(this);
        }
    };
    Fx.prototype.move = function () {
        this.position = this.position.add(this.speed);
    };
    Fx.prototype.dump = function () {
        return {
            id: this.id,
            position: this.position,
            frame: this.frame,
            length: this.length
        };
    };
    return Fx;
})();
module.exports = Fx;

},{}],9:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Shot = require('./Shot');
var V = require('./V');
var Laser = (function (_super) {
    __extends(Laser, _super);
    function Laser(field, owner, direction, power) {
        _super.call(this, field, owner, "Laser");
        this.direction = direction;
        this.temperature = 5;
        this.damage = function () { return 8; };
        this.speed = V.direction(direction).multiply(power);
    }
    return Laser;
})(Shot);
module.exports = Laser;

},{"./Shot":13,"./V":19}],10:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Shot = require('./Shot');
var Configs = require('./Configs');
var MissileCommand = require('./MissileCommand');
var MissileController = require('./MissileController');
var Consts = require('./Consts');
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(field, owner, ai) {
        var _this = this;
        _super.call(this, field, owner, "Missile");
        this.temperature = 5;
        this.damage = function () { return 10 + _this.speed.length() * 2; };
        this.fuel = 100;
        this.breakable = true;
        this.ai = ai;
        this.direction = owner.direction === Consts.DIRECTION_RIGHT ? 0 : 180;
        this.speed = owner.speed;
        this.command = new MissileCommand(this);
        this.command.reset();
        this.controller = new MissileController(this);
    }
    Missile.prototype.onThink = function () {
        this.command.reset();
        try {
            this.command.accept();
            this.ai(this.controller);
            this.command.unaccept();
        }
        catch (error) {
            this.command.reset();
        }
    };
    Missile.prototype.onAction = function () {
        this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);
        this.command.execute();
        this.command.reset();
    };
    Missile.prototype.onHit = function (attack) {
        this.field.removeShot(this);
        this.field.removeShot(attack);
    };
    Missile.prototype.opposite = function (direction) {
        return this.direction + direction;
    };
    return Missile;
})(Shot);
module.exports = Missile;

},{"./Configs":4,"./Consts":5,"./MissileCommand":11,"./MissileController":12,"./Shot":13}],11:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Command = require('./Command');
var Configs = require('./Configs');
var V = require('./V');
var MissileCommand = (function (_super) {
    __extends(MissileCommand, _super);
    function MissileCommand(missile) {
        _super.call(this);
        this.missile = missile;
        this.reset();
    }
    MissileCommand.prototype.reset = function () {
        this.speedUp = 0;
        this.speedDown = 0;
        this.turn = 0;
    };
    MissileCommand.prototype.execute = function () {
        if (0 < this.missile.fuel) {
            this.missile.direction += this.turn;
            var normalized = V.direction(this.missile.direction);
            this.missile.speed = this.missile.speed.add(normalized.multiply(this.speedUp));
            this.missile.speed = this.missile.speed.multiply(1 - this.speedDown);
            this.missile.fuel -= (this.speedUp + this.speedDown * 3) * Configs.FUEL_COST;
            this.missile.fuel = Math.max(0, this.missile.fuel);
        }
    };
    return MissileCommand;
})(Command);
module.exports = MissileCommand;

},{"./Command":3,"./Configs":4,"./V":19}],12:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controller = require('./Controller');
var Utils = require('./Utils');
var MissileController = (function (_super) {
    __extends(MissileController, _super);
    function MissileController(missile) {
        _super.call(this, missile);
        this.direction = function () { return missile.direction; };
        var field = missile.field;
        var command = missile.command;
        this.fuel = function () { return missile.fuel; };
        this.scanEnemy = function (direction, angle, renge) {
            command.validate();
            missile.wait += 1.5;
            direction = missile.opposite(direction);
            renge = renge || Number.MAX_VALUE;
            var radar = Utils.createRadar(missile.position, direction, angle, renge);
            return missile.field.scanEnemy(missile.owner, radar);
        };
        this.speedUp = function () {
            command.validate();
            command.speedUp = 0.8;
        };
        this.speedDown = function () {
            command.validate();
            command.speedDown = 0.1;
        };
        this.turnRight = function () {
            command.validate();
            command.turn = -9;
        };
        this.turnLeft = function () {
            command.validate();
            command.turn = 9;
        };
    }
    return MissileController;
})(Controller);
module.exports = MissileController;

},{"./Controller":6,"./Utils":18}],13:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Actor = require('./Actor');
var Fx = require('./Fx');
var Shot = (function (_super) {
    __extends(Shot, _super);
    function Shot(field, owner, type) {
        _super.call(this, field, owner.position.x, owner.position.y);
        this.owner = owner;
        this.type = type;
        this.temperature = 0;
        this.damage = function () { return 0; };
        this.breakable = false;
    }
    Shot.prototype.action = function () {
        this.onAction();
        var collided = this.field.checkCollision(this);
        if (collided) {
            collided.onHit(this);
            this.field.addFx(new Fx(this.field, this.position, this.speed.divide(2), 8));
        }
        if (this.field.checkCollisionEnviroment(this)) {
            this.field.removeShot(this);
            this.field.addFx(new Fx(this.field, this.position, this.speed.divide(2), 8));
        }
    };
    Shot.prototype.reaction = function (sourcer) {
        sourcer.temperature += this.temperature;
    };
    Shot.prototype.onAction = function () {
    };
    Shot.prototype.dump = function () {
        var dump = _super.prototype.dump.call(this);
        dump.type = this.type;
        return dump;
    };
    return Shot;
})(Actor);
module.exports = Shot;

},{"./Actor":2,"./Fx":8}],14:[function(require,module,exports){
var ShotParam = (function () {
    function ShotParam() {
    }
    return ShotParam;
})();
module.exports = ShotParam;

},{}],15:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var chainchomp = require('../libs/chainchomp');
var Actor = require('./Actor');
var SourcerCommand = require('./SourcerCommand');
var SourcerController = require('./SourcerController');
var Configs = require('./Configs');
var Consts = require('./Consts');
var Utils = require('./Utils');
var V = require('./V');
var Laser = require('./Laser');
var Missile = require('./Missile');
var Sourcer = (function (_super) {
    __extends(Sourcer, _super);
    function Sourcer(field, x, y, ai) {
        _super.call(this, field, x, y);
        this.alive = true;
        this.temperature = 0;
        this.shield = Configs.INITIAL_SHIELD;
        this.missileAmmo = Configs.INITIAL_MISSILE_AMMO;
        this.fuel = Configs.INITIAL_FUEL;
        this.direction = Consts.DIRECTION_RIGHT;
        this.command = new SourcerCommand(this);
        this.controller = new SourcerController(this);
        try {
            this.ai = chainchomp(ai);
        }
        catch (error) {
            this.ai = null;
        }
    }
    Sourcer.prototype.onThink = function () {
        if (this.ai === null || !this.alive) {
            return;
        }
        try {
            this.command.accept();
            this.ai(this.controller);
        }
        catch (error) {
            this.command.reset();
        }
        finally {
            this.command.unaccept();
        }
    };
    Sourcer.prototype.action = function () {
        this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);
        this.speed = this.speed.subtract(0, Configs.GRAVITY);
        if (Configs.TOP_INVISIBLE_HAND < this.position.y) {
            var invisiblePower = (this.position.y - Configs.TOP_INVISIBLE_HAND) * 0.1;
            this.speed = this.speed.subtract(0, Configs.GRAVITY * invisiblePower);
        }
        var diff = this.field.center - this.position.x;
        if (Configs.DISTANCE_BORDAR < Math.abs(diff)) {
            var invisibleHand = diff * Configs.DISTANCE_INVISIBLE_HAND;
            this.position = new V(this.position.x + invisibleHand, this.position.y);
        }
        if (this.position.y < 0) {
            this.shield -= (-this.speed.y * Configs.GROUND_DAMAGE_SCALE);
            this.position = new V(this.position.x, 0);
            this.speed = new V(this.speed.x, 0);
        }
        this.temperature -= Configs.COOL_DOWN;
        this.temperature = Math.max(this.temperature, 0);
        var overheat = (this.temperature - Configs.OVERHEAT_BORDER);
        if (0 < overheat) {
            var linearDamage = overheat * Configs.OVERHEAT_DAMAGE_LINEAR_WEIGHT;
            var powerDamage = Math.pow(overheat * Configs.OVERHEAT_DAMAGE_POWER_WEIGHT, 2);
            this.shield -= (linearDamage + powerDamage);
        }
        this.shield = Math.max(0, this.shield);
        this.command.execute();
        this.command.reset();
    };
    Sourcer.prototype.fire = function (param) {
        if (param.shotType === "Laser") {
            var direction = this.opposite(param.direction);
            var shot = new Laser(this.field, this, direction, param.power);
            shot.reaction(this);
            this.field.addShot(shot);
        }
        if (param.shotType === 'Missile') {
            if (0 < this.missileAmmo) {
                var missile = new Missile(this.field, this, param.ai);
                missile.reaction(this);
                this.missileAmmo--;
                this.field.addShot(missile);
            }
        }
    };
    Sourcer.prototype.opposite = function (direction) {
        if (this.direction === Consts.DIRECTION_LEFT) {
            return Utils.toOpposite(direction);
        }
        else {
            return direction;
        }
    };
    Sourcer.prototype.onHit = function (shot) {
        this.speed = this.speed.add(shot.speed.multiply(Configs.ON_HIT_SPEED_GIVEN_RATE));
        this.shield -= shot.damage();
        this.shield = Math.max(0, this.shield);
        this.field.removeShot(shot);
    };
    Sourcer.prototype.dump = function () {
        var dump = _super.prototype.dump.call(this);
        dump.shield = this.shield;
        dump.temperature = this.temperature;
        dump.missileAmmo = this.missileAmmo;
        dump.fuel = this.fuel;
        return dump;
    };
    return Sourcer;
})(Actor);
module.exports = Sourcer;

},{"../libs/chainchomp":20,"./Actor":2,"./Configs":4,"./Consts":5,"./Laser":9,"./Missile":10,"./SourcerCommand":16,"./SourcerController":17,"./Utils":18,"./V":19}],16:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Command = require('./Command');
var Configs = require('./Configs');
var SourcerCommand = (function (_super) {
    __extends(SourcerCommand, _super);
    function SourcerCommand(sourcer) {
        _super.call(this);
        this.sourcer = sourcer;
        this.reset();
    }
    SourcerCommand.prototype.reset = function () {
        this.ahead = 0;
        this.ascent = 0;
        this.turn = false;
        this.fire = null;
    };
    SourcerCommand.prototype.execute = function () {
        if (this.fire) {
            this.sourcer.fire(this.fire);
        }
        if (this.turn) {
            this.sourcer.direction *= -1;
        }
        if (0 < this.sourcer.fuel) {
            this.sourcer.speed = this.sourcer.speed.add(this.ahead * this.sourcer.direction, this.ascent);
            this.sourcer.fuel -= (Math.abs(this.ahead) + Math.abs(this.ascent)) * Configs.FUEL_COST;
            this.sourcer.fuel = Math.max(0, this.sourcer.fuel);
        }
    };
    return SourcerCommand;
})(Command);
module.exports = SourcerCommand;

},{"./Command":3,"./Configs":4}],17:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controller = require('./Controller');
var Configs = require('./Configs');
var Utils = require('./Utils');
var ShotParam = require('./ShotParam');
var SourcerController = (function (_super) {
    __extends(SourcerController, _super);
    function SourcerController(sourcer) {
        _super.call(this, sourcer);
        this.shield = function () { return sourcer.shield; };
        this.temperature = function () { return sourcer.temperature; };
        this.missileAmmo = function () { return sourcer.missileAmmo; };
        this.fuel = function () { return sourcer.fuel; };
        var field = sourcer.field;
        var command = sourcer.command;
        this.scanEnemy = function (direction, angle, renge) {
            command.validate();
            sourcer.wait += Configs.SCAN_WAIT;
            direction = sourcer.opposite(direction);
            renge = renge || Number.MAX_VALUE;
            var radar = Utils.createRadar(sourcer.position, direction, angle, renge);
            return field.scanEnemy(sourcer, radar);
        };
        this.scanAttack = function (direction, angle, renge) {
            command.validate();
            sourcer.wait += Configs.SCAN_WAIT;
            direction = sourcer.opposite(direction);
            renge = renge || Number.MAX_VALUE;
            var radar = Utils.createRadar(sourcer.position, direction, angle, renge);
            return field.scanAttack(sourcer, radar);
        };
        this.ahead = function () {
            command.validate();
            command.ahead = 0.8;
        };
        this.back = function () {
            command.validate();
            command.ahead = -0.4;
        };
        this.ascent = function () {
            command.validate();
            command.ascent = 0.9;
        };
        this.descent = function () {
            command.validate();
            command.ascent = -0.9;
        };
        this.turn = function () {
            command.validate();
            command.turn = true;
        };
        this.fireLaser = function (direction, power) {
            command.validate();
            power = Math.min(Math.max(power || 8, 3), 8);
            command.fire = new ShotParam();
            command.fire.power = power;
            command.fire.direction = direction;
            command.fire.shotType = 'Laser';
        };
        this.fireMissile = function (ai) {
            command.validate();
            command.fire = new ShotParam();
            command.fire.ai = ai;
            command.fire.shotType = 'Missile';
        };
    }
    return SourcerController;
})(Controller);
module.exports = SourcerController;

},{"./Configs":4,"./Controller":6,"./ShotParam":14,"./Utils":18}],18:[function(require,module,exports){
var V = require('./V');
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
        var direction = new V(Math.cos(radian), Math.sin(radian));
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
})();
module.exports = Utils;

},{"./V":19}],19:[function(require,module,exports){
var V = (function () {
    function V(x, y) {
        this.x = x;
        this.y = y;
        this._length = null;
        this._angle = null;
    }
    V.prototype.add = function (v, y) {
        if (v instanceof V) {
            return new V(this.x + v.x, this.y + v.y);
        }
        else {
            return new V(this.x + v, this.y + y);
        }
    };
    V.prototype.subtract = function (v, y) {
        if (v instanceof V) {
            return new V(this.x - v.x, this.y - v.y);
        }
        else {
            return new V(this.x - v, this.y - y);
        }
    };
    V.prototype.multiply = function (v) {
        if (v instanceof V) {
            return new V(this.x * v.x, this.y * v.y);
        }
        else {
            return new V(this.x * v, this.y * v);
        }
    };
    V.prototype.divide = function (v) {
        if (v instanceof V) {
            return new V(this.x / v.x, this.y / v.y);
        }
        else {
            return new V(this.x / v, this.y / v);
        }
    };
    V.prototype.modulo = function (v) {
        if (v instanceof V) {
            return new V(this.x % v.x, this.y % v.y);
        }
        else {
            return new V(this.x % v, this.y % v);
        }
    };
    V.prototype.negate = function () {
        return new V(-this.x, -this.y);
    };
    V.prototype.distance = function (v) {
        return this.subtract(v).length();
    };
    V.prototype.length = function () {
        if (this._length) {
            return this._length;
        }
        else {
            this._length = Math.sqrt(this.dot());
            return this._length;
        }
    };
    V.prototype.normalize = function () {
        var current = this.length();
        var scale = current !== 0 ? 1 / current : 0;
        return this.multiply(scale);
    };
    V.prototype.angle = function () {
        return this.angleInRadians() * 180 / Math.PI;
    };
    V.prototype.angleInRadians = function () {
        if (this._angle) {
            return this._angle;
        }
        else {
            this._angle = Math.atan2(-this.y, this.x);
            return this._angle;
        }
    };
    V.prototype.dot = function (point) {
        if (point === undefined) {
            point = this;
        }
        return this.x * point.x + this.y * point.y;
    };
    V.prototype.cross = function (point) {
        return this.x * point.y - this.y * point.x;
    };
    V.prototype.rotate = function (degree) {
        var radian = degree * (Math.PI / 180);
        var cos = Math.cos(radian);
        var sin = Math.sin(radian);
        return new V(cos * this.x - sin * this.y, cos * this.y + sin * this.x);
    };
    V.direction = function (degree) {
        return new V(1, 0).rotate(degree);
    };
    return V;
})();
module.exports = V;

},{}],20:[function(require,module,exports){
/**
 * Invoke untrusted guest code in a sandbox.
 * The guest code can access objects of the standard library of ECMAScript.
 *
 * function chainchomp(script: string, scope?: any = {}): any;
 *
 * this.param script guest code.
 * this.param scope an object whose properties will be exposed to the guest code.
 * this.return result of the process.
 */
function chainchomp(script, scope, options){
    // First, you need to pile a picket to tie a Chain Chomp.
    // If the environment is changed, the picket will drop out.
    // You should remake a new picket each time as long as　you are so busy.
    // ------------------------------------------------------------------
    // If the global object is changed, you must remake a picket.
    var picket = chainchomp.pick();

    // Next, get new Chain Chomp tied the picket.
    // Different Chain Chomps have different behavior.
    // --------------------------------------------------------------
    // If you need a different function, you can get another one.
    var chomp = picket(script, scope);

    // Last, feed the chomp and let it rampage!
    // A chomp eats nothing but　a kind of feed that the chomp ate at first.
    // ----------------------------------------------------------------------
    // If only a value in the scope object is changed, you need not to remake the Chain Chomp and the picket.
    return chomp(options);
}

/**
 * create sandbox
 */
chainchomp.pick = (function(){
    // Dynamic instantiation idiom
    // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

    function getBannedVars(){
        // correct banned object names.
        var banned = ['__proto__', 'prototype'];
        function ban(k){
            if(k && banned.indexOf(k) < 0 && k !== 'eval' && k.match(/^[_$a-zA-Z][_$a-zA-Z0-9]*$/)){
                banned.push(k);
            }
        }
        var global = new Function("return this")();
        Object.getOwnPropertyNames(global).forEach(ban);
        for(var k in global){
            ban(k);
        }

        // ban all ids of the elements
        function traverse(elem){
            ban(elem.getAttribute && elem.getAttribute('id'));
            var childs = elem.childNodes;
            for(var i = 0; i < childs.length; i++){
                traverse(childs[i]);
            }
        }

        // **** support node.js start ****
        if (typeof document !== 'undefined') {
            traverse(document);
        }
        // **** support node.js end ****

        return banned;
    }

    // table of exposed objects
    function getStdlibs(){
        return {
            'Object'            : Object,
            'String'            : String,
            'Number'            : Number,
            'Boolean'           : Boolean,
            'Array'             : Array,
            'Date'              : Date,
            'Math'              : Math,
            'RegExp'            : RegExp,
            'Error'             : Error,
            'EvalError'         : EvalError,
            'RangeError'        : RangeError,
            'ReferenceError'    : ReferenceError,
            'SyntaxError'       : SyntaxError,
            'TypeError'         : TypeError,
            'URIError'          : URIError,
            'JSON'              : JSON,
            'NaN'               : NaN,
            'Infinity'          : Infinity,
            'undefined'         : undefined,
            'parseInt'          : parseInt,
            'parseFloat'        : parseFloat,
            'isNaN'             : isNaN,
            'isFinite'          : isFinite,
            'decodeURI'         : decodeURI,
            'decodeURIComponent': decodeURIComponent,
            'encodeURI'         : encodeURI,
            'encodeURIComponent': encodeURIComponent
        };
    }

    var isFreezedStdLibObjs = false;

    /**
     * create sandbox.
     */
    return function(){
        if(isFreezedStdLibObjs == false){
            var stdlibs = getStdlibs();

            function freeze(v){
                if(v && (typeof v === 'object' || typeof v === 'function') && ! Object.isFrozen(v)){
                    Object.freeze(v);
                    Object.getOwnPropertyNames(v).forEach(function(k, i){
                        var value;
                        try{
                            value = v[k];
                        }catch(e){
                            // do notiong
                        }
                        freeze(value);
                    });
                }
            }
            freeze(stdlibs);

            // freeze Function.prototype
            Object.defineProperty(Function.prototype, "constructor", {
                enumerable: false,
                get: function(){ throw new ReferenceError('Access to "Function.prototype.constructor" is not allowed.') },
                set: function(){ throw new ReferenceError('Access to "Function.prototype.constructor" is not allowed.') }
            });
            freeze(Function);

            isFreezedStdLibObjs = true;
        }

        var banned = getBannedVars();

        /**
         * create sandboxed function.
         */
        var createSandboxedFunction = function(script, scope){
            // validate arguments
            if( ! (typeof script === 'string' || script instanceof String )){
                throw new TypeError();
            }

            // store default values of the parameter
            scope = scope || {};
            Object.seal(scope);

            // Expose custom properties
            var guestGlobal = getStdlibs();
            Object.keys(scope).forEach(function(k){
                guestGlobal[k] = scope[k];
            });
            Object.seal(guestGlobal);

            // create sandboxed function
            var args = Object.keys(guestGlobal).concat(banned.filter(function(b){ return ! guestGlobal.hasOwnProperty(b); }));
            args.push('"use strict";\n' + script);
            var functionObject = construct(Function, args);

            var safeEval = function(s){
                return createSandboxedFunction("return " + s, guestGlobal)();
            };
            Object.freeze(safeEval);

            /**
             * Invoke sandboxed function.
             */
            var invokeSandboxedFunction = function(options){
                options = options || {};

                // replace eval with safe eval-like function
                var _eval = eval;
                if(options.debug !== true){
                    eval = safeEval;
                }

                 // call the sandboxed function
                try{
                    // restore default values
                    Object.keys(scope).forEach(function(k){
                        guestGlobal[k] = scope[k];
                    });

                    // call
                    var params = Object.keys(guestGlobal).map(function(k){ return guestGlobal[k]; });
                    return functionObject.apply(undefined, params);
                }finally{
                    eval = _eval;
                }
            };

            return invokeSandboxedFunction;
        };
        return createSandboxedFunction;
    };
})();

//
chainchomp.callback = function(callback, args, options){
    options = options || {};
    args = args || [];

    // replace eval with safe eval-like function
    var _eval = eval;
    if(options.debug !== true){
        eval = undefined;
    }

    try{
        return callback.apply(undefined, args);
    }finally{
        eval = _eval;
    }
};

// **** support node.js start ****
module.exports = chainchomp;
// **** support node.js end ****

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9BY3Rvci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0NvbW1hbmQuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29uc3RzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvRnguanMiLCJpbnRlcm1lZGlhdGUvY29yZS9MYXNlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9NaXNzaWxlQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGVDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1Nob3RQYXJhbS5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXIuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXJDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvVXRpbHMuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9WLmpzIiwiaW50ZXJtZWRpYXRlL2xpYnMvY2hhaW5jaG9tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRmllbGQgPSByZXF1aXJlKCcuL2NvcmUvRmllbGQnKTtcbnZhciBTb3VyY2VyID0gcmVxdWlyZSgnLi9jb3JlL1NvdXJjZXInKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vY29yZS9VdGlscycpO1xub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZmllbGQgPSBuZXcgRmllbGQoKTtcbiAgICB2YXIgc291cmNlcjEgPSBuZXcgU291cmNlcihmaWVsZCwgVXRpbHMucmFuZCgzMjApIC0gMTYwLCBVdGlscy5yYW5kKDMyMCkgLSAxNjAsIGUuZGF0YS5zb3VyY2VzWzBdKTtcbiAgICB2YXIgc291cmNlcjIgPSBuZXcgU291cmNlcihmaWVsZCwgVXRpbHMucmFuZCgzMjApIC0gMTYwLCBVdGlscy5yYW5kKDMyMCkgLSAxNjAsIGUuZGF0YS5zb3VyY2VzWzFdKTtcbiAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIxKTtcbiAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIyKTtcbiAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgIG9uUHJlVGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlByZVRoaW5rXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHNvdXJjZXIxLmlkID09IHNvdXJjZXJJZCA/IDAgOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0VGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlBvc3RUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBzb3VyY2VyMS5pZCA9PSBzb3VyY2VySWQgPyAwIDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjAwMCAmJiAhZmllbGQuaXNGaW5pc2goKTsgaSsrKSB7XG4gICAgICAgIGZpZWxkLnRpY2sobGlzdGVuZXIpO1xuICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21tYW5kOiBcIkZyYW1lXCIsXG4gICAgICAgICAgICBmaWVsZDogZmllbGQuZHVtcCgpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvbW1hbmQ6IFwiRW5kT2ZHYW1lXCJcbiAgICB9KTtcbn07XG4iLCJ2YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBBY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWN0b3IoZmllbGQsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnNpemUgPSBDb25maWdzLkNPTExJU0lPTl9TSVpFO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYoeCwgeSk7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVigwLCAwKTtcbiAgICB9XG4gICAgQWN0b3IucHJvdG90eXBlLnRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgICAgICB0aGlzLm9uVGhpbmsoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FpdC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgICAgIHNwZWVkOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvblxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEFjdG9yO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQWN0b3I7XG4iLCJ2YXIgQ29tbWFuZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfVxuICAgIENvbW1hbmQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBY2NlcHRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb21tYW5kLiBcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLnVuYWNjZXB0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBDb21tYW5kO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZDtcbiIsInZhciBDb25maWdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25maWdzKCkge1xuICAgIH1cbiAgICBDb25maWdzLklOSVRJQUxfU0hJRUxEID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9GVUVMID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcbiAgICBDb25maWdzLkZVRUxfQ09TVCA9IDAuMjQ7XG4gICAgQ29uZmlncy5DT0xMSVNJT05fU0laRSA9IDQ7XG4gICAgQ29uZmlncy5TQ0FOX1dBSVQgPSAwLjM1O1xuICAgIENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSA9IDAuOTY7XG4gICAgQ29uZmlncy5HUkFWSVRZID0gMC4wODtcbiAgICBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0JPUkRBUiA9IDQwMDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9CT1JERVIgPSAxMDA7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XG4gICAgQ29uZmlncy5HUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcbiAgICBDb25maWdzLkNPT0xfRE9XTiA9IDAuNTtcbiAgICBDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xuICAgIHJldHVybiBDb25maWdzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlncztcbiIsInZhciBDb25zdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnN0cygpIHtcbiAgICB9XG4gICAgQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA9IDE7XG4gICAgQ29uc3RzLkRJUkVDVElPTl9MRUZUID0gLTE7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX1VQID0gXCJ2ZXJ0aWFsX3VwXCI7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX0RPV04gPSBcInZlcnRpYWxfZG93blwiO1xuICAgIHJldHVybiBDb25zdHM7XG59KSgpO1xuO1xubW9kdWxlLmV4cG9ydHMgPSBDb25zdHM7XG4iLCJ2YXIgQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcihhY3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvZyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9uYWxQYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uYWxQYXJhbXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmllbGQgPSBhY3Rvci5maWVsZDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmZpZWxkLmZyYW1lOyB9O1xuICAgICAgICB0aGlzLmFsdGl0dWRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gYWN0b3IucG9zaXRpb24ueTsgfTtcbiAgICAgICAgdGhpcy53YWl0ID0gZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgICAgICAgICBpZiAoMCA8IGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgYWN0b3Iud2FpdCArPSBmcmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2xsZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIEZpZWxkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGaWVsZCgpIHtcbiAgICAgICAgdGhpcy5pZCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzID0gW107XG4gICAgICAgIHRoaXMuc2hvdHMgPSBbXTtcbiAgICAgICAgdGhpcy5meHMgPSBbXTtcbiAgICB9XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNvdXJjZXIgPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLmlkID0gXCJzb3VyY2VyXCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5wdXNoKHNvdXJjZXIpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNob3QgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICBzaG90LmlkID0gXCJzaG90XCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZVNob3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdG9yID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIGlmIChhY3RvciA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkRnggPSBmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgZnguaWQgPSBcImZ4XCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5meHMucHVzaChmeCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlRnggPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5meHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmeCA9IHRoaXMuZnhzW2ldO1xuICAgICAgICAgICAgaWYgKGZ4ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ4cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XG4gICAgICAgICAgICBzb3VyY2VyLnRoaW5rKCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzaG90Lm93bmVyLmlkKTtcbiAgICAgICAgICAgIHNob3QudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IuYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLnNoaWVsZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgc291cmNlci5hbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5zY2FuQXR0YWNrID0gZnVuY3Rpb24gKG93bmVyLCByYWRhcikge1xuICAgICAgICB2YXIgb3duZXJQb3NpdGlvbiA9IG93bmVyLnBvc2l0aW9uO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzaG90ID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIHZhciBhY3RvclBvc2l0aW9uID0gc2hvdC5wb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChzaG90Lm93bmVyICE9PSBvd25lciAmJiByYWRhcihhY3RvclBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24uYWRkKHNob3Quc3BlZWQpKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dERpc3RhbmNlIDwgY3VycmVudERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tDb2xsaXNpb24gPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICB2YXIgZiA9IHNob3QucG9zaXRpb247XG4gICAgICAgIHZhciB0ID0gc2hvdC5wb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdG9yID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIGlmIChhY3Rvci5icmVha2FibGUgJiYgYWN0b3Iub3duZXIgIT09IHNob3Qub3duZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgYWN0b3IucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IHNob3Qub3duZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgc291cmNlci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgcmV0dXJuIHNob3QucG9zaXRpb24ueSA8IDA7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY29tcHV0ZUNlbnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgdmFyIHN1bVggPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdW1YIC8gY291bnQ7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuaXNGaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMuZmluaXNoZWRGcmFtZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRGcmFtZSA9IHRoaXMuZnJhbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmlzaGVkRnJhbWUgPCB0aGlzLmZyYW1lIC0gOTApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlcnNEdW1wID0gW107XG4gICAgICAgIHZhciBzaG90c0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIGZ4RHVtcCA9IFtdO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeER1bXAucHVzaChmeC5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgc291cmNlcnM6IHNvdXJjZXJzRHVtcCxcbiAgICAgICAgICAgIHNob3RzOiBzaG90c0R1bXAsXG4gICAgICAgICAgICBmeHM6IGZ4RHVtcFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEZpZWxkO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7XG4iLCJ2YXIgRnggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZ4KGZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkge1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgfVxuICAgIEZ4LnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gICAgfTtcbiAgICBGeC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIGxlbmd0aDogdGhpcy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBGeDtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEZ4O1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG52YXIgU2hvdCA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBMYXNlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExhc2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIExhc2VyKGZpZWxkLCBvd25lciwgZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTGFzZXJcIik7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gNTtcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiA4OyB9O1xuICAgICAgICB0aGlzLnNwZWVkID0gVi5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XG4gICAgfVxuICAgIHJldHVybiBMYXNlcjtcbn0pKFNob3QpO1xubW9kdWxlLmV4cG9ydHMgPSBMYXNlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIFNob3QgPSByZXF1aXJlKCcuL1Nob3QnKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgTWlzc2lsZUNvbW1hbmQgPSByZXF1aXJlKCcuL01pc3NpbGVDb21tYW5kJyk7XG52YXIgTWlzc2lsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL01pc3NpbGVDb250cm9sbGVyJyk7XG52YXIgQ29uc3RzID0gcmVxdWlyZSgnLi9Db25zdHMnKTtcbnZhciBNaXNzaWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlKGZpZWxkLCBvd25lciwgYWkpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLCBcIk1pc3NpbGVcIik7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDEwICsgX3RoaXMuc3BlZWQubGVuZ3RoKCkgKiAyOyB9O1xuICAgICAgICB0aGlzLmZ1ZWwgPSAxMDA7XG4gICAgICAgIHRoaXMuYnJlYWthYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5haSA9IGFpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IG93bmVyLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyKHRoaXMpO1xuICAgIH1cbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcbiAgICAgICAgICAgIHRoaXMuYWkodGhpcy5jb250cm9sbGVyKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKGF0dGFjaykge1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChhdHRhY2spO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlO1xufSkoU2hvdCk7XG5tb2R1bGUuZXhwb3J0cyA9IE1pc3NpbGU7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlncyA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBNaXNzaWxlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb21tYW5kKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMubWlzc2lsZSA9IG1pc3NpbGU7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgTWlzc2lsZUNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSAwO1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IDA7XG4gICAgICAgIHRoaXMudHVybiA9IDA7XG4gICAgfTtcbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmRpcmVjdGlvbiArPSB0aGlzLnR1cm47XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLmFkZChub3JtYWxpemVkLm11bHRpcGx5KHRoaXMuc3BlZWRVcCkpO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLm1pc3NpbGUuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlQ29tbWFuZDtcbn0pKENvbW1hbmQpO1xubW9kdWxlLmV4cG9ydHMgPSBNaXNzaWxlQ29tbWFuZDtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL0NvbnRyb2xsZXInKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb250cm9sbGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb250cm9sbGVyKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbWlzc2lsZSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5kaXJlY3Rpb247IH07XG4gICAgICAgIHZhciBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmZ1ZWw7IH07XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBtaXNzaWxlLndhaXQgKz0gMS41O1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gbWlzc2lsZS5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIG1pc3NpbGUuZmllbGQuc2NhbkVuZW15KG1pc3NpbGUub3duZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGVlZFVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuc3BlZWREb3duID0gMC4xO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5SaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IC05O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5MZWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gOTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIE1pc3NpbGVDb250cm9sbGVyO1xufSkoQ29udHJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IE1pc3NpbGVDb250cm9sbGVyO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG52YXIgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgRnggPSByZXF1aXJlKCcuL0Z4Jyk7XG52YXIgU2hvdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNob3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2hvdChmaWVsZCwgb3duZXIsIHR5cGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLnBvc2l0aW9uLngsIG93bmVyLnBvc2l0aW9uLnkpO1xuICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDA7IH07XG4gICAgICAgIHRoaXMuYnJlYWthYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIFNob3QucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vbkFjdGlvbigpO1xuICAgICAgICB2YXIgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xuICAgICAgICBpZiAoY29sbGlkZWQpIHtcbiAgICAgICAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMiksIDgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4KHRoaXMuZmllbGQsIHRoaXMucG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLCA4KSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLnJlYWN0aW9uID0gZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgc291cmNlci50ZW1wZXJhdHVyZSArPSB0aGlzLnRlbXBlcmF0dXJlO1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHVtcCA9IF9zdXBlci5wcm90b3R5cGUuZHVtcC5jYWxsKHRoaXMpO1xuICAgICAgICBkdW1wLnR5cGUgPSB0aGlzLnR5cGU7XG4gICAgICAgIHJldHVybiBkdW1wO1xuICAgIH07XG4gICAgcmV0dXJuIFNob3Q7XG59KShBY3Rvcik7XG5tb2R1bGUuZXhwb3J0cyA9IFNob3Q7XG4iLCJ2YXIgU2hvdFBhcmFtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaG90UGFyYW0oKSB7XG4gICAgfVxuICAgIHJldHVybiBTaG90UGFyYW07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBTaG90UGFyYW07XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBjaGFpbmNob21wID0gcmVxdWlyZSgnLi4vbGlicy9jaGFpbmNob21wJyk7XG52YXIgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgU291cmNlckNvbW1hbmQgPSByZXF1aXJlKCcuL1NvdXJjZXJDb21tYW5kJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL1NvdXJjZXJDb250cm9sbGVyJyk7XG52YXIgQ29uZmlncyA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIENvbnN0cyA9IHJlcXVpcmUoJy4vQ29uc3RzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIExhc2VyID0gcmVxdWlyZSgnLi9MYXNlcicpO1xudmFyIE1pc3NpbGUgPSByZXF1aXJlKCcuL01pc3NpbGUnKTtcbnZhciBTb3VyY2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyKGZpZWxkLCB4LCB5LCBhaSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgeCwgeSk7XG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMDtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBDb25maWdzLklOSVRJQUxfU0hJRUxEO1xuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vID0gQ29uZmlncy5JTklUSUFMX01JU1NJTEVfQU1NTztcbiAgICAgICAgdGhpcy5mdWVsID0gQ29uZmlncy5JTklUSUFMX0ZVRUw7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgU291cmNlckNvbnRyb2xsZXIodGhpcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmFpID0gY2hhaW5jaG9tcChhaSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmFpID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5haSA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSk7XG4gICAgICAgIGlmIChDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xuICAgICAgICAgICAgdmFyIGludmlzaWJsZVBvd2VyID0gKHRoaXMucG9zaXRpb24ueSAtIENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EKSAqIDAuMTtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xuICAgICAgICBpZiAoQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIgPCBNYXRoLmFicyhkaWZmKSkge1xuICAgICAgICAgICAgdmFyIGludmlzaWJsZUhhbmQgPSBkaWZmICogQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORDtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLnggKyBpbnZpc2libGVIYW5kLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRSk7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYodGhpcy5wb3NpdGlvbi54LCAwKTtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVih0aGlzLnNwZWVkLngsIDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlncy5DT09MX0RPV047XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBNYXRoLm1heCh0aGlzLnRlbXBlcmF0dXJlLCAwKTtcbiAgICAgICAgdmFyIG92ZXJoZWF0ID0gKHRoaXMudGVtcGVyYXR1cmUgLSBDb25maWdzLk9WRVJIRUFUX0JPUkRFUik7XG4gICAgICAgIGlmICgwIDwgb3ZlcmhlYXQpIHtcbiAgICAgICAgICAgIHZhciBsaW5lYXJEYW1hZ2UgPSBvdmVyaGVhdCAqIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XG4gICAgICAgICAgICB2YXIgcG93ZXJEYW1hZ2UgPSBNYXRoLnBvdyhvdmVyaGVhdCAqIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCwgMik7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAobGluZWFyRGFtYWdlICsgcG93ZXJEYW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSBcIkxhc2VyXCIpIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB2YXIgc2hvdCA9IG5ldyBMYXNlcih0aGlzLmZpZWxkLCB0aGlzLCBkaXJlY3Rpb24sIHBhcmFtLnBvd2VyKTtcbiAgICAgICAgICAgIHNob3QucmVhY3Rpb24odGhpcyk7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3Qoc2hvdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSAnTWlzc2lsZScpIHtcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy5taXNzaWxlQW1tbykge1xuICAgICAgICAgICAgICAgIHZhciBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYWkpO1xuICAgICAgICAgICAgICAgIG1pc3NpbGUucmVhY3Rpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChtaXNzaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9MRUZUKSB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHMudG9PcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5hZGQoc2hvdC5zcGVlZC5tdWx0aXBseShDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XG4gICAgICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHVtcCA9IF9zdXBlci5wcm90b3R5cGUuZHVtcC5jYWxsKHRoaXMpO1xuICAgICAgICBkdW1wLnNoaWVsZCA9IHRoaXMuc2hpZWxkO1xuICAgICAgICBkdW1wLnRlbXBlcmF0dXJlID0gdGhpcy50ZW1wZXJhdHVyZTtcbiAgICAgICAgZHVtcC5taXNzaWxlQW1tbyA9IHRoaXMubWlzc2lsZUFtbW87XG4gICAgICAgIGR1bXAuZnVlbCA9IHRoaXMuZnVlbDtcbiAgICAgICAgcmV0dXJuIGR1bXA7XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlcjtcbn0pKEFjdG9yKTtcbm1vZHVsZS5leHBvcnRzID0gU291cmNlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgU291cmNlckNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29tbWFuZChzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnNvdXJjZXIgPSBzb3VyY2VyO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5haGVhZCA9IDA7XG4gICAgICAgIHRoaXMuYXNjZW50ID0gMDtcbiAgICAgICAgdGhpcy50dXJuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmlyZSA9IG51bGw7XG4gICAgfTtcbiAgICBTb3VyY2VyQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlyZSkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZpcmUodGhpcy5maXJlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50dXJuKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5zcGVlZCA9IHRoaXMuc291cmNlci5zcGVlZC5hZGQodGhpcy5haGVhZCAqIHRoaXMuc291cmNlci5kaXJlY3Rpb24sIHRoaXMuYXNjZW50KTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsIC09IChNYXRoLmFicyh0aGlzLmFoZWFkKSArIE1hdGguYWJzKHRoaXMuYXNjZW50KSkgKiBDb25maWdzLkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlckNvbW1hbmQ7XG59KShDb21tYW5kKTtcbm1vZHVsZS5leHBvcnRzID0gU291cmNlckNvbW1hbmQ7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgQ29uZmlncyA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIFNob3RQYXJhbSA9IHJlcXVpcmUoJy4vU2hvdFBhcmFtJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29udHJvbGxlcihzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZXIpO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuc2hpZWxkOyB9O1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci50ZW1wZXJhdHVyZTsgfTtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIubWlzc2lsZUFtbW87IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuZnVlbDsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gc291cmNlci5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBzb3VyY2VyLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY2FuQXR0YWNrID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuc2NhbkF0dGFjayhzb3VyY2VyLCByYWRhcik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWhlYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFoZWFkID0gMC44O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFoZWFkID0gLTAuNDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hc2NlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFzY2VudCA9IDAuOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZXNjZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5hc2NlbnQgPSAtMC45O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpcmVMYXNlciA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIHBvd2VyKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBwb3dlciA9IE1hdGgubWluKE1hdGgubWF4KHBvd2VyIHx8IDgsIDMpLCA4KTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZSA9IG5ldyBTaG90UGFyYW0oKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5wb3dlciA9IHBvd2VyO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5zaG90VHlwZSA9ICdMYXNlcic7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZU1pc3NpbGUgPSBmdW5jdGlvbiAoYWkpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZSA9IG5ldyBTaG90UGFyYW0oKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5haSA9IGFpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ01pc3NpbGUnO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gU291cmNlckNvbnRyb2xsZXI7XG59KShDb250cm9sbGVyKTtcbm1vZHVsZS5leHBvcnRzID0gU291cmNlckNvbnRyb2xsZXI7XG4iLCJ2YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIEVQU0lMT04gPSAxMGUtMTI7XG52YXIgVXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFV0aWxzKCkge1xuICAgIH1cbiAgICBVdGlscy5jcmVhdGVSYWRhciA9IGZ1bmN0aW9uIChjLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICB2YXIgY2hlY2tEaXN0YW5jZSA9IGZ1bmN0aW9uICh0KSB7IHJldHVybiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlOyB9O1xuICAgICAgICBpZiAoMzYwIDw9IGFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xuICAgICAgICB2YXIgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcbiAgICAgICAgaWYgKGFuZ2xlIDwgMTgwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGNoZWNrTGVmdCh0KSAmJiBjaGVja1JpZ2h0KHQpICYmIGNoZWNrRGlzdGFuY2UodCk7IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuc2lkZSA9IGZ1bmN0aW9uIChiYXNlLCBkZWdyZWUpIHtcbiAgICAgICAgdmFyIHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBuZXcgVihNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcbiAgICAgICAgdmFyIHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFV0aWxzLmNhbGNEaXN0YW5jZSA9IGZ1bmN0aW9uIChmLCB0LCBwKSB7XG4gICAgICAgIHZhciB0b0Zyb20gPSB0LnN1YnRyYWN0KGYpO1xuICAgICAgICB2YXIgcEZyb20gPSBwLnN1YnRyYWN0KGYpO1xuICAgICAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gcEZyb20ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21UbyA9IGYuc3VidHJhY3QodCk7XG4gICAgICAgIHZhciBwVG8gPSBwLnN1YnRyYWN0KHQpO1xuICAgICAgICBpZiAoZnJvbVRvLmRvdChwVG8pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBUby5sZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnModG9Gcm9tLmNyb3NzKHBGcm9tKSAvIHRvRnJvbS5sZW5ndGgoKSk7XG4gICAgfTtcbiAgICBVdGlscy50b1JhZGlhbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB9O1xuICAgIFV0aWxzLnRvT3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSAlIDM2MDtcbiAgICAgICAgaWYgKGRlZ3JlZSA8IDApIHtcbiAgICAgICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSArIDM2MDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVncmVlIDw9IDE4MCkge1xuICAgICAgICAgICAgcmV0dXJuICg5MCAtIGRlZ3JlZSkgKiAyICsgZGVncmVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgyNzAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMucmFuZCA9IGZ1bmN0aW9uIChyZW5nZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xuICAgIH07XG4gICAgcmV0dXJuIFV0aWxzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XG4iLCJ2YXIgViA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuX2xlbmd0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gbnVsbDtcbiAgICB9XG4gICAgVi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYsIHkpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArIHYsIHRoaXMueSArIHkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2LCB5KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSB2LCB0aGlzLnkgLSB5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdiwgdGhpcy55ICogdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRpdmlkZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LCB0aGlzLnkgLyB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubW9kdWxvID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdi54LCB0aGlzLnkgJSB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVigtdGhpcy54LCAtdGhpcy55KTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VidHJhY3QodikubGVuZ3RoKCk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sZW5ndGggPSBNYXRoLnNxcnQodGhpcy5kb3QoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5sZW5ndGgoKTtcbiAgICAgICAgdmFyIHNjYWxlID0gY3VycmVudCAhPT0gMCA/IDEgLyBjdXJyZW50IDogMDtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuYW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuYW5nbGVJblJhZGlhbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbmdsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSBNYXRoLmF0YW4yKC10aGlzLnksIHRoaXMueCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5nbGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICBpZiAocG9pbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9pbnQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnggKiBwb2ludC54ICsgdGhpcy55ICogcG9pbnQueTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiBwb2ludC55IC0gdGhpcy55ICogcG9pbnQueDtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgdmFyIHJhZGlhbiA9IGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKHJhZGlhbik7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihyYWRpYW4pO1xuICAgICAgICByZXR1cm4gbmV3IFYoY29zICogdGhpcy54IC0gc2luICogdGhpcy55LCBjb3MgKiB0aGlzLnkgKyBzaW4gKiB0aGlzLngpO1xuICAgIH07XG4gICAgVi5kaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgVigxLCAwKS5yb3RhdGUoZGVncmVlKTtcbiAgICB9O1xuICAgIHJldHVybiBWO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVjtcbiIsIi8qKlxuICogSW52b2tlIHVudHJ1c3RlZCBndWVzdCBjb2RlIGluIGEgc2FuZGJveC5cbiAqIFRoZSBndWVzdCBjb2RlIGNhbiBhY2Nlc3Mgb2JqZWN0cyBvZiB0aGUgc3RhbmRhcmQgbGlicmFyeSBvZiBFQ01BU2NyaXB0LlxuICpcbiAqIGZ1bmN0aW9uIGNoYWluY2hvbXAoc2NyaXB0OiBzdHJpbmcsIHNjb3BlPzogYW55ID0ge30pOiBhbnk7XG4gKlxuICogdGhpcy5wYXJhbSBzY3JpcHQgZ3Vlc3QgY29kZS5cbiAqIHRoaXMucGFyYW0gc2NvcGUgYW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgd2lsbCBiZSBleHBvc2VkIHRvIHRoZSBndWVzdCBjb2RlLlxuICogdGhpcy5yZXR1cm4gcmVzdWx0IG9mIHRoZSBwcm9jZXNzLlxuICovXG5mdW5jdGlvbiBjaGFpbmNob21wKHNjcmlwdCwgc2NvcGUsIG9wdGlvbnMpe1xuICAgIC8vIEZpcnN0LCB5b3UgbmVlZCB0byBwaWxlIGEgcGlja2V0IHRvIHRpZSBhIENoYWluIENob21wLlxuICAgIC8vIElmIHRoZSBlbnZpcm9ubWVudCBpcyBjaGFuZ2VkLCB0aGUgcGlja2V0IHdpbGwgZHJvcCBvdXQuXG4gICAgLy8gWW91IHNob3VsZCByZW1ha2UgYSBuZXcgcGlja2V0IGVhY2ggdGltZSBhcyBsb25nIGFz44CAeW91IGFyZSBzbyBidXN5LlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIHRoZSBnbG9iYWwgb2JqZWN0IGlzIGNoYW5nZWQsIHlvdSBtdXN0IHJlbWFrZSBhIHBpY2tldC5cbiAgICB2YXIgcGlja2V0ID0gY2hhaW5jaG9tcC5waWNrKCk7XG5cbiAgICAvLyBOZXh0LCBnZXQgbmV3IENoYWluIENob21wIHRpZWQgdGhlIHBpY2tldC5cbiAgICAvLyBEaWZmZXJlbnQgQ2hhaW4gQ2hvbXBzIGhhdmUgZGlmZmVyZW50IGJlaGF2aW9yLlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgeW91IG5lZWQgYSBkaWZmZXJlbnQgZnVuY3Rpb24sIHlvdSBjYW4gZ2V0IGFub3RoZXIgb25lLlxuICAgIHZhciBjaG9tcCA9IHBpY2tldChzY3JpcHQsIHNjb3BlKTtcblxuICAgIC8vIExhc3QsIGZlZWQgdGhlIGNob21wIGFuZCBsZXQgaXQgcmFtcGFnZSFcbiAgICAvLyBBIGNob21wIGVhdHMgbm90aGluZyBidXTjgIBhIGtpbmQgb2YgZmVlZCB0aGF0IHRoZSBjaG9tcCBhdGUgYXQgZmlyc3QuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIG9ubHkgYSB2YWx1ZSBpbiB0aGUgc2NvcGUgb2JqZWN0IGlzIGNoYW5nZWQsIHlvdSBuZWVkIG5vdCB0byByZW1ha2UgdGhlIENoYWluIENob21wIGFuZCB0aGUgcGlja2V0LlxuICAgIHJldHVybiBjaG9tcChvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBjcmVhdGUgc2FuZGJveFxuICovXG5jaGFpbmNob21wLnBpY2sgPSAoZnVuY3Rpb24oKXtcbiAgICAvLyBEeW5hbWljIGluc3RhbnRpYXRpb24gaWRpb21cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MDY3OTcvdXNlLW9mLWFwcGx5LXdpdGgtbmV3LW9wZXJhdG9yLWlzLXRoaXMtcG9zc2libGVcbiAgICBmdW5jdGlvbiBjb25zdHJ1Y3QoY29uc3RydWN0b3IsIGFyZ3MpIHtcbiAgICAgICAgZnVuY3Rpb24gRigpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBGLnByb3RvdHlwZSA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmFubmVkVmFycygpe1xuICAgICAgICAvLyBjb3JyZWN0IGJhbm5lZCBvYmplY3QgbmFtZXMuXG4gICAgICAgIHZhciBiYW5uZWQgPSBbJ19fcHJvdG9fXycsICdwcm90b3R5cGUnXTtcbiAgICAgICAgZnVuY3Rpb24gYmFuKGspe1xuICAgICAgICAgICAgaWYoayAmJiBiYW5uZWQuaW5kZXhPZihrKSA8IDAgJiYgayAhPT0gJ2V2YWwnICYmIGsubWF0Y2goL15bXyRhLXpBLVpdW18kYS16QS1aMC05XSokLykpe1xuICAgICAgICAgICAgICAgIGJhbm5lZC5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnbG9iYWwpLmZvckVhY2goYmFuKTtcbiAgICAgICAgZm9yKHZhciBrIGluIGdsb2JhbCl7XG4gICAgICAgICAgICBiYW4oayk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBiYW4gYWxsIGlkcyBvZiB0aGUgZWxlbWVudHNcbiAgICAgICAgZnVuY3Rpb24gdHJhdmVyc2UoZWxlbSl7XG4gICAgICAgICAgICBiYW4oZWxlbS5nZXRBdHRyaWJ1dGUgJiYgZWxlbS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IGVsZW0uY2hpbGROb2RlcztcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjaGlsZHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHRyYXZlcnNlKGNoaWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBzdGFydCAqKioqXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0cmF2ZXJzZShkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgZW5kICoqKipcblxuICAgICAgICByZXR1cm4gYmFubmVkO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIG9mIGV4cG9zZWQgb2JqZWN0c1xuICAgIGZ1bmN0aW9uIGdldFN0ZGxpYnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdPYmplY3QnICAgICAgICAgICAgOiBPYmplY3QsXG4gICAgICAgICAgICAnU3RyaW5nJyAgICAgICAgICAgIDogU3RyaW5nLFxuICAgICAgICAgICAgJ051bWJlcicgICAgICAgICAgICA6IE51bWJlcixcbiAgICAgICAgICAgICdCb29sZWFuJyAgICAgICAgICAgOiBCb29sZWFuLFxuICAgICAgICAgICAgJ0FycmF5JyAgICAgICAgICAgICA6IEFycmF5LFxuICAgICAgICAgICAgJ0RhdGUnICAgICAgICAgICAgICA6IERhdGUsXG4gICAgICAgICAgICAnTWF0aCcgICAgICAgICAgICAgIDogTWF0aCxcbiAgICAgICAgICAgICdSZWdFeHAnICAgICAgICAgICAgOiBSZWdFeHAsXG4gICAgICAgICAgICAnRXJyb3InICAgICAgICAgICAgIDogRXJyb3IsXG4gICAgICAgICAgICAnRXZhbEVycm9yJyAgICAgICAgIDogRXZhbEVycm9yLFxuICAgICAgICAgICAgJ1JhbmdlRXJyb3InICAgICAgICA6IFJhbmdlRXJyb3IsXG4gICAgICAgICAgICAnUmVmZXJlbmNlRXJyb3InICAgIDogUmVmZXJlbmNlRXJyb3IsXG4gICAgICAgICAgICAnU3ludGF4RXJyb3InICAgICAgIDogU3ludGF4RXJyb3IsXG4gICAgICAgICAgICAnVHlwZUVycm9yJyAgICAgICAgIDogVHlwZUVycm9yLFxuICAgICAgICAgICAgJ1VSSUVycm9yJyAgICAgICAgICA6IFVSSUVycm9yLFxuICAgICAgICAgICAgJ0pTT04nICAgICAgICAgICAgICA6IEpTT04sXG4gICAgICAgICAgICAnTmFOJyAgICAgICAgICAgICAgIDogTmFOLFxuICAgICAgICAgICAgJ0luZmluaXR5JyAgICAgICAgICA6IEluZmluaXR5LFxuICAgICAgICAgICAgJ3VuZGVmaW5lZCcgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwYXJzZUludCcgICAgICAgICAgOiBwYXJzZUludCxcbiAgICAgICAgICAgICdwYXJzZUZsb2F0JyAgICAgICAgOiBwYXJzZUZsb2F0LFxuICAgICAgICAgICAgJ2lzTmFOJyAgICAgICAgICAgICA6IGlzTmFOLFxuICAgICAgICAgICAgJ2lzRmluaXRlJyAgICAgICAgICA6IGlzRmluaXRlLFxuICAgICAgICAgICAgJ2RlY29kZVVSSScgICAgICAgICA6IGRlY29kZVVSSSxcbiAgICAgICAgICAgICdkZWNvZGVVUklDb21wb25lbnQnOiBkZWNvZGVVUklDb21wb25lbnQsXG4gICAgICAgICAgICAnZW5jb2RlVVJJJyAgICAgICAgIDogZW5jb2RlVVJJLFxuICAgICAgICAgICAgJ2VuY29kZVVSSUNvbXBvbmVudCc6IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBpc0ZyZWV6ZWRTdGRMaWJPYmpzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgc2FuZGJveC5cbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNGcmVlemVkU3RkTGliT2JqcyA9PSBmYWxzZSl7XG4gICAgICAgICAgICB2YXIgc3RkbGlicyA9IGdldFN0ZGxpYnMoKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZnJlZXplKHYpe1xuICAgICAgICAgICAgICAgIGlmKHYgJiYgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykgJiYgISBPYmplY3QuaXNGcm96ZW4odikpe1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKHYpO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2KS5mb3JFYWNoKGZ1bmN0aW9uKGssIGkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdltrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3Rpb25nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmVlemUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmVlemUoc3RkbGlicyk7XG5cbiAgICAgICAgICAgIC8vIGZyZWV6ZSBGdW5jdGlvbi5wcm90b3R5cGVcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwge1xuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBY2Nlc3MgdG8gXCJGdW5jdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3JcIiBpcyBub3QgYWxsb3dlZC4nKSB9LFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oKXsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBY2Nlc3MgdG8gXCJGdW5jdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3JcIiBpcyBub3QgYWxsb3dlZC4nKSB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyZWV6ZShGdW5jdGlvbik7XG5cbiAgICAgICAgICAgIGlzRnJlZXplZFN0ZExpYk9ianMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJhbm5lZCA9IGdldEJhbm5lZFZhcnMoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogY3JlYXRlIHNhbmRib3hlZCBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbiA9IGZ1bmN0aW9uKHNjcmlwdCwgc2NvcGUpe1xuICAgICAgICAgICAgLy8gdmFsaWRhdGUgYXJndW1lbnRzXG4gICAgICAgICAgICBpZiggISAodHlwZW9mIHNjcmlwdCA9PT0gJ3N0cmluZycgfHwgc2NyaXB0IGluc3RhbmNlb2YgU3RyaW5nICkpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcmUgZGVmYXVsdCB2YWx1ZXMgb2YgdGhlIHBhcmFtZXRlclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKHNjb3BlKTtcblxuICAgICAgICAgICAgLy8gRXhwb3NlIGN1c3RvbSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YXIgZ3Vlc3RHbG9iYWwgPSBnZXRTdGRsaWJzKCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzY29wZSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICBndWVzdEdsb2JhbFtrXSA9IHNjb3BlW2tdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBPYmplY3Quc2VhbChndWVzdEdsb2JhbCk7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzYW5kYm94ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgIHZhciBhcmdzID0gT2JqZWN0LmtleXMoZ3Vlc3RHbG9iYWwpLmNvbmNhdChiYW5uZWQuZmlsdGVyKGZ1bmN0aW9uKGIpeyByZXR1cm4gISBndWVzdEdsb2JhbC5oYXNPd25Qcm9wZXJ0eShiKTsgfSkpO1xuICAgICAgICAgICAgYXJncy5wdXNoKCdcInVzZSBzdHJpY3RcIjtcXG4nICsgc2NyaXB0KTtcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk9iamVjdCA9IGNvbnN0cnVjdChGdW5jdGlvbiwgYXJncyk7XG5cbiAgICAgICAgICAgIHZhciBzYWZlRXZhbCA9IGZ1bmN0aW9uKHMpe1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbihcInJldHVybiBcIiArIHMsIGd1ZXN0R2xvYmFsKSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUoc2FmZUV2YWwpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEludm9rZSBzYW5kYm94ZWQgZnVuY3Rpb24uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBpbnZva2VTYW5kYm94ZWRGdW5jdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBldmFsIHdpdGggc2FmZSBldmFsLWxpa2UgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB2YXIgX2V2YWwgPSBldmFsO1xuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuZGVidWcgIT09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICBldmFsID0gc2FmZUV2YWw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIHNhbmRib3hlZCBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzdG9yZSBkZWZhdWx0IHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzY29wZSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1ZXN0R2xvYmFsW2tdID0gc2NvcGVba107XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKGd1ZXN0R2xvYmFsKS5tYXAoZnVuY3Rpb24oayl7IHJldHVybiBndWVzdEdsb2JhbFtrXTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk9iamVjdC5hcHBseSh1bmRlZmluZWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfWZpbmFsbHl7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwgPSBfZXZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gaW52b2tlU2FuZGJveGVkRnVuY3Rpb247XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbjtcbiAgICB9O1xufSkoKTtcblxuLy9cbmNoYWluY2hvbXAuY2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaywgYXJncywgb3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgYXJncyA9IGFyZ3MgfHwgW107XG5cbiAgICAvLyByZXBsYWNlIGV2YWwgd2l0aCBzYWZlIGV2YWwtbGlrZSBmdW5jdGlvblxuICAgIHZhciBfZXZhbCA9IGV2YWw7XG4gICAgaWYob3B0aW9ucy5kZWJ1ZyAhPT0gdHJ1ZSl7XG4gICAgICAgIGV2YWwgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5e1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9ZmluYWxseXtcbiAgICAgICAgZXZhbCA9IF9ldmFsO1xuICAgIH1cbn07XG5cbi8vICoqKiogc3VwcG9ydCBub2RlLmpzIHN0YXJ0ICoqKipcbm1vZHVsZS5leHBvcnRzID0gY2hhaW5jaG9tcDtcbi8vICoqKiogc3VwcG9ydCBub2RlLmpzIGVuZCAqKioqXG4iXX0=
