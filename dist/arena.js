(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Field_1 = require('./core/Field');
var Sourcer_1 = require('./core/Sourcer');
var Utils_1 = require('./core/Utils');
function create(field, source) {
    return new Sourcer_1.default(field, Utils_1.default.rand(320) - 160, Utils_1.default.rand(320) - 160, source.ai, source.name, source.color);
}
onmessage = function (e) {
    var field = new Field_1.default();
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
var V_1 = require('./V');
var Configs_1 = require('./Configs');
var Actor = (function () {
    function Actor(field, x, y) {
        this.field = field;
        this.size = Configs_1.default.COLLISION_SIZE;
        this.wait = 0;
        this.wait = 0;
        this.position = new V_1.default(x, y);
        this.speed = new V_1.default(0, 0);
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
        return new ActorDump(this);
    };
    return Actor;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Actor;
var ActorDump = (function () {
    function ActorDump(actor) {
        this.id = actor.id;
        this.position = actor.position;
        this.speed = actor.speed;
        this.direction = actor.direction;
    }
    return ActorDump;
})();
exports.ActorDump = ActorDump;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Configs;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Consts;
;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Controller;

},{}],7:[function(require,module,exports){
var Utils_1 = require('./Utils');
var Field = (function () {
    function Field() {
        this.currentId = 0;
        this.frame = 0;
        this.sourcers = [];
        this.shots = [];
        this.fxs = [];
    }
    Field.prototype.addSourcer = function (sourcer) {
        sourcer.id = "sourcer" + (this.currentId++);
        this.sourcers.push(sourcer);
    };
    Field.prototype.addShot = function (shot) {
        shot.id = "shot" + (this.currentId++);
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
        fx.id = "fx" + (this.currentId++);
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
        // To be used in the invisible hand.
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
        this.result = new GameResult(survived.dump(), this.frame);
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
                var distance = Utils_1.default.calcDistance(f, t, actor.position);
                if (distance < shot.size + actor.size) {
                    return actor;
                }
            }
        }
        for (var i = 0; i < this.sourcers.length; i++) {
            var sourcer = this.sourcers[i];
            if (sourcer.alive && sourcer !== shot.owner) {
                var distance = Utils_1.default.calcDistance(f, t, sourcer.position);
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
        return new FieldDump(this);
    };
    return Field;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;
var FieldDump = (function () {
    function FieldDump(field) {
        var sourcersDump = [];
        var shotsDump = [];
        var fxDump = [];
        var resultDump = null;
        field.sourcers.forEach(function (actor) {
            sourcersDump.push(actor.dump());
        });
        field.shots.forEach(function (actor) {
            shotsDump.push(actor.dump());
        });
        field.fxs.forEach(function (fx) {
            fxDump.push(fx.dump());
        });
        this.frame = field.frame;
        this.sourcers = sourcersDump;
        this.shots = shotsDump;
        this.fxs = fxDump;
        if (field.result) {
            this.result = field.result;
        }
    }
    return FieldDump;
})();
exports.FieldDump = FieldDump;
var GameResult = (function () {
    function GameResult(winner, frame) {
        this.winner = winner;
        this.frame = frame;
        this.isDraw = winner == null;
    }
    return GameResult;
})();
exports.GameResult = GameResult;

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
        return new FxDump(this);
    };
    return Fx;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Fx;
var FxDump = (function () {
    function FxDump(fx) {
        this.id = fx.id;
        this.position = fx.position;
        this.frame = fx.frame;
        this.length = fx.length;
    }
    return FxDump;
})();
exports.FxDump = FxDump;

},{}],9:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shot_1 = require('./Shot');
var V_1 = require('./V');
var Laser = (function (_super) {
    __extends(Laser, _super);
    function Laser(field, owner, direction, power) {
        _super.call(this, field, owner, "Laser");
        this.direction = direction;
        this.temperature = 5;
        this.damage = function () { return 8; };
        this.speed = V_1.default.direction(direction).multiply(power);
    }
    return Laser;
})(Shot_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Laser;

},{"./Shot":13,"./V":19}],10:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shot_1 = require('./Shot');
var Configs_1 = require('./Configs');
var MissileCommand_1 = require('./MissileCommand');
var MissileController_1 = require('./MissileController');
var Consts_1 = require('./Consts');
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(field, owner, ai) {
        var _this = this;
        _super.call(this, field, owner, "Missile");
        this.ai = ai;
        this.temperature = 5;
        this.damage = function () { return 10 + _this.speed.length() * 2; };
        this.fuel = 100;
        this.breakable = true;
        this.ai = ai;
        this.direction = owner.direction === Consts_1.default.DIRECTION_RIGHT ? 0 : 180;
        this.speed = owner.speed;
        this.command = new MissileCommand_1.default(this);
        this.command.reset();
        this.controller = new MissileController_1.default(this);
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
        this.speed = this.speed.multiply(Configs_1.default.SPEED_RESISTANCE);
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
})(Shot_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Missile;

},{"./Configs":4,"./Consts":5,"./MissileCommand":11,"./MissileController":12,"./Shot":13}],11:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var Configs_1 = require('./Configs');
var V_1 = require('./V');
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
            var normalized = V_1.default.direction(this.missile.direction);
            this.missile.speed = this.missile.speed.add(normalized.multiply(this.speedUp));
            this.missile.speed = this.missile.speed.multiply(1 - this.speedDown);
            this.missile.fuel -= (this.speedUp + this.speedDown * 3) * Configs_1.default.FUEL_COST;
            this.missile.fuel = Math.max(0, this.missile.fuel);
        }
    };
    return MissileCommand;
})(Command_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MissileCommand;

},{"./Command":3,"./Configs":4,"./V":19}],12:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Controller_1 = require('./Controller');
var Utils_1 = require('./Utils');
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
            var radar = Utils_1.default.createRadar(missile.position, direction, angle, renge);
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
})(Controller_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MissileController;

},{"./Controller":6,"./Utils":18}],13:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Actor_1 = require('./Actor');
var Fx_1 = require('./Fx');
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
            this.field.addFx(new Fx_1.default(this.field, this.position, this.speed.divide(2), 8));
        }
        if (this.field.checkCollisionEnviroment(this)) {
            this.field.removeShot(this);
            this.field.addFx(new Fx_1.default(this.field, this.position, this.speed.divide(2), 8));
        }
    };
    Shot.prototype.reaction = function (sourcer) {
        sourcer.temperature += this.temperature;
    };
    Shot.prototype.onAction = function () {
    };
    Shot.prototype.dump = function () {
        return new ShotDump(this);
    };
    return Shot;
})(Actor_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Shot;
var ShotDump = (function (_super) {
    __extends(ShotDump, _super);
    function ShotDump(shot) {
        _super.call(this, shot);
        this.type = shot.type;
        this.color = shot.owner.color;
    }
    return ShotDump;
})(Actor_1.ActorDump);
exports.ShotDump = ShotDump;

},{"./Actor":2,"./Fx":8}],14:[function(require,module,exports){
var ShotParam = (function () {
    function ShotParam() {
    }
    return ShotParam;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShotParam;

},{}],15:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chainchomp_1 = require('../libs/chainchomp');
var Actor_1 = require('./Actor');
var SourcerCommand_1 = require('./SourcerCommand');
var SourcerController_1 = require('./SourcerController');
var Configs_1 = require('./Configs');
var Consts_1 = require('./Consts');
var Utils_1 = require('./Utils');
var V_1 = require('./V');
var Laser_1 = require('./Laser');
var Missile_1 = require('./Missile');
var Sourcer = (function (_super) {
    __extends(Sourcer, _super);
    function Sourcer(field, x, y, ai, name, color) {
        _super.call(this, field, x, y);
        this.name = name;
        this.color = color;
        this.alive = true;
        this.temperature = 0;
        this.shield = Configs_1.default.INITIAL_SHIELD;
        this.missileAmmo = Configs_1.default.INITIAL_MISSILE_AMMO;
        this.fuel = Configs_1.default.INITIAL_FUEL;
        this.direction = Consts_1.default.DIRECTION_RIGHT;
        this.command = new SourcerCommand_1.default(this);
        this.controller = new SourcerController_1.default(this);
        try {
            this.ai = chainchomp_1.default(ai);
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
        // air resistance
        this.speed = this.speed.multiply(Configs_1.default.SPEED_RESISTANCE);
        // gravity
        this.speed = this.speed.subtract(0, Configs_1.default.GRAVITY);
        // control altitude by the invisible hand
        if (Configs_1.default.TOP_INVISIBLE_HAND < this.position.y) {
            var invisiblePower = (this.position.y - Configs_1.default.TOP_INVISIBLE_HAND) * 0.1;
            this.speed = this.speed.subtract(0, Configs_1.default.GRAVITY * invisiblePower);
        }
        // control distance by the invisible hand
        var diff = this.field.center - this.position.x;
        if (Configs_1.default.DISTANCE_BORDAR < Math.abs(diff)) {
            var invisibleHand = diff * Configs_1.default.DISTANCE_INVISIBLE_HAND;
            this.position = new V_1.default(this.position.x + invisibleHand, this.position.y);
        }
        // go into the ground
        if (this.position.y < 0) {
            this.shield -= (-this.speed.y * Configs_1.default.GROUND_DAMAGE_SCALE);
            this.position = new V_1.default(this.position.x, 0);
            this.speed = new V_1.default(this.speed.x, 0);
        }
        this.temperature -= Configs_1.default.COOL_DOWN;
        this.temperature = Math.max(this.temperature, 0);
        // overheat
        var overheat = (this.temperature - Configs_1.default.OVERHEAT_BORDER);
        if (0 < overheat) {
            var linearDamage = overheat * Configs_1.default.OVERHEAT_DAMAGE_LINEAR_WEIGHT;
            var powerDamage = Math.pow(overheat * Configs_1.default.OVERHEAT_DAMAGE_POWER_WEIGHT, 2);
            this.shield -= (linearDamage + powerDamage);
        }
        this.shield = Math.max(0, this.shield);
        this.command.execute();
        this.command.reset();
    };
    Sourcer.prototype.fire = function (param) {
        if (param.shotType === "Laser") {
            var direction = this.opposite(param.direction);
            var shot = new Laser_1.default(this.field, this, direction, param.power);
            shot.reaction(this);
            this.field.addShot(shot);
        }
        if (param.shotType === 'Missile') {
            if (0 < this.missileAmmo) {
                var missile = new Missile_1.default(this.field, this, param.ai);
                missile.reaction(this);
                this.missileAmmo--;
                this.field.addShot(missile);
            }
        }
    };
    Sourcer.prototype.opposite = function (direction) {
        if (this.direction === Consts_1.default.DIRECTION_LEFT) {
            return Utils_1.default.toOpposite(direction);
        }
        else {
            return direction;
        }
    };
    Sourcer.prototype.onHit = function (shot) {
        this.speed = this.speed.add(shot.speed.multiply(Configs_1.default.ON_HIT_SPEED_GIVEN_RATE));
        this.shield -= shot.damage();
        this.shield = Math.max(0, this.shield);
        this.field.removeShot(shot);
    };
    Sourcer.prototype.dump = function () {
        return new SourcerDump(this);
    };
    return Sourcer;
})(Actor_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sourcer;
var SourcerDump = (function (_super) {
    __extends(SourcerDump, _super);
    function SourcerDump(sourcer) {
        _super.call(this, sourcer);
        this.shield = sourcer.shield;
        this.temperature = sourcer.temperature;
        this.missileAmmo = sourcer.missileAmmo;
        this.fuel = sourcer.fuel;
        this.name = sourcer.name;
        this.color = sourcer.color;
    }
    return SourcerDump;
})(Actor_1.ActorDump);
exports.SourcerDump = SourcerDump;

},{"../libs/chainchomp":20,"./Actor":2,"./Configs":4,"./Consts":5,"./Laser":9,"./Missile":10,"./SourcerCommand":16,"./SourcerController":17,"./Utils":18,"./V":19}],16:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var Configs_1 = require('./Configs');
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
            this.sourcer.fuel -= (Math.abs(this.ahead) + Math.abs(this.ascent)) * Configs_1.default.FUEL_COST;
            this.sourcer.fuel = Math.max(0, this.sourcer.fuel);
        }
    };
    return SourcerCommand;
})(Command_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourcerCommand;

},{"./Command":3,"./Configs":4}],17:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Controller_1 = require('./Controller');
var Configs_1 = require('./Configs');
var Utils_1 = require('./Utils');
var ShotParam_1 = require('./ShotParam');
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
            sourcer.wait += Configs_1.default.SCAN_WAIT;
            direction = sourcer.opposite(direction);
            renge = renge || Number.MAX_VALUE;
            var radar = Utils_1.default.createRadar(sourcer.position, direction, angle, renge);
            return field.scanEnemy(sourcer, radar);
        };
        this.scanAttack = function (direction, angle, renge) {
            command.validate();
            sourcer.wait += Configs_1.default.SCAN_WAIT;
            direction = sourcer.opposite(direction);
            renge = renge || Number.MAX_VALUE;
            var radar = Utils_1.default.createRadar(sourcer.position, direction, angle, renge);
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
            command.fire = new ShotParam_1.default();
            command.fire.power = power;
            command.fire.direction = direction;
            command.fire.shotType = 'Laser';
        };
        this.fireMissile = function (ai) {
            command.validate();
            command.fire = new ShotParam_1.default();
            command.fire.ai = ai;
            command.fire.shotType = 'Missile';
        };
    }
    return SourcerController;
})(Controller_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourcerController;

},{"./Configs":4,"./Controller":6,"./ShotParam":14,"./Utils":18}],18:[function(require,module,exports){
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
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = V;

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

exports.default = chainchomp;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9BY3Rvci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0NvbW1hbmQuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29uc3RzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvRnguanMiLCJpbnRlcm1lZGlhdGUvY29yZS9MYXNlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9NaXNzaWxlQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGVDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1Nob3RQYXJhbS5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXIuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXJDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvVXRpbHMuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9WLmpzIiwiaW50ZXJtZWRpYXRlL2xpYnMvY2hhaW5jaG9tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRmllbGRfMSA9IHJlcXVpcmUoJy4vY29yZS9GaWVsZCcpO1xudmFyIFNvdXJjZXJfMSA9IHJlcXVpcmUoJy4vY29yZS9Tb3VyY2VyJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vY29yZS9VdGlscycpO1xuZnVuY3Rpb24gY3JlYXRlKGZpZWxkLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gbmV3IFNvdXJjZXJfMS5kZWZhdWx0KGZpZWxkLCBVdGlsc18xLmRlZmF1bHQucmFuZCgzMjApIC0gMTYwLCBVdGlsc18xLmRlZmF1bHQucmFuZCgzMjApIC0gMTYwLCBzb3VyY2UuYWksIHNvdXJjZS5uYW1lLCBzb3VyY2UuY29sb3IpO1xufVxub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZmllbGQgPSBuZXcgRmllbGRfMS5kZWZhdWx0KCk7XG4gICAgdmFyIHNvdXJjZXIxID0gY3JlYXRlKGZpZWxkLCBlLmRhdGEuc291cmNlc1swXSk7XG4gICAgdmFyIHNvdXJjZXIyID0gY3JlYXRlKGZpZWxkLCBlLmRhdGEuc291cmNlc1sxXSk7XG4gICAgZmllbGQuYWRkU291cmNlcihzb3VyY2VyMSk7XG4gICAgZmllbGQuYWRkU291cmNlcihzb3VyY2VyMik7XG4gICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgICBvblByZVRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQcmVUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBzb3VyY2VyMS5pZCA9PSBzb3VyY2VySWQgPyAwIDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdFRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQb3N0VGhpbmtcIixcbiAgICAgICAgICAgICAgICBpbmRleDogc291cmNlcjEuaWQgPT0gc291cmNlcklkID8gMCA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIwMDAgJiYgIWZpZWxkLmlzRmluaXNoKCk7IGkrKykge1xuICAgICAgICBmaWVsZC50aWNrKGxpc3RlbmVyKTtcbiAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgY29tbWFuZDogXCJGcmFtZVwiLFxuICAgICAgICAgICAgZmllbGQ6IGZpZWxkLmR1bXAoKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb21tYW5kOiBcIkVuZE9mR2FtZVwiXG4gICAgfSk7XG59O1xuIiwidmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIEFjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBY3RvcihmaWVsZCwgeCwgeSkge1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMuc2l6ZSA9IENvbmZpZ3NfMS5kZWZhdWx0LkNPTExJU0lPTl9TSVpFO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHgsIHkpO1xuICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KDAsIDApO1xuICAgIH1cbiAgICBBY3Rvci5wcm90b3R5cGUudGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLndhaXQgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgICAgIHRoaXMub25UaGluaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53YWl0LS07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQWN0b3JEdW1wKHRoaXMpO1xuICAgIH07XG4gICAgcmV0dXJuIEFjdG9yO1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFjdG9yO1xudmFyIEFjdG9yRHVtcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWN0b3JEdW1wKGFjdG9yKSB7XG4gICAgICAgIHRoaXMuaWQgPSBhY3Rvci5pZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGFjdG9yLnBvc2l0aW9uO1xuICAgICAgICB0aGlzLnNwZWVkID0gYWN0b3Iuc3BlZWQ7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gYWN0b3IuZGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQWN0b3JEdW1wO1xufSkoKTtcbmV4cG9ydHMuQWN0b3JEdW1wID0gQWN0b3JEdW1wO1xuIiwidmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBDb21tYW5kLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWNjZXB0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29tbWFuZC4gXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IHRydWU7XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS51bmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gQ29tbWFuZDtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb21tYW5kO1xuIiwidmFyIENvbmZpZ3MgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbmZpZ3MoKSB7XG4gICAgfVxuICAgIENvbmZpZ3MuSU5JVElBTF9TSElFTEQgPSAxMDA7XG4gICAgQ29uZmlncy5JTklUSUFMX0ZVRUwgPSAxMDA7XG4gICAgQ29uZmlncy5JTklUSUFMX01JU1NJTEVfQU1NTyA9IDIwO1xuICAgIENvbmZpZ3MuRlVFTF9DT1NUID0gMC4yNDtcbiAgICBDb25maWdzLkNPTExJU0lPTl9TSVpFID0gNDtcbiAgICBDb25maWdzLlNDQU5fV0FJVCA9IDAuMzU7XG4gICAgQ29uZmlncy5TUEVFRF9SRVNJU1RBTkNFID0gMC45NjtcbiAgICBDb25maWdzLkdSQVZJVFkgPSAwLjE7XG4gICAgQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQgPSA0ODA7XG4gICAgQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIgPSA0MDA7XG4gICAgQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCA9IDAuMDA4O1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSID0gMTAwO1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQgPSAwLjA1O1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCA9IDAuMDEyO1xuICAgIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRSA9IDE7XG4gICAgQ29uZmlncy5DT09MX0RPV04gPSAwLjU7XG4gICAgQ29uZmlncy5PTl9ISVRfU1BFRURfR0lWRU5fUkFURSA9IDAuNDtcbiAgICByZXR1cm4gQ29uZmlncztcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb25maWdzO1xuIiwidmFyIENvbnN0cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3RzKCkge1xuICAgIH1cbiAgICBDb25zdHMuRElSRUNUSU9OX1JJR0hUID0gMTtcbiAgICBDb25zdHMuRElSRUNUSU9OX0xFRlQgPSAtMTtcbiAgICBDb25zdHMuVkVSVElDQUxfVVAgPSBcInZlcnRpYWxfdXBcIjtcbiAgICBDb25zdHMuVkVSVElDQUxfRE9XTiA9IFwidmVydGlhbF9kb3duXCI7XG4gICAgcmV0dXJuIENvbnN0cztcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb25zdHM7XG47XG4iLCJ2YXIgQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcihhY3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvZyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9uYWxQYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uYWxQYXJhbXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmllbGQgPSBhY3Rvci5maWVsZDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmZpZWxkLmZyYW1lOyB9O1xuICAgICAgICB0aGlzLmFsdGl0dWRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gYWN0b3IucG9zaXRpb24ueTsgfTtcbiAgICAgICAgdGhpcy53YWl0ID0gZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgICAgICAgICBpZiAoMCA8IGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgYWN0b3Iud2FpdCArPSBmcmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2xsZXI7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29udHJvbGxlcjtcbiIsInZhciBVdGlsc18xID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIEZpZWxkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGaWVsZCgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSAwO1xuICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgdGhpcy5zb3VyY2VycyA9IFtdO1xuICAgICAgICB0aGlzLnNob3RzID0gW107XG4gICAgICAgIHRoaXMuZnhzID0gW107XG4gICAgfVxuICAgIEZpZWxkLnByb3RvdHlwZS5hZGRTb3VyY2VyID0gZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgc291cmNlci5pZCA9IFwic291cmNlclwiICsgKHRoaXMuY3VycmVudElkKyspO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLnB1c2goc291cmNlcik7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU2hvdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHNob3QuaWQgPSBcInNob3RcIiArICh0aGlzLmN1cnJlbnRJZCsrKTtcbiAgICAgICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZVNob3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdG9yID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIGlmIChhY3RvciA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkRnggPSBmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgZnguaWQgPSBcImZ4XCIgKyAodGhpcy5jdXJyZW50SWQrKyk7XG4gICAgICAgIHRoaXMuZnhzLnB1c2goZngpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZUZ4ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZnhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZnggPSB0aGlzLmZ4c1tpXTtcbiAgICAgICAgICAgIGlmIChmeCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5meHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgLy8gVG8gYmUgdXNlZCBpbiB0aGUgaW52aXNpYmxlIGhhbmQuXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgICAgIHNvdXJjZXIudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICAgICAgc2hvdC50aGluaygpO1xuICAgICAgICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc2hvdC5vd25lci5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4LmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4Lm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2hlY2tSZXN1bHQoKTtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrUmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3Vydml2ZWQgPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLnNoaWVsZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgc291cmNlci5hbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIXN1cnZpdmVkKSB7XG4gICAgICAgICAgICAgICAgc3Vydml2ZWQgPSBzb3VyY2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0ID0gbmV3IEdhbWVSZXN1bHQoc3Vydml2ZWQuZHVtcCgpLCB0aGlzLmZyYW1lKTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5zY2FuRW5lbXkgPSBmdW5jdGlvbiAob3duZXIsIHJhZGFyKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gb3duZXIgJiYgcmFkYXIoc291cmNlci5wb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkF0dGFjayA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgdmFyIG93bmVyUG9zaXRpb24gPSBvd25lci5wb3NpdGlvbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2hvdCA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICB2YXIgYWN0b3JQb3NpdGlvbiA9IHNob3QucG9zaXRpb247XG4gICAgICAgICAgICBpZiAoc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoYWN0b3JQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uLmFkZChzaG90LnNwZWVkKSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHREaXN0YW5jZSA8IGN1cnJlbnREaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdmFyIGYgPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICB2YXIgdCA9IHNob3QucG9zaXRpb24uYWRkKHNob3Quc3BlZWQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhY3RvciA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICBpZiAoYWN0b3IuYnJlYWthYmxlICYmIGFjdG9yLm93bmVyICE9PSBzaG90Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gVXRpbHNfMS5kZWZhdWx0LmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzXzEuZGVmYXVsdC5jYWxjRGlzdGFuY2UoZiwgdCwgc291cmNlci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgcmV0dXJuIHNob3QucG9zaXRpb24ueSA8IDA7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY29tcHV0ZUNlbnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgdmFyIHN1bVggPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdW1YIC8gY291bnQ7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuaXNGaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMuZmluaXNoZWRGcmFtZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRGcmFtZSA9IHRoaXMuZnJhbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmlzaGVkRnJhbWUgPCB0aGlzLmZyYW1lIC0gOTApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZpZWxkRHVtcCh0aGlzKTtcbiAgICB9O1xuICAgIHJldHVybiBGaWVsZDtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBGaWVsZDtcbnZhciBGaWVsZER1bXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZpZWxkRHVtcChmaWVsZCkge1xuICAgICAgICB2YXIgc291cmNlcnNEdW1wID0gW107XG4gICAgICAgIHZhciBzaG90c0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIGZ4RHVtcCA9IFtdO1xuICAgICAgICB2YXIgcmVzdWx0RHVtcCA9IG51bGw7XG4gICAgICAgIGZpZWxkLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIHNob3RzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZyYW1lID0gZmllbGQuZnJhbWU7XG4gICAgICAgIHRoaXMuc291cmNlcnMgPSBzb3VyY2Vyc0R1bXA7XG4gICAgICAgIHRoaXMuc2hvdHMgPSBzaG90c0R1bXA7XG4gICAgICAgIHRoaXMuZnhzID0gZnhEdW1wO1xuICAgICAgICBpZiAoZmllbGQucmVzdWx0KSB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdCA9IGZpZWxkLnJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gRmllbGREdW1wO1xufSkoKTtcbmV4cG9ydHMuRmllbGREdW1wID0gRmllbGREdW1wO1xudmFyIEdhbWVSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVSZXN1bHQod2lubmVyLCBmcmFtZSkge1xuICAgICAgICB0aGlzLndpbm5lciA9IHdpbm5lcjtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgICAgICB0aGlzLmlzRHJhdyA9IHdpbm5lciA9PSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gR2FtZVJlc3VsdDtcbn0pKCk7XG5leHBvcnRzLkdhbWVSZXN1bHQgPSBHYW1lUmVzdWx0O1xuIiwidmFyIEZ4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGeChmaWVsZCwgcG9zaXRpb24sIHNwZWVkLCBsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgIH1cbiAgICBGeC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSB0aGlzLmZyYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZUZ4KHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGeC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgRngucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnhEdW1wKHRoaXMpO1xuICAgIH07XG4gICAgcmV0dXJuIEZ4O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEZ4O1xudmFyIEZ4RHVtcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRnhEdW1wKGZ4KSB7XG4gICAgICAgIHRoaXMuaWQgPSBmeC5pZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGZ4LnBvc2l0aW9uO1xuICAgICAgICB0aGlzLmZyYW1lID0gZnguZnJhbWU7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZngubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gRnhEdW1wO1xufSkoKTtcbmV4cG9ydHMuRnhEdW1wID0gRnhEdW1wO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU2hvdF8xID0gcmVxdWlyZSgnLi9TaG90Jyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTGFzZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMYXNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMYXNlcihmaWVsZCwgb3duZXIsIGRpcmVjdGlvbiwgcG93ZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLCBcIkxhc2VyXCIpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDU7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gODsgfTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IFZfMS5kZWZhdWx0LmRpcmVjdGlvbihkaXJlY3Rpb24pLm11bHRpcGx5KHBvd2VyKTtcbiAgICB9XG4gICAgcmV0dXJuIExhc2VyO1xufSkoU2hvdF8xLmRlZmF1bHQpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTGFzZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBTaG90XzEgPSByZXF1aXJlKCcuL1Nob3QnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBNaXNzaWxlQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9NaXNzaWxlQ29tbWFuZCcpO1xudmFyIE1pc3NpbGVDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL01pc3NpbGVDb250cm9sbGVyJyk7XG52YXIgQ29uc3RzXzEgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIE1pc3NpbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGUoZmllbGQsIG93bmVyLCBhaSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTWlzc2lsZVwiKTtcbiAgICAgICAgdGhpcy5haSA9IGFpO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gNTtcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAxMCArIF90aGlzLnNwZWVkLmxlbmd0aCgpICogMjsgfTtcbiAgICAgICAgdGhpcy5mdWVsID0gMTAwO1xuICAgICAgICB0aGlzLmJyZWFrYWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYWkgPSBhaTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBvd25lci5kaXJlY3Rpb24gPT09IENvbnN0c18xLmRlZmF1bHQuRElSRUNUSU9OX1JJR0hUID8gMCA6IDE4MDtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG93bmVyLnNwZWVkO1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSBuZXcgTWlzc2lsZUNvbW1hbmRfMS5kZWZhdWx0KHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyXzEuZGVmYXVsdCh0aGlzKTtcbiAgICB9XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vbkFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoYXR0YWNrKSB7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KGF0dGFjayk7XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uICsgZGlyZWN0aW9uO1xuICAgIH07XG4gICAgcmV0dXJuIE1pc3NpbGU7XG59KShTaG90XzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTWlzc2lsZUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlQ29tbWFuZChtaXNzaWxlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLm1pc3NpbGUgPSBtaXNzaWxlO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIE1pc3NpbGVDb21tYW5kLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGVlZFVwID0gMDtcbiAgICAgICAgdGhpcy5zcGVlZERvd24gPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSAwO1xuICAgIH07XG4gICAgTWlzc2lsZUNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgwIDwgdGhpcy5taXNzaWxlLmZ1ZWwpIHtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5kaXJlY3Rpb24gKz0gdGhpcy50dXJuO1xuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBWXzEuZGVmYXVsdC5kaXJlY3Rpb24odGhpcy5taXNzaWxlLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQubXVsdGlwbHkoMSAtIHRoaXMuc3BlZWREb3duKTtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5mdWVsIC09ICh0aGlzLnNwZWVkVXAgKyB0aGlzLnNwZWVkRG93biAqIDMpICogQ29uZmlnc18xLmRlZmF1bHQuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLm1pc3NpbGUuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlQ29tbWFuZDtcbn0pKENvbW1hbmRfMS5kZWZhdWx0KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1pc3NpbGVDb21tYW5kO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb250cm9sbGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb250cm9sbGVyKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbWlzc2lsZSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5kaXJlY3Rpb247IH07XG4gICAgICAgIHZhciBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmZ1ZWw7IH07XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBtaXNzaWxlLndhaXQgKz0gMS41O1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gbWlzc2lsZS5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKG1pc3NpbGUucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBtaXNzaWxlLmZpZWxkLnNjYW5FbmVteShtaXNzaWxlLm93bmVyLCByYWRhcik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BlZWRVcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuc3BlZWRVcCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGVlZERvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuUmlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSAtOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuTGVmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IDk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBNaXNzaWxlQ29udHJvbGxlcjtcbn0pKENvbnRyb2xsZXJfMS5kZWZhdWx0KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1pc3NpbGVDb250cm9sbGVyO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQWN0b3JfMSA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBGeF8xID0gcmVxdWlyZSgnLi9GeCcpO1xudmFyIFNob3QgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTaG90LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNob3QoZmllbGQsIG93bmVyLCB0eXBlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lci5wb3NpdGlvbi54LCBvd25lci5wb3NpdGlvbi55KTtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMDtcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAwOyB9O1xuICAgICAgICB0aGlzLmJyZWFrYWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBTaG90LnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub25BY3Rpb24oKTtcbiAgICAgICAgdmFyIGNvbGxpZGVkID0gdGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbih0aGlzKTtcbiAgICAgICAgaWYgKGNvbGxpZGVkKSB7XG4gICAgICAgICAgICBjb2xsaWRlZC5vbkhpdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4XzEuZGVmYXVsdCh0aGlzLmZpZWxkLCB0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKSwgOCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRnhfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHRoaXMucG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLCA4KSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLnJlYWN0aW9uID0gZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgc291cmNlci50ZW1wZXJhdHVyZSArPSB0aGlzLnRlbXBlcmF0dXJlO1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNob3REdW1wKHRoaXMpO1xuICAgIH07XG4gICAgcmV0dXJuIFNob3Q7XG59KShBY3Rvcl8xLmRlZmF1bHQpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2hvdDtcbnZhciBTaG90RHVtcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNob3REdW1wLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNob3REdW1wKHNob3QpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc2hvdCk7XG4gICAgICAgIHRoaXMudHlwZSA9IHNob3QudHlwZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHNob3Qub3duZXIuY29sb3I7XG4gICAgfVxuICAgIHJldHVybiBTaG90RHVtcDtcbn0pKEFjdG9yXzEuQWN0b3JEdW1wKTtcbmV4cG9ydHMuU2hvdER1bXAgPSBTaG90RHVtcDtcbiIsInZhciBTaG90UGFyYW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNob3RQYXJhbSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIFNob3RQYXJhbTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTaG90UGFyYW07XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBjaGFpbmNob21wXzEgPSByZXF1aXJlKCcuLi9saWJzL2NoYWluY2hvbXAnKTtcbnZhciBBY3Rvcl8xID0gcmVxdWlyZSgnLi9BY3RvcicpO1xudmFyIFNvdXJjZXJDb21tYW5kXzEgPSByZXF1aXJlKCcuL1NvdXJjZXJDb21tYW5kJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vU291cmNlckNvbnRyb2xsZXInKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBDb25zdHNfMSA9IHJlcXVpcmUoJy4vQ29uc3RzJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBMYXNlcl8xID0gcmVxdWlyZSgnLi9MYXNlcicpO1xudmFyIE1pc3NpbGVfMSA9IHJlcXVpcmUoJy4vTWlzc2lsZScpO1xudmFyIFNvdXJjZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXIoZmllbGQsIHgsIHksIGFpLCBuYW1lLCBjb2xvcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgeCwgeSk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfU0hJRUxEO1xuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vID0gQ29uZmlnc18xLmRlZmF1bHQuSU5JVElBTF9NSVNTSUxFX0FNTU87XG4gICAgICAgIHRoaXMuZnVlbCA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfRlVFTDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuYWkgPSBjaGFpbmNob21wXzEuZGVmYXVsdChhaSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmFpID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5haSA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGFpciByZXNpc3RhbmNlXG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0LlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICAvLyBncmF2aXR5XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3NfMS5kZWZhdWx0LkdSQVZJVFkpO1xuICAgICAgICAvLyBjb250cm9sIGFsdGl0dWRlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxuICAgICAgICBpZiAoQ29uZmlnc18xLmRlZmF1bHQuVE9QX0lOVklTSUJMRV9IQU5EIDwgdGhpcy5wb3NpdGlvbi55KSB7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlUG93ZXIgPSAodGhpcy5wb3NpdGlvbi55IC0gQ29uZmlnc18xLmRlZmF1bHQuVE9QX0lOVklTSUJMRV9IQU5EKSAqIDAuMTtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3NfMS5kZWZhdWx0LkdSQVZJVFkgKiBpbnZpc2libGVQb3dlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29udHJvbCBkaXN0YW5jZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcbiAgICAgICAgdmFyIGRpZmYgPSB0aGlzLmZpZWxkLmNlbnRlciAtIHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgaWYgKENvbmZpZ3NfMS5kZWZhdWx0LkRJU1RBTkNFX0JPUkRBUiA8IE1hdGguYWJzKGRpZmYpKSB7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlSGFuZCA9IGRpZmYgKiBDb25maWdzXzEuZGVmYXVsdC5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORDtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVl8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54ICsgaW52aXNpYmxlSGFuZCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnbyBpbnRvIHRoZSBncm91bmRcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkIC09ICgtdGhpcy5zcGVlZC55ICogQ29uZmlnc18xLmRlZmF1bHQuR1JPVU5EX0RBTUFHRV9TQ0FMRSk7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgMCk7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMuc3BlZWQueCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSAtPSBDb25maWdzXzEuZGVmYXVsdC5DT09MX0RPV047XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBNYXRoLm1heCh0aGlzLnRlbXBlcmF0dXJlLCAwKTtcbiAgICAgICAgLy8gb3ZlcmhlYXRcbiAgICAgICAgdmFyIG92ZXJoZWF0ID0gKHRoaXMudGVtcGVyYXR1cmUgLSBDb25maWdzXzEuZGVmYXVsdC5PVkVSSEVBVF9CT1JERVIpO1xuICAgICAgICBpZiAoMCA8IG92ZXJoZWF0KSB7XG4gICAgICAgICAgICB2YXIgbGluZWFyRGFtYWdlID0gb3ZlcmhlYXQgKiBDb25maWdzXzEuZGVmYXVsdC5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVDtcbiAgICAgICAgICAgIHZhciBwb3dlckRhbWFnZSA9IE1hdGgucG93KG92ZXJoZWF0ICogQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCwgMik7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAobGluZWFyRGFtYWdlICsgcG93ZXJEYW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSBcIkxhc2VyXCIpIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB2YXIgc2hvdCA9IG5ldyBMYXNlcl8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XG4gICAgICAgICAgICBzaG90LnJlYWN0aW9uKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KHNob3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ01pc3NpbGUnKSB7XG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWlzc2lsZSA9IG5ldyBNaXNzaWxlXzEuZGVmYXVsdCh0aGlzLmZpZWxkLCB0aGlzLCBwYXJhbS5haSk7XG4gICAgICAgICAgICAgICAgbWlzc2lsZS5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NpbGVBbW1vLS07XG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KG1pc3NpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9MRUZUKSB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHNfMS5kZWZhdWx0LnRvT3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuYWRkKHNob3Quc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUpKTtcbiAgICAgICAgdGhpcy5zaGllbGQgLT0gc2hvdC5kYW1hZ2UoKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChzaG90KTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU291cmNlckR1bXAodGhpcyk7XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlcjtcbn0pKEFjdG9yXzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyO1xudmFyIFNvdXJjZXJEdW1wID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckR1bXAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckR1bXAoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2VyKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBzb3VyY2VyLnNoaWVsZDtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IHNvdXJjZXIudGVtcGVyYXR1cmU7XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBzb3VyY2VyLm1pc3NpbGVBbW1vO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBzb3VyY2VyLmZ1ZWw7XG4gICAgICAgIHRoaXMubmFtZSA9IHNvdXJjZXIubmFtZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHNvdXJjZXIuY29sb3I7XG4gICAgfVxuICAgIHJldHVybiBTb3VyY2VyRHVtcDtcbn0pKEFjdG9yXzEuQWN0b3JEdW1wKTtcbmV4cG9ydHMuU291cmNlckR1bXAgPSBTb3VyY2VyRHVtcDtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFNvdXJjZXJDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckNvbW1hbmQoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5zb3VyY2VyID0gc291cmNlcjtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICBTb3VyY2VyQ29tbWFuZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWhlYWQgPSAwO1xuICAgICAgICB0aGlzLmFzY2VudCA9IDA7XG4gICAgICAgIHRoaXMudHVybiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpcmUgPSBudWxsO1xuICAgIH07XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudHVybikge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCA8IHRoaXMuc291cmNlci5mdWVsKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuc3BlZWQgPSB0aGlzLnNvdXJjZXIuc3BlZWQuYWRkKHRoaXMuYWhlYWQgKiB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uLCB0aGlzLmFzY2VudCk7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlnc18xLmRlZmF1bHQuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLnNvdXJjZXIuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBTb3VyY2VyQ29tbWFuZDtcbn0pKENvbW1hbmRfMS5kZWZhdWx0KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNvdXJjZXJDb21tYW5kO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTaG90UGFyYW1fMSA9IHJlcXVpcmUoJy4vU2hvdFBhcmFtJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29udHJvbGxlcihzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZXIpO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuc2hpZWxkOyB9O1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci50ZW1wZXJhdHVyZTsgfTtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIubWlzc2lsZUFtbW87IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuZnVlbDsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gc291cmNlci5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBzb3VyY2VyLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlnc18xLmRlZmF1bHQuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuRW5lbXkoc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzXzEuZGVmYXVsdC5TQ0FOX1dBSVQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlsc18xLmRlZmF1bHQuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnNjYW5BdHRhY2soc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFoZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5iYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IC0wLjQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNjZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5hc2NlbnQgPSAwLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTGFzZXIgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgcG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUgPSBuZXcgU2hvdFBhcmFtXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnBvd2VyID0gcG93ZXI7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ0xhc2VyJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTWlzc2lsZSA9IGZ1bmN0aW9uIChhaSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbV8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5haSA9IGFpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ01pc3NpbGUnO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gU291cmNlckNvbnRyb2xsZXI7XG59KShDb250cm9sbGVyXzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29udHJvbGxlcjtcbiIsInZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBFUFNJTE9OID0gMTBlLTEyO1xudmFyIFV0aWxzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVdGlscygpIHtcbiAgICB9XG4gICAgVXRpbHMuY3JlYXRlUmFkYXIgPSBmdW5jdGlvbiAoYywgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgdmFyIGNoZWNrRGlzdGFuY2UgPSBmdW5jdGlvbiAodCkgeyByZXR1cm4gYy5kaXN0YW5jZSh0KSA8PSByZW5nZTsgfTtcbiAgICAgICAgaWYgKDM2MCA8PSBhbmdsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNoZWNrRGlzdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoZWNrTGVmdCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgYW5nbGUgLyAyKTtcbiAgICAgICAgdmFyIGNoZWNrUmlnaHQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIDE4MCAtIGFuZ2xlIC8gMik7XG4gICAgICAgIGlmIChhbmdsZSA8IDE4MCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiBjaGVja0xlZnQodCkgJiYgY2hlY2tSaWdodCh0KSAmJiBjaGVja0Rpc3RhbmNlKHQpOyB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiAoY2hlY2tMZWZ0KHQpIHx8IGNoZWNrUmlnaHQodCkpICYmIGNoZWNrRGlzdGFuY2UodCk7IH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnNpZGUgPSBmdW5jdGlvbiAoYmFzZSwgZGVncmVlKSB7XG4gICAgICAgIHZhciByYWRpYW4gPSBVdGlscy50b1JhZGlhbihkZWdyZWUpO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gbmV3IFZfMS5kZWZhdWx0KE1hdGguY29zKHJhZGlhbiksIE1hdGguc2luKHJhZGlhbikpO1xuICAgICAgICB2YXIgcHJldmlvdXNseSA9IGJhc2UueCAqIGRpcmVjdGlvbi55IC0gYmFzZS55ICogZGlyZWN0aW9uLnggLSBFUFNJTE9OO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIDAgPD0gdGFyZ2V0LnggKiBkaXJlY3Rpb24ueSAtIHRhcmdldC55ICogZGlyZWN0aW9uLnggLSBwcmV2aW91c2x5O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgVXRpbHMuY2FsY0Rpc3RhbmNlID0gZnVuY3Rpb24gKGYsIHQsIHApIHtcbiAgICAgICAgdmFyIHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XG4gICAgICAgIHZhciBwRnJvbSA9IHAuc3VidHJhY3QoZik7XG4gICAgICAgIGlmICh0b0Zyb20uZG90KHBGcm9tKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbVRvID0gZi5zdWJ0cmFjdCh0KTtcbiAgICAgICAgdmFyIHBUbyA9IHAuc3VidHJhY3QodCk7XG4gICAgICAgIGlmIChmcm9tVG8uZG90KHBUbykgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gcFRvLmxlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0b0Zyb20uY3Jvc3MocEZyb20pIC8gdG9Gcm9tLmxlbmd0aCgpKTtcbiAgICB9O1xuICAgIFV0aWxzLnRvUmFkaWFuID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgIH07XG4gICAgVXRpbHMudG9PcHBvc2l0ZSA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgZGVncmVlID0gZGVncmVlICUgMzYwO1xuICAgICAgICBpZiAoZGVncmVlIDwgMCkge1xuICAgICAgICAgICAgZGVncmVlID0gZGVncmVlICsgMzYwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWdyZWUgPD0gMTgwKSB7XG4gICAgICAgICAgICByZXR1cm4gKDkwIC0gZGVncmVlKSAqIDIgKyBkZWdyZWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKDI3MCAtIGRlZ3JlZSkgKiAyICsgZGVncmVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5yYW5kID0gZnVuY3Rpb24gKHJlbmdlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogcmVuZ2U7XG4gICAgfTtcbiAgICByZXR1cm4gVXRpbHM7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gVXRpbHM7XG4iLCJ2YXIgViA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuX2xlbmd0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gbnVsbDtcbiAgICB9XG4gICAgVi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYsIHkpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArIHYsIHRoaXMueSArIHkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2LCB5KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSB2LCB0aGlzLnkgLSB5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdiwgdGhpcy55ICogdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRpdmlkZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LCB0aGlzLnkgLyB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubW9kdWxvID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdi54LCB0aGlzLnkgJSB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVigtdGhpcy54LCAtdGhpcy55KTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VidHJhY3QodikubGVuZ3RoKCk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sZW5ndGggPSBNYXRoLnNxcnQodGhpcy5kb3QoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5sZW5ndGgoKTtcbiAgICAgICAgdmFyIHNjYWxlID0gY3VycmVudCAhPT0gMCA/IDEgLyBjdXJyZW50IDogMDtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuYW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuYW5nbGVJblJhZGlhbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbmdsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSBNYXRoLmF0YW4yKC10aGlzLnksIHRoaXMueCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5nbGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICBpZiAocG9pbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9pbnQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnggKiBwb2ludC54ICsgdGhpcy55ICogcG9pbnQueTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiBwb2ludC55IC0gdGhpcy55ICogcG9pbnQueDtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgdmFyIHJhZGlhbiA9IGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKHJhZGlhbik7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihyYWRpYW4pO1xuICAgICAgICByZXR1cm4gbmV3IFYoY29zICogdGhpcy54IC0gc2luICogdGhpcy55LCBjb3MgKiB0aGlzLnkgKyBzaW4gKiB0aGlzLngpO1xuICAgIH07XG4gICAgVi5kaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgVigxLCAwKS5yb3RhdGUoZGVncmVlKTtcbiAgICB9O1xuICAgIHJldHVybiBWO1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFY7XG4iLCIvKipcbiAqIEludm9rZSB1bnRydXN0ZWQgZ3Vlc3QgY29kZSBpbiBhIHNhbmRib3guXG4gKiBUaGUgZ3Vlc3QgY29kZSBjYW4gYWNjZXNzIG9iamVjdHMgb2YgdGhlIHN0YW5kYXJkIGxpYnJhcnkgb2YgRUNNQVNjcmlwdC5cbiAqXG4gKiBmdW5jdGlvbiBjaGFpbmNob21wKHNjcmlwdDogc3RyaW5nLCBzY29wZT86IGFueSA9IHt9KTogYW55O1xuICpcbiAqIHRoaXMucGFyYW0gc2NyaXB0IGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnBhcmFtIHNjb3BlIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHdpbGwgYmUgZXhwb3NlZCB0byB0aGUgZ3Vlc3QgY29kZS5cbiAqIHRoaXMucmV0dXJuIHJlc3VsdCBvZiB0aGUgcHJvY2Vzcy5cbiAqL1xuZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQsIHNjb3BlLCBvcHRpb25zKXtcbiAgICAvLyBGaXJzdCwgeW91IG5lZWQgdG8gcGlsZSBhIHBpY2tldCB0byB0aWUgYSBDaGFpbiBDaG9tcC5cbiAgICAvLyBJZiB0aGUgZW52aXJvbm1lbnQgaXMgY2hhbmdlZCwgdGhlIHBpY2tldCB3aWxsIGRyb3Agb3V0LlxuICAgIC8vIFlvdSBzaG91bGQgcmVtYWtlIGEgbmV3IHBpY2tldCBlYWNoIHRpbWUgYXMgbG9uZyBhc+OAgHlvdSBhcmUgc28gYnVzeS5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB0aGUgZ2xvYmFsIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbXVzdCByZW1ha2UgYSBwaWNrZXQuXG4gICAgdmFyIHBpY2tldCA9IGNoYWluY2hvbXAucGljaygpO1xuXG4gICAgLy8gTmV4dCwgZ2V0IG5ldyBDaGFpbiBDaG9tcCB0aWVkIHRoZSBwaWNrZXQuXG4gICAgLy8gRGlmZmVyZW50IENoYWluIENob21wcyBoYXZlIGRpZmZlcmVudCBiZWhhdmlvci5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIHlvdSBuZWVkIGEgZGlmZmVyZW50IGZ1bmN0aW9uLCB5b3UgY2FuIGdldCBhbm90aGVyIG9uZS5cbiAgICB2YXIgY2hvbXAgPSBwaWNrZXQoc2NyaXB0LCBzY29wZSk7XG5cbiAgICAvLyBMYXN0LCBmZWVkIHRoZSBjaG9tcCBhbmQgbGV0IGl0IHJhbXBhZ2UhXG4gICAgLy8gQSBjaG9tcCBlYXRzIG5vdGhpbmcgYnV044CAYSBraW5kIG9mIGZlZWQgdGhhdCB0aGUgY2hvbXAgYXRlIGF0IGZpcnN0LlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiBvbmx5IGEgdmFsdWUgaW4gdGhlIHNjb3BlIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbmVlZCBub3QgdG8gcmVtYWtlIHRoZSBDaGFpbiBDaG9tcCBhbmQgdGhlIHBpY2tldC5cbiAgICByZXR1cm4gY2hvbXAob3B0aW9ucyk7XG59XG5cbi8qKlxuICogY3JlYXRlIHNhbmRib3hcbiAqL1xuY2hhaW5jaG9tcC5waWNrID0gKGZ1bmN0aW9uKCl7XG4gICAgLy8gRHluYW1pYyBpbnN0YW50aWF0aW9uIGlkaW9tXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjA2Nzk3L3VzZS1vZi1hcHBseS13aXRoLW5ldy1vcGVyYXRvci1pcy10aGlzLXBvc3NpYmxlXG4gICAgZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yLCBhcmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIEYoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgRi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJhbm5lZFZhcnMoKXtcbiAgICAgICAgLy8gY29ycmVjdCBiYW5uZWQgb2JqZWN0IG5hbWVzLlxuICAgICAgICB2YXIgYmFubmVkID0gWydfX3Byb3RvX18nLCAncHJvdG90eXBlJ107XG4gICAgICAgIGZ1bmN0aW9uIGJhbihrKXtcbiAgICAgICAgICAgIGlmKGsgJiYgYmFubmVkLmluZGV4T2YoaykgPCAwICYmIGsgIT09ICdldmFsJyAmJiBrLm1hdGNoKC9eW18kYS16QS1aXVtfJGEtekEtWjAtOV0qJC8pKXtcbiAgICAgICAgICAgICAgICBiYW5uZWQucHVzaChrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZ2xvYmFsKS5mb3JFYWNoKGJhbik7XG4gICAgICAgIGZvcih2YXIgayBpbiBnbG9iYWwpe1xuICAgICAgICAgICAgYmFuKGspO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmFuIGFsbCBpZHMgb2YgdGhlIGVsZW1lbnRzXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlcnNlKGVsZW0pe1xuICAgICAgICAgICAgYmFuKGVsZW0uZ2V0QXR0cmlidXRlICYmIGVsZW0uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHZhciBjaGlsZHMgPSBlbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0cmF2ZXJzZShjaGlsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgc3RhcnQgKioqKlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdHJhdmVyc2UoZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIGVuZCAqKioqXG5cbiAgICAgICAgcmV0dXJuIGJhbm5lZDtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSBvZiBleHBvc2VkIG9iamVjdHNcbiAgICBmdW5jdGlvbiBnZXRTdGRsaWJzKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnT2JqZWN0JyAgICAgICAgICAgIDogT2JqZWN0LFxuICAgICAgICAgICAgJ1N0cmluZycgICAgICAgICAgICA6IFN0cmluZyxcbiAgICAgICAgICAgICdOdW1iZXInICAgICAgICAgICAgOiBOdW1iZXIsXG4gICAgICAgICAgICAnQm9vbGVhbicgICAgICAgICAgIDogQm9vbGVhbixcbiAgICAgICAgICAgICdBcnJheScgICAgICAgICAgICAgOiBBcnJheSxcbiAgICAgICAgICAgICdEYXRlJyAgICAgICAgICAgICAgOiBEYXRlLFxuICAgICAgICAgICAgJ01hdGgnICAgICAgICAgICAgICA6IE1hdGgsXG4gICAgICAgICAgICAnUmVnRXhwJyAgICAgICAgICAgIDogUmVnRXhwLFxuICAgICAgICAgICAgJ0Vycm9yJyAgICAgICAgICAgICA6IEVycm9yLFxuICAgICAgICAgICAgJ0V2YWxFcnJvcicgICAgICAgICA6IEV2YWxFcnJvcixcbiAgICAgICAgICAgICdSYW5nZUVycm9yJyAgICAgICAgOiBSYW5nZUVycm9yLFxuICAgICAgICAgICAgJ1JlZmVyZW5jZUVycm9yJyAgICA6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgICAgICAgJ1N5bnRheEVycm9yJyAgICAgICA6IFN5bnRheEVycm9yLFxuICAgICAgICAgICAgJ1R5cGVFcnJvcicgICAgICAgICA6IFR5cGVFcnJvcixcbiAgICAgICAgICAgICdVUklFcnJvcicgICAgICAgICAgOiBVUklFcnJvcixcbiAgICAgICAgICAgICdKU09OJyAgICAgICAgICAgICAgOiBKU09OLFxuICAgICAgICAgICAgJ05hTicgICAgICAgICAgICAgICA6IE5hTixcbiAgICAgICAgICAgICdJbmZpbml0eScgICAgICAgICAgOiBJbmZpbml0eSxcbiAgICAgICAgICAgICd1bmRlZmluZWQnICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGFyc2VJbnQnICAgICAgICAgIDogcGFyc2VJbnQsXG4gICAgICAgICAgICAncGFyc2VGbG9hdCcgICAgICAgIDogcGFyc2VGbG9hdCxcbiAgICAgICAgICAgICdpc05hTicgICAgICAgICAgICAgOiBpc05hTixcbiAgICAgICAgICAgICdpc0Zpbml0ZScgICAgICAgICAgOiBpc0Zpbml0ZSxcbiAgICAgICAgICAgICdkZWNvZGVVUkknICAgICAgICAgOiBkZWNvZGVVUkksXG4gICAgICAgICAgICAnZGVjb2RlVVJJQ29tcG9uZW50JzogZGVjb2RlVVJJQ29tcG9uZW50LFxuICAgICAgICAgICAgJ2VuY29kZVVSSScgICAgICAgICA6IGVuY29kZVVSSSxcbiAgICAgICAgICAgICdlbmNvZGVVUklDb21wb25lbnQnOiBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgaXNGcmVlemVkU3RkTGliT2JqcyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIHNhbmRib3guXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzRnJlZXplZFN0ZExpYk9ianMgPT0gZmFsc2Upe1xuICAgICAgICAgICAgdmFyIHN0ZGxpYnMgPSBnZXRTdGRsaWJzKCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZyZWV6ZSh2KXtcbiAgICAgICAgICAgICAgICBpZih2ICYmICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHYgPT09ICdmdW5jdGlvbicpICYmICEgT2JqZWN0LmlzRnJvemVuKHYpKXtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModikuZm9yRWFjaChmdW5jdGlvbihrLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aW9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZXplKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJlZXplKHN0ZGxpYnMpO1xuXG4gICAgICAgICAgICAvLyBmcmVlemUgRnVuY3Rpb24ucHJvdG90eXBlXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmcmVlemUoRnVuY3Rpb24pO1xuXG4gICAgICAgICAgICBpc0ZyZWV6ZWRTdGRMaWJPYmpzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBiYW5uZWQgPSBnZXRCYW5uZWRWYXJzKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNyZWF0ZSBzYW5kYm94ZWQgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihzY3JpcHQsIHNjb3BlKXtcbiAgICAgICAgICAgIC8vIHZhbGlkYXRlIGFyZ3VtZW50c1xuICAgICAgICAgICAgaWYoICEgKHR5cGVvZiBzY3JpcHQgPT09ICdzdHJpbmcnIHx8IHNjcmlwdCBpbnN0YW5jZW9mIFN0cmluZyApKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIGRlZmF1bHQgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Quc2VhbChzY29wZSk7XG5cbiAgICAgICAgICAgIC8vIEV4cG9zZSBjdXN0b20gcHJvcGVydGllc1xuICAgICAgICAgICAgdmFyIGd1ZXN0R2xvYmFsID0gZ2V0U3RkbGlicygpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoZ3Vlc3RHbG9iYWwpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5rZXlzKGd1ZXN0R2xvYmFsKS5jb25jYXQoYmFubmVkLmZpbHRlcihmdW5jdGlvbihiKXsgcmV0dXJuICEgZ3Vlc3RHbG9iYWwuaGFzT3duUHJvcGVydHkoYik7IH0pKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNjcmlwdCk7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25PYmplY3QgPSBjb25zdHJ1Y3QoRnVuY3Rpb24sIGFyZ3MpO1xuXG4gICAgICAgICAgICB2YXIgc2FmZUV2YWwgPSBmdW5jdGlvbihzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24oXCJyZXR1cm4gXCIgKyBzLCBndWVzdEdsb2JhbCkoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHNhZmVFdmFsKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbnZva2Ugc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgaW52b2tlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IHNhZmVFdmFsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBzYW5kYm94ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc3RvcmUgZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBndWVzdEdsb2JhbFtrXSA9IHNjb3BlW2tdO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkubWFwKGZ1bmN0aW9uKGspeyByZXR1cm4gZ3Vlc3RHbG9iYWxba107IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25PYmplY3QuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1maW5hbGx5e1xuICAgICAgICAgICAgICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb247XG4gICAgfTtcbn0pKCk7XG5cbi8vXG5jaGFpbmNob21wLmNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MsIG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xuXG4gICAgLy8gcmVwbGFjZSBldmFsIHdpdGggc2FmZSBldmFsLWxpa2UgZnVuY3Rpb25cbiAgICB2YXIgX2V2YWwgPSBldmFsO1xuICAgIGlmKG9wdGlvbnMuZGVidWcgIT09IHRydWUpe1xuICAgICAgICBldmFsID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeXtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGV2YWwgPSBfZXZhbDtcbiAgICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjaGFpbmNob21wO1xuIl19
