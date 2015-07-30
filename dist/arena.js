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
            var scope = {
                module: {
                    exports: null
                }
            };
            this.ai = chainchomp_1.default(ai, scope) || scope.module && scope.module.exports;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9BY3Rvci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0NvbW1hbmQuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29uc3RzLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvRnguanMiLCJpbnRlcm1lZGlhdGUvY29yZS9MYXNlci5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9NaXNzaWxlQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL01pc3NpbGVDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1Nob3RQYXJhbS5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXIuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9jb3JlL1NvdXJjZXJDb250cm9sbGVyLmpzIiwiaW50ZXJtZWRpYXRlL2NvcmUvVXRpbHMuanMiLCJpbnRlcm1lZGlhdGUvY29yZS9WLmpzIiwiaW50ZXJtZWRpYXRlL2xpYnMvY2hhaW5jaG9tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEZpZWxkXzEgPSByZXF1aXJlKCcuL2NvcmUvRmllbGQnKTtcbnZhciBTb3VyY2VyXzEgPSByZXF1aXJlKCcuL2NvcmUvU291cmNlcicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL2NvcmUvVXRpbHMnKTtcbmZ1bmN0aW9uIGNyZWF0ZShmaWVsZCwgc291cmNlKSB7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VyXzEuZGVmYXVsdChmaWVsZCwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoMzIwKSAtIDE2MCwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoMzIwKSAtIDE2MCwgc291cmNlLmFpLCBzb3VyY2UubmFtZSwgc291cmNlLmNvbG9yKTtcbn1cbm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZpZWxkID0gbmV3IEZpZWxkXzEuZGVmYXVsdCgpO1xuICAgIHZhciBzb3VyY2VyMSA9IGNyZWF0ZShmaWVsZCwgZS5kYXRhLnNvdXJjZXNbMF0pO1xuICAgIHZhciBzb3VyY2VyMiA9IGNyZWF0ZShmaWVsZCwgZS5kYXRhLnNvdXJjZXNbMV0pO1xuICAgIGZpZWxkLmFkZFNvdXJjZXIoc291cmNlcjEpO1xuICAgIGZpZWxkLmFkZFNvdXJjZXIoc291cmNlcjIpO1xuICAgIHZhciBsaXN0ZW5lciA9IHtcbiAgICAgICAgb25QcmVUaGluazogZnVuY3Rpb24gKHNvdXJjZXJJZCkge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiUHJlVGhpbmtcIixcbiAgICAgICAgICAgICAgICBpbmRleDogc291cmNlcjEuaWQgPT0gc291cmNlcklkID8gMCA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblBvc3RUaGluazogZnVuY3Rpb24gKHNvdXJjZXJJZCkge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiUG9zdFRoaW5rXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHNvdXJjZXIxLmlkID09IHNvdXJjZXJJZCA/IDAgOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyMDAwICYmICFmaWVsZC5pc0ZpbmlzaCgpOyBpKyspIHtcbiAgICAgICAgZmllbGQudGljayhsaXN0ZW5lcik7XG4gICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IFwiRnJhbWVcIixcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZC5kdW1wKClcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29tbWFuZDogXCJFbmRPZkdhbWVcIlxuICAgIH0pO1xufTtcbiIsInZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBBY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWN0b3IoZmllbGQsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnNpemUgPSBDb25maWdzXzEuZGVmYXVsdC5DT0xMSVNJT05fU0laRTtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWXzEuZGVmYXVsdCh4LCB5KTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWXzEuZGVmYXVsdCgwLCAwKTtcbiAgICB9XG4gICAgQWN0b3IucHJvdG90eXBlLnRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgICAgICB0aGlzLm9uVGhpbmsoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FpdC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEFjdG9yRHVtcCh0aGlzKTtcbiAgICB9O1xuICAgIHJldHVybiBBY3Rvcjtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBY3RvcjtcbnZhciBBY3RvckR1bXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFjdG9yRHVtcChhY3Rvcikge1xuICAgICAgICB0aGlzLmlkID0gYWN0b3IuaWQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBhY3Rvci5wb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zcGVlZCA9IGFjdG9yLnNwZWVkO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGFjdG9yLmRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIEFjdG9yRHVtcDtcbn0pKCk7XG5leHBvcnRzLkFjdG9yRHVtcCA9IEFjdG9yRHVtcDtcbiIsInZhciBDb21tYW5kID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb21tYW5kKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgQ29tbWFuZC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbW1hbmQuIFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29tbWFuZC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSB0cnVlO1xuICAgIH07XG4gICAgQ29tbWFuZC5wcm90b3R5cGUudW5hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIENvbW1hbmQ7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29tbWFuZDtcbiIsInZhciBDb25maWdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25maWdzKCkge1xuICAgIH1cbiAgICBDb25maWdzLklOSVRJQUxfU0hJRUxEID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9GVUVMID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcbiAgICBDb25maWdzLkZVRUxfQ09TVCA9IDAuMjQ7XG4gICAgQ29uZmlncy5DT0xMSVNJT05fU0laRSA9IDQ7XG4gICAgQ29uZmlncy5TQ0FOX1dBSVQgPSAwLjM1O1xuICAgIENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSA9IDAuOTY7XG4gICAgQ29uZmlncy5HUkFWSVRZID0gMC4xO1xuICAgIENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EID0gNDgwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSID0gNDAwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQgPSAwLjAwODtcbiAgICBDb25maWdzLk9WRVJIRUFUX0JPUkRFUiA9IDEwMDtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUID0gMC4wNTtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQgPSAwLjAxMjtcbiAgICBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEUgPSAxO1xuICAgIENvbmZpZ3MuQ09PTF9ET1dOID0gMC41O1xuICAgIENvbmZpZ3MuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUgPSAwLjQ7XG4gICAgcmV0dXJuIENvbmZpZ3M7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29uZmlncztcbiIsInZhciBDb25zdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnN0cygpIHtcbiAgICB9XG4gICAgQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA9IDE7XG4gICAgQ29uc3RzLkRJUkVDVElPTl9MRUZUID0gLTE7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX1VQID0gXCJ2ZXJ0aWFsX3VwXCI7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX0RPV04gPSBcInZlcnRpYWxfZG93blwiO1xuICAgIHJldHVybiBDb25zdHM7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29uc3RzO1xuO1xuIiwidmFyIENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIoYWN0b3IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5sb2cgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbmFsUGFyYW1zID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIG9wdGlvbmFsUGFyYW1zW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpZWxkID0gYWN0b3IuZmllbGQ7XG4gICAgICAgIHRoaXMuZnJhbWUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5maWVsZC5mcmFtZTsgfTtcbiAgICAgICAgdGhpcy5hbHRpdHVkZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFjdG9yLnBvc2l0aW9uLnk7IH07XG4gICAgICAgIHRoaXMud2FpdCA9IGZ1bmN0aW9uIChmcmFtZSkge1xuICAgICAgICAgICAgaWYgKDAgPCBmcmFtZSkge1xuICAgICAgICAgICAgICAgIGFjdG9yLndhaXQgKz0gZnJhbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDb250cm9sbGVyO1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbnRyb2xsZXI7XG4iLCJ2YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBGaWVsZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRmllbGQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkID0gMDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zaG90cyA9IFtdO1xuICAgICAgICB0aGlzLmZ4cyA9IFtdO1xuICAgIH1cbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU291cmNlciA9IGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgIHNvdXJjZXIuaWQgPSBcInNvdXJjZXJcIiArICh0aGlzLmN1cnJlbnRJZCsrKTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5wdXNoKHNvdXJjZXIpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNob3QgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICBzaG90LmlkID0gXCJzaG90XCIgKyAodGhpcy5jdXJyZW50SWQrKyk7XG4gICAgICAgIHRoaXMuc2hvdHMucHVzaChzaG90KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5yZW1vdmVTaG90ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhY3RvciA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICBpZiAoYWN0b3IgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmFkZEZ4ID0gZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgIGZ4LmlkID0gXCJmeFwiICsgKHRoaXMuY3VycmVudElkKyspO1xuICAgICAgICB0aGlzLmZ4cy5wdXNoKGZ4KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5yZW1vdmVGeCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZ4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZ4ID0gdGhpcy5meHNbaV07XG4gICAgICAgICAgICBpZiAoZnggPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZnhzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIC8vIFRvIGJlIHVzZWQgaW4gdGhlIGludmlzaWJsZSBoYW5kLlxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XG4gICAgICAgICAgICBzb3VyY2VyLnRoaW5rKCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzaG90Lm93bmVyLmlkKTtcbiAgICAgICAgICAgIHNob3QudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IuYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoZWNrUmVzdWx0KCk7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja1Jlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1cnZpdmVkID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlci5zaGllbGQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHNvdXJjZXIuYWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFzdXJ2aXZlZCkge1xuICAgICAgICAgICAgICAgIHN1cnZpdmVkID0gc291cmNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3VsdCA9IG5ldyBHYW1lUmVzdWx0KHN1cnZpdmVkLmR1bXAoKSwgdGhpcy5mcmFtZSk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkVuZW15ID0gZnVuY3Rpb24gKG93bmVyLCByYWRhcikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IG93bmVyICYmIHJhZGFyKHNvdXJjZXIucG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAob3duZXIsIHJhZGFyKSB7XG4gICAgICAgIHZhciBvd25lclBvc2l0aW9uID0gb3duZXIucG9zaXRpb247XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNob3QgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgdmFyIGFjdG9yUG9zaXRpb24gPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKHNob3Qub3duZXIgIT09IG93bmVyICYmIHJhZGFyKGFjdG9yUG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdmFyIG5leHREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCkpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0NvbGxpc2lvbiA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHZhciBmID0gc2hvdC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHQgPSBzaG90LnBvc2l0aW9uLmFkZChzaG90LnNwZWVkKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLmJyZWFrYWJsZSAmJiBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzXzEuZGVmYXVsdC5jYWxjRGlzdGFuY2UoZiwgdCwgYWN0b3IucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IHNob3Qub3duZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBVdGlsc18xLmRlZmF1bHQuY2FsY0Rpc3RhbmNlKGYsIHQsIHNvdXJjZXIucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNvbXB1dGVDZW50ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIHZhciBzdW1YID0gMDtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHN1bVggKz0gc291cmNlci5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmlzRmluaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF0aGlzLmZpbmlzaGVkRnJhbWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkRnJhbWUgPSB0aGlzLmZyYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5pc2hlZEZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaWVsZER1bXAodGhpcyk7XG4gICAgfTtcbiAgICByZXR1cm4gRmllbGQ7XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRmllbGQ7XG52YXIgRmllbGREdW1wID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGaWVsZER1bXAoZmllbGQpIHtcbiAgICAgICAgdmFyIHNvdXJjZXJzRHVtcCA9IFtdO1xuICAgICAgICB2YXIgc2hvdHNEdW1wID0gW107XG4gICAgICAgIHZhciBmeER1bXAgPSBbXTtcbiAgICAgICAgdmFyIHJlc3VsdER1bXAgPSBudWxsO1xuICAgICAgICBmaWVsZC5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgc291cmNlcnNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzaG90c0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeER1bXAucHVzaChmeC5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZpZWxkLmZyYW1lO1xuICAgICAgICB0aGlzLnNvdXJjZXJzID0gc291cmNlcnNEdW1wO1xuICAgICAgICB0aGlzLnNob3RzID0gc2hvdHNEdW1wO1xuICAgICAgICB0aGlzLmZ4cyA9IGZ4RHVtcDtcbiAgICAgICAgaWYgKGZpZWxkLnJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBmaWVsZC5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEZpZWxkRHVtcDtcbn0pKCk7XG5leHBvcnRzLkZpZWxkRHVtcCA9IEZpZWxkRHVtcDtcbnZhciBHYW1lUmVzdWx0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHYW1lUmVzdWx0KHdpbm5lciwgZnJhbWUpIHtcbiAgICAgICAgdGhpcy53aW5uZXIgPSB3aW5uZXI7XG4gICAgICAgIHRoaXMuZnJhbWUgPSBmcmFtZTtcbiAgICAgICAgdGhpcy5pc0RyYXcgPSB3aW5uZXIgPT0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIEdhbWVSZXN1bHQ7XG59KSgpO1xuZXhwb3J0cy5HYW1lUmVzdWx0ID0gR2FtZVJlc3VsdDtcbiIsInZhciBGeCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRngoZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICB9XG4gICAgRngucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gdGhpcy5mcmFtZSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRngucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZ4RHVtcCh0aGlzKTtcbiAgICB9O1xuICAgIHJldHVybiBGeDtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBGeDtcbnZhciBGeER1bXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZ4RHVtcChmeCkge1xuICAgICAgICB0aGlzLmlkID0gZnguaWQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBmeC5wb3NpdGlvbjtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZ4LmZyYW1lO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ4Lmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIEZ4RHVtcDtcbn0pKCk7XG5leHBvcnRzLkZ4RHVtcCA9IEZ4RHVtcDtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFNob3RfMSA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIExhc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGFzZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGFzZXIoZmllbGQsIG93bmVyLCBkaXJlY3Rpb24sIHBvd2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lciwgXCJMYXNlclwiKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDg7IH07XG4gICAgICAgIHRoaXMuc3BlZWQgPSBWXzEuZGVmYXVsdC5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XG4gICAgfVxuICAgIHJldHVybiBMYXNlcjtcbn0pKFNob3RfMS5kZWZhdWx0KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IExhc2VyO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU2hvdF8xID0gcmVxdWlyZSgnLi9TaG90Jyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgTWlzc2lsZUNvbW1hbmRfMSA9IHJlcXVpcmUoJy4vTWlzc2lsZUNvbW1hbmQnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9NaXNzaWxlQ29udHJvbGxlcicpO1xudmFyIENvbnN0c18xID0gcmVxdWlyZSgnLi9Db25zdHMnKTtcbnZhciBNaXNzaWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlKGZpZWxkLCBvd25lciwgYWkpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLCBcIk1pc3NpbGVcIik7XG4gICAgICAgIHRoaXMuYWkgPSBhaTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDU7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMTAgKyBfdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IDEwMDtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFpID0gYWk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBNaXNzaWxlQ29udHJvbGxlcl8xLmRlZmF1bHQodGhpcyk7XG4gICAgfVxuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5haSh0aGlzLmNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0LlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKGF0dGFjaykge1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChhdHRhY2spO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlO1xufSkoU2hvdF8xLmRlZmF1bHQpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTWlzc2lsZTtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIE1pc3NpbGVDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZUNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZUNvbW1hbmQobWlzc2lsZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5taXNzaWxlID0gbWlzc2lsZTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWRVcCA9IDA7XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gMDtcbiAgICAgICAgdGhpcy50dXJuID0gMDtcbiAgICB9O1xuICAgIE1pc3NpbGVDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZS5mdWVsKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkID0gVl8xLmRlZmF1bHQuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLmFkZChub3JtYWxpemVkLm11bHRpcGx5KHRoaXMuc3BlZWRVcCkpO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5taXNzaWxlLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTWlzc2lsZUNvbW1hbmQ7XG59KShDb21tYW5kXzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlQ29tbWFuZDtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgTWlzc2lsZUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlQ29udHJvbGxlcihtaXNzaWxlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG1pc3NpbGUpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1pc3NpbGUuZGlyZWN0aW9uOyB9O1xuICAgICAgICB2YXIgZmllbGQgPSBtaXNzaWxlLmZpZWxkO1xuICAgICAgICB2YXIgY29tbWFuZCA9IG1pc3NpbGUuY29tbWFuZDtcbiAgICAgICAgdGhpcy5mdWVsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5mdWVsOyB9O1xuICAgICAgICB0aGlzLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgbWlzc2lsZS53YWl0ICs9IDEuNTtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IG1pc3NpbGUub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzXzEuZGVmYXVsdC5jcmVhdGVSYWRhcihtaXNzaWxlLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnNwZWVkVXAgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZERvd24gPSAwLjE7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVyblJpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gLTk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybkxlZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSA5O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gTWlzc2lsZUNvbnRyb2xsZXI7XG59KShDb250cm9sbGVyXzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlQ29udHJvbGxlcjtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIEFjdG9yXzEgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgRnhfMSA9IHJlcXVpcmUoJy4vRngnKTtcbnZhciBTaG90ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2hvdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaG90KGZpZWxkLCBvd25lciwgdHlwZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIucG9zaXRpb24ueCwgb3duZXIucG9zaXRpb24ueSk7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfTtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgU2hvdC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uQWN0aW9uKCk7XG4gICAgICAgIHZhciBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XG4gICAgICAgIGlmIChjb2xsaWRlZCkge1xuICAgICAgICAgICAgY29sbGlkZWQub25IaXQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeF8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMiksIDgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4XzEuZGVmYXVsdCh0aGlzLmZpZWxkLCB0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKSwgOCkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5yZWFjdGlvbiA9IGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLm9uQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTaG90RHVtcCh0aGlzKTtcbiAgICB9O1xuICAgIHJldHVybiBTaG90O1xufSkoQWN0b3JfMS5kZWZhdWx0KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNob3Q7XG52YXIgU2hvdER1bXAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTaG90RHVtcCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaG90RHVtcChzaG90KSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNob3QpO1xuICAgICAgICB0aGlzLnR5cGUgPSBzaG90LnR5cGU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBzaG90Lm93bmVyLmNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU2hvdER1bXA7XG59KShBY3Rvcl8xLkFjdG9yRHVtcCk7XG5leHBvcnRzLlNob3REdW1wID0gU2hvdER1bXA7XG4iLCJ2YXIgU2hvdFBhcmFtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaG90UGFyYW0oKSB7XG4gICAgfVxuICAgIHJldHVybiBTaG90UGFyYW07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2hvdFBhcmFtO1xuIiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgY2hhaW5jaG9tcF8xID0gcmVxdWlyZSgnLi4vbGlicy9jaGFpbmNob21wJyk7XG52YXIgQWN0b3JfMSA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBTb3VyY2VyQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Tb3VyY2VyQ29tbWFuZCcpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL1NvdXJjZXJDb250cm9sbGVyJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgQ29uc3RzXzEgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTGFzZXJfMSA9IHJlcXVpcmUoJy4vTGFzZXInKTtcbnZhciBNaXNzaWxlXzEgPSByZXF1aXJlKCcuL01pc3NpbGUnKTtcbnZhciBTb3VyY2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyKGZpZWxkLCB4LCB5LCBhaSwgbmFtZSwgY29sb3IpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIHgsIHkpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMDtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBDb25maWdzXzEuZGVmYXVsdC5JTklUSUFMX1NISUVMRDtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfTUlTU0lMRV9BTU1PO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBDb25maWdzXzEuZGVmYXVsdC5JTklUSUFMX0ZVRUw7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gQ29uc3RzXzEuZGVmYXVsdC5ESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IG5ldyBTb3VyY2VyQ29tbWFuZF8xLmRlZmF1bHQodGhpcyk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTb3VyY2VyQ29udHJvbGxlcl8xLmRlZmF1bHQodGhpcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5haSA9IGNoYWluY2hvbXBfMS5kZWZhdWx0KGFpLCBzY29wZSkgfHwgc2NvcGUubW9kdWxlICYmIHNjb3BlLm1vZHVsZS5leHBvcnRzO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5haSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgU291cmNlci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWkgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5haSh0aGlzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBhaXIgcmVzaXN0YW5jZVxuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzXzEuZGVmYXVsdC5TUEVFRF9SRVNJU1RBTkNFKTtcbiAgICAgICAgLy8gZ3Jhdml0eVxuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzXzEuZGVmYXVsdC5HUkFWSVRZKTtcbiAgICAgICAgLy8gY29udHJvbCBhbHRpdHVkZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcbiAgICAgICAgaWYgKENvbmZpZ3NfMS5kZWZhdWx0LlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xuICAgICAgICAgICAgdmFyIGludmlzaWJsZVBvd2VyID0gKHRoaXMucG9zaXRpb24ueSAtIENvbmZpZ3NfMS5kZWZhdWx0LlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzXzEuZGVmYXVsdC5HUkFWSVRZICogaW52aXNpYmxlUG93ZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRyb2wgZGlzdGFuY2UgYnkgdGhlIGludmlzaWJsZSBoYW5kXG4gICAgICAgIHZhciBkaWZmID0gdGhpcy5maWVsZC5jZW50ZXIgLSB0aGlzLnBvc2l0aW9uLng7XG4gICAgICAgIGlmIChDb25maWdzXzEuZGVmYXVsdC5ESVNUQU5DRV9CT1JEQVIgPCBNYXRoLmFicyhkaWZmKSkge1xuICAgICAgICAgICAgdmFyIGludmlzaWJsZUhhbmQgPSBkaWZmICogQ29uZmlnc18xLmRlZmF1bHQuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQ7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCArIGludmlzaWJsZUhhbmQsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ28gaW50byB0aGUgZ3JvdW5kXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3NfMS5kZWZhdWx0LkdST1VORF9EQU1BR0VfU0NBTEUpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIDApO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnNwZWVkLngsIDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlnc18xLmRlZmF1bHQuQ09PTF9ET1dOO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XG4gICAgICAgIC8vIG92ZXJoZWF0XG4gICAgICAgIHZhciBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfQk9SREVSKTtcbiAgICAgICAgaWYgKDAgPCBvdmVyaGVhdCkge1xuICAgICAgICAgICAgdmFyIGxpbmVhckRhbWFnZSA9IG92ZXJoZWF0ICogQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XG4gICAgICAgICAgICB2YXIgcG93ZXJEYW1hZ2UgPSBNYXRoLnBvdyhvdmVyaGVhdCAqIENvbmZpZ3NfMS5kZWZhdWx0Lk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gXCJMYXNlclwiKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdmFyIHNob3QgPSBuZXcgTGFzZXJfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHRoaXMsIGRpcmVjdGlvbiwgcGFyYW0ucG93ZXIpO1xuICAgICAgICAgICAgc2hvdC5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGVBbW1vKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pc3NpbGUgPSBuZXcgTWlzc2lsZV8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYWkpO1xuICAgICAgICAgICAgICAgIG1pc3NpbGUucmVhY3Rpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChtaXNzaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gQ29uc3RzXzEuZGVmYXVsdC5ESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWxzXzEuZGVmYXVsdC50b09wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLmFkZChzaG90LnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0Lk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XG4gICAgICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNvdXJjZXJEdW1wKHRoaXMpO1xuICAgIH07XG4gICAgcmV0dXJuIFNvdXJjZXI7XG59KShBY3Rvcl8xLmRlZmF1bHQpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU291cmNlcjtcbnZhciBTb3VyY2VyRHVtcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJEdW1wLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJEdW1wKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlcik7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gc291cmNlci5zaGllbGQ7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBzb3VyY2VyLnRlbXBlcmF0dXJlO1xuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vID0gc291cmNlci5taXNzaWxlQW1tbztcbiAgICAgICAgdGhpcy5mdWVsID0gc291cmNlci5mdWVsO1xuICAgICAgICB0aGlzLm5hbWUgPSBzb3VyY2VyLm5hbWU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBzb3VyY2VyLmNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU291cmNlckR1bXA7XG59KShBY3Rvcl8xLkFjdG9yRHVtcCk7XG5leHBvcnRzLlNvdXJjZXJEdW1wID0gU291cmNlckR1bXA7XG4iLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBTb3VyY2VyQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJDb21tYW5kKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuc291cmNlciA9IHNvdXJjZXI7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFoZWFkID0gMDtcbiAgICAgICAgdGhpcy5hc2NlbnQgPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maXJlID0gbnVsbDtcbiAgICB9O1xuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5maXJlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZmlyZSh0aGlzLmZpcmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnR1cm4pIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgPCB0aGlzLnNvdXJjZXIuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgLT0gKE1hdGguYWJzKHRoaXMuYWhlYWQpICsgTWF0aC5hYnModGhpcy5hc2NlbnQpKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlckNvbW1hbmQ7XG59KShDb21tYW5kXzEuZGVmYXVsdCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29tbWFuZDtcbiIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU2hvdFBhcmFtXzEgPSByZXF1aXJlKCcuL1Nob3RQYXJhbScpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckNvbnRyb2xsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckNvbnRyb2xsZXIoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2VyKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLnNoaWVsZDsgfTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIudGVtcGVyYXR1cmU7IH07XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLm1pc3NpbGVBbW1vOyB9O1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLmZ1ZWw7IH07XG4gICAgICAgIHZhciBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xuICAgICAgICB0aGlzLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3NfMS5kZWZhdWx0LlNDQU5fV0FJVDtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzXzEuZGVmYXVsdC5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY2FuQXR0YWNrID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlnc18xLmRlZmF1bHQuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuQXR0YWNrKHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5haGVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAtMC40O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gMC45O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlc2NlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFzY2VudCA9IC0wLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZUxhc2VyID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgcG93ZXIpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHBvd2VyID0gTWF0aC5taW4oTWF0aC5tYXgocG93ZXIgfHwgOCwgMyksIDgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbV8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5wb3dlciA9IHBvd2VyO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5zaG90VHlwZSA9ICdMYXNlcic7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZU1pc3NpbGUgPSBmdW5jdGlvbiAoYWkpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZSA9IG5ldyBTaG90UGFyYW1fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuYWkgPSBhaTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5zaG90VHlwZSA9ICdNaXNzaWxlJztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFNvdXJjZXJDb250cm9sbGVyO1xufSkoQ29udHJvbGxlcl8xLmRlZmF1bHQpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU291cmNlckNvbnRyb2xsZXI7XG4iLCJ2YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgRVBTSUxPTiA9IDEwZS0xMjtcbnZhciBVdGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXRpbHMoKSB7XG4gICAgfVxuICAgIFV0aWxzLmNyZWF0ZVJhZGFyID0gZnVuY3Rpb24gKGMsIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgIHZhciBjaGVja0Rpc3RhbmNlID0gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7IH07XG4gICAgICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVja0Rpc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XG4gICAgICAgIHZhciBjaGVja1JpZ2h0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyAxODAgLSBhbmdsZSAvIDIpO1xuICAgICAgICBpZiAoYW5nbGUgPCAxODApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpOyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zaWRlID0gZnVuY3Rpb24gKGJhc2UsIGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gVXRpbHMudG9SYWRpYW4oZGVncmVlKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG5ldyBWXzEuZGVmYXVsdChNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcbiAgICAgICAgdmFyIHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFV0aWxzLmNhbGNEaXN0YW5jZSA9IGZ1bmN0aW9uIChmLCB0LCBwKSB7XG4gICAgICAgIHZhciB0b0Zyb20gPSB0LnN1YnRyYWN0KGYpO1xuICAgICAgICB2YXIgcEZyb20gPSBwLnN1YnRyYWN0KGYpO1xuICAgICAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gcEZyb20ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21UbyA9IGYuc3VidHJhY3QodCk7XG4gICAgICAgIHZhciBwVG8gPSBwLnN1YnRyYWN0KHQpO1xuICAgICAgICBpZiAoZnJvbVRvLmRvdChwVG8pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBUby5sZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnModG9Gcm9tLmNyb3NzKHBGcm9tKSAvIHRvRnJvbS5sZW5ndGgoKSk7XG4gICAgfTtcbiAgICBVdGlscy50b1JhZGlhbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB9O1xuICAgIFV0aWxzLnRvT3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSAlIDM2MDtcbiAgICAgICAgaWYgKGRlZ3JlZSA8IDApIHtcbiAgICAgICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSArIDM2MDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVncmVlIDw9IDE4MCkge1xuICAgICAgICAgICAgcmV0dXJuICg5MCAtIGRlZ3JlZSkgKiAyICsgZGVncmVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgyNzAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMucmFuZCA9IGZ1bmN0aW9uIChyZW5nZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xuICAgIH07XG4gICAgcmV0dXJuIFV0aWxzO1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFV0aWxzO1xuIiwidmFyIFYgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFYoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLl9sZW5ndGggPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmdsZSA9IG51bGw7XG4gICAgfVxuICAgIFYucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh2LCB5KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LCB0aGlzLnkgKyB5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdiwgdGhpcy55IC0geSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdiwgdGhpcy55IC8gdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm1vZHVsbyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYueCwgdGhpcy55ICUgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LCB0aGlzLnkgJSB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFYoLXRoaXMueCwgLXRoaXMueSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHYpLmxlbmd0aCgpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMubGVuZ3RoKCk7XG4gICAgICAgIHZhciBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHNjYWxlKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmdsZUluUmFkaWFucygpICogMTgwIC8gTWF0aC5QSTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlSW5SYWRpYW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmdsZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCB0aGlzLngpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgaWYgKHBvaW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueCArIHRoaXMueSAqIHBvaW50Lnk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueSAtIHRoaXMueSAqIHBvaW50Lng7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHZhciByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWKGNvcyAqIHRoaXMueCAtIHNpbiAqIHRoaXMueSwgY29zICogdGhpcy55ICsgc2luICogdGhpcy54KTtcbiAgICB9O1xuICAgIFYuZGlyZWN0aW9uID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XG4gICAgfTtcbiAgICByZXR1cm4gVjtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWO1xuIiwiLyoqXG4gKiBJbnZva2UgdW50cnVzdGVkIGd1ZXN0IGNvZGUgaW4gYSBzYW5kYm94LlxuICogVGhlIGd1ZXN0IGNvZGUgY2FuIGFjY2VzcyBvYmplY3RzIG9mIHRoZSBzdGFuZGFyZCBsaWJyYXJ5IG9mIEVDTUFTY3JpcHQuXG4gKlxuICogZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQ6IHN0cmluZywgc2NvcGU/OiBhbnkgPSB7fSk6IGFueTtcbiAqXG4gKiB0aGlzLnBhcmFtIHNjcmlwdCBndWVzdCBjb2RlLlxuICogdGhpcy5wYXJhbSBzY29wZSBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyB3aWxsIGJlIGV4cG9zZWQgdG8gdGhlIGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnJldHVybiByZXN1bHQgb2YgdGhlIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIGNoYWluY2hvbXAoc2NyaXB0LCBzY29wZSwgb3B0aW9ucyl7XG4gICAgLy8gRmlyc3QsIHlvdSBuZWVkIHRvIHBpbGUgYSBwaWNrZXQgdG8gdGllIGEgQ2hhaW4gQ2hvbXAuXG4gICAgLy8gSWYgdGhlIGVudmlyb25tZW50IGlzIGNoYW5nZWQsIHRoZSBwaWNrZXQgd2lsbCBkcm9wIG91dC5cbiAgICAvLyBZb3Ugc2hvdWxkIHJlbWFrZSBhIG5ldyBwaWNrZXQgZWFjaCB0aW1lIGFzIGxvbmcgYXPjgIB5b3UgYXJlIHNvIGJ1c3kuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgdGhlIGdsb2JhbCBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG11c3QgcmVtYWtlIGEgcGlja2V0LlxuICAgIHZhciBwaWNrZXQgPSBjaGFpbmNob21wLnBpY2soKTtcblxuICAgIC8vIE5leHQsIGdldCBuZXcgQ2hhaW4gQ2hvbXAgdGllZCB0aGUgcGlja2V0LlxuICAgIC8vIERpZmZlcmVudCBDaGFpbiBDaG9tcHMgaGF2ZSBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB5b3UgbmVlZCBhIGRpZmZlcmVudCBmdW5jdGlvbiwgeW91IGNhbiBnZXQgYW5vdGhlciBvbmUuXG4gICAgdmFyIGNob21wID0gcGlja2V0KHNjcmlwdCwgc2NvcGUpO1xuXG4gICAgLy8gTGFzdCwgZmVlZCB0aGUgY2hvbXAgYW5kIGxldCBpdCByYW1wYWdlIVxuICAgIC8vIEEgY2hvbXAgZWF0cyBub3RoaW5nIGJ1dOOAgGEga2luZCBvZiBmZWVkIHRoYXQgdGhlIGNob21wIGF0ZSBhdCBmaXJzdC5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgb25seSBhIHZhbHVlIGluIHRoZSBzY29wZSBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG5lZWQgbm90IHRvIHJlbWFrZSB0aGUgQ2hhaW4gQ2hvbXAgYW5kIHRoZSBwaWNrZXQuXG4gICAgcmV0dXJuIGNob21wKG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBzYW5kYm94XG4gKi9cbmNoYWluY2hvbXAucGljayA9IChmdW5jdGlvbigpe1xuICAgIC8vIER5bmFtaWMgaW5zdGFudGlhdGlvbiBpZGlvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYwNjc5Ny91c2Utb2YtYXBwbHktd2l0aC1uZXctb3BlcmF0b3ItaXMtdGhpcy1wb3NzaWJsZVxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdChjb25zdHJ1Y3RvciwgYXJncykge1xuICAgICAgICBmdW5jdGlvbiBGKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIEYucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCYW5uZWRWYXJzKCl7XG4gICAgICAgIC8vIGNvcnJlY3QgYmFubmVkIG9iamVjdCBuYW1lcy5cbiAgICAgICAgdmFyIGJhbm5lZCA9IFsnX19wcm90b19fJywgJ3Byb3RvdHlwZSddO1xuICAgICAgICBmdW5jdGlvbiBiYW4oayl7XG4gICAgICAgICAgICBpZihrICYmIGJhbm5lZC5pbmRleE9mKGspIDwgMCAmJiBrICE9PSAnZXZhbCcgJiYgay5tYXRjaCgvXltfJGEtekEtWl1bXyRhLXpBLVowLTldKiQvKSl7XG4gICAgICAgICAgICAgICAgYmFubmVkLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdsb2JhbCA9IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGdsb2JhbCkuZm9yRWFjaChiYW4pO1xuICAgICAgICBmb3IodmFyIGsgaW4gZ2xvYmFsKXtcbiAgICAgICAgICAgIGJhbihrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJhbiBhbGwgaWRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZShlbGVtKXtcbiAgICAgICAgICAgIGJhbihlbGVtLmdldEF0dHJpYnV0ZSAmJiBlbGVtLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB2YXIgY2hpbGRzID0gZWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNoaWxkcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdHJhdmVyc2UoY2hpbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIHN0YXJ0ICoqKipcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRyYXZlcnNlKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBlbmQgKioqKlxuXG4gICAgICAgIHJldHVybiBiYW5uZWQ7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgb2YgZXhwb3NlZCBvYmplY3RzXG4gICAgZnVuY3Rpb24gZ2V0U3RkbGlicygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ09iamVjdCcgICAgICAgICAgICA6IE9iamVjdCxcbiAgICAgICAgICAgICdTdHJpbmcnICAgICAgICAgICAgOiBTdHJpbmcsXG4gICAgICAgICAgICAnTnVtYmVyJyAgICAgICAgICAgIDogTnVtYmVyLFxuICAgICAgICAgICAgJ0Jvb2xlYW4nICAgICAgICAgICA6IEJvb2xlYW4sXG4gICAgICAgICAgICAnQXJyYXknICAgICAgICAgICAgIDogQXJyYXksXG4gICAgICAgICAgICAnRGF0ZScgICAgICAgICAgICAgIDogRGF0ZSxcbiAgICAgICAgICAgICdNYXRoJyAgICAgICAgICAgICAgOiBNYXRoLFxuICAgICAgICAgICAgJ1JlZ0V4cCcgICAgICAgICAgICA6IFJlZ0V4cCxcbiAgICAgICAgICAgICdFcnJvcicgICAgICAgICAgICAgOiBFcnJvcixcbiAgICAgICAgICAgICdFdmFsRXJyb3InICAgICAgICAgOiBFdmFsRXJyb3IsXG4gICAgICAgICAgICAnUmFuZ2VFcnJvcicgICAgICAgIDogUmFuZ2VFcnJvcixcbiAgICAgICAgICAgICdSZWZlcmVuY2VFcnJvcicgICAgOiBSZWZlcmVuY2VFcnJvcixcbiAgICAgICAgICAgICdTeW50YXhFcnJvcicgICAgICAgOiBTeW50YXhFcnJvcixcbiAgICAgICAgICAgICdUeXBlRXJyb3InICAgICAgICAgOiBUeXBlRXJyb3IsXG4gICAgICAgICAgICAnVVJJRXJyb3InICAgICAgICAgIDogVVJJRXJyb3IsXG4gICAgICAgICAgICAnSlNPTicgICAgICAgICAgICAgIDogSlNPTixcbiAgICAgICAgICAgICdOYU4nICAgICAgICAgICAgICAgOiBOYU4sXG4gICAgICAgICAgICAnSW5maW5pdHknICAgICAgICAgIDogSW5maW5pdHksXG4gICAgICAgICAgICAndW5kZWZpbmVkJyAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BhcnNlSW50JyAgICAgICAgICA6IHBhcnNlSW50LFxuICAgICAgICAgICAgJ3BhcnNlRmxvYXQnICAgICAgICA6IHBhcnNlRmxvYXQsXG4gICAgICAgICAgICAnaXNOYU4nICAgICAgICAgICAgIDogaXNOYU4sXG4gICAgICAgICAgICAnaXNGaW5pdGUnICAgICAgICAgIDogaXNGaW5pdGUsXG4gICAgICAgICAgICAnZGVjb2RlVVJJJyAgICAgICAgIDogZGVjb2RlVVJJLFxuICAgICAgICAgICAgJ2RlY29kZVVSSUNvbXBvbmVudCc6IGRlY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgICAgICdlbmNvZGVVUkknICAgICAgICAgOiBlbmNvZGVVUkksXG4gICAgICAgICAgICAnZW5jb2RlVVJJQ29tcG9uZW50JzogZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGlzRnJlZXplZFN0ZExpYk9ianMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBzYW5kYm94LlxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICBpZihpc0ZyZWV6ZWRTdGRMaWJPYmpzID09IGZhbHNlKXtcbiAgICAgICAgICAgIHZhciBzdGRsaWJzID0gZ2V0U3RkbGlicygpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmcmVlemUodil7XG4gICAgICAgICAgICAgICAgaWYodiAmJiAodHlwZW9mIHYgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSAmJiAhIE9iamVjdC5pc0Zyb3plbih2KSl7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUodik7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHYpLmZvckVhY2goZnVuY3Rpb24oaywgaSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2W2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGlvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyZWV6ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyZWV6ZShzdGRsaWJzKTtcblxuICAgICAgICAgICAgLy8gZnJlZXplIEZ1bmN0aW9uLnByb3RvdHlwZVxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnJlZXplKEZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgaXNGcmVlemVkU3RkTGliT2JqcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmFubmVkID0gZ2V0QmFubmVkVmFycygpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24oc2NyaXB0LCBzY29wZSl7XG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSBhcmd1bWVudHNcbiAgICAgICAgICAgIGlmKCAhICh0eXBlb2Ygc2NyaXB0ID09PSAnc3RyaW5nJyB8fCBzY3JpcHQgaW5zdGFuY2VvZiBTdHJpbmcgKSl7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSBkZWZhdWx0IHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoc2NvcGUpO1xuXG4gICAgICAgICAgICAvLyBFeHBvc2UgY3VzdG9tIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHZhciBndWVzdEdsb2JhbCA9IGdldFN0ZGxpYnMoKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgIGd1ZXN0R2xvYmFsW2tdID0gc2NvcGVba107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKGd1ZXN0R2xvYmFsKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHNhbmRib3hlZCBmdW5jdGlvblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkuY29uY2F0KGJhbm5lZC5maWx0ZXIoZnVuY3Rpb24oYil7IHJldHVybiAhIGd1ZXN0R2xvYmFsLmhhc093blByb3BlcnR5KGIpOyB9KSk7XG4gICAgICAgICAgICBhcmdzLnB1c2goJ1widXNlIHN0cmljdFwiO1xcbicgKyBzY3JpcHQpO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uT2JqZWN0ID0gY29uc3RydWN0KEZ1bmN0aW9uLCBhcmdzKTtcblxuICAgICAgICAgICAgdmFyIHNhZmVFdmFsID0gZnVuY3Rpb24ocyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgcywgZ3Vlc3RHbG9iYWwpKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShzYWZlRXZhbCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW52b2tlIHNhbmRib3hlZCBmdW5jdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGV2YWwgd2l0aCBzYWZlIGV2YWwtbGlrZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHZhciBfZXZhbCA9IGV2YWw7XG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5kZWJ1ZyAhPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwgPSBzYWZlRXZhbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN0b3JlIGRlZmF1bHQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbFxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gT2JqZWN0LmtleXMoZ3Vlc3RHbG9iYWwpLm1hcChmdW5jdGlvbihrKXsgcmV0dXJuIGd1ZXN0R2xvYmFsW2tdOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uT2JqZWN0LmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9ZmluYWxseXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IF9ldmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBpbnZva2VTYW5kYm94ZWRGdW5jdGlvbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgIH07XG59KSgpO1xuXG4vL1xuY2hhaW5jaG9tcC5jYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBhcmdzLCBvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcblxuICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgZXZhbCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnl7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gY2hhaW5jaG9tcDtcbiJdfQ==
