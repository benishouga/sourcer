(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Field = require('./core/Field');
var Sourcer = require('./core/Sourcer');
var Utils = require('./core/Utils');
function create(field, source) {
    return new Sourcer(field, Utils.rand(320) - 160, Utils.rand(320) - 160, source.ai, source.name, source.color);
}
onmessage = function (e) {
    var field = new Field();
    var sourcer1 = create(field, e.data.sources[0]);
    var sourcer2 = create(field, e.data.sources[1]);
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
        this.checkResult();
        this.frame++;
    };
    Field.prototype.checkResult = function () {
        if (this.result) {
            return;
        }
        var survived = null;
        for (var i = 0; i < this.sourcers.length; i++) {
            var sourcer = this.sourcers[i];
            if (sourcer.shield <= 0) {
                sourcer.alive = false;
            }
            else if (!survived) {
                survived = sourcer;
            }
            else {
                return;
            }
        }
        this.result = new GameResult(survived, this.frame);
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
        var resultDump = null;
        this.sourcers.forEach(function (actor) {
            sourcersDump.push(actor.dump());
        });
        this.shots.forEach(function (actor) {
            shotsDump.push(actor.dump());
        });
        this.fxs.forEach(function (fx) {
            fxDump.push(fx.dump());
        });
        if (this.result) {
            resultDump = this.result.dump();
        }
        return {
            frame: this.frame,
            sourcers: sourcersDump,
            shots: shotsDump,
            fxs: fxDump,
            result: resultDump
        };
    };
    return Field;
})();
var GameResult = (function () {
    function GameResult(winner, frame) {
        this.winner = winner;
        this.frame = frame;
    }
    GameResult.prototype.isDraw = function () {
        return this.winner == null;
    };
    GameResult.prototype.dump = function () {
        var dump = null;
        if (this.winner) {
            dump = this.winner.dump();
        }
        return {
            winner: dump,
            isDraw: this.isDraw(),
            frame: this.frame
        };
    };
    return GameResult;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        dump.color = this.owner.color;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    function Sourcer(field, x, y, ai, name, color) {
        _super.call(this, field, x, y);
        this.name = name;
        this.color = color;
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
        dump.name = this.name;
        dump.color = this.color;
        return dump;
    };
    return Sourcer;
})(Actor);
module.exports = Sourcer;

},{"../libs/chainchomp":20,"./Actor":2,"./Configs":4,"./Consts":5,"./Laser":9,"./Missile":10,"./SourcerCommand":16,"./SourcerController":17,"./Utils":18,"./V":19}],16:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9BY3Rvci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0NvbW1hbmQuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29uc3RzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvRnguanMiLCJpbnRlcm1lZGlhdGUvY29yZS9MYXNlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9NaXNzaWxlQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGVDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1Nob3RQYXJhbS5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXIuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXJDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvVXRpbHMuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9WLmpzIiwiaW50ZXJtZWRpYXRlL2xpYnMvY2hhaW5jaG9tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEZpZWxkID0gcmVxdWlyZSgnLi9jb3JlL0ZpZWxkJyk7XG52YXIgU291cmNlciA9IHJlcXVpcmUoJy4vY29yZS9Tb3VyY2VyJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2NvcmUvVXRpbHMnKTtcbmZ1bmN0aW9uIGNyZWF0ZShmaWVsZCwgc291cmNlKSB7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VyKGZpZWxkLCBVdGlscy5yYW5kKDMyMCkgLSAxNjAsIFV0aWxzLnJhbmQoMzIwKSAtIDE2MCwgc291cmNlLmFpLCBzb3VyY2UubmFtZSwgc291cmNlLmNvbG9yKTtcbn1cbm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZpZWxkID0gbmV3IEZpZWxkKCk7XG4gICAgdmFyIHNvdXJjZXIxID0gY3JlYXRlKGZpZWxkLCBlLmRhdGEuc291cmNlc1swXSk7XG4gICAgdmFyIHNvdXJjZXIyID0gY3JlYXRlKGZpZWxkLCBlLmRhdGEuc291cmNlc1sxXSk7XG4gICAgZmllbGQuYWRkU291cmNlcihzb3VyY2VyMSk7XG4gICAgZmllbGQuYWRkU291cmNlcihzb3VyY2VyMik7XG4gICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgICBvblByZVRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQcmVUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBzb3VyY2VyMS5pZCA9PSBzb3VyY2VySWQgPyAwIDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdFRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQb3N0VGhpbmtcIixcbiAgICAgICAgICAgICAgICBpbmRleDogc291cmNlcjEuaWQgPT0gc291cmNlcklkID8gMCA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIwMDAgJiYgIWZpZWxkLmlzRmluaXNoKCk7IGkrKykge1xuICAgICAgICBmaWVsZC50aWNrKGxpc3RlbmVyKTtcbiAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgY29tbWFuZDogXCJGcmFtZVwiLFxuICAgICAgICAgICAgZmllbGQ6IGZpZWxkLmR1bXAoKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb21tYW5kOiBcIkVuZE9mR2FtZVwiXG4gICAgfSk7XG59O1xuIiwidmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgQWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFjdG9yKGZpZWxkLCB4LCB5KSB7XG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5zaXplID0gQ29uZmlncy5DT0xMSVNJT05fU0laRTtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHgsIHkpO1xuICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFYoMCwgMCk7XG4gICAgfVxuICAgIEFjdG9yLnByb3RvdHlwZS50aGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMud2FpdCA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5vblRoaW5rKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhaXQtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICAgICAgICBzcGVlZDogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb25cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBBY3Rvcjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEFjdG9yO1xuIiwidmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBDb21tYW5kLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWNjZXB0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29tbWFuZC4gXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IHRydWU7XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS51bmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gQ29tbWFuZDtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmQ7XG4iLCJ2YXIgQ29uZmlncyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uZmlncygpIHtcbiAgICB9XG4gICAgQ29uZmlncy5JTklUSUFMX1NISUVMRCA9IDEwMDtcbiAgICBDb25maWdzLklOSVRJQUxfRlVFTCA9IDEwMDtcbiAgICBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PID0gMjA7XG4gICAgQ29uZmlncy5GVUVMX0NPU1QgPSAwLjI0O1xuICAgIENvbmZpZ3MuQ09MTElTSU9OX1NJWkUgPSA0O1xuICAgIENvbmZpZ3MuU0NBTl9XQUlUID0gMC4zNTtcbiAgICBDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UgPSAwLjk2O1xuICAgIENvbmZpZ3MuR1JBVklUWSA9IDAuMTtcbiAgICBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0JPUkRBUiA9IDQwMDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9CT1JERVIgPSAxMDA7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XG4gICAgQ29uZmlncy5HUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcbiAgICBDb25maWdzLkNPT0xfRE9XTiA9IDAuNTtcbiAgICBDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xuICAgIHJldHVybiBDb25maWdzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlncztcbiIsInZhciBDb25zdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnN0cygpIHtcbiAgICB9XG4gICAgQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA9IDE7XG4gICAgQ29uc3RzLkRJUkVDVElPTl9MRUZUID0gLTE7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX1VQID0gXCJ2ZXJ0aWFsX3VwXCI7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX0RPV04gPSBcInZlcnRpYWxfZG93blwiO1xuICAgIHJldHVybiBDb25zdHM7XG59KSgpO1xuO1xubW9kdWxlLmV4cG9ydHMgPSBDb25zdHM7XG4iLCJ2YXIgQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcihhY3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvZyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9uYWxQYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uYWxQYXJhbXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmllbGQgPSBhY3Rvci5maWVsZDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmZpZWxkLmZyYW1lOyB9O1xuICAgICAgICB0aGlzLmFsdGl0dWRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gYWN0b3IucG9zaXRpb24ueTsgfTtcbiAgICAgICAgdGhpcy53YWl0ID0gZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgICAgICAgICBpZiAoMCA8IGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgYWN0b3Iud2FpdCArPSBmcmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2xsZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIEZpZWxkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGaWVsZCgpIHtcbiAgICAgICAgdGhpcy5pZCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzID0gW107XG4gICAgICAgIHRoaXMuc2hvdHMgPSBbXTtcbiAgICAgICAgdGhpcy5meHMgPSBbXTtcbiAgICB9XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNvdXJjZXIgPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLmlkID0gXCJzb3VyY2VyXCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5wdXNoKHNvdXJjZXIpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNob3QgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICBzaG90LmlkID0gXCJzaG90XCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZVNob3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdG9yID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIGlmIChhY3RvciA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkRnggPSBmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgZnguaWQgPSBcImZ4XCIgKyAodGhpcy5pZCsrKTtcbiAgICAgICAgdGhpcy5meHMucHVzaChmeCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlRnggPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5meHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmeCA9IHRoaXMuZnhzW2ldO1xuICAgICAgICAgICAgaWYgKGZ4ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ4cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XG4gICAgICAgICAgICBzb3VyY2VyLnRoaW5rKCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzaG90Lm93bmVyLmlkKTtcbiAgICAgICAgICAgIHNob3QudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IuYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoZWNrUmVzdWx0KCk7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja1Jlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1cnZpdmVkID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlci5zaGllbGQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHNvdXJjZXIuYWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFzdXJ2aXZlZCkge1xuICAgICAgICAgICAgICAgIHN1cnZpdmVkID0gc291cmNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3VsdCA9IG5ldyBHYW1lUmVzdWx0KHN1cnZpdmVkLCB0aGlzLmZyYW1lKTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5zY2FuRW5lbXkgPSBmdW5jdGlvbiAob3duZXIsIHJhZGFyKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gb3duZXIgJiYgcmFkYXIoc291cmNlci5wb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkF0dGFjayA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgdmFyIG93bmVyUG9zaXRpb24gPSBvd25lci5wb3NpdGlvbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2hvdCA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICB2YXIgYWN0b3JQb3NpdGlvbiA9IHNob3QucG9zaXRpb247XG4gICAgICAgICAgICBpZiAoc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoYWN0b3JQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uLmFkZChzaG90LnNwZWVkKSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHREaXN0YW5jZSA8IGN1cnJlbnREaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdmFyIGYgPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICB2YXIgdCA9IHNob3QucG9zaXRpb24uYWRkKHNob3Quc3BlZWQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhY3RvciA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICBpZiAoYWN0b3IuYnJlYWthYmxlICYmIGFjdG9yLm93bmVyICE9PSBzaG90Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gVXRpbHMuY2FsY0Rpc3RhbmNlKGYsIHQsIGFjdG9yLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBzaG90Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gVXRpbHMuY2FsY0Rpc3RhbmNlKGYsIHQsIHNvdXJjZXIucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNvbXB1dGVDZW50ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIHZhciBzdW1YID0gMDtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHN1bVggKz0gc291cmNlci5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmlzRmluaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF0aGlzLmZpbmlzaGVkRnJhbWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkRnJhbWUgPSB0aGlzLmZyYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5pc2hlZEZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNvdXJjZXJzRHVtcCA9IFtdO1xuICAgICAgICB2YXIgc2hvdHNEdW1wID0gW107XG4gICAgICAgIHZhciBmeER1bXAgPSBbXTtcbiAgICAgICAgdmFyIHJlc3VsdER1bXAgPSBudWxsO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeER1bXAucHVzaChmeC5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHREdW1wID0gdGhpcy5yZXN1bHQuZHVtcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIHNvdXJjZXJzOiBzb3VyY2Vyc0R1bXAsXG4gICAgICAgICAgICBzaG90czogc2hvdHNEdW1wLFxuICAgICAgICAgICAgZnhzOiBmeER1bXAsXG4gICAgICAgICAgICByZXN1bHQ6IHJlc3VsdER1bXBcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBGaWVsZDtcbn0pKCk7XG52YXIgR2FtZVJlc3VsdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZVJlc3VsdCh3aW5uZXIsIGZyYW1lKSB7XG4gICAgICAgIHRoaXMud2lubmVyID0gd2lubmVyO1xuICAgICAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gICAgfVxuICAgIEdhbWVSZXN1bHQucHJvdG90eXBlLmlzRHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lubmVyID09IG51bGw7XG4gICAgfTtcbiAgICBHYW1lUmVzdWx0LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHVtcCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLndpbm5lcikge1xuICAgICAgICAgICAgZHVtcCA9IHRoaXMud2lubmVyLmR1bXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lubmVyOiBkdW1wLFxuICAgICAgICAgICAgaXNEcmF3OiB0aGlzLmlzRHJhdygpLFxuICAgICAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lUmVzdWx0O1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7XG4iLCJ2YXIgRnggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZ4KGZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkge1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgfVxuICAgIEZ4LnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gICAgfTtcbiAgICBGeC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIGxlbmd0aDogdGhpcy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBGeDtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEZ4O1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU2hvdCA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBMYXNlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExhc2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIExhc2VyKGZpZWxkLCBvd25lciwgZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTGFzZXJcIik7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gNTtcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiA4OyB9O1xuICAgICAgICB0aGlzLnNwZWVkID0gVi5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XG4gICAgfVxuICAgIHJldHVybiBMYXNlcjtcbn0pKFNob3QpO1xubW9kdWxlLmV4cG9ydHMgPSBMYXNlcjtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFNob3QgPSByZXF1aXJlKCcuL1Nob3QnKTtcbnZhciBDb25maWdzID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgTWlzc2lsZUNvbW1hbmQgPSByZXF1aXJlKCcuL01pc3NpbGVDb21tYW5kJyk7XG52YXIgTWlzc2lsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL01pc3NpbGVDb250cm9sbGVyJyk7XG52YXIgQ29uc3RzID0gcmVxdWlyZSgnLi9Db25zdHMnKTtcbnZhciBNaXNzaWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlKGZpZWxkLCBvd25lciwgYWkpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLCBcIk1pc3NpbGVcIik7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDEwICsgX3RoaXMuc3BlZWQubGVuZ3RoKCkgKiAyOyB9O1xuICAgICAgICB0aGlzLmZ1ZWwgPSAxMDA7XG4gICAgICAgIHRoaXMuYnJlYWthYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5haSA9IGFpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IG93bmVyLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyKHRoaXMpO1xuICAgIH1cbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcbiAgICAgICAgICAgIHRoaXMuYWkodGhpcy5jb250cm9sbGVyKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKGF0dGFjaykge1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChhdHRhY2spO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlO1xufSkoU2hvdCk7XG5tb2R1bGUuZXhwb3J0cyA9IE1pc3NpbGU7XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlncyA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBNaXNzaWxlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb21tYW5kKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMubWlzc2lsZSA9IG1pc3NpbGU7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgTWlzc2lsZUNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSAwO1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IDA7XG4gICAgICAgIHRoaXMudHVybiA9IDA7XG4gICAgfTtcbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmRpcmVjdGlvbiArPSB0aGlzLnR1cm47XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLmFkZChub3JtYWxpemVkLm11bHRpcGx5KHRoaXMuc3BlZWRVcCkpO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLm1pc3NpbGUuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlQ29tbWFuZDtcbn0pKENvbW1hbmQpO1xubW9kdWxlLmV4cG9ydHMgPSBNaXNzaWxlQ29tbWFuZDtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL0NvbnRyb2xsZXInKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb250cm9sbGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb250cm9sbGVyKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbWlzc2lsZSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5kaXJlY3Rpb247IH07XG4gICAgICAgIHZhciBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmZ1ZWw7IH07XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBtaXNzaWxlLndhaXQgKz0gMS41O1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gbWlzc2lsZS5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIG1pc3NpbGUuZmllbGQuc2NhbkVuZW15KG1pc3NpbGUub3duZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGVlZFVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuc3BlZWREb3duID0gMC4xO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5SaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IC05O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5MZWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gOTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIE1pc3NpbGVDb250cm9sbGVyO1xufSkoQ29udHJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IE1pc3NpbGVDb250cm9sbGVyO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgRnggPSByZXF1aXJlKCcuL0Z4Jyk7XG52YXIgU2hvdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNob3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2hvdChmaWVsZCwgb3duZXIsIHR5cGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLnBvc2l0aW9uLngsIG93bmVyLnBvc2l0aW9uLnkpO1xuICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDA7IH07XG4gICAgICAgIHRoaXMuYnJlYWthYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIFNob3QucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vbkFjdGlvbigpO1xuICAgICAgICB2YXIgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xuICAgICAgICBpZiAoY29sbGlkZWQpIHtcbiAgICAgICAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMiksIDgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4KHRoaXMuZmllbGQsIHRoaXMucG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLCA4KSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLnJlYWN0aW9uID0gZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgc291cmNlci50ZW1wZXJhdHVyZSArPSB0aGlzLnRlbXBlcmF0dXJlO1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHVtcCA9IF9zdXBlci5wcm90b3R5cGUuZHVtcC5jYWxsKHRoaXMpO1xuICAgICAgICBkdW1wLnR5cGUgPSB0aGlzLnR5cGU7XG4gICAgICAgIGR1bXAuY29sb3IgPSB0aGlzLm93bmVyLmNvbG9yO1xuICAgICAgICByZXR1cm4gZHVtcDtcbiAgICB9O1xuICAgIHJldHVybiBTaG90O1xufSkoQWN0b3IpO1xubW9kdWxlLmV4cG9ydHMgPSBTaG90O1xuIiwidmFyIFNob3RQYXJhbSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2hvdFBhcmFtKCkge1xuICAgIH1cbiAgICByZXR1cm4gU2hvdFBhcmFtO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gU2hvdFBhcmFtO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgY2hhaW5jaG9tcCA9IHJlcXVpcmUoJy4uL2xpYnMvY2hhaW5jaG9tcCcpO1xudmFyIEFjdG9yID0gcmVxdWlyZSgnLi9BY3RvcicpO1xudmFyIFNvdXJjZXJDb21tYW5kID0gcmVxdWlyZSgnLi9Tb3VyY2VyQ29tbWFuZCcpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi9Tb3VyY2VyQ29udHJvbGxlcicpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBDb25zdHMgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBMYXNlciA9IHJlcXVpcmUoJy4vTGFzZXInKTtcbnZhciBNaXNzaWxlID0gcmVxdWlyZSgnLi9NaXNzaWxlJyk7XG52YXIgU291cmNlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlcihmaWVsZCwgeCwgeSwgYWksIG5hbWUsIGNvbG9yKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCB4LCB5KTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gQ29uZmlncy5JTklUSUFMX1NISUVMRDtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU87XG4gICAgICAgIHRoaXMuZnVlbCA9IENvbmZpZ3MuSU5JVElBTF9GVUVMO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IENvbnN0cy5ESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IG5ldyBTb3VyY2VyQ29tbWFuZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyKHRoaXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5haSA9IGNoYWluY2hvbXAoYWkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5haSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgU291cmNlci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWkgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5haSh0aGlzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzLkdSQVZJVFkpO1xuICAgICAgICBpZiAoQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQgPCB0aGlzLnBvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgIHZhciBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzLkdSQVZJVFkgKiBpbnZpc2libGVQb3dlcik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpZmYgPSB0aGlzLmZpZWxkLmNlbnRlciAtIHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgaWYgKENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcbiAgICAgICAgICAgIHZhciBpbnZpc2libGVIYW5kID0gZGlmZiAqIENvbmZpZ3MuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQ7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYodGhpcy5wb3NpdGlvbi54ICsgaW52aXNpYmxlSGFuZCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55IDwgMCkge1xuICAgICAgICAgICAgdGhpcy5zaGllbGQgLT0gKC10aGlzLnNwZWVkLnkgKiBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEUpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHRoaXMucG9zaXRpb24ueCwgMCk7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFYodGhpcy5zcGVlZC54LCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlIC09IENvbmZpZ3MuQ09PTF9ET1dOO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XG4gICAgICAgIHZhciBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlncy5PVkVSSEVBVF9CT1JERVIpO1xuICAgICAgICBpZiAoMCA8IG92ZXJoZWF0KSB7XG4gICAgICAgICAgICB2YXIgbGluZWFyRGFtYWdlID0gb3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUO1xuICAgICAgICAgICAgdmFyIHBvd2VyRGFtYWdlID0gTWF0aC5wb3cob3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gXCJMYXNlclwiKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdmFyIHNob3QgPSBuZXcgTGFzZXIodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XG4gICAgICAgICAgICBzaG90LnJlYWN0aW9uKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KHNob3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ01pc3NpbGUnKSB7XG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWlzc2lsZSA9IG5ldyBNaXNzaWxlKHRoaXMuZmllbGQsIHRoaXMsIHBhcmFtLmFpKTtcbiAgICAgICAgICAgICAgICBtaXNzaWxlLnJlYWN0aW9uKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMubWlzc2lsZUFtbW8tLTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3QobWlzc2lsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLm9wcG9zaXRlID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnRvT3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuYWRkKHNob3Quc3BlZWQubXVsdGlwbHkoQ29uZmlncy5PTl9ISVRfU1BFRURfR0lWRU5fUkFURSkpO1xuICAgICAgICB0aGlzLnNoaWVsZCAtPSBzaG90LmRhbWFnZSgpO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcbiAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHNob3QpO1xuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGR1bXAgPSBfc3VwZXIucHJvdG90eXBlLmR1bXAuY2FsbCh0aGlzKTtcbiAgICAgICAgZHVtcC5zaGllbGQgPSB0aGlzLnNoaWVsZDtcbiAgICAgICAgZHVtcC50ZW1wZXJhdHVyZSA9IHRoaXMudGVtcGVyYXR1cmU7XG4gICAgICAgIGR1bXAubWlzc2lsZUFtbW8gPSB0aGlzLm1pc3NpbGVBbW1vO1xuICAgICAgICBkdW1wLmZ1ZWwgPSB0aGlzLmZ1ZWw7XG4gICAgICAgIGR1bXAubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgZHVtcC5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgICAgIHJldHVybiBkdW1wO1xuICAgIH07XG4gICAgcmV0dXJuIFNvdXJjZXI7XG59KShBY3Rvcik7XG5tb2R1bGUuZXhwb3J0cyA9IFNvdXJjZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlncyA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFNvdXJjZXJDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckNvbW1hbmQoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5zb3VyY2VyID0gc291cmNlcjtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICBTb3VyY2VyQ29tbWFuZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWhlYWQgPSAwO1xuICAgICAgICB0aGlzLmFzY2VudCA9IDA7XG4gICAgICAgIHRoaXMudHVybiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpcmUgPSBudWxsO1xuICAgIH07XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudHVybikge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCA8IHRoaXMuc291cmNlci5mdWVsKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuc3BlZWQgPSB0aGlzLnNvdXJjZXIuc3BlZWQuYWRkKHRoaXMuYWhlYWQgKiB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uLCB0aGlzLmFzY2VudCk7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlncy5GVUVMX0NPU1Q7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMuc291cmNlci5mdWVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFNvdXJjZXJDb21tYW5kO1xufSkoQ29tbWFuZCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNvdXJjZXJDb21tYW5kO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIENvbmZpZ3MgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTaG90UGFyYW0gPSByZXF1aXJlKCcuL1Nob3RQYXJhbScpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckNvbnRyb2xsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckNvbnRyb2xsZXIoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2VyKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLnNoaWVsZDsgfTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIudGVtcGVyYXR1cmU7IH07XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLm1pc3NpbGVBbW1vOyB9O1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLmZ1ZWw7IH07XG4gICAgICAgIHZhciBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xuICAgICAgICB0aGlzLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3MuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnNjYW5FbmVteShzb3VyY2VyLCByYWRhcik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2NhbkF0dGFjayA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3MuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnNjYW5BdHRhY2soc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFoZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5iYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IC0wLjQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNjZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5hc2NlbnQgPSAwLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTGFzZXIgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgcG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUgPSBuZXcgU2hvdFBhcmFtKCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUucG93ZXIgPSBwb3dlcjtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuc2hvdFR5cGUgPSAnTGFzZXInO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpcmVNaXNzaWxlID0gZnVuY3Rpb24gKGFpKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUgPSBuZXcgU2hvdFBhcmFtKCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuYWkgPSBhaTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5zaG90VHlwZSA9ICdNaXNzaWxlJztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFNvdXJjZXJDb250cm9sbGVyO1xufSkoQ29udHJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IFNvdXJjZXJDb250cm9sbGVyO1xuIiwidmFyIFYgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBFUFNJTE9OID0gMTBlLTEyO1xudmFyIFV0aWxzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVdGlscygpIHtcbiAgICB9XG4gICAgVXRpbHMuY3JlYXRlUmFkYXIgPSBmdW5jdGlvbiAoYywgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgdmFyIGNoZWNrRGlzdGFuY2UgPSBmdW5jdGlvbiAodCkgeyByZXR1cm4gYy5kaXN0YW5jZSh0KSA8PSByZW5nZTsgfTtcbiAgICAgICAgaWYgKDM2MCA8PSBhbmdsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNoZWNrRGlzdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoZWNrTGVmdCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgYW5nbGUgLyAyKTtcbiAgICAgICAgdmFyIGNoZWNrUmlnaHQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIDE4MCAtIGFuZ2xlIC8gMik7XG4gICAgICAgIGlmIChhbmdsZSA8IDE4MCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiBjaGVja0xlZnQodCkgJiYgY2hlY2tSaWdodCh0KSAmJiBjaGVja0Rpc3RhbmNlKHQpOyB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiAoY2hlY2tMZWZ0KHQpIHx8IGNoZWNrUmlnaHQodCkpICYmIGNoZWNrRGlzdGFuY2UodCk7IH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnNpZGUgPSBmdW5jdGlvbiAoYmFzZSwgZGVncmVlKSB7XG4gICAgICAgIHZhciByYWRpYW4gPSBVdGlscy50b1JhZGlhbihkZWdyZWUpO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gbmV3IFYoTWF0aC5jb3MocmFkaWFuKSwgTWF0aC5zaW4ocmFkaWFuKSk7XG4gICAgICAgIHZhciBwcmV2aW91c2x5ID0gYmFzZS54ICogZGlyZWN0aW9uLnkgLSBiYXNlLnkgKiBkaXJlY3Rpb24ueCAtIEVQU0lMT047XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gMCA8PSB0YXJnZXQueCAqIGRpcmVjdGlvbi55IC0gdGFyZ2V0LnkgKiBkaXJlY3Rpb24ueCAtIHByZXZpb3VzbHk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBVdGlscy5jYWxjRGlzdGFuY2UgPSBmdW5jdGlvbiAoZiwgdCwgcCkge1xuICAgICAgICB2YXIgdG9Gcm9tID0gdC5zdWJ0cmFjdChmKTtcbiAgICAgICAgdmFyIHBGcm9tID0gcC5zdWJ0cmFjdChmKTtcbiAgICAgICAgaWYgKHRvRnJvbS5kb3QocEZyb20pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBGcm9tLmxlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xuICAgICAgICB2YXIgcFRvID0gcC5zdWJ0cmFjdCh0KTtcbiAgICAgICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xuICAgIH07XG4gICAgVXRpbHMudG9SYWRpYW4gPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgfTtcbiAgICBVdGlscy50b09wcG9zaXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICBkZWdyZWUgPSBkZWdyZWUgJSAzNjA7XG4gICAgICAgIGlmIChkZWdyZWUgPCAwKSB7XG4gICAgICAgICAgICBkZWdyZWUgPSBkZWdyZWUgKyAzNjA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZ3JlZSA8PSAxODApIHtcbiAgICAgICAgICAgIHJldHVybiAoOTAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoMjcwIC0gZGVncmVlKSAqIDIgKyBkZWdyZWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnJhbmQgPSBmdW5jdGlvbiAocmVuZ2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiByZW5nZTtcbiAgICB9O1xuICAgIHJldHVybiBVdGlscztcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxzO1xuIiwidmFyIFYgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFYoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLl9sZW5ndGggPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmdsZSA9IG51bGw7XG4gICAgfVxuICAgIFYucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh2LCB5KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LCB0aGlzLnkgKyB5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdiwgdGhpcy55IC0geSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdiwgdGhpcy55IC8gdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm1vZHVsbyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYueCwgdGhpcy55ICUgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LCB0aGlzLnkgJSB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFYoLXRoaXMueCwgLXRoaXMueSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHYpLmxlbmd0aCgpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMubGVuZ3RoKCk7XG4gICAgICAgIHZhciBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHNjYWxlKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmdsZUluUmFkaWFucygpICogMTgwIC8gTWF0aC5QSTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlSW5SYWRpYW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmdsZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCB0aGlzLngpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgaWYgKHBvaW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueCArIHRoaXMueSAqIHBvaW50Lnk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueSAtIHRoaXMueSAqIHBvaW50Lng7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHZhciByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWKGNvcyAqIHRoaXMueCAtIHNpbiAqIHRoaXMueSwgY29zICogdGhpcy55ICsgc2luICogdGhpcy54KTtcbiAgICB9O1xuICAgIFYuZGlyZWN0aW9uID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XG4gICAgfTtcbiAgICByZXR1cm4gVjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFY7XG4iLCIvKipcbiAqIEludm9rZSB1bnRydXN0ZWQgZ3Vlc3QgY29kZSBpbiBhIHNhbmRib3guXG4gKiBUaGUgZ3Vlc3QgY29kZSBjYW4gYWNjZXNzIG9iamVjdHMgb2YgdGhlIHN0YW5kYXJkIGxpYnJhcnkgb2YgRUNNQVNjcmlwdC5cbiAqXG4gKiBmdW5jdGlvbiBjaGFpbmNob21wKHNjcmlwdDogc3RyaW5nLCBzY29wZT86IGFueSA9IHt9KTogYW55O1xuICpcbiAqIHRoaXMucGFyYW0gc2NyaXB0IGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnBhcmFtIHNjb3BlIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHdpbGwgYmUgZXhwb3NlZCB0byB0aGUgZ3Vlc3QgY29kZS5cbiAqIHRoaXMucmV0dXJuIHJlc3VsdCBvZiB0aGUgcHJvY2Vzcy5cbiAqL1xuZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQsIHNjb3BlLCBvcHRpb25zKXtcbiAgICAvLyBGaXJzdCwgeW91IG5lZWQgdG8gcGlsZSBhIHBpY2tldCB0byB0aWUgYSBDaGFpbiBDaG9tcC5cbiAgICAvLyBJZiB0aGUgZW52aXJvbm1lbnQgaXMgY2hhbmdlZCwgdGhlIHBpY2tldCB3aWxsIGRyb3Agb3V0LlxuICAgIC8vIFlvdSBzaG91bGQgcmVtYWtlIGEgbmV3IHBpY2tldCBlYWNoIHRpbWUgYXMgbG9uZyBhc+OAgHlvdSBhcmUgc28gYnVzeS5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB0aGUgZ2xvYmFsIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbXVzdCByZW1ha2UgYSBwaWNrZXQuXG4gICAgdmFyIHBpY2tldCA9IGNoYWluY2hvbXAucGljaygpO1xuXG4gICAgLy8gTmV4dCwgZ2V0IG5ldyBDaGFpbiBDaG9tcCB0aWVkIHRoZSBwaWNrZXQuXG4gICAgLy8gRGlmZmVyZW50IENoYWluIENob21wcyBoYXZlIGRpZmZlcmVudCBiZWhhdmlvci5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIHlvdSBuZWVkIGEgZGlmZmVyZW50IGZ1bmN0aW9uLCB5b3UgY2FuIGdldCBhbm90aGVyIG9uZS5cbiAgICB2YXIgY2hvbXAgPSBwaWNrZXQoc2NyaXB0LCBzY29wZSk7XG5cbiAgICAvLyBMYXN0LCBmZWVkIHRoZSBjaG9tcCBhbmQgbGV0IGl0IHJhbXBhZ2UhXG4gICAgLy8gQSBjaG9tcCBlYXRzIG5vdGhpbmcgYnV044CAYSBraW5kIG9mIGZlZWQgdGhhdCB0aGUgY2hvbXAgYXRlIGF0IGZpcnN0LlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiBvbmx5IGEgdmFsdWUgaW4gdGhlIHNjb3BlIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbmVlZCBub3QgdG8gcmVtYWtlIHRoZSBDaGFpbiBDaG9tcCBhbmQgdGhlIHBpY2tldC5cbiAgICByZXR1cm4gY2hvbXAob3B0aW9ucyk7XG59XG5cbi8qKlxuICogY3JlYXRlIHNhbmRib3hcbiAqL1xuY2hhaW5jaG9tcC5waWNrID0gKGZ1bmN0aW9uKCl7XG4gICAgLy8gRHluYW1pYyBpbnN0YW50aWF0aW9uIGlkaW9tXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjA2Nzk3L3VzZS1vZi1hcHBseS13aXRoLW5ldy1vcGVyYXRvci1pcy10aGlzLXBvc3NpYmxlXG4gICAgZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yLCBhcmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIEYoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgRi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJhbm5lZFZhcnMoKXtcbiAgICAgICAgLy8gY29ycmVjdCBiYW5uZWQgb2JqZWN0IG5hbWVzLlxuICAgICAgICB2YXIgYmFubmVkID0gWydfX3Byb3RvX18nLCAncHJvdG90eXBlJ107XG4gICAgICAgIGZ1bmN0aW9uIGJhbihrKXtcbiAgICAgICAgICAgIGlmKGsgJiYgYmFubmVkLmluZGV4T2YoaykgPCAwICYmIGsgIT09ICdldmFsJyAmJiBrLm1hdGNoKC9eW18kYS16QS1aXVtfJGEtekEtWjAtOV0qJC8pKXtcbiAgICAgICAgICAgICAgICBiYW5uZWQucHVzaChrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZ2xvYmFsKS5mb3JFYWNoKGJhbik7XG4gICAgICAgIGZvcih2YXIgayBpbiBnbG9iYWwpe1xuICAgICAgICAgICAgYmFuKGspO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmFuIGFsbCBpZHMgb2YgdGhlIGVsZW1lbnRzXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlcnNlKGVsZW0pe1xuICAgICAgICAgICAgYmFuKGVsZW0uZ2V0QXR0cmlidXRlICYmIGVsZW0uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHZhciBjaGlsZHMgPSBlbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0cmF2ZXJzZShjaGlsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgc3RhcnQgKioqKlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdHJhdmVyc2UoZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIGVuZCAqKioqXG5cbiAgICAgICAgcmV0dXJuIGJhbm5lZDtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSBvZiBleHBvc2VkIG9iamVjdHNcbiAgICBmdW5jdGlvbiBnZXRTdGRsaWJzKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnT2JqZWN0JyAgICAgICAgICAgIDogT2JqZWN0LFxuICAgICAgICAgICAgJ1N0cmluZycgICAgICAgICAgICA6IFN0cmluZyxcbiAgICAgICAgICAgICdOdW1iZXInICAgICAgICAgICAgOiBOdW1iZXIsXG4gICAgICAgICAgICAnQm9vbGVhbicgICAgICAgICAgIDogQm9vbGVhbixcbiAgICAgICAgICAgICdBcnJheScgICAgICAgICAgICAgOiBBcnJheSxcbiAgICAgICAgICAgICdEYXRlJyAgICAgICAgICAgICAgOiBEYXRlLFxuICAgICAgICAgICAgJ01hdGgnICAgICAgICAgICAgICA6IE1hdGgsXG4gICAgICAgICAgICAnUmVnRXhwJyAgICAgICAgICAgIDogUmVnRXhwLFxuICAgICAgICAgICAgJ0Vycm9yJyAgICAgICAgICAgICA6IEVycm9yLFxuICAgICAgICAgICAgJ0V2YWxFcnJvcicgICAgICAgICA6IEV2YWxFcnJvcixcbiAgICAgICAgICAgICdSYW5nZUVycm9yJyAgICAgICAgOiBSYW5nZUVycm9yLFxuICAgICAgICAgICAgJ1JlZmVyZW5jZUVycm9yJyAgICA6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgICAgICAgJ1N5bnRheEVycm9yJyAgICAgICA6IFN5bnRheEVycm9yLFxuICAgICAgICAgICAgJ1R5cGVFcnJvcicgICAgICAgICA6IFR5cGVFcnJvcixcbiAgICAgICAgICAgICdVUklFcnJvcicgICAgICAgICAgOiBVUklFcnJvcixcbiAgICAgICAgICAgICdKU09OJyAgICAgICAgICAgICAgOiBKU09OLFxuICAgICAgICAgICAgJ05hTicgICAgICAgICAgICAgICA6IE5hTixcbiAgICAgICAgICAgICdJbmZpbml0eScgICAgICAgICAgOiBJbmZpbml0eSxcbiAgICAgICAgICAgICd1bmRlZmluZWQnICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGFyc2VJbnQnICAgICAgICAgIDogcGFyc2VJbnQsXG4gICAgICAgICAgICAncGFyc2VGbG9hdCcgICAgICAgIDogcGFyc2VGbG9hdCxcbiAgICAgICAgICAgICdpc05hTicgICAgICAgICAgICAgOiBpc05hTixcbiAgICAgICAgICAgICdpc0Zpbml0ZScgICAgICAgICAgOiBpc0Zpbml0ZSxcbiAgICAgICAgICAgICdkZWNvZGVVUkknICAgICAgICAgOiBkZWNvZGVVUkksXG4gICAgICAgICAgICAnZGVjb2RlVVJJQ29tcG9uZW50JzogZGVjb2RlVVJJQ29tcG9uZW50LFxuICAgICAgICAgICAgJ2VuY29kZVVSSScgICAgICAgICA6IGVuY29kZVVSSSxcbiAgICAgICAgICAgICdlbmNvZGVVUklDb21wb25lbnQnOiBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgaXNGcmVlemVkU3RkTGliT2JqcyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIHNhbmRib3guXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzRnJlZXplZFN0ZExpYk9ianMgPT0gZmFsc2Upe1xuICAgICAgICAgICAgdmFyIHN0ZGxpYnMgPSBnZXRTdGRsaWJzKCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZyZWV6ZSh2KXtcbiAgICAgICAgICAgICAgICBpZih2ICYmICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHYgPT09ICdmdW5jdGlvbicpICYmICEgT2JqZWN0LmlzRnJvemVuKHYpKXtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModikuZm9yRWFjaChmdW5jdGlvbihrLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aW9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZXplKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJlZXplKHN0ZGxpYnMpO1xuXG4gICAgICAgICAgICAvLyBmcmVlemUgRnVuY3Rpb24ucHJvdG90eXBlXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmcmVlemUoRnVuY3Rpb24pO1xuXG4gICAgICAgICAgICBpc0ZyZWV6ZWRTdGRMaWJPYmpzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBiYW5uZWQgPSBnZXRCYW5uZWRWYXJzKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNyZWF0ZSBzYW5kYm94ZWQgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihzY3JpcHQsIHNjb3BlKXtcbiAgICAgICAgICAgIC8vIHZhbGlkYXRlIGFyZ3VtZW50c1xuICAgICAgICAgICAgaWYoICEgKHR5cGVvZiBzY3JpcHQgPT09ICdzdHJpbmcnIHx8IHNjcmlwdCBpbnN0YW5jZW9mIFN0cmluZyApKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIGRlZmF1bHQgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Quc2VhbChzY29wZSk7XG5cbiAgICAgICAgICAgIC8vIEV4cG9zZSBjdXN0b20gcHJvcGVydGllc1xuICAgICAgICAgICAgdmFyIGd1ZXN0R2xvYmFsID0gZ2V0U3RkbGlicygpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoZ3Vlc3RHbG9iYWwpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5rZXlzKGd1ZXN0R2xvYmFsKS5jb25jYXQoYmFubmVkLmZpbHRlcihmdW5jdGlvbihiKXsgcmV0dXJuICEgZ3Vlc3RHbG9iYWwuaGFzT3duUHJvcGVydHkoYik7IH0pKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNjcmlwdCk7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25PYmplY3QgPSBjb25zdHJ1Y3QoRnVuY3Rpb24sIGFyZ3MpO1xuXG4gICAgICAgICAgICB2YXIgc2FmZUV2YWwgPSBmdW5jdGlvbihzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24oXCJyZXR1cm4gXCIgKyBzLCBndWVzdEdsb2JhbCkoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHNhZmVFdmFsKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbnZva2Ugc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgaW52b2tlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IHNhZmVFdmFsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBzYW5kYm94ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc3RvcmUgZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBndWVzdEdsb2JhbFtrXSA9IHNjb3BlW2tdO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkubWFwKGZ1bmN0aW9uKGspeyByZXR1cm4gZ3Vlc3RHbG9iYWxba107IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25PYmplY3QuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1maW5hbGx5e1xuICAgICAgICAgICAgICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb247XG4gICAgfTtcbn0pKCk7XG5cbi8vXG5jaGFpbmNob21wLmNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MsIG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xuXG4gICAgLy8gcmVwbGFjZSBldmFsIHdpdGggc2FmZSBldmFsLWxpa2UgZnVuY3Rpb25cbiAgICB2YXIgX2V2YWwgPSBldmFsO1xuICAgIGlmKG9wdGlvbnMuZGVidWcgIT09IHRydWUpe1xuICAgICAgICBldmFsID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeXtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGV2YWwgPSBfZXZhbDtcbiAgICB9XG59O1xuXG4vLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBzdGFydCAqKioqXG5tb2R1bGUuZXhwb3J0cyA9IGNoYWluY2hvbXA7XG4vLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBlbmQgKioqKlxuIl19
