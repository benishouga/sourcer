(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
var Field_1 = require('./core/Field');
var Sourcer_1 = require('./core/Sourcer');
var Utils_1 = require('./core/Utils');
function create(field, source) {
    "use strict";
    return new Sourcer_1.default(field, Utils_1.default.rand(320) - 160, Utils_1.default.rand(160) + 80, source.ai, source.name, source.color);
}
onmessage = function (e) {
    var sources = e.data.sources;
    var idToIndex = {};
    var listener = {
        onPreThink: function (sourcerId) {
            postMessage({
                command: "PreThink",
                index: idToIndex[sourcerId]
            });
        },
        onPostThink: function (sourcerId) {
            postMessage({
                command: "PostThink",
                index: idToIndex[sourcerId]
            });
        },
        onFrame: function (field) {
            postMessage({
                command: "Frame",
                field: field
            });
        },
        onFinished: function (result) {
            postMessage({
                command: "Finished",
                result: result
            });
        },
        onEndOfGame: function () {
            postMessage({
                command: "EndOfGame"
            });
        },
        onLog: function (sourcerId) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            console.log("onLog");
            postMessage({
                command: "Log",
                index: idToIndex[sourcerId],
                messages: messages
            });
        }
    };
    var field = new Field_1.default();
    sources.forEach(function (value, index) {
        var sourcer = create(field, value);
        field.addSourcer(sourcer);
        idToIndex[sourcer.id] = index;
    });
    for (var i = 0; i < 2000 && !field.isFinished; i++) {
        field.tick(listener);
    }
};

},{"./core/Field":8,"./core/Sourcer":16,"./core/Utils":19}],3:[function(require,module,exports){
"use strict";
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
        // not think anything.
    };
    ;
    Actor.prototype.action = function () {
        // do nothing
    };
    Actor.prototype.move = function () {
        this.position = this.position.add(this.speed);
    };
    Actor.prototype.onHit = function (shot) {
        // do nothing
    };
    Actor.prototype.dump = function () {
        throw new Error('not implimentation');
    };
    return Actor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Actor;

},{"./Configs":5,"./V":20}],4:[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;

},{}],5:[function(require,module,exports){
"use strict";
var Configs = (function () {
    function Configs() {
    }
    Configs.INITIAL_SHIELD = 100;
    Configs.INITIAL_FUEL = 100;
    Configs.INITIAL_MISSILE_AMMO = 20;
    Configs.LASER_ATTENUATION = 1;
    Configs.LASER_MOMENTUM = 100;
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Configs;

},{}],6:[function(require,module,exports){
"use strict";
var Consts = (function () {
    function Consts() {
    }
    Consts.DIRECTION_RIGHT = 1;
    Consts.DIRECTION_LEFT = -1;
    Consts.VERTICAL_UP = "vertial_up";
    Consts.VERTICAL_DOWN = "vertial_down";
    return Consts;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Consts;
;

},{}],7:[function(require,module,exports){
"use strict";
var Controller = (function () {
    function Controller(actor) {
        var _this = this;
        this.log = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            console.log.apply(console, messages);
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Controller;

},{}],8:[function(require,module,exports){
"use strict";
var Utils_1 = require('./Utils');
var Field = (function () {
    function Field() {
        this.currentId = 0;
        this.isFinished = false;
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
        var index = this.shots.indexOf(target);
        if (0 <= index) {
            this.shots.splice(index, 1);
        }
    };
    Field.prototype.addFx = function (fx) {
        fx.id = "fx" + (this.currentId++);
        this.fxs.push(fx);
    };
    Field.prototype.removeFx = function (target) {
        var index = this.fxs.indexOf(target);
        if (0 <= index) {
            this.fxs.splice(index, 1);
        }
    };
    Field.prototype.tick = function (listener) {
        // To be used in the invisible hand.
        this.center = this.computeCenter();
        // Think phase
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
        // Action phase
        this.sourcers.forEach(function (actor) {
            actor.action();
        });
        this.shots.forEach(function (actor) {
            actor.action();
        });
        this.fxs.forEach(function (fx) {
            fx.action();
        });
        // Move phase
        this.sourcers.forEach(function (actor) {
            actor.move();
        });
        this.shots.forEach(function (actor) {
            actor.move();
        });
        this.fxs.forEach(function (fx) {
            fx.move();
        });
        // Check phase
        this.checkFinish(listener);
        this.checkEndOfGame(listener);
        this.frame++;
        // onFrame
        listener.onFrame(this.dump());
    };
    Field.prototype.checkFinish = function (listener) {
        // 決定済み
        if (this.result) {
            return;
        }
        this.sourcers.forEach(function (sourcer) { sourcer.alive = 0 < sourcer.shield; });
        var survivers = this.sourcers.filter(function (sourcer) { return sourcer.alive; });
        if (1 < survivers.length) {
            return;
        }
        if (survivers.length === 1) {
            var surviver = survivers[0];
            this.result = {
                winner: surviver.dump(),
                frame: this.frame,
                isDraw: false
            };
            listener.onFinished(this.result);
            return;
        }
        // no surviver.. draw...
        this.result = {
            winner: null,
            frame: this.frame,
            isDraw: true
        };
        listener.onFinished(this.result);
    };
    Field.prototype.checkEndOfGame = function (listener) {
        if (this.isFinished) {
            return;
        }
        if (!this.result) {
            return;
        }
        if (this.result.frame < this.frame - 90) {
            this.isFinished = true;
            listener.onEndOfGame();
        }
    };
    Field.prototype.scanEnemy = function (owner, radar) {
        return this.sourcers.some(function (sourcer) {
            return sourcer.alive && sourcer !== owner && radar(sourcer.position);
        });
    };
    Field.prototype.scanAttack = function (owner, radar) {
        var _this = this;
        return this.shots.some(function (shot) {
            return shot.owner !== owner && radar(shot.position) && _this.isIncoming(owner, shot);
        });
    };
    Field.prototype.isIncoming = function (owner, shot) {
        var ownerPosition = owner.position;
        var actorPosition = shot.position;
        var currentDistance = ownerPosition.distance(actorPosition);
        var nextDistance = ownerPosition.distance(actorPosition.add(shot.speed));
        return nextDistance < currentDistance;
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
                if (distance < shot.size + sourcer.size) {
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;

},{"./Utils":19}],9:[function(require,module,exports){
"use strict";
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
            position: this.position.minimize(),
            frame: this.frame,
            length: this.length
        };
    };
    return Fx;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Fx;

},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shot_1 = require('./Shot');
var V_1 = require('./V');
var Configs_1 = require('./Configs');
var Laser = (function (_super) {
    __extends(Laser, _super);
    function Laser(field, owner, direction, power) {
        _super.call(this, field, owner, "Laser");
        this.direction = direction;
        this.temperature = 5;
        this.damage = function () { return 8; };
        this.speed = V_1.default.direction(direction).multiply(power);
        this.momentum = Configs_1.default.LASER_MOMENTUM;
    }
    Laser.prototype.action = function () {
        _super.prototype.action.call(this);
        this.momentum -= Configs_1.default.LASER_ATTENUATION;
        if (this.momentum < 0) {
            this.field.removeShot(this);
        }
    };
    return Laser;
}(Shot_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Laser;

},{"./Configs":5,"./Shot":14,"./V":20}],11:[function(require,module,exports){
"use strict";
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
        this.temperature = 10;
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
}(Shot_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Missile;

},{"./Configs":5,"./Consts":6,"./MissileCommand":12,"./MissileController":13,"./Shot":14}],12:[function(require,module,exports){
"use strict";
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
}(Command_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MissileCommand;

},{"./Command":4,"./Configs":5,"./V":20}],13:[function(require,module,exports){
"use strict";
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
}(Controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MissileController;

},{"./Controller":7,"./Utils":19}],14:[function(require,module,exports){
"use strict";
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
        // do nothing
    };
    Shot.prototype.dump = function () {
        return {
            id: this.id,
            position: this.position.minimize(),
            speed: this.speed.minimize(),
            direction: this.direction,
            type: this.type,
            color: this.owner.color
        };
    };
    return Shot;
}(Actor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Shot;

},{"./Actor":3,"./Fx":9}],15:[function(require,module,exports){
"use strict";
var ShotParam = (function () {
    function ShotParam() {
    }
    return ShotParam;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShotParam;

},{}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chainchomp_1 = require('../../libs/chainchomp');
var Actor_1 = require('./Actor');
var SourcerCommand_1 = require('./SourcerCommand');
var SourcerController_1 = require('./SourcerController');
var Configs_1 = require('./Configs');
var Consts_1 = require('./Consts');
var Utils_1 = require('./Utils');
var V_1 = require('./V');
var Laser_1 = require('./Laser');
var Missile_1 = require('./Missile');
var Fx_1 = require('./Fx');
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
        if (!this.alive && Utils_1.default.rand(8) < 1) {
            var position = this.position.add(Utils_1.default.rand(16) - 8, Utils_1.default.rand(16) - 8);
            var speed = new V_1.default(Utils_1.default.rand(1) - 0.5, Utils_1.default.rand(1) + 0.5);
            var length = Utils_1.default.rand(8) + 4;
            this.field.addFx(new Fx_1.default(this.field, position, speed, length));
        }
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
            var n = diff < 0 ? -1 : 1;
            var invisibleHand = (Math.abs(diff) - Configs_1.default.DISTANCE_BORDAR) * Configs_1.default.DISTANCE_INVISIBLE_HAND * n;
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
        return {
            id: this.id,
            position: this.position.minimize(),
            speed: this.speed.minimize(),
            direction: this.direction,
            shield: Math.round(this.shield),
            temperature: Math.round(this.temperature),
            missileAmmo: this.missileAmmo,
            fuel: Math.round(this.fuel),
            name: this.name,
            color: this.color
        };
    };
    return Sourcer;
}(Actor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sourcer;

},{"../../libs/chainchomp":1,"./Actor":3,"./Configs":5,"./Consts":6,"./Fx":9,"./Laser":10,"./Missile":11,"./SourcerCommand":17,"./SourcerController":18,"./Utils":19,"./V":20}],17:[function(require,module,exports){
"use strict";
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
}(Command_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourcerCommand;

},{"./Command":4,"./Configs":5}],18:[function(require,module,exports){
"use strict";
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
}(Controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourcerController;

},{"./Configs":5,"./Controller":7,"./ShotParam":15,"./Utils":19}],19:[function(require,module,exports){
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

},{"./V":20}],20:[function(require,module,exports){
"use strict";
var V = (function () {
    function V(x, y) {
        this.x = x;
        this.y = y;
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
        if (this.calculatedLength) {
            return this.calculatedLength;
        }
        else {
            this.calculatedLength = Math.sqrt(this.dot());
            return this.calculatedLength;
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
        if (this.calculatedAngle) {
            return this.calculatedAngle;
        }
        else {
            this.calculatedAngle = Math.atan2(-this.y, this.x);
            return this.calculatedAngle;
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
    V.prototype.minimize = function () {
        return { x: Math.round(this.x), y: Math.round(this.y) };
    };
    return V;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = V;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvbGlicy9jaGFpbmNob21wLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0FjdG9yLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25zdHMuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0NvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9GeC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvTGFzZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGVDb21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9NaXNzaWxlQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdFBhcmFtLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL1V0aWxzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9WLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogSW52b2tlIHVudHJ1c3RlZCBndWVzdCBjb2RlIGluIGEgc2FuZGJveC5cbiAqIFRoZSBndWVzdCBjb2RlIGNhbiBhY2Nlc3Mgb2JqZWN0cyBvZiB0aGUgc3RhbmRhcmQgbGlicmFyeSBvZiBFQ01BU2NyaXB0LlxuICpcbiAqIGZ1bmN0aW9uIGNoYWluY2hvbXAoc2NyaXB0OiBzdHJpbmcsIHNjb3BlPzogYW55ID0ge30pOiBhbnk7XG4gKlxuICogdGhpcy5wYXJhbSBzY3JpcHQgZ3Vlc3QgY29kZS5cbiAqIHRoaXMucGFyYW0gc2NvcGUgYW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgd2lsbCBiZSBleHBvc2VkIHRvIHRoZSBndWVzdCBjb2RlLlxuICogdGhpcy5yZXR1cm4gcmVzdWx0IG9mIHRoZSBwcm9jZXNzLlxuICovXG5mdW5jdGlvbiBjaGFpbmNob21wKHNjcmlwdCwgc2NvcGUsIG9wdGlvbnMpe1xuICAgIC8vIEZpcnN0LCB5b3UgbmVlZCB0byBwaWxlIGEgcGlja2V0IHRvIHRpZSBhIENoYWluIENob21wLlxuICAgIC8vIElmIHRoZSBlbnZpcm9ubWVudCBpcyBjaGFuZ2VkLCB0aGUgcGlja2V0IHdpbGwgZHJvcCBvdXQuXG4gICAgLy8gWW91IHNob3VsZCByZW1ha2UgYSBuZXcgcGlja2V0IGVhY2ggdGltZSBhcyBsb25nIGFz44CAeW91IGFyZSBzbyBidXN5LlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIHRoZSBnbG9iYWwgb2JqZWN0IGlzIGNoYW5nZWQsIHlvdSBtdXN0IHJlbWFrZSBhIHBpY2tldC5cbiAgICB2YXIgcGlja2V0ID0gY2hhaW5jaG9tcC5waWNrKCk7XG5cbiAgICAvLyBOZXh0LCBnZXQgbmV3IENoYWluIENob21wIHRpZWQgdGhlIHBpY2tldC5cbiAgICAvLyBEaWZmZXJlbnQgQ2hhaW4gQ2hvbXBzIGhhdmUgZGlmZmVyZW50IGJlaGF2aW9yLlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgeW91IG5lZWQgYSBkaWZmZXJlbnQgZnVuY3Rpb24sIHlvdSBjYW4gZ2V0IGFub3RoZXIgb25lLlxuICAgIHZhciBjaG9tcCA9IHBpY2tldChzY3JpcHQsIHNjb3BlKTtcblxuICAgIC8vIExhc3QsIGZlZWQgdGhlIGNob21wIGFuZCBsZXQgaXQgcmFtcGFnZSFcbiAgICAvLyBBIGNob21wIGVhdHMgbm90aGluZyBidXTjgIBhIGtpbmQgb2YgZmVlZCB0aGF0IHRoZSBjaG9tcCBhdGUgYXQgZmlyc3QuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIG9ubHkgYSB2YWx1ZSBpbiB0aGUgc2NvcGUgb2JqZWN0IGlzIGNoYW5nZWQsIHlvdSBuZWVkIG5vdCB0byByZW1ha2UgdGhlIENoYWluIENob21wIGFuZCB0aGUgcGlja2V0LlxuICAgIHJldHVybiBjaG9tcChvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBjcmVhdGUgc2FuZGJveFxuICovXG5jaGFpbmNob21wLnBpY2sgPSAoZnVuY3Rpb24oKXtcbiAgICAvLyBEeW5hbWljIGluc3RhbnRpYXRpb24gaWRpb21cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MDY3OTcvdXNlLW9mLWFwcGx5LXdpdGgtbmV3LW9wZXJhdG9yLWlzLXRoaXMtcG9zc2libGVcbiAgICBmdW5jdGlvbiBjb25zdHJ1Y3QoY29uc3RydWN0b3IsIGFyZ3MpIHtcbiAgICAgICAgZnVuY3Rpb24gRigpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBGLnByb3RvdHlwZSA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmFubmVkVmFycygpe1xuICAgICAgICAvLyBjb3JyZWN0IGJhbm5lZCBvYmplY3QgbmFtZXMuXG4gICAgICAgIHZhciBiYW5uZWQgPSBbJ19fcHJvdG9fXycsICdwcm90b3R5cGUnXTtcbiAgICAgICAgZnVuY3Rpb24gYmFuKGspe1xuICAgICAgICAgICAgaWYoayAmJiBiYW5uZWQuaW5kZXhPZihrKSA8IDAgJiYgayAhPT0gJ2V2YWwnICYmIGsubWF0Y2goL15bXyRhLXpBLVpdW18kYS16QS1aMC05XSokLykpe1xuICAgICAgICAgICAgICAgIGJhbm5lZC5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnbG9iYWwpLmZvckVhY2goYmFuKTtcbiAgICAgICAgZm9yKHZhciBrIGluIGdsb2JhbCl7XG4gICAgICAgICAgICBiYW4oayk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBiYW4gYWxsIGlkcyBvZiB0aGUgZWxlbWVudHNcbiAgICAgICAgZnVuY3Rpb24gdHJhdmVyc2UoZWxlbSl7XG4gICAgICAgICAgICBiYW4oZWxlbS5nZXRBdHRyaWJ1dGUgJiYgZWxlbS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IGVsZW0uY2hpbGROb2RlcztcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjaGlsZHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHRyYXZlcnNlKGNoaWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBzdGFydCAqKioqXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0cmF2ZXJzZShkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgZW5kICoqKipcblxuICAgICAgICByZXR1cm4gYmFubmVkO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIG9mIGV4cG9zZWQgb2JqZWN0c1xuICAgIGZ1bmN0aW9uIGdldFN0ZGxpYnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdPYmplY3QnICAgICAgICAgICAgOiBPYmplY3QsXG4gICAgICAgICAgICAnU3RyaW5nJyAgICAgICAgICAgIDogU3RyaW5nLFxuICAgICAgICAgICAgJ051bWJlcicgICAgICAgICAgICA6IE51bWJlcixcbiAgICAgICAgICAgICdCb29sZWFuJyAgICAgICAgICAgOiBCb29sZWFuLFxuICAgICAgICAgICAgJ0FycmF5JyAgICAgICAgICAgICA6IEFycmF5LFxuICAgICAgICAgICAgJ0RhdGUnICAgICAgICAgICAgICA6IERhdGUsXG4gICAgICAgICAgICAnTWF0aCcgICAgICAgICAgICAgIDogTWF0aCxcbiAgICAgICAgICAgICdSZWdFeHAnICAgICAgICAgICAgOiBSZWdFeHAsXG4gICAgICAgICAgICAnRXJyb3InICAgICAgICAgICAgIDogRXJyb3IsXG4gICAgICAgICAgICAnRXZhbEVycm9yJyAgICAgICAgIDogRXZhbEVycm9yLFxuICAgICAgICAgICAgJ1JhbmdlRXJyb3InICAgICAgICA6IFJhbmdlRXJyb3IsXG4gICAgICAgICAgICAnUmVmZXJlbmNlRXJyb3InICAgIDogUmVmZXJlbmNlRXJyb3IsXG4gICAgICAgICAgICAnU3ludGF4RXJyb3InICAgICAgIDogU3ludGF4RXJyb3IsXG4gICAgICAgICAgICAnVHlwZUVycm9yJyAgICAgICAgIDogVHlwZUVycm9yLFxuICAgICAgICAgICAgJ1VSSUVycm9yJyAgICAgICAgICA6IFVSSUVycm9yLFxuICAgICAgICAgICAgJ0pTT04nICAgICAgICAgICAgICA6IEpTT04sXG4gICAgICAgICAgICAnTmFOJyAgICAgICAgICAgICAgIDogTmFOLFxuICAgICAgICAgICAgJ0luZmluaXR5JyAgICAgICAgICA6IEluZmluaXR5LFxuICAgICAgICAgICAgJ3VuZGVmaW5lZCcgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwYXJzZUludCcgICAgICAgICAgOiBwYXJzZUludCxcbiAgICAgICAgICAgICdwYXJzZUZsb2F0JyAgICAgICAgOiBwYXJzZUZsb2F0LFxuICAgICAgICAgICAgJ2lzTmFOJyAgICAgICAgICAgICA6IGlzTmFOLFxuICAgICAgICAgICAgJ2lzRmluaXRlJyAgICAgICAgICA6IGlzRmluaXRlLFxuICAgICAgICAgICAgJ2RlY29kZVVSSScgICAgICAgICA6IGRlY29kZVVSSSxcbiAgICAgICAgICAgICdkZWNvZGVVUklDb21wb25lbnQnOiBkZWNvZGVVUklDb21wb25lbnQsXG4gICAgICAgICAgICAnZW5jb2RlVVJJJyAgICAgICAgIDogZW5jb2RlVVJJLFxuICAgICAgICAgICAgJ2VuY29kZVVSSUNvbXBvbmVudCc6IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBpc0ZyZWV6ZWRTdGRMaWJPYmpzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgc2FuZGJveC5cbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNGcmVlemVkU3RkTGliT2JqcyA9PSBmYWxzZSl7XG4gICAgICAgICAgICB2YXIgc3RkbGlicyA9IGdldFN0ZGxpYnMoKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZnJlZXplKHYpe1xuICAgICAgICAgICAgICAgIGlmKHYgJiYgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykgJiYgISBPYmplY3QuaXNGcm96ZW4odikpe1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKHYpO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2KS5mb3JFYWNoKGZ1bmN0aW9uKGssIGkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdltrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3Rpb25nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmVlemUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmVlemUoc3RkbGlicyk7XG5cbiAgICAgICAgICAgIC8vIGZyZWV6ZSBGdW5jdGlvbi5wcm90b3R5cGVcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwge1xuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBY2Nlc3MgdG8gXCJGdW5jdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3JcIiBpcyBub3QgYWxsb3dlZC4nKSB9LFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oKXsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBY2Nlc3MgdG8gXCJGdW5jdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3JcIiBpcyBub3QgYWxsb3dlZC4nKSB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyZWV6ZShGdW5jdGlvbik7XG5cbiAgICAgICAgICAgIGlzRnJlZXplZFN0ZExpYk9ianMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJhbm5lZCA9IGdldEJhbm5lZFZhcnMoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogY3JlYXRlIHNhbmRib3hlZCBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbiA9IGZ1bmN0aW9uKHNjcmlwdCwgc2NvcGUpe1xuICAgICAgICAgICAgLy8gdmFsaWRhdGUgYXJndW1lbnRzXG4gICAgICAgICAgICBpZiggISAodHlwZW9mIHNjcmlwdCA9PT0gJ3N0cmluZycgfHwgc2NyaXB0IGluc3RhbmNlb2YgU3RyaW5nICkpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcmUgZGVmYXVsdCB2YWx1ZXMgb2YgdGhlIHBhcmFtZXRlclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKHNjb3BlKTtcblxuICAgICAgICAgICAgLy8gRXhwb3NlIGN1c3RvbSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YXIgZ3Vlc3RHbG9iYWwgPSBnZXRTdGRsaWJzKCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzY29wZSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICBndWVzdEdsb2JhbFtrXSA9IHNjb3BlW2tdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBPYmplY3Quc2VhbChndWVzdEdsb2JhbCk7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzYW5kYm94ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgIHZhciBhcmdzID0gT2JqZWN0LmtleXMoZ3Vlc3RHbG9iYWwpLmNvbmNhdChiYW5uZWQuZmlsdGVyKGZ1bmN0aW9uKGIpeyByZXR1cm4gISBndWVzdEdsb2JhbC5oYXNPd25Qcm9wZXJ0eShiKTsgfSkpO1xuICAgICAgICAgICAgYXJncy5wdXNoKCdcInVzZSBzdHJpY3RcIjtcXG4nICsgc2NyaXB0KTtcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk9iamVjdCA9IGNvbnN0cnVjdChGdW5jdGlvbiwgYXJncyk7XG5cbiAgICAgICAgICAgIHZhciBzYWZlRXZhbCA9IGZ1bmN0aW9uKHMpe1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbihcInJldHVybiBcIiArIHMsIGd1ZXN0R2xvYmFsKSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUoc2FmZUV2YWwpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEludm9rZSBzYW5kYm94ZWQgZnVuY3Rpb24uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBpbnZva2VTYW5kYm94ZWRGdW5jdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBldmFsIHdpdGggc2FmZSBldmFsLWxpa2UgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB2YXIgX2V2YWwgPSBldmFsO1xuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuZGVidWcgIT09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICBldmFsID0gc2FmZUV2YWw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIHNhbmRib3hlZCBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzdG9yZSBkZWZhdWx0IHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzY29wZSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1ZXN0R2xvYmFsW2tdID0gc2NvcGVba107XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKGd1ZXN0R2xvYmFsKS5tYXAoZnVuY3Rpb24oayl7IHJldHVybiBndWVzdEdsb2JhbFtrXTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk9iamVjdC5hcHBseSh1bmRlZmluZWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfWZpbmFsbHl7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwgPSBfZXZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gaW52b2tlU2FuZGJveGVkRnVuY3Rpb247XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjcmVhdGVTYW5kYm94ZWRGdW5jdGlvbjtcbiAgICB9O1xufSkoKTtcblxuLy9cbmNoYWluY2hvbXAuY2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaywgYXJncywgb3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgYXJncyA9IGFyZ3MgfHwgW107XG5cbiAgICAvLyByZXBsYWNlIGV2YWwgd2l0aCBzYWZlIGV2YWwtbGlrZSBmdW5jdGlvblxuICAgIHZhciBfZXZhbCA9IGV2YWw7XG4gICAgaWYob3B0aW9ucy5kZWJ1ZyAhPT0gdHJ1ZSl7XG4gICAgICAgIGV2YWwgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5e1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9ZmluYWxseXtcbiAgICAgICAgZXZhbCA9IF9ldmFsO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGNoYWluY2hvbXA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBGaWVsZF8xID0gcmVxdWlyZSgnLi9jb3JlL0ZpZWxkJyk7XG52YXIgU291cmNlcl8xID0gcmVxdWlyZSgnLi9jb3JlL1NvdXJjZXInKTtcbnZhciBVdGlsc18xID0gcmVxdWlyZSgnLi9jb3JlL1V0aWxzJyk7XG5mdW5jdGlvbiBjcmVhdGUoZmllbGQsIHNvdXJjZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiBuZXcgU291cmNlcl8xLmRlZmF1bHQoZmllbGQsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDMyMCkgLSAxNjAsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2MCkgKyA4MCwgc291cmNlLmFpLCBzb3VyY2UubmFtZSwgc291cmNlLmNvbG9yKTtcbn1cbm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNvdXJjZXMgPSBlLmRhdGEuc291cmNlcztcbiAgICB2YXIgaWRUb0luZGV4ID0ge307XG4gICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgICBvblByZVRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQcmVUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpZFRvSW5kZXhbc291cmNlcklkXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdFRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQb3N0VGhpbmtcIixcbiAgICAgICAgICAgICAgICBpbmRleDogaWRUb0luZGV4W3NvdXJjZXJJZF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkZyYW1lOiBmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIkZyYW1lXCIsXG4gICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiRmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRW5kT2ZHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJFbmRPZkdhbWVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9nOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uTG9nXCIpO1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiTG9nXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGlkVG9JbmRleFtzb3VyY2VySWRdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBmaWVsZCA9IG5ldyBGaWVsZF8xLmRlZmF1bHQoKTtcbiAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIgc291cmNlciA9IGNyZWF0ZShmaWVsZCwgdmFsdWUpO1xuICAgICAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIpO1xuICAgICAgICBpZFRvSW5kZXhbc291cmNlci5pZF0gPSBpbmRleDtcbiAgICB9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIwMDAgJiYgIWZpZWxkLmlzRmluaXNoZWQ7IGkrKykge1xuICAgICAgICBmaWVsZC50aWNrKGxpc3RlbmVyKTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgQWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFjdG9yKGZpZWxkLCB4LCB5KSB7XG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5zaXplID0gQ29uZmlnc18xLmRlZmF1bHQuQ09MTElTSU9OX1NJWkU7XG4gICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVl8xLmRlZmF1bHQoeCwgeSk7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfVxuICAgIEFjdG9yLnByb3RvdHlwZS50aGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMud2FpdCA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5vblRoaW5rKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhaXQtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG5vdCB0aGluayBhbnl0aGluZy5cbiAgICB9O1xuICAgIDtcbiAgICBBY3Rvci5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxpbWVudGF0aW9uJyk7XG4gICAgfTtcbiAgICByZXR1cm4gQWN0b3I7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQWN0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb21tYW5kID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb21tYW5kKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgQ29tbWFuZC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbW1hbmQuIFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29tbWFuZC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSB0cnVlO1xuICAgIH07XG4gICAgQ29tbWFuZC5wcm90b3R5cGUudW5hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIENvbW1hbmQ7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29tbWFuZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvbmZpZ3MgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbmZpZ3MoKSB7XG4gICAgfVxuICAgIENvbmZpZ3MuSU5JVElBTF9TSElFTEQgPSAxMDA7XG4gICAgQ29uZmlncy5JTklUSUFMX0ZVRUwgPSAxMDA7XG4gICAgQ29uZmlncy5JTklUSUFMX01JU1NJTEVfQU1NTyA9IDIwO1xuICAgIENvbmZpZ3MuTEFTRVJfQVRURU5VQVRJT04gPSAxO1xuICAgIENvbmZpZ3MuTEFTRVJfTU9NRU5UVU0gPSAxMDA7XG4gICAgQ29uZmlncy5GVUVMX0NPU1QgPSAwLjI0O1xuICAgIENvbmZpZ3MuQ09MTElTSU9OX1NJWkUgPSA0O1xuICAgIENvbmZpZ3MuU0NBTl9XQUlUID0gMC4zNTtcbiAgICBDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UgPSAwLjk2O1xuICAgIENvbmZpZ3MuR1JBVklUWSA9IDAuMTtcbiAgICBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0JPUkRBUiA9IDQwMDtcbiAgICBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9CT1JERVIgPSAxMDA7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XG4gICAgQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XG4gICAgQ29uZmlncy5HUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcbiAgICBDb25maWdzLkNPT0xfRE9XTiA9IDAuNTtcbiAgICBDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xuICAgIHJldHVybiBDb25maWdzO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbmZpZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb25zdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnN0cygpIHtcbiAgICB9XG4gICAgQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA9IDE7XG4gICAgQ29uc3RzLkRJUkVDVElPTl9MRUZUID0gLTE7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX1VQID0gXCJ2ZXJ0aWFsX3VwXCI7XG4gICAgQ29uc3RzLlZFUlRJQ0FMX0RPV04gPSBcInZlcnRpYWxfZG93blwiO1xuICAgIHJldHVybiBDb25zdHM7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29uc3RzO1xuO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcihhY3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1tfaSAtIDBdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIG1lc3NhZ2VzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maWVsZCA9IGFjdG9yLmZpZWxkO1xuICAgICAgICB0aGlzLmZyYW1lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuZmllbGQuZnJhbWU7IH07XG4gICAgICAgIHRoaXMuYWx0aXR1ZGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBhY3Rvci5wb3NpdGlvbi55OyB9O1xuICAgICAgICB0aGlzLndhaXQgPSBmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICAgICAgICAgIGlmICgwIDwgZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ29udHJvbGxlcjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBGaWVsZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRmllbGQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkID0gMDtcbiAgICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzID0gW107XG4gICAgICAgIHRoaXMuc2hvdHMgPSBbXTtcbiAgICAgICAgdGhpcy5meHMgPSBbXTtcbiAgICB9XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNvdXJjZXIgPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLmlkID0gXCJzb3VyY2VyXCIgKyAodGhpcy5jdXJyZW50SWQrKyk7XG4gICAgICAgIHRoaXMuc291cmNlcnMucHVzaChzb3VyY2VyKTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5hZGRTaG90ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgc2hvdC5pZCA9IFwic2hvdFwiICsgKHRoaXMuY3VycmVudElkKyspO1xuICAgICAgICB0aGlzLnNob3RzLnB1c2goc2hvdCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlU2hvdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zaG90cy5pbmRleE9mKHRhcmdldCk7XG4gICAgICAgIGlmICgwIDw9IGluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLnNob3RzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5hZGRGeCA9IGZ1bmN0aW9uIChmeCkge1xuICAgICAgICBmeC5pZCA9IFwiZnhcIiArICh0aGlzLmN1cnJlbnRJZCsrKTtcbiAgICAgICAgdGhpcy5meHMucHVzaChmeCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlRnggPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZnhzLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgICAgaWYgKDAgPD0gaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuZnhzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIC8vIFRvIGJlIHVzZWQgaW4gdGhlIGludmlzaWJsZSBoYW5kLlxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xuICAgICAgICAvLyBUaGluayBwaGFzZVxuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XG4gICAgICAgICAgICBzb3VyY2VyLnRoaW5rKCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzaG90Lm93bmVyLmlkKTtcbiAgICAgICAgICAgIHNob3QudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQWN0aW9uIHBoYXNlXG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IuYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZ4cy5mb3JFYWNoKGZ1bmN0aW9uIChmeCkge1xuICAgICAgICAgICAgZnguYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBNb3ZlIHBoYXNlXG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDaGVjayBwaGFzZVxuICAgICAgICB0aGlzLmNoZWNrRmluaXNoKGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5jaGVja0VuZE9mR2FtZShsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgLy8gb25GcmFtZVxuICAgICAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0ZpbmlzaCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICAvLyDmsbrlrprmuIjjgb9cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7IHNvdXJjZXIuYWxpdmUgPSAwIDwgc291cmNlci5zaGllbGQ7IH0pO1xuICAgICAgICB2YXIgc3Vydml2ZXJzID0gdGhpcy5zb3VyY2Vycy5maWx0ZXIoZnVuY3Rpb24gKHNvdXJjZXIpIHsgcmV0dXJuIHNvdXJjZXIuYWxpdmU7IH0pO1xuICAgICAgICBpZiAoMSA8IHN1cnZpdmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3Vydml2ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdmFyIHN1cnZpdmVyID0gc3Vydml2ZXJzWzBdO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgd2lubmVyOiBzdXJ2aXZlci5kdW1wKCksXG4gICAgICAgICAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXG4gICAgICAgICAgICAgICAgaXNEcmF3OiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vIHN1cnZpdmVyLi4gZHJhdy4uLlxuICAgICAgICB0aGlzLnJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpbm5lcjogbnVsbCxcbiAgICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgaXNEcmF3OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrRW5kT2ZHYW1lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRmluaXNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0LmZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGlzdGVuZXIub25FbmRPZkdhbWUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlcnMuc29tZShmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gb3duZXIgJiYgcmFkYXIoc291cmNlci5wb3NpdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAob3duZXIsIHJhZGFyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLnNob3RzLnNvbWUoZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgICAgIHJldHVybiBzaG90Lm93bmVyICE9PSBvd25lciAmJiByYWRhcihzaG90LnBvc2l0aW9uKSAmJiBfdGhpcy5pc0luY29taW5nKG93bmVyLCBzaG90KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuaXNJbmNvbWluZyA9IGZ1bmN0aW9uIChvd25lciwgc2hvdCkge1xuICAgICAgICB2YXIgb3duZXJQb3NpdGlvbiA9IG93bmVyLnBvc2l0aW9uO1xuICAgICAgICB2YXIgYWN0b3JQb3NpdGlvbiA9IHNob3QucG9zaXRpb247XG4gICAgICAgIHZhciBjdXJyZW50RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24pO1xuICAgICAgICB2YXIgbmV4dERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uLmFkZChzaG90LnNwZWVkKSk7XG4gICAgICAgIHJldHVybiBuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2U7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tDb2xsaXNpb24gPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICB2YXIgZiA9IHNob3QucG9zaXRpb247XG4gICAgICAgIHZhciB0ID0gc2hvdC5wb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdG9yID0gdGhpcy5zaG90c1tpXTtcbiAgICAgICAgICAgIGlmIChhY3Rvci5icmVha2FibGUgJiYgYWN0b3Iub3duZXIgIT09IHNob3Qub3duZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBVdGlsc18xLmRlZmF1bHQuY2FsY0Rpc3RhbmNlKGYsIHQsIGFjdG9yLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlciA9IHRoaXMuc291cmNlcnNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBzaG90Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gVXRpbHNfMS5kZWZhdWx0LmNhbGNEaXN0YW5jZShmLCB0LCBzb3VyY2VyLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBzaG90LnNpemUgKyBzb3VyY2VyLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNvbXB1dGVDZW50ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIHZhciBzdW1YID0gMDtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHN1bVggKz0gc291cmNlci5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2Vyc0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIHNob3RzRHVtcCA9IFtdO1xuICAgICAgICB2YXIgZnhEdW1wID0gW107XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIHNvdXJjZXJzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzaG90c0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXG4gICAgICAgICAgICBzb3VyY2Vyczogc291cmNlcnNEdW1wLFxuICAgICAgICAgICAgc2hvdHM6IHNob3RzRHVtcCxcbiAgICAgICAgICAgIGZ4czogZnhEdW1wXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gRmllbGQ7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRmllbGQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBGeCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRngoZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICB9XG4gICAgRngucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gdGhpcy5mcmFtZSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRngucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXG4gICAgICAgICAgICBsZW5ndGg6IHRoaXMubGVuZ3RoXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gRng7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRng7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFNob3RfMSA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIExhc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGFzZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGFzZXIoZmllbGQsIG93bmVyLCBkaXJlY3Rpb24sIHBvd2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lciwgXCJMYXNlclwiKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDg7IH07XG4gICAgICAgIHRoaXMuc3BlZWQgPSBWXzEuZGVmYXVsdC5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XG4gICAgICAgIHRoaXMubW9tZW50dW0gPSBDb25maWdzXzEuZGVmYXVsdC5MQVNFUl9NT01FTlRVTTtcbiAgICB9XG4gICAgTGFzZXIucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5hY3Rpb24uY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5tb21lbnR1bSAtPSBDb25maWdzXzEuZGVmYXVsdC5MQVNFUl9BVFRFTlVBVElPTjtcbiAgICAgICAgaWYgKHRoaXMubW9tZW50dW0gPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBMYXNlcjtcbn0oU2hvdF8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IExhc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBTaG90XzEgPSByZXF1aXJlKCcuL1Nob3QnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBNaXNzaWxlQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9NaXNzaWxlQ29tbWFuZCcpO1xudmFyIE1pc3NpbGVDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL01pc3NpbGVDb250cm9sbGVyJyk7XG52YXIgQ29uc3RzXzEgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIE1pc3NpbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGUoZmllbGQsIG93bmVyLCBhaSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTWlzc2lsZVwiKTtcbiAgICAgICAgdGhpcy5haSA9IGFpO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMTA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMTAgKyBfdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IDEwMDtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFpID0gYWk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBNaXNzaWxlQ29udHJvbGxlcl8xLmRlZmF1bHQodGhpcyk7XG4gICAgfVxuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5haSh0aGlzLmNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0LlNQRUVEX1JFU0lTVEFOQ0UpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKGF0dGFjaykge1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChhdHRhY2spO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlO1xufShTaG90XzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTWlzc2lsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTWlzc2lsZUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlQ29tbWFuZChtaXNzaWxlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLm1pc3NpbGUgPSBtaXNzaWxlO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIE1pc3NpbGVDb21tYW5kLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGVlZFVwID0gMDtcbiAgICAgICAgdGhpcy5zcGVlZERvd24gPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSAwO1xuICAgIH07XG4gICAgTWlzc2lsZUNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgwIDwgdGhpcy5taXNzaWxlLmZ1ZWwpIHtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5kaXJlY3Rpb24gKz0gdGhpcy50dXJuO1xuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBWXzEuZGVmYXVsdC5kaXJlY3Rpb24odGhpcy5taXNzaWxlLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQubXVsdGlwbHkoMSAtIHRoaXMuc3BlZWREb3duKTtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5mdWVsIC09ICh0aGlzLnNwZWVkVXAgKyB0aGlzLnNwZWVkRG93biAqIDMpICogQ29uZmlnc18xLmRlZmF1bHQuRlVFTF9DT1NUO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLm1pc3NpbGUuZnVlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNaXNzaWxlQ29tbWFuZDtcbn0oQ29tbWFuZF8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1pc3NpbGVDb21tYW5kO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL0NvbnRyb2xsZXInKTtcbnZhciBVdGlsc18xID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIE1pc3NpbGVDb250cm9sbGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZUNvbnRyb2xsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZUNvbnRyb2xsZXIobWlzc2lsZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBtaXNzaWxlKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmRpcmVjdGlvbjsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gbWlzc2lsZS5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBtaXNzaWxlLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1pc3NpbGUuZnVlbDsgfTtcbiAgICAgICAgdGhpcy5zY2FuRW5lbXkgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlsc18xLmRlZmF1bHQuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIG1pc3NpbGUuZmllbGQuc2NhbkVuZW15KG1pc3NpbGUub3duZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGVlZFVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuc3BlZWREb3duID0gMC4xO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5SaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IC05O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnR1cm5MZWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gOTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIE1pc3NpbGVDb250cm9sbGVyO1xufShDb250cm9sbGVyXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTWlzc2lsZUNvbnRyb2xsZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIEFjdG9yXzEgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgRnhfMSA9IHJlcXVpcmUoJy4vRngnKTtcbnZhciBTaG90ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2hvdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaG90KGZpZWxkLCBvd25lciwgdHlwZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIucG9zaXRpb24ueCwgb3duZXIucG9zaXRpb24ueSk7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfTtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgU2hvdC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uQWN0aW9uKCk7XG4gICAgICAgIHZhciBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XG4gICAgICAgIGlmIChjb2xsaWRlZCkge1xuICAgICAgICAgICAgY29sbGlkZWQub25IaXQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeF8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMiksIDgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4XzEuZGVmYXVsdCh0aGlzLmZpZWxkLCB0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKSwgOCkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5yZWFjdGlvbiA9IGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLm9uQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgc3BlZWQ6IHRoaXMuc3BlZWQubWluaW1pemUoKSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5vd25lci5jb2xvclxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIFNob3Q7XG59KEFjdG9yXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2hvdDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFNob3RQYXJhbSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2hvdFBhcmFtKCkge1xuICAgIH1cbiAgICByZXR1cm4gU2hvdFBhcmFtO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNob3RQYXJhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgY2hhaW5jaG9tcF8xID0gcmVxdWlyZSgnLi4vLi4vbGlicy9jaGFpbmNob21wJyk7XG52YXIgQWN0b3JfMSA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBTb3VyY2VyQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Tb3VyY2VyQ29tbWFuZCcpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL1NvdXJjZXJDb250cm9sbGVyJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgQ29uc3RzXzEgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgTGFzZXJfMSA9IHJlcXVpcmUoJy4vTGFzZXInKTtcbnZhciBNaXNzaWxlXzEgPSByZXF1aXJlKCcuL01pc3NpbGUnKTtcbnZhciBGeF8xID0gcmVxdWlyZSgnLi9GeCcpO1xudmFyIFNvdXJjZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXIoZmllbGQsIHgsIHksIGFpLCBuYW1lLCBjb2xvcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgeCwgeSk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfU0hJRUxEO1xuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vID0gQ29uZmlnc18xLmRlZmF1bHQuSU5JVElBTF9NSVNTSUxFX0FNTU87XG4gICAgICAgIHRoaXMuZnVlbCA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfRlVFTDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHtcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0czogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFpID0gY2hhaW5jaG9tcF8xLmRlZmF1bHQoYWksIHNjb3BlKSB8fCBzY29wZS5tb2R1bGUgJiYgc2NvcGUubW9kdWxlLmV4cG9ydHM7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmFpID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5haSA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5hbGl2ZSAmJiBVdGlsc18xLmRlZmF1bHQucmFuZCg4KSA8IDEpIHtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgpO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KFV0aWxzXzEuZGVmYXVsdC5yYW5kKDEpIC0gMC41LCBVdGlsc18xLmRlZmF1bHQucmFuZCgxKSArIDAuNSk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gVXRpbHNfMS5kZWZhdWx0LnJhbmQoOCkgKyA0O1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRnhfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWlyIHJlc2lzdGFuY2VcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIC8vIGdyYXZpdHlcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlnc18xLmRlZmF1bHQuR1JBVklUWSk7XG4gICAgICAgIC8vIGNvbnRyb2wgYWx0aXR1ZGUgYnkgdGhlIGludmlzaWJsZSBoYW5kXG4gICAgICAgIGlmIChDb25maWdzXzEuZGVmYXVsdC5UT1BfSU5WSVNJQkxFX0hBTkQgPCB0aGlzLnBvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgIHZhciBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzXzEuZGVmYXVsdC5UT1BfSU5WSVNJQkxFX0hBTkQpICogMC4xO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlnc18xLmRlZmF1bHQuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb250cm9sIGRpc3RhbmNlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxuICAgICAgICB2YXIgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xuICAgICAgICBpZiAoQ29uZmlnc18xLmRlZmF1bHQuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcbiAgICAgICAgICAgIHZhciBuID0gZGlmZiA8IDAgPyAtMSA6IDE7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlSGFuZCA9IChNYXRoLmFicyhkaWZmKSAtIENvbmZpZ3NfMS5kZWZhdWx0LkRJU1RBTkNFX0JPUkRBUikgKiBDb25maWdzXzEuZGVmYXVsdC5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCAqIG47XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCArIGludmlzaWJsZUhhbmQsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ28gaW50byB0aGUgZ3JvdW5kXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3NfMS5kZWZhdWx0LkdST1VORF9EQU1BR0VfU0NBTEUpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIDApO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnNwZWVkLngsIDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlnc18xLmRlZmF1bHQuQ09PTF9ET1dOO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XG4gICAgICAgIC8vIG92ZXJoZWF0XG4gICAgICAgIHZhciBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfQk9SREVSKTtcbiAgICAgICAgaWYgKDAgPCBvdmVyaGVhdCkge1xuICAgICAgICAgICAgdmFyIGxpbmVhckRhbWFnZSA9IG92ZXJoZWF0ICogQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XG4gICAgICAgICAgICB2YXIgcG93ZXJEYW1hZ2UgPSBNYXRoLnBvdyhvdmVyaGVhdCAqIENvbmZpZ3NfMS5kZWZhdWx0Lk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gXCJMYXNlclwiKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdmFyIHNob3QgPSBuZXcgTGFzZXJfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHRoaXMsIGRpcmVjdGlvbiwgcGFyYW0ucG93ZXIpO1xuICAgICAgICAgICAgc2hvdC5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGVBbW1vKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pc3NpbGUgPSBuZXcgTWlzc2lsZV8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYWkpO1xuICAgICAgICAgICAgICAgIG1pc3NpbGUucmVhY3Rpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChtaXNzaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gQ29uc3RzXzEuZGVmYXVsdC5ESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWxzXzEuZGVmYXVsdC50b09wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLmFkZChzaG90LnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0Lk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XG4gICAgICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgc3BlZWQ6IHRoaXMuc3BlZWQubWluaW1pemUoKSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXG4gICAgICAgICAgICBzaGllbGQ6IE1hdGgucm91bmQodGhpcy5zaGllbGQpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IE1hdGgucm91bmQodGhpcy50ZW1wZXJhdHVyZSksXG4gICAgICAgICAgICBtaXNzaWxlQW1tbzogdGhpcy5taXNzaWxlQW1tbyxcbiAgICAgICAgICAgIGZ1ZWw6IE1hdGgucm91bmQodGhpcy5mdWVsKSxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlcjtcbn0oQWN0b3JfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBTb3VyY2VyQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJDb21tYW5kKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuc291cmNlciA9IHNvdXJjZXI7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFoZWFkID0gMDtcbiAgICAgICAgdGhpcy5hc2NlbnQgPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maXJlID0gbnVsbDtcbiAgICB9O1xuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5maXJlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZmlyZSh0aGlzLmZpcmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnR1cm4pIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgPCB0aGlzLnNvdXJjZXIuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgLT0gKE1hdGguYWJzKHRoaXMuYWhlYWQpICsgTWF0aC5hYnModGhpcy5hc2NlbnQpKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlckNvbW1hbmQ7XG59KENvbW1hbmRfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29tbWFuZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTaG90UGFyYW1fMSA9IHJlcXVpcmUoJy4vU2hvdFBhcmFtJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29udHJvbGxlcihzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZXIpO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuc2hpZWxkOyB9O1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci50ZW1wZXJhdHVyZTsgfTtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIubWlzc2lsZUFtbW87IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuZnVlbDsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gc291cmNlci5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBzb3VyY2VyLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlnc18xLmRlZmF1bHQuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuRW5lbXkoc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzXzEuZGVmYXVsdC5TQ0FOX1dBSVQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlsc18xLmRlZmF1bHQuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnNjYW5BdHRhY2soc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFoZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5iYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IC0wLjQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNjZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5hc2NlbnQgPSAwLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTGFzZXIgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgcG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUgPSBuZXcgU2hvdFBhcmFtXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnBvd2VyID0gcG93ZXI7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ0xhc2VyJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTWlzc2lsZSA9IGZ1bmN0aW9uIChhaSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbV8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5haSA9IGFpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ01pc3NpbGUnO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gU291cmNlckNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXJfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29udHJvbGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIEVQU0lMT04gPSAxMGUtMTI7XG52YXIgVXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFV0aWxzKCkge1xuICAgIH1cbiAgICBVdGlscy5jcmVhdGVSYWRhciA9IGZ1bmN0aW9uIChjLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICB2YXIgY2hlY2tEaXN0YW5jZSA9IGZ1bmN0aW9uICh0KSB7IHJldHVybiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlOyB9O1xuICAgICAgICBpZiAoMzYwIDw9IGFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xuICAgICAgICB2YXIgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcbiAgICAgICAgaWYgKGFuZ2xlIDwgMTgwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGNoZWNrTGVmdCh0KSAmJiBjaGVja1JpZ2h0KHQpICYmIGNoZWNrRGlzdGFuY2UodCk7IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuc2lkZSA9IGZ1bmN0aW9uIChiYXNlLCBkZWdyZWUpIHtcbiAgICAgICAgdmFyIHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBuZXcgVl8xLmRlZmF1bHQoTWF0aC5jb3MocmFkaWFuKSwgTWF0aC5zaW4ocmFkaWFuKSk7XG4gICAgICAgIHZhciBwcmV2aW91c2x5ID0gYmFzZS54ICogZGlyZWN0aW9uLnkgLSBiYXNlLnkgKiBkaXJlY3Rpb24ueCAtIEVQU0lMT047XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gMCA8PSB0YXJnZXQueCAqIGRpcmVjdGlvbi55IC0gdGFyZ2V0LnkgKiBkaXJlY3Rpb24ueCAtIHByZXZpb3VzbHk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBVdGlscy5jYWxjRGlzdGFuY2UgPSBmdW5jdGlvbiAoZiwgdCwgcCkge1xuICAgICAgICB2YXIgdG9Gcm9tID0gdC5zdWJ0cmFjdChmKTtcbiAgICAgICAgdmFyIHBGcm9tID0gcC5zdWJ0cmFjdChmKTtcbiAgICAgICAgaWYgKHRvRnJvbS5kb3QocEZyb20pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBGcm9tLmxlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xuICAgICAgICB2YXIgcFRvID0gcC5zdWJ0cmFjdCh0KTtcbiAgICAgICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xuICAgIH07XG4gICAgVXRpbHMudG9SYWRpYW4gPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgfTtcbiAgICBVdGlscy50b09wcG9zaXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICBkZWdyZWUgPSBkZWdyZWUgJSAzNjA7XG4gICAgICAgIGlmIChkZWdyZWUgPCAwKSB7XG4gICAgICAgICAgICBkZWdyZWUgPSBkZWdyZWUgKyAzNjA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZ3JlZSA8PSAxODApIHtcbiAgICAgICAgICAgIHJldHVybiAoOTAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoMjcwIC0gZGVncmVlKSAqIDIgKyBkZWdyZWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnJhbmQgPSBmdW5jdGlvbiAocmVuZ2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiByZW5nZTtcbiAgICB9O1xuICAgIHJldHVybiBVdGlscztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBVdGlscztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFYgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFYoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgdiwgdGhpcy55ICsgeSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHYsIHkpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtIHYsIHRoaXMueSAtIHkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LCB0aGlzLnkgKiB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tb2R1bG8gPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LngsIHRoaXMueSAlIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdiwgdGhpcy55ICUgdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZExlbmd0aCA9IE1hdGguc3FydCh0aGlzLmRvdCgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZW5ndGg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xuICAgICAgICB2YXIgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseShzY2FsZSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZUluUmFkaWFucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZEFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIGlmIChwb2ludCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MocmFkaWFuKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKHJhZGlhbik7XG4gICAgICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XG4gICAgfTtcbiAgICBWLmRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKDEsIDApLnJvdGF0ZShkZWdyZWUpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUubWluaW1pemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7IHg6IE1hdGgucm91bmQodGhpcy54KSwgeTogTWF0aC5yb3VuZCh0aGlzLnkpIH07XG4gICAgfTtcbiAgICByZXR1cm4gVjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWO1xuIl19
