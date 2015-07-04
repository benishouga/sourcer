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
    Configs.GRAVITY = 0.1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9BY3Rvci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0NvbW1hbmQuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29uc3RzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvRnguanMiLCJpbnRlcm1lZGlhdGUvY29yZS9MYXNlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9NaXNzaWxlQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGVDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1Nob3RQYXJhbS5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXIuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXJDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvVXRpbHMuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9WLmpzIiwiaW50ZXJtZWRpYXRlL2xpYnMvY2hhaW5jaG9tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRmllbGQgPSByZXF1aXJlKCcuL2NvcmUvRmllbGQnKTtcbnZhciBTb3VyY2VyID0gcmVxdWlyZSgnLi9jb3JlL1NvdXJjZXInKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vY29yZS9VdGlscycpO1xub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZmllbGQgPSBuZXcgRmllbGQoKTtcbiAgICB2YXIgc291cmNlcjEgPSBuZXcgU291cmNlcihmaWVsZCwgVXRpbHMucmFuZCgzMjApIC0gMTYwLCBVdGlscy5yYW5kKDMyMCkgLSAxNjAsIGUuZGF0YS5zb3VyY2VzWzBdKTtcbiAgICB2YXIgc291cmNlcjIgPSBuZXcgU291cmNlcihmaWVsZCwgVXRpbHMucmFuZCgzMjApIC0gMTYwLCBVdGlscy5yYW5kKDMyMCkgLSAxNjAsIGUuZGF0YS5zb3VyY2VzWzFdKTtcbiAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIxKTtcbiAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIyKTtcbiAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgIG9uUHJlVGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlByZVRoaW5rXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHNvdXJjZXIxLmlkID09IHNvdXJjZXJJZCA/IDAgOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0VGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlBvc3RUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBzb3VyY2VyMS5pZCA9PSBzb3VyY2VySWQgPyAwIDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjAwMCAmJiAhZmllbGQuaXNGaW5pc2goKTsgaSsrKSB7XG4gICAgICAgIGZpZWxkLnRpY2sobGlzdGVuZXIpO1xuICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21tYW5kOiBcIkZyYW1lXCIsXG4gICAgICAgICAgICBmaWVsZDogZmllbGQuZHVtcCgpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvbW1hbmQ6IFwiRW5kT2ZHYW1lXCJcbiAgICB9KTtcbn07XG4iLCJ2YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBBY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWN0b3IoZmllbGQsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnNpemUgPSBDb25maWdzLkNPTExJU0lPTl9TSVpFO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYoeCwgeSk7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVigwLCAwKTtcbiAgICB9XG4gICAgQWN0b3IucHJvdG90eXBlLnRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgICAgICB0aGlzLm9uVGhpbmsoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FpdC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgICAgIHNwZWVkOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvblxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEFjdG9yO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQWN0b3I7XG4iLCJ2YXIgQ29tbWFuZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfVxuICAgIENvbW1hbmQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBY2NlcHRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb21tYW5kLiBcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLnVuYWNjZXB0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBDb21tYW5kO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZDtcbiIsInZhciBDb25maWdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25maWdzKCkge1xuICAgIH1cbiAgICBDb25maWdzLklOSVRJQUxfU0hJRUxEID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9GVUVMID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcbiAgICBDb25maWdzLkZVRUxfQ09TVCA9IDAuMjQ7XG4gICAgQ29uZmlncy5DT0xMSVNJT05fU0laRSA9IDQ7XG4gICAgQ29uZmlncy5TQ0FOX1dBSVQgPSAwLjM1O1xuICAgIENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSA9IDAuOTY7XG4gICAgQ29uZmlncy5HUkFWSVRZID0gMC4xO1xuICAgIENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EID0gNDgwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSID0gNDAwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQgPSAwLjAwODtcbiAgICBDb25maWdzLk9WRVJIRUFUX0JPUkRFUiA9IDEwMDtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUID0gMC4wNTtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQgPSAwLjAxMjtcbiAgICBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEUgPSAxO1xuICAgIENvbmZpZ3MuQ09PTF9ET1dOID0gMC41O1xuICAgIENvbmZpZ3MuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUgPSAwLjQ7XG4gICAgcmV0dXJuIENvbmZpZ3M7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBDb25maWdzO1xuIiwidmFyIENvbnN0cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3RzKCkge1xuICAgIH1cbiAgICBDb25zdHMuRElSRUNUSU9OX1JJR0hUID0gMTtcbiAgICBDb25zdHMuRElSRUNUSU9OX0xFRlQgPSAtMTtcbiAgICBDb25zdHMuVkVSVElDQUxfVVAgPSBcInZlcnRpYWxfdXBcIjtcbiAgICBDb25zdHMuVkVSVElDQUxfRE9XTiA9IFwidmVydGlhbF9kb3duXCI7XG4gICAgcmV0dXJuIENvbnN0cztcbn0pKCk7XG47XG5tb2R1bGUuZXhwb3J0cyA9IENvbnN0cztcbiIsInZhciBDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb250cm9sbGVyKGFjdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMubG9nID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25hbFBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBvcHRpb25hbFBhcmFtc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIG9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maWVsZCA9IGFjdG9yLmZpZWxkO1xuICAgICAgICB0aGlzLmZyYW1lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuZmllbGQuZnJhbWU7IH07XG4gICAgICAgIHRoaXMuYWx0aXR1ZGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBhY3Rvci5wb3NpdGlvbi55OyB9O1xuICAgICAgICB0aGlzLndhaXQgPSBmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICAgICAgICAgIGlmICgwIDwgZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ29udHJvbGxlcjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG4iLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgRmllbGQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZpZWxkKCkge1xuICAgICAgICB0aGlzLmlkID0gMDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zaG90cyA9IFtdO1xuICAgICAgICB0aGlzLmZ4cyA9IFtdO1xuICAgIH1cbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU291cmNlciA9IGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgIHNvdXJjZXIuaWQgPSBcInNvdXJjZXJcIiArICh0aGlzLmlkKyspO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLnB1c2goc291cmNlcik7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU2hvdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHNob3QuaWQgPSBcInNob3RcIiArICh0aGlzLmlkKyspO1xuICAgICAgICB0aGlzLnNob3RzLnB1c2goc2hvdCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlU2hvdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5hZGRGeCA9IGZ1bmN0aW9uIChmeCkge1xuICAgICAgICBmeC5pZCA9IFwiZnhcIiArICh0aGlzLmlkKyspO1xuICAgICAgICB0aGlzLmZ4cy5wdXNoKGZ4KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5yZW1vdmVGeCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZ4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZ4ID0gdGhpcy5meHNbaV07XG4gICAgICAgICAgICBpZiAoZnggPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZnhzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgICAgIHNvdXJjZXIudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICAgICAgc2hvdC50aGluaygpO1xuICAgICAgICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc2hvdC5vd25lci5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4LmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4Lm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuc2hpZWxkIDw9IDApIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VyLmFsaXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkVuZW15ID0gZnVuY3Rpb24gKG93bmVyLCByYWRhcikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IG93bmVyICYmIHJhZGFyKHNvdXJjZXIucG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAob3duZXIsIHJhZGFyKSB7XG4gICAgICAgIHZhciBvd25lclBvc2l0aW9uID0gb3duZXIucG9zaXRpb247XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNob3QgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgdmFyIGFjdG9yUG9zaXRpb24gPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKHNob3Qub3duZXIgIT09IG93bmVyICYmIHJhZGFyKGFjdG9yUG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdmFyIG5leHREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCkpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0NvbGxpc2lvbiA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHZhciBmID0gc2hvdC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHQgPSBzaG90LnBvc2l0aW9uLmFkZChzaG90LnNwZWVkKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLmJyZWFrYWJsZSAmJiBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBzb3VyY2VyLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICByZXR1cm4gc2hvdC5wb3NpdGlvbi55IDwgMDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jb21wdXRlQ2VudGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICB2YXIgc3VtWCA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICBzdW1YICs9IHNvdXJjZXIucG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1bVggLyBjb3VudDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5pc0ZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5maW5pc2hlZEZyYW1lKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2VyLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hlZEZyYW1lID0gdGhpcy5mcmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluaXNoZWRGcmFtZSA8IHRoaXMuZnJhbWUgLSA5MCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2Vyc0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIHNob3RzRHVtcCA9IFtdO1xuICAgICAgICB2YXIgZnhEdW1wID0gW107XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIHNvdXJjZXJzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzaG90c0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXG4gICAgICAgICAgICBzb3VyY2Vyczogc291cmNlcnNEdW1wLFxuICAgICAgICAgICAgc2hvdHM6IHNob3RzRHVtcCxcbiAgICAgICAgICAgIGZ4czogZnhEdW1wXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gRmllbGQ7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDtcbiIsInZhciBGeCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRngoZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICB9XG4gICAgRngucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gdGhpcy5mcmFtZSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRngucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgbGVuZ3RoOiB0aGlzLmxlbmd0aFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEZ4O1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gRng7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBTaG90ID0gcmVxdWlyZSgnLi9TaG90Jyk7XG52YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIExhc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGFzZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGFzZXIoZmllbGQsIG93bmVyLCBkaXJlY3Rpb24sIHBvd2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lciwgXCJMYXNlclwiKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDg7IH07XG4gICAgICAgIHRoaXMuc3BlZWQgPSBWLmRpcmVjdGlvbihkaXJlY3Rpb24pLm11bHRpcGx5KHBvd2VyKTtcbiAgICB9XG4gICAgcmV0dXJuIExhc2VyO1xufSkoU2hvdCk7XG5tb2R1bGUuZXhwb3J0cyA9IExhc2VyO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG52YXIgU2hvdCA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBNaXNzaWxlQ29tbWFuZCA9IHJlcXVpcmUoJy4vTWlzc2lsZUNvbW1hbmQnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vTWlzc2lsZUNvbnRyb2xsZXInKTtcbnZhciBDb25zdHMgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIE1pc3NpbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGUoZmllbGQsIG93bmVyLCBhaSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTWlzc2lsZVwiKTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDU7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMTAgKyBfdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IDEwMDtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFpID0gYWk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHMuRElSRUNUSU9OX1JJR0hUID8gMCA6IDE4MDtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG93bmVyLnNwZWVkO1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSBuZXcgTWlzc2lsZUNvbW1hbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgTWlzc2lsZUNvbnRyb2xsZXIodGhpcyk7XG4gICAgfVxuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5haSh0aGlzLmNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoYXR0YWNrKSB7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KGF0dGFjayk7XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uICsgZGlyZWN0aW9uO1xuICAgIH07XG4gICAgcmV0dXJuIE1pc3NpbGU7XG59KShTaG90KTtcbm1vZHVsZS5leHBvcnRzID0gTWlzc2lsZTtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgViA9IHJlcXVpcmUoJy4vVicpO1xudmFyIE1pc3NpbGVDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZUNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZUNvbW1hbmQobWlzc2lsZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5taXNzaWxlID0gbWlzc2lsZTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWRVcCA9IDA7XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gMDtcbiAgICAgICAgdGhpcy50dXJuID0gMDtcbiAgICB9O1xuICAgIE1pc3NpbGVDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZS5mdWVsKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkID0gVi5kaXJlY3Rpb24odGhpcy5taXNzaWxlLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQubXVsdGlwbHkoMSAtIHRoaXMuc3BlZWREb3duKTtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5mdWVsIC09ICh0aGlzLnNwZWVkVXAgKyB0aGlzLnNwZWVkRG93biAqIDMpICogQ29uZmlncy5GVUVMX0NPU1Q7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE1pc3NpbGVDb21tYW5kO1xufSkoQ29tbWFuZCk7XG5tb2R1bGUuZXhwb3J0cyA9IE1pc3NpbGVDb21tYW5kO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG52YXIgQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIE1pc3NpbGVDb250cm9sbGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZUNvbnRyb2xsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZUNvbnRyb2xsZXIobWlzc2lsZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBtaXNzaWxlKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmRpcmVjdGlvbjsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gbWlzc2lsZS5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBtaXNzaWxlLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1pc3NpbGUuZnVlbDsgfTtcbiAgICAgICAgdGhpcy5zY2FuRW5lbXkgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihtaXNzaWxlLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnNwZWVkVXAgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZERvd24gPSAwLjE7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVyblJpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gLTk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybkxlZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSA5O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gTWlzc2lsZUNvbnRyb2xsZXI7XG59KShDb250cm9sbGVyKTtcbm1vZHVsZS5leHBvcnRzID0gTWlzc2lsZUNvbnRyb2xsZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBBY3RvciA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBGeCA9IHJlcXVpcmUoJy4vRngnKTtcbnZhciBTaG90ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2hvdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaG90KGZpZWxkLCBvd25lciwgdHlwZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIucG9zaXRpb24ueCwgb3duZXIucG9zaXRpb24ueSk7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfTtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgU2hvdC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uQWN0aW9uKCk7XG4gICAgICAgIHZhciBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XG4gICAgICAgIGlmIChjb2xsaWRlZCkge1xuICAgICAgICAgICAgY29sbGlkZWQub25IaXQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeCh0aGlzLmZpZWxkLCB0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKSwgOCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMiksIDgpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUucmVhY3Rpb24gPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLnRlbXBlcmF0dXJlICs9IHRoaXMudGVtcGVyYXR1cmU7XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5vbkFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkdW1wID0gX3N1cGVyLnByb3RvdHlwZS5kdW1wLmNhbGwodGhpcyk7XG4gICAgICAgIGR1bXAudHlwZSA9IHRoaXMudHlwZTtcbiAgICAgICAgcmV0dXJuIGR1bXA7XG4gICAgfTtcbiAgICByZXR1cm4gU2hvdDtcbn0pKEFjdG9yKTtcbm1vZHVsZS5leHBvcnRzID0gU2hvdDtcbiIsInZhciBTaG90UGFyYW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNob3RQYXJhbSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIFNob3RQYXJhbTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNob3RQYXJhbTtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIGNoYWluY2hvbXAgPSByZXF1aXJlKCcuLi9saWJzL2NoYWluY2hvbXAnKTtcbnZhciBBY3RvciA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBTb3VyY2VyQ29tbWFuZCA9IHJlcXVpcmUoJy4vU291cmNlckNvbW1hbmQnKTtcbnZhciBTb3VyY2VyQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vU291cmNlckNvbnRyb2xsZXInKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgQ29uc3RzID0gcmVxdWlyZSgnLi9Db25zdHMnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBWID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTGFzZXIgPSByZXF1aXJlKCcuL0xhc2VyJyk7XG52YXIgTWlzc2lsZSA9IHJlcXVpcmUoJy4vTWlzc2lsZScpO1xudmFyIFNvdXJjZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXIoZmllbGQsIHgsIHksIGFpKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCB4LCB5KTtcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IENvbmZpZ3MuSU5JVElBTF9TSElFTEQ7XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBDb25maWdzLklOSVRJQUxfRlVFTDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBDb25zdHMuRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSBuZXcgU291cmNlckNvbW1hbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTb3VyY2VyQ29udHJvbGxlcih0aGlzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuYWkgPSBjaGFpbmNob21wKGFpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuYWkgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIFNvdXJjZXIucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmFpID09PSBudWxsIHx8ICF0aGlzLmFsaXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcbiAgICAgICAgICAgIHRoaXMuYWkodGhpcy5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlncy5TUEVFRF9SRVNJU1RBTkNFKTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlncy5HUkFWSVRZKTtcbiAgICAgICAgaWYgKENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EIDwgdGhpcy5wb3NpdGlvbi55KSB7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlUG93ZXIgPSAodGhpcy5wb3NpdGlvbi55IC0gQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQpICogMC4xO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlncy5HUkFWSVRZICogaW52aXNpYmxlUG93ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWZmID0gdGhpcy5maWVsZC5jZW50ZXIgLSB0aGlzLnBvc2l0aW9uLng7XG4gICAgICAgIGlmIChDb25maWdzLkRJU1RBTkNFX0JPUkRBUiA8IE1hdGguYWJzKGRpZmYpKSB7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlSGFuZCA9IGRpZmYgKiBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHRoaXMucG9zaXRpb24ueCArIGludmlzaWJsZUhhbmQsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkIC09ICgtdGhpcy5zcGVlZC55ICogQ29uZmlncy5HUk9VTkRfREFNQUdFX1NDQUxFKTtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLngsIDApO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWKHRoaXMuc3BlZWQueCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSAtPSBDb25maWdzLkNPT0xfRE9XTjtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IE1hdGgubWF4KHRoaXMudGVtcGVyYXR1cmUsIDApO1xuICAgICAgICB2YXIgb3ZlcmhlYXQgPSAodGhpcy50ZW1wZXJhdHVyZSAtIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSKTtcbiAgICAgICAgaWYgKDAgPCBvdmVyaGVhdCkge1xuICAgICAgICAgICAgdmFyIGxpbmVhckRhbWFnZSA9IG92ZXJoZWF0ICogQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVDtcbiAgICAgICAgICAgIHZhciBwb3dlckRhbWFnZSA9IE1hdGgucG93KG92ZXJoZWF0ICogQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hULCAyKTtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkIC09IChsaW5lYXJEYW1hZ2UgKyBwb3dlckRhbWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09IFwiTGFzZXJcIikge1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3Bwb3NpdGUocGFyYW0uZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHZhciBzaG90ID0gbmV3IExhc2VyKHRoaXMuZmllbGQsIHRoaXMsIGRpcmVjdGlvbiwgcGFyYW0ucG93ZXIpO1xuICAgICAgICAgICAgc2hvdC5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGVBbW1vKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pc3NpbGUgPSBuZXcgTWlzc2lsZSh0aGlzLmZpZWxkLCB0aGlzLCBwYXJhbS5haSk7XG4gICAgICAgICAgICAgICAgbWlzc2lsZS5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NpbGVBbW1vLS07XG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KG1pc3NpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBDb25zdHMuRElSRUNUSU9OX0xFRlQpIHtcbiAgICAgICAgICAgIHJldHVybiBVdGlscy50b09wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLmFkZChzaG90LnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUpKTtcbiAgICAgICAgdGhpcy5zaGllbGQgLT0gc2hvdC5kYW1hZ2UoKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChzaG90KTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkdW1wID0gX3N1cGVyLnByb3RvdHlwZS5kdW1wLmNhbGwodGhpcyk7XG4gICAgICAgIGR1bXAuc2hpZWxkID0gdGhpcy5zaGllbGQ7XG4gICAgICAgIGR1bXAudGVtcGVyYXR1cmUgPSB0aGlzLnRlbXBlcmF0dXJlO1xuICAgICAgICBkdW1wLm1pc3NpbGVBbW1vID0gdGhpcy5taXNzaWxlQW1tbztcbiAgICAgICAgZHVtcC5mdWVsID0gdGhpcy5mdWVsO1xuICAgICAgICByZXR1cm4gZHVtcDtcbiAgICB9O1xuICAgIHJldHVybiBTb3VyY2VyO1xufSkoQWN0b3IpO1xubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VyO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG52YXIgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBTb3VyY2VyQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJDb21tYW5kKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuc291cmNlciA9IHNvdXJjZXI7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFoZWFkID0gMDtcbiAgICAgICAgdGhpcy5hc2NlbnQgPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maXJlID0gbnVsbDtcbiAgICB9O1xuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5maXJlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZmlyZSh0aGlzLmZpcmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnR1cm4pIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgPCB0aGlzLnNvdXJjZXIuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgLT0gKE1hdGguYWJzKHRoaXMuYWhlYWQpICsgTWF0aC5hYnModGhpcy5hc2NlbnQpKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLnNvdXJjZXIuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBTb3VyY2VyQ29tbWFuZDtcbn0pKENvbW1hbmQpO1xubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VyQ29tbWFuZDtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL0NvbnRyb2xsZXInKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU2hvdFBhcmFtID0gcmVxdWlyZSgnLi9TaG90UGFyYW0nKTtcbnZhciBTb3VyY2VyQ29udHJvbGxlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJDb250cm9sbGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJDb250cm9sbGVyKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlcik7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci5zaGllbGQ7IH07XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLnRlbXBlcmF0dXJlOyB9O1xuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci5taXNzaWxlQW1tbzsgfTtcbiAgICAgICAgdGhpcy5mdWVsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci5mdWVsOyB9O1xuICAgICAgICB2YXIgZmllbGQgPSBzb3VyY2VyLmZpZWxkO1xuICAgICAgICB2YXIgY29tbWFuZCA9IHNvdXJjZXIuY29tbWFuZDtcbiAgICAgICAgdGhpcy5zY2FuRW5lbXkgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzLlNDQU5fV0FJVDtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzLmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuRW5lbXkoc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzLlNDQU5fV0FJVDtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzLmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuQXR0YWNrKHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5haGVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAtMC40O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gMC45O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlc2NlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFzY2VudCA9IC0wLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZUxhc2VyID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgcG93ZXIpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHBvd2VyID0gTWF0aC5taW4oTWF0aC5tYXgocG93ZXIgfHwgOCwgMyksIDgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnBvd2VyID0gcG93ZXI7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ0xhc2VyJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTWlzc2lsZSA9IGZ1bmN0aW9uIChhaSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLmFpID0gYWk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuc2hvdFR5cGUgPSAnTWlzc2lsZSc7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBTb3VyY2VyQ29udHJvbGxlcjtcbn0pKENvbnRyb2xsZXIpO1xubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VyQ29udHJvbGxlcjtcbiIsInZhciBWID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgRVBTSUxPTiA9IDEwZS0xMjtcbnZhciBVdGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXRpbHMoKSB7XG4gICAgfVxuICAgIFV0aWxzLmNyZWF0ZVJhZGFyID0gZnVuY3Rpb24gKGMsIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgIHZhciBjaGVja0Rpc3RhbmNlID0gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7IH07XG4gICAgICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVja0Rpc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XG4gICAgICAgIHZhciBjaGVja1JpZ2h0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyAxODAgLSBhbmdsZSAvIDIpO1xuICAgICAgICBpZiAoYW5nbGUgPCAxODApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpOyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zaWRlID0gZnVuY3Rpb24gKGJhc2UsIGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gVXRpbHMudG9SYWRpYW4oZGVncmVlKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG5ldyBWKE1hdGguY29zKHJhZGlhbiksIE1hdGguc2luKHJhZGlhbikpO1xuICAgICAgICB2YXIgcHJldmlvdXNseSA9IGJhc2UueCAqIGRpcmVjdGlvbi55IC0gYmFzZS55ICogZGlyZWN0aW9uLnggLSBFUFNJTE9OO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIDAgPD0gdGFyZ2V0LnggKiBkaXJlY3Rpb24ueSAtIHRhcmdldC55ICogZGlyZWN0aW9uLnggLSBwcmV2aW91c2x5O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgVXRpbHMuY2FsY0Rpc3RhbmNlID0gZnVuY3Rpb24gKGYsIHQsIHApIHtcbiAgICAgICAgdmFyIHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XG4gICAgICAgIHZhciBwRnJvbSA9IHAuc3VidHJhY3QoZik7XG4gICAgICAgIGlmICh0b0Zyb20uZG90KHBGcm9tKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbVRvID0gZi5zdWJ0cmFjdCh0KTtcbiAgICAgICAgdmFyIHBUbyA9IHAuc3VidHJhY3QodCk7XG4gICAgICAgIGlmIChmcm9tVG8uZG90KHBUbykgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gcFRvLmxlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0b0Zyb20uY3Jvc3MocEZyb20pIC8gdG9Gcm9tLmxlbmd0aCgpKTtcbiAgICB9O1xuICAgIFV0aWxzLnRvUmFkaWFuID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgIH07XG4gICAgVXRpbHMudG9PcHBvc2l0ZSA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgZGVncmVlID0gZGVncmVlICUgMzYwO1xuICAgICAgICBpZiAoZGVncmVlIDwgMCkge1xuICAgICAgICAgICAgZGVncmVlID0gZGVncmVlICsgMzYwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWdyZWUgPD0gMTgwKSB7XG4gICAgICAgICAgICByZXR1cm4gKDkwIC0gZGVncmVlKSAqIDIgKyBkZWdyZWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKDI3MCAtIGRlZ3JlZSkgKiAyICsgZGVncmVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5yYW5kID0gZnVuY3Rpb24gKHJlbmdlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogcmVuZ2U7XG4gICAgfTtcbiAgICByZXR1cm4gVXRpbHM7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcbiIsInZhciBWID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5fbGVuZ3RoID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSBudWxsO1xuICAgIH1cbiAgICBWLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgdiwgdGhpcy55ICsgeSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHYsIHkpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtIHYsIHRoaXMueSAtIHkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LCB0aGlzLnkgKiB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tb2R1bG8gPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LngsIHRoaXMueSAlIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdiwgdGhpcy55ICUgdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2xlbmd0aCA9IE1hdGguc3FydCh0aGlzLmRvdCgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xuICAgICAgICB2YXIgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseShzY2FsZSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZUluUmFkaWFucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmdsZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIGlmIChwb2ludCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MocmFkaWFuKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKHJhZGlhbik7XG4gICAgICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XG4gICAgfTtcbiAgICBWLmRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKDEsIDApLnJvdGF0ZShkZWdyZWUpO1xuICAgIH07XG4gICAgcmV0dXJuIFY7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBWO1xuIiwiLyoqXG4gKiBJbnZva2UgdW50cnVzdGVkIGd1ZXN0IGNvZGUgaW4gYSBzYW5kYm94LlxuICogVGhlIGd1ZXN0IGNvZGUgY2FuIGFjY2VzcyBvYmplY3RzIG9mIHRoZSBzdGFuZGFyZCBsaWJyYXJ5IG9mIEVDTUFTY3JpcHQuXG4gKlxuICogZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQ6IHN0cmluZywgc2NvcGU/OiBhbnkgPSB7fSk6IGFueTtcbiAqXG4gKiB0aGlzLnBhcmFtIHNjcmlwdCBndWVzdCBjb2RlLlxuICogdGhpcy5wYXJhbSBzY29wZSBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyB3aWxsIGJlIGV4cG9zZWQgdG8gdGhlIGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnJldHVybiByZXN1bHQgb2YgdGhlIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIGNoYWluY2hvbXAoc2NyaXB0LCBzY29wZSwgb3B0aW9ucyl7XG4gICAgLy8gRmlyc3QsIHlvdSBuZWVkIHRvIHBpbGUgYSBwaWNrZXQgdG8gdGllIGEgQ2hhaW4gQ2hvbXAuXG4gICAgLy8gSWYgdGhlIGVudmlyb25tZW50IGlzIGNoYW5nZWQsIHRoZSBwaWNrZXQgd2lsbCBkcm9wIG91dC5cbiAgICAvLyBZb3Ugc2hvdWxkIHJlbWFrZSBhIG5ldyBwaWNrZXQgZWFjaCB0aW1lIGFzIGxvbmcgYXPjgIB5b3UgYXJlIHNvIGJ1c3kuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgdGhlIGdsb2JhbCBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG11c3QgcmVtYWtlIGEgcGlja2V0LlxuICAgIHZhciBwaWNrZXQgPSBjaGFpbmNob21wLnBpY2soKTtcblxuICAgIC8vIE5leHQsIGdldCBuZXcgQ2hhaW4gQ2hvbXAgdGllZCB0aGUgcGlja2V0LlxuICAgIC8vIERpZmZlcmVudCBDaGFpbiBDaG9tcHMgaGF2ZSBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB5b3UgbmVlZCBhIGRpZmZlcmVudCBmdW5jdGlvbiwgeW91IGNhbiBnZXQgYW5vdGhlciBvbmUuXG4gICAgdmFyIGNob21wID0gcGlja2V0KHNjcmlwdCwgc2NvcGUpO1xuXG4gICAgLy8gTGFzdCwgZmVlZCB0aGUgY2hvbXAgYW5kIGxldCBpdCByYW1wYWdlIVxuICAgIC8vIEEgY2hvbXAgZWF0cyBub3RoaW5nIGJ1dOOAgGEga2luZCBvZiBmZWVkIHRoYXQgdGhlIGNob21wIGF0ZSBhdCBmaXJzdC5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgb25seSBhIHZhbHVlIGluIHRoZSBzY29wZSBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG5lZWQgbm90IHRvIHJlbWFrZSB0aGUgQ2hhaW4gQ2hvbXAgYW5kIHRoZSBwaWNrZXQuXG4gICAgcmV0dXJuIGNob21wKG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBzYW5kYm94XG4gKi9cbmNoYWluY2hvbXAucGljayA9IChmdW5jdGlvbigpe1xuICAgIC8vIER5bmFtaWMgaW5zdGFudGlhdGlvbiBpZGlvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYwNjc5Ny91c2Utb2YtYXBwbHktd2l0aC1uZXctb3BlcmF0b3ItaXMtdGhpcy1wb3NzaWJsZVxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdChjb25zdHJ1Y3RvciwgYXJncykge1xuICAgICAgICBmdW5jdGlvbiBGKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIEYucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCYW5uZWRWYXJzKCl7XG4gICAgICAgIC8vIGNvcnJlY3QgYmFubmVkIG9iamVjdCBuYW1lcy5cbiAgICAgICAgdmFyIGJhbm5lZCA9IFsnX19wcm90b19fJywgJ3Byb3RvdHlwZSddO1xuICAgICAgICBmdW5jdGlvbiBiYW4oayl7XG4gICAgICAgICAgICBpZihrICYmIGJhbm5lZC5pbmRleE9mKGspIDwgMCAmJiBrICE9PSAnZXZhbCcgJiYgay5tYXRjaCgvXltfJGEtekEtWl1bXyRhLXpBLVowLTldKiQvKSl7XG4gICAgICAgICAgICAgICAgYmFubmVkLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdsb2JhbCA9IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGdsb2JhbCkuZm9yRWFjaChiYW4pO1xuICAgICAgICBmb3IodmFyIGsgaW4gZ2xvYmFsKXtcbiAgICAgICAgICAgIGJhbihrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJhbiBhbGwgaWRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZShlbGVtKXtcbiAgICAgICAgICAgIGJhbihlbGVtLmdldEF0dHJpYnV0ZSAmJiBlbGVtLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB2YXIgY2hpbGRzID0gZWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNoaWxkcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdHJhdmVyc2UoY2hpbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIHN0YXJ0ICoqKipcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRyYXZlcnNlKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBlbmQgKioqKlxuXG4gICAgICAgIHJldHVybiBiYW5uZWQ7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgb2YgZXhwb3NlZCBvYmplY3RzXG4gICAgZnVuY3Rpb24gZ2V0U3RkbGlicygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ09iamVjdCcgICAgICAgICAgICA6IE9iamVjdCxcbiAgICAgICAgICAgICdTdHJpbmcnICAgICAgICAgICAgOiBTdHJpbmcsXG4gICAgICAgICAgICAnTnVtYmVyJyAgICAgICAgICAgIDogTnVtYmVyLFxuICAgICAgICAgICAgJ0Jvb2xlYW4nICAgICAgICAgICA6IEJvb2xlYW4sXG4gICAgICAgICAgICAnQXJyYXknICAgICAgICAgICAgIDogQXJyYXksXG4gICAgICAgICAgICAnRGF0ZScgICAgICAgICAgICAgIDogRGF0ZSxcbiAgICAgICAgICAgICdNYXRoJyAgICAgICAgICAgICAgOiBNYXRoLFxuICAgICAgICAgICAgJ1JlZ0V4cCcgICAgICAgICAgICA6IFJlZ0V4cCxcbiAgICAgICAgICAgICdFcnJvcicgICAgICAgICAgICAgOiBFcnJvcixcbiAgICAgICAgICAgICdFdmFsRXJyb3InICAgICAgICAgOiBFdmFsRXJyb3IsXG4gICAgICAgICAgICAnUmFuZ2VFcnJvcicgICAgICAgIDogUmFuZ2VFcnJvcixcbiAgICAgICAgICAgICdSZWZlcmVuY2VFcnJvcicgICAgOiBSZWZlcmVuY2VFcnJvcixcbiAgICAgICAgICAgICdTeW50YXhFcnJvcicgICAgICAgOiBTeW50YXhFcnJvcixcbiAgICAgICAgICAgICdUeXBlRXJyb3InICAgICAgICAgOiBUeXBlRXJyb3IsXG4gICAgICAgICAgICAnVVJJRXJyb3InICAgICAgICAgIDogVVJJRXJyb3IsXG4gICAgICAgICAgICAnSlNPTicgICAgICAgICAgICAgIDogSlNPTixcbiAgICAgICAgICAgICdOYU4nICAgICAgICAgICAgICAgOiBOYU4sXG4gICAgICAgICAgICAnSW5maW5pdHknICAgICAgICAgIDogSW5maW5pdHksXG4gICAgICAgICAgICAndW5kZWZpbmVkJyAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BhcnNlSW50JyAgICAgICAgICA6IHBhcnNlSW50LFxuICAgICAgICAgICAgJ3BhcnNlRmxvYXQnICAgICAgICA6IHBhcnNlRmxvYXQsXG4gICAgICAgICAgICAnaXNOYU4nICAgICAgICAgICAgIDogaXNOYU4sXG4gICAgICAgICAgICAnaXNGaW5pdGUnICAgICAgICAgIDogaXNGaW5pdGUsXG4gICAgICAgICAgICAnZGVjb2RlVVJJJyAgICAgICAgIDogZGVjb2RlVVJJLFxuICAgICAgICAgICAgJ2RlY29kZVVSSUNvbXBvbmVudCc6IGRlY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgICAgICdlbmNvZGVVUkknICAgICAgICAgOiBlbmNvZGVVUkksXG4gICAgICAgICAgICAnZW5jb2RlVVJJQ29tcG9uZW50JzogZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGlzRnJlZXplZFN0ZExpYk9ianMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBzYW5kYm94LlxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICBpZihpc0ZyZWV6ZWRTdGRMaWJPYmpzID09IGZhbHNlKXtcbiAgICAgICAgICAgIHZhciBzdGRsaWJzID0gZ2V0U3RkbGlicygpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmcmVlemUodil7XG4gICAgICAgICAgICAgICAgaWYodiAmJiAodHlwZW9mIHYgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSAmJiAhIE9iamVjdC5pc0Zyb3plbih2KSl7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUodik7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHYpLmZvckVhY2goZnVuY3Rpb24oaywgaSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2W2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGlvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyZWV6ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyZWV6ZShzdGRsaWJzKTtcblxuICAgICAgICAgICAgLy8gZnJlZXplIEZ1bmN0aW9uLnByb3RvdHlwZVxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnJlZXplKEZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgaXNGcmVlemVkU3RkTGliT2JqcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmFubmVkID0gZ2V0QmFubmVkVmFycygpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24oc2NyaXB0LCBzY29wZSl7XG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSBhcmd1bWVudHNcbiAgICAgICAgICAgIGlmKCAhICh0eXBlb2Ygc2NyaXB0ID09PSAnc3RyaW5nJyB8fCBzY3JpcHQgaW5zdGFuY2VvZiBTdHJpbmcgKSl7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSBkZWZhdWx0IHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoc2NvcGUpO1xuXG4gICAgICAgICAgICAvLyBFeHBvc2UgY3VzdG9tIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHZhciBndWVzdEdsb2JhbCA9IGdldFN0ZGxpYnMoKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgIGd1ZXN0R2xvYmFsW2tdID0gc2NvcGVba107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKGd1ZXN0R2xvYmFsKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHNhbmRib3hlZCBmdW5jdGlvblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkuY29uY2F0KGJhbm5lZC5maWx0ZXIoZnVuY3Rpb24oYil7IHJldHVybiAhIGd1ZXN0R2xvYmFsLmhhc093blByb3BlcnR5KGIpOyB9KSk7XG4gICAgICAgICAgICBhcmdzLnB1c2goJ1widXNlIHN0cmljdFwiO1xcbicgKyBzY3JpcHQpO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uT2JqZWN0ID0gY29uc3RydWN0KEZ1bmN0aW9uLCBhcmdzKTtcblxuICAgICAgICAgICAgdmFyIHNhZmVFdmFsID0gZnVuY3Rpb24ocyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgcywgZ3Vlc3RHbG9iYWwpKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShzYWZlRXZhbCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW52b2tlIHNhbmRib3hlZCBmdW5jdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGV2YWwgd2l0aCBzYWZlIGV2YWwtbGlrZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHZhciBfZXZhbCA9IGV2YWw7XG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5kZWJ1ZyAhPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwgPSBzYWZlRXZhbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN0b3JlIGRlZmF1bHQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbFxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gT2JqZWN0LmtleXMoZ3Vlc3RHbG9iYWwpLm1hcChmdW5jdGlvbihrKXsgcmV0dXJuIGd1ZXN0R2xvYmFsW2tdOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uT2JqZWN0LmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9ZmluYWxseXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IF9ldmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBpbnZva2VTYW5kYm94ZWRGdW5jdGlvbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgIH07XG59KSgpO1xuXG4vL1xuY2hhaW5jaG9tcC5jYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBhcmdzLCBvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcblxuICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgZXZhbCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnl7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgfVxufTtcblxuLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgc3RhcnQgKioqKlxubW9kdWxlLmV4cG9ydHMgPSBjaGFpbmNob21wO1xuLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgZW5kICoqKipcbiJdfQ==
