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
function create(field, source, index) {
    "use strict";
    var side = (index % 2 === 0) ? -1 : 1;
    return new Sourcer_1.default(field, Utils_1.default.rand(80) + 160 * side, Utils_1.default.rand(160) + 80, source.ai, source.account, source.name, source.color);
}
onmessage = function (e) {
    var isDemo = e.data.isDemo;
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
    var field = new Field_1.default(isDemo);
    sources.forEach(function (value, index) {
        var sourcer = create(field, value, index);
        field.addSourcer(sourcer);
        idToIndex[sourcer.id] = index;
    });
    postMessage({
        command: "Players",
        players: field.players()
    });
    for (var i = 0; i < 10000 && !field.isFinished; i++) {
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
    Configs.LASER_MOMENTUM = 128;
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
        this.countOfThinks = 0;
        this.preThink = function () {
            _this.countOfThinks++;
        };
        this.log = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            console.log.apply(console, messages);
        };
        this.field = actor.field;
        this.frame = function () { return _this.countOfThinks; };
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
var V_1 = require('./V');
var Utils_1 = require('./Utils');
var DEMO_FRAME_LENGTH = 128;
var Field = (function () {
    function Field(isDemo) {
        this.isDemo = isDemo;
        this.currentId = 0;
        this.isFinished = false;
        this.dummyEnemy = new V_1.default(0, 150);
        this.frame = 0;
        this.sourcers = [];
        this.shots = [];
        this.fxs = [];
    }
    Field.prototype.addSourcer = function (sourcer) {
        sourcer.id = this.currentId++;
        this.sourcers.push(sourcer);
    };
    Field.prototype.addShot = function (shot) {
        shot.id = this.currentId++;
        this.shots.push(shot);
    };
    Field.prototype.removeShot = function (target) {
        var index = this.shots.indexOf(target);
        if (0 <= index) {
            this.shots.splice(index, 1);
        }
    };
    Field.prototype.addFx = function (fx) {
        fx.id = this.currentId++;
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
        if (this.isDemo) {
            if (DEMO_FRAME_LENGTH < this.frame) {
                this.result = { frame: this.frame };
                listener.onFinished(this.result);
            }
            return;
        }
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
                winnerId: surviver.id,
                frame: this.frame,
                isDraw: false
            };
            listener.onFinished(this.result);
            return;
        }
        // no surviver.. draw...
        this.result = {
            winnerId: null,
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
        if (this.isDemo) {
            this.isFinished = true;
            listener.onEndOfGame();
            return;
        }
        if (this.result.frame < this.frame - 90) {
            this.isFinished = true;
            listener.onEndOfGame();
        }
    };
    Field.prototype.scanEnemy = function (owner, radar) {
        if (this.isDemo && this.sourcers.length === 1) {
            return radar(this.dummyEnemy);
        }
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
    Field.prototype.players = function () {
        var players = {};
        this.sourcers.forEach(function (sourcer) {
            players[sourcer.id] = { name: sourcer.name || sourcer.account, account: sourcer.account, color: sourcer.color };
        });
        return players;
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
            f: this.frame,
            s: sourcersDump,
            b: shotsDump,
            x: fxDump
        };
    };
    return Field;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;

},{"./Utils":19,"./V":20}],9:[function(require,module,exports){
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
            i: this.id,
            p: this.position.minimize(),
            f: this.frame,
            l: Math.round(this.length)
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
            this.controller.preThink();
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
var V_1 = require('./V');
var Utils_1 = require('./Utils');
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
            this.createFxs();
        }
        if (this.field.checkCollisionEnviroment(this)) {
            this.field.removeShot(this);
            this.createFxs();
        }
    };
    Shot.prototype.createFxs = function () {
        for (var i = 0; i < 3; i++) {
            var position = this.position.add(Utils_1.default.rand(16) - 8, Utils_1.default.rand(16) - 8);
            var speed = new V_1.default(Utils_1.default.rand(1) - 0.5, Utils_1.default.rand(1) - 0.5);
            var length_1 = Utils_1.default.rand(8) + 4;
            this.field.addFx(new Fx_1.default(this.field, position, this.speed.divide(2).add(speed), length_1));
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
            o: this.owner.id,
            i: this.id,
            p: this.position.minimize(),
            d: this.direction,
            s: this.type
        };
    };
    return Shot;
}(Actor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Shot;

},{"./Actor":3,"./Fx":9,"./Utils":19,"./V":20}],15:[function(require,module,exports){
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
    function Sourcer(field, x, y, ai, account, name, color) {
        _super.call(this, field, x, y);
        this.account = account;
        this.name = name;
        this.color = color;
        this.alive = true;
        this.temperature = 0;
        this.shield = Configs_1.default.INITIAL_SHIELD;
        this.missileAmmo = Configs_1.default.INITIAL_MISSILE_AMMO;
        this.fuel = Configs_1.default.INITIAL_FUEL;
        this.direction = Math.random() < 0.5 ? Consts_1.default.DIRECTION_RIGHT : Consts_1.default.DIRECTION_LEFT;
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
            this.controller.preThink();
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
            i: this.id,
            p: this.position.minimize(),
            d: this.direction,
            h: Math.round(this.shield),
            t: Math.round(this.temperature),
            a: this.missileAmmo,
            f: Math.round(this.fuel)
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
            command.fire = new ShotParam_1.default();
            command.fire.power = Math.min(Math.max(power || 8, 3), 8);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvbGlicy9jaGFpbmNob21wLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0FjdG9yLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25zdHMuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0NvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9GeC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvTGFzZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGVDb21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9NaXNzaWxlQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdFBhcmFtLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL1V0aWxzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9WLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEludm9rZSB1bnRydXN0ZWQgZ3Vlc3QgY29kZSBpbiBhIHNhbmRib3guXG4gKiBUaGUgZ3Vlc3QgY29kZSBjYW4gYWNjZXNzIG9iamVjdHMgb2YgdGhlIHN0YW5kYXJkIGxpYnJhcnkgb2YgRUNNQVNjcmlwdC5cbiAqXG4gKiBmdW5jdGlvbiBjaGFpbmNob21wKHNjcmlwdDogc3RyaW5nLCBzY29wZT86IGFueSA9IHt9KTogYW55O1xuICpcbiAqIHRoaXMucGFyYW0gc2NyaXB0IGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnBhcmFtIHNjb3BlIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHdpbGwgYmUgZXhwb3NlZCB0byB0aGUgZ3Vlc3QgY29kZS5cbiAqIHRoaXMucmV0dXJuIHJlc3VsdCBvZiB0aGUgcHJvY2Vzcy5cbiAqL1xuZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQsIHNjb3BlLCBvcHRpb25zKXtcbiAgICAvLyBGaXJzdCwgeW91IG5lZWQgdG8gcGlsZSBhIHBpY2tldCB0byB0aWUgYSBDaGFpbiBDaG9tcC5cbiAgICAvLyBJZiB0aGUgZW52aXJvbm1lbnQgaXMgY2hhbmdlZCwgdGhlIHBpY2tldCB3aWxsIGRyb3Agb3V0LlxuICAgIC8vIFlvdSBzaG91bGQgcmVtYWtlIGEgbmV3IHBpY2tldCBlYWNoIHRpbWUgYXMgbG9uZyBhc+OAgHlvdSBhcmUgc28gYnVzeS5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB0aGUgZ2xvYmFsIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbXVzdCByZW1ha2UgYSBwaWNrZXQuXG4gICAgdmFyIHBpY2tldCA9IGNoYWluY2hvbXAucGljaygpO1xuXG4gICAgLy8gTmV4dCwgZ2V0IG5ldyBDaGFpbiBDaG9tcCB0aWVkIHRoZSBwaWNrZXQuXG4gICAgLy8gRGlmZmVyZW50IENoYWluIENob21wcyBoYXZlIGRpZmZlcmVudCBiZWhhdmlvci5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElmIHlvdSBuZWVkIGEgZGlmZmVyZW50IGZ1bmN0aW9uLCB5b3UgY2FuIGdldCBhbm90aGVyIG9uZS5cbiAgICB2YXIgY2hvbXAgPSBwaWNrZXQoc2NyaXB0LCBzY29wZSk7XG5cbiAgICAvLyBMYXN0LCBmZWVkIHRoZSBjaG9tcCBhbmQgbGV0IGl0IHJhbXBhZ2UhXG4gICAgLy8gQSBjaG9tcCBlYXRzIG5vdGhpbmcgYnV044CAYSBraW5kIG9mIGZlZWQgdGhhdCB0aGUgY2hvbXAgYXRlIGF0IGZpcnN0LlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiBvbmx5IGEgdmFsdWUgaW4gdGhlIHNjb3BlIG9iamVjdCBpcyBjaGFuZ2VkLCB5b3UgbmVlZCBub3QgdG8gcmVtYWtlIHRoZSBDaGFpbiBDaG9tcCBhbmQgdGhlIHBpY2tldC5cbiAgICByZXR1cm4gY2hvbXAob3B0aW9ucyk7XG59XG5cbi8qKlxuICogY3JlYXRlIHNhbmRib3hcbiAqL1xuY2hhaW5jaG9tcC5waWNrID0gKGZ1bmN0aW9uKCl7XG4gICAgLy8gRHluYW1pYyBpbnN0YW50aWF0aW9uIGlkaW9tXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjA2Nzk3L3VzZS1vZi1hcHBseS13aXRoLW5ldy1vcGVyYXRvci1pcy10aGlzLXBvc3NpYmxlXG4gICAgZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yLCBhcmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIEYoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgRi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJhbm5lZFZhcnMoKXtcbiAgICAgICAgLy8gY29ycmVjdCBiYW5uZWQgb2JqZWN0IG5hbWVzLlxuICAgICAgICB2YXIgYmFubmVkID0gWydfX3Byb3RvX18nLCAncHJvdG90eXBlJ107XG4gICAgICAgIGZ1bmN0aW9uIGJhbihrKXtcbiAgICAgICAgICAgIGlmKGsgJiYgYmFubmVkLmluZGV4T2YoaykgPCAwICYmIGsgIT09ICdldmFsJyAmJiBrLm1hdGNoKC9eW18kYS16QS1aXVtfJGEtekEtWjAtOV0qJC8pKXtcbiAgICAgICAgICAgICAgICBiYW5uZWQucHVzaChrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZ2xvYmFsKS5mb3JFYWNoKGJhbik7XG4gICAgICAgIGZvcih2YXIgayBpbiBnbG9iYWwpe1xuICAgICAgICAgICAgYmFuKGspO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmFuIGFsbCBpZHMgb2YgdGhlIGVsZW1lbnRzXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlcnNlKGVsZW0pe1xuICAgICAgICAgICAgYmFuKGVsZW0uZ2V0QXR0cmlidXRlICYmIGVsZW0uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHZhciBjaGlsZHMgPSBlbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0cmF2ZXJzZShjaGlsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gKioqKiBzdXBwb3J0IG5vZGUuanMgc3RhcnQgKioqKlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdHJhdmVyc2UoZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIGVuZCAqKioqXG5cbiAgICAgICAgcmV0dXJuIGJhbm5lZDtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSBvZiBleHBvc2VkIG9iamVjdHNcbiAgICBmdW5jdGlvbiBnZXRTdGRsaWJzKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnT2JqZWN0JyAgICAgICAgICAgIDogT2JqZWN0LFxuICAgICAgICAgICAgJ1N0cmluZycgICAgICAgICAgICA6IFN0cmluZyxcbiAgICAgICAgICAgICdOdW1iZXInICAgICAgICAgICAgOiBOdW1iZXIsXG4gICAgICAgICAgICAnQm9vbGVhbicgICAgICAgICAgIDogQm9vbGVhbixcbiAgICAgICAgICAgICdBcnJheScgICAgICAgICAgICAgOiBBcnJheSxcbiAgICAgICAgICAgICdEYXRlJyAgICAgICAgICAgICAgOiBEYXRlLFxuICAgICAgICAgICAgJ01hdGgnICAgICAgICAgICAgICA6IE1hdGgsXG4gICAgICAgICAgICAnUmVnRXhwJyAgICAgICAgICAgIDogUmVnRXhwLFxuICAgICAgICAgICAgJ0Vycm9yJyAgICAgICAgICAgICA6IEVycm9yLFxuICAgICAgICAgICAgJ0V2YWxFcnJvcicgICAgICAgICA6IEV2YWxFcnJvcixcbiAgICAgICAgICAgICdSYW5nZUVycm9yJyAgICAgICAgOiBSYW5nZUVycm9yLFxuICAgICAgICAgICAgJ1JlZmVyZW5jZUVycm9yJyAgICA6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgICAgICAgJ1N5bnRheEVycm9yJyAgICAgICA6IFN5bnRheEVycm9yLFxuICAgICAgICAgICAgJ1R5cGVFcnJvcicgICAgICAgICA6IFR5cGVFcnJvcixcbiAgICAgICAgICAgICdVUklFcnJvcicgICAgICAgICAgOiBVUklFcnJvcixcbiAgICAgICAgICAgICdKU09OJyAgICAgICAgICAgICAgOiBKU09OLFxuICAgICAgICAgICAgJ05hTicgICAgICAgICAgICAgICA6IE5hTixcbiAgICAgICAgICAgICdJbmZpbml0eScgICAgICAgICAgOiBJbmZpbml0eSxcbiAgICAgICAgICAgICd1bmRlZmluZWQnICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGFyc2VJbnQnICAgICAgICAgIDogcGFyc2VJbnQsXG4gICAgICAgICAgICAncGFyc2VGbG9hdCcgICAgICAgIDogcGFyc2VGbG9hdCxcbiAgICAgICAgICAgICdpc05hTicgICAgICAgICAgICAgOiBpc05hTixcbiAgICAgICAgICAgICdpc0Zpbml0ZScgICAgICAgICAgOiBpc0Zpbml0ZSxcbiAgICAgICAgICAgICdkZWNvZGVVUkknICAgICAgICAgOiBkZWNvZGVVUkksXG4gICAgICAgICAgICAnZGVjb2RlVVJJQ29tcG9uZW50JzogZGVjb2RlVVJJQ29tcG9uZW50LFxuICAgICAgICAgICAgJ2VuY29kZVVSSScgICAgICAgICA6IGVuY29kZVVSSSxcbiAgICAgICAgICAgICdlbmNvZGVVUklDb21wb25lbnQnOiBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgaXNGcmVlemVkU3RkTGliT2JqcyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIHNhbmRib3guXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzRnJlZXplZFN0ZExpYk9ianMgPT0gZmFsc2Upe1xuICAgICAgICAgICAgdmFyIHN0ZGxpYnMgPSBnZXRTdGRsaWJzKCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZyZWV6ZSh2KXtcbiAgICAgICAgICAgICAgICBpZih2ICYmICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHYgPT09ICdmdW5jdGlvbicpICYmICEgT2JqZWN0LmlzRnJvemVuKHYpKXtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModikuZm9yRWFjaChmdW5jdGlvbihrLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aW9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZXplKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJlZXplKHN0ZGxpYnMpO1xuXG4gICAgICAgICAgICAvLyBmcmVlemUgRnVuY3Rpb24ucHJvdG90eXBlXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQWNjZXNzIHRvIFwiRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yXCIgaXMgbm90IGFsbG93ZWQuJykgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmcmVlemUoRnVuY3Rpb24pO1xuXG4gICAgICAgICAgICBpc0ZyZWV6ZWRTdGRMaWJPYmpzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBiYW5uZWQgPSBnZXRCYW5uZWRWYXJzKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNyZWF0ZSBzYW5kYm94ZWQgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihzY3JpcHQsIHNjb3BlKXtcbiAgICAgICAgICAgIC8vIHZhbGlkYXRlIGFyZ3VtZW50c1xuICAgICAgICAgICAgaWYoICEgKHR5cGVvZiBzY3JpcHQgPT09ICdzdHJpbmcnIHx8IHNjcmlwdCBpbnN0YW5jZW9mIFN0cmluZyApKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIGRlZmF1bHQgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Quc2VhbChzY29wZSk7XG5cbiAgICAgICAgICAgIC8vIEV4cG9zZSBjdXN0b20gcHJvcGVydGllc1xuICAgICAgICAgICAgdmFyIGd1ZXN0R2xvYmFsID0gZ2V0U3RkbGlicygpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoZ3Vlc3RHbG9iYWwpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5rZXlzKGd1ZXN0R2xvYmFsKS5jb25jYXQoYmFubmVkLmZpbHRlcihmdW5jdGlvbihiKXsgcmV0dXJuICEgZ3Vlc3RHbG9iYWwuaGFzT3duUHJvcGVydHkoYik7IH0pKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNjcmlwdCk7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25PYmplY3QgPSBjb25zdHJ1Y3QoRnVuY3Rpb24sIGFyZ3MpO1xuXG4gICAgICAgICAgICB2YXIgc2FmZUV2YWwgPSBmdW5jdGlvbihzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb24oXCJyZXR1cm4gXCIgKyBzLCBndWVzdEdsb2JhbCkoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHNhZmVFdmFsKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbnZva2Ugc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgaW52b2tlU2FuZGJveGVkRnVuY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IHNhZmVFdmFsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBzYW5kYm94ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc3RvcmUgZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGUpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBndWVzdEdsb2JhbFtrXSA9IHNjb3BlW2tdO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkubWFwKGZ1bmN0aW9uKGspeyByZXR1cm4gZ3Vlc3RHbG9iYWxba107IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25PYmplY3QuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1maW5hbGx5e1xuICAgICAgICAgICAgICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY3JlYXRlU2FuZGJveGVkRnVuY3Rpb247XG4gICAgfTtcbn0pKCk7XG5cbi8vXG5jaGFpbmNob21wLmNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MsIG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xuXG4gICAgLy8gcmVwbGFjZSBldmFsIHdpdGggc2FmZSBldmFsLWxpa2UgZnVuY3Rpb25cbiAgICB2YXIgX2V2YWwgPSBldmFsO1xuICAgIGlmKG9wdGlvbnMuZGVidWcgIT09IHRydWUpe1xuICAgICAgICBldmFsID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeXtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGV2YWwgPSBfZXZhbDtcbiAgICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjaGFpbmNob21wO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRmllbGRfMSA9IHJlcXVpcmUoJy4vY29yZS9GaWVsZCcpO1xudmFyIFNvdXJjZXJfMSA9IHJlcXVpcmUoJy4vY29yZS9Tb3VyY2VyJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vY29yZS9VdGlscycpO1xuZnVuY3Rpb24gY3JlYXRlKGZpZWxkLCBzb3VyY2UsIGluZGV4KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHNpZGUgPSAoaW5kZXggJSAyID09PSAwKSA/IC0xIDogMTtcbiAgICByZXR1cm4gbmV3IFNvdXJjZXJfMS5kZWZhdWx0KGZpZWxkLCBVdGlsc18xLmRlZmF1bHQucmFuZCg4MCkgKyAxNjAgKiBzaWRlLCBVdGlsc18xLmRlZmF1bHQucmFuZCgxNjApICsgODAsIHNvdXJjZS5haSwgc291cmNlLmFjY291bnQsIHNvdXJjZS5uYW1lLCBzb3VyY2UuY29sb3IpO1xufVxub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaXNEZW1vID0gZS5kYXRhLmlzRGVtbztcbiAgICB2YXIgc291cmNlcyA9IGUuZGF0YS5zb3VyY2VzO1xuICAgIHZhciBpZFRvSW5kZXggPSB7fTtcbiAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgIG9uUHJlVGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlByZVRoaW5rXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGlkVG9JbmRleFtzb3VyY2VySWRdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0VGhpbms6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlBvc3RUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpZFRvSW5kZXhbc291cmNlcklkXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRnJhbWU6IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiRnJhbWVcIixcbiAgICAgICAgICAgICAgICBmaWVsZDogZmllbGRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJGaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FbmRPZkdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIkVuZE9mR2FtZVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Mb2c6IGZ1bmN0aW9uIChzb3VyY2VySWQpIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25Mb2dcIik7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJMb2dcIixcbiAgICAgICAgICAgICAgICBpbmRleDogaWRUb0luZGV4W3NvdXJjZXJJZF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGZpZWxkID0gbmV3IEZpZWxkXzEuZGVmYXVsdChpc0RlbW8pO1xuICAgIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBzb3VyY2VyID0gY3JlYXRlKGZpZWxkLCB2YWx1ZSwgaW5kZXgpO1xuICAgICAgICBmaWVsZC5hZGRTb3VyY2VyKHNvdXJjZXIpO1xuICAgICAgICBpZFRvSW5kZXhbc291cmNlci5pZF0gPSBpbmRleDtcbiAgICB9KTtcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvbW1hbmQ6IFwiUGxheWVyc1wiLFxuICAgICAgICBwbGF5ZXJzOiBmaWVsZC5wbGF5ZXJzKClcbiAgICB9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDAwICYmICFmaWVsZC5pc0ZpbmlzaGVkOyBpKyspIHtcbiAgICAgICAgZmllbGQudGljayhsaXN0ZW5lcik7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIEFjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBY3RvcihmaWVsZCwgeCwgeSkge1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMuc2l6ZSA9IENvbmZpZ3NfMS5kZWZhdWx0LkNPTExJU0lPTl9TSVpFO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHgsIHkpO1xuICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KDAsIDApO1xuICAgIH1cbiAgICBBY3Rvci5wcm90b3R5cGUudGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLndhaXQgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgICAgIHRoaXMub25UaGluaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53YWl0LS07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBub3QgdGhpbmsgYW55dGhpbmcuXG4gICAgfTtcbiAgICA7XG4gICAgQWN0b3IucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH07XG4gICAgQWN0b3IucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsaW1lbnRhdGlvbicpO1xuICAgIH07XG4gICAgcmV0dXJuIEFjdG9yO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFjdG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29tbWFuZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfVxuICAgIENvbW1hbmQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBY2NlcHRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb21tYW5kLiBcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIENvbW1hbmQucHJvdG90eXBlLnVuYWNjZXB0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBDb21tYW5kO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbW1hbmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb25maWdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25maWdzKCkge1xuICAgIH1cbiAgICBDb25maWdzLklOSVRJQUxfU0hJRUxEID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9GVUVMID0gMTAwO1xuICAgIENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcbiAgICBDb25maWdzLkxBU0VSX0FUVEVOVUFUSU9OID0gMTtcbiAgICBDb25maWdzLkxBU0VSX01PTUVOVFVNID0gMTI4O1xuICAgIENvbmZpZ3MuRlVFTF9DT1NUID0gMC4yNDtcbiAgICBDb25maWdzLkNPTExJU0lPTl9TSVpFID0gNDtcbiAgICBDb25maWdzLlNDQU5fV0FJVCA9IDAuMzU7XG4gICAgQ29uZmlncy5TUEVFRF9SRVNJU1RBTkNFID0gMC45NjtcbiAgICBDb25maWdzLkdSQVZJVFkgPSAwLjE7XG4gICAgQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQgPSA0ODA7XG4gICAgQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIgPSA0MDA7XG4gICAgQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCA9IDAuMDA4O1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSID0gMTAwO1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQgPSAwLjA1O1xuICAgIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCA9IDAuMDEyO1xuICAgIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRSA9IDE7XG4gICAgQ29uZmlncy5DT09MX0RPV04gPSAwLjU7XG4gICAgQ29uZmlncy5PTl9ISVRfU1BFRURfR0lWRU5fUkFURSA9IDAuNDtcbiAgICByZXR1cm4gQ29uZmlncztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb25maWdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29uc3RzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25zdHMoKSB7XG4gICAgfVxuICAgIENvbnN0cy5ESVJFQ1RJT05fUklHSFQgPSAxO1xuICAgIENvbnN0cy5ESVJFQ1RJT05fTEVGVCA9IC0xO1xuICAgIENvbnN0cy5WRVJUSUNBTF9VUCA9IFwidmVydGlhbF91cFwiO1xuICAgIENvbnN0cy5WRVJUSUNBTF9ET1dOID0gXCJ2ZXJ0aWFsX2Rvd25cIjtcbiAgICByZXR1cm4gQ29uc3RzO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbnN0cztcbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIoYWN0b3IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jb3VudE9mVGhpbmtzID0gMDtcbiAgICAgICAgdGhpcy5wcmVUaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmNvdW50T2ZUaGlua3MrKztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNbX2kgLSAwXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBtZXNzYWdlcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmllbGQgPSBhY3Rvci5maWVsZDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmNvdW50T2ZUaGlua3M7IH07XG4gICAgICAgIHRoaXMuYWx0aXR1ZGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBhY3Rvci5wb3NpdGlvbi55OyB9O1xuICAgICAgICB0aGlzLndhaXQgPSBmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICAgICAgICAgIGlmICgwIDwgZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ29udHJvbGxlcjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBERU1PX0ZSQU1FX0xFTkdUSCA9IDEyODtcbnZhciBGaWVsZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRmllbGQoaXNEZW1vKSB7XG4gICAgICAgIHRoaXMuaXNEZW1vID0gaXNEZW1vO1xuICAgICAgICB0aGlzLmN1cnJlbnRJZCA9IDA7XG4gICAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmR1bW15RW5lbXkgPSBuZXcgVl8xLmRlZmF1bHQoMCwgMTUwKTtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zaG90cyA9IFtdO1xuICAgICAgICB0aGlzLmZ4cyA9IFtdO1xuICAgIH1cbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU291cmNlciA9IGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgIHNvdXJjZXIuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLnB1c2goc291cmNlcik7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkU2hvdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHNob3QuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xuICAgICAgICB0aGlzLnNob3RzLnB1c2goc2hvdCk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucmVtb3ZlU2hvdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zaG90cy5pbmRleE9mKHRhcmdldCk7XG4gICAgICAgIGlmICgwIDw9IGluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLnNob3RzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5hZGRGeCA9IGZ1bmN0aW9uIChmeCkge1xuICAgICAgICBmeC5pZCA9IHRoaXMuY3VycmVudElkKys7XG4gICAgICAgIHRoaXMuZnhzLnB1c2goZngpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZUZ4ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmZ4cy5pbmRleE9mKHRhcmdldCk7XG4gICAgICAgIGlmICgwIDw9IGluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmZ4cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICAvLyBUbyBiZSB1c2VkIGluIHRoZSBpbnZpc2libGUgaGFuZC5cbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmNvbXB1dGVDZW50ZXIoKTtcbiAgICAgICAgLy8gVGhpbmsgcGhhc2VcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNvdXJjZXIuaWQpO1xuICAgICAgICAgICAgc291cmNlci50aGluaygpO1xuICAgICAgICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc291cmNlci5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc2hvdC5vd25lci5pZCk7XG4gICAgICAgICAgICBzaG90LnRoaW5rKCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzaG90Lm93bmVyLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFjdGlvbiBwaGFzZVxuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2hvdHMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIGFjdG9yLmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4LmFjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gTW92ZSBwaGFzZVxuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5tb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZ4cy5mb3JFYWNoKGZ1bmN0aW9uIChmeCkge1xuICAgICAgICAgICAgZngubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2hlY2sgcGhhc2VcbiAgICAgICAgdGhpcy5jaGVja0ZpbmlzaChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuY2hlY2tFbmRPZkdhbWUobGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgICAgIC8vIG9uRnJhbWVcbiAgICAgICAgbGlzdGVuZXIub25GcmFtZSh0aGlzLmR1bXAoKSk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tGaW5pc2ggPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZW1vKSB7XG4gICAgICAgICAgICBpZiAoREVNT19GUkFNRV9MRU5HVEggPCB0aGlzLmZyYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSB7IGZyYW1lOiB0aGlzLmZyYW1lIH07XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8g5rG65a6a5riI44G/XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikgeyBzb3VyY2VyLmFsaXZlID0gMCA8IHNvdXJjZXIuc2hpZWxkOyB9KTtcbiAgICAgICAgdmFyIHN1cnZpdmVycyA9IHRoaXMuc291cmNlcnMuZmlsdGVyKGZ1bmN0aW9uIChzb3VyY2VyKSB7IHJldHVybiBzb3VyY2VyLmFsaXZlOyB9KTtcbiAgICAgICAgaWYgKDEgPCBzdXJ2aXZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1cnZpdmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBzdXJ2aXZlciA9IHN1cnZpdmVyc1swXTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIHdpbm5lcklkOiBzdXJ2aXZlci5pZCxcbiAgICAgICAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgICAgICBpc0RyYXc6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm8gc3Vydml2ZXIuLiBkcmF3Li4uXG4gICAgICAgIHRoaXMucmVzdWx0ID0ge1xuICAgICAgICAgICAgd2lubmVySWQ6IG51bGwsXG4gICAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIGlzRHJhdzogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0VuZE9mR2FtZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAodGhpcy5pc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRGVtbykge1xuICAgICAgICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0LmZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGlzdGVuZXIub25FbmRPZkdhbWUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZW1vICYmIHRoaXMuc291cmNlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFkYXIodGhpcy5kdW1teUVuZW15KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2Vycy5zb21lKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkF0dGFjayA9IGZ1bmN0aW9uIChvd25lciwgcmFkYXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hvdHMuc29tZShmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAgICAgcmV0dXJuIHNob3Qub3duZXIgIT09IG93bmVyICYmIHJhZGFyKHNob3QucG9zaXRpb24pICYmIF90aGlzLmlzSW5jb21pbmcob3duZXIsIHNob3QpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5pc0luY29taW5nID0gZnVuY3Rpb24gKG93bmVyLCBzaG90KSB7XG4gICAgICAgIHZhciBvd25lclBvc2l0aW9uID0gb3duZXIucG9zaXRpb247XG4gICAgICAgIHZhciBhY3RvclBvc2l0aW9uID0gc2hvdC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIGN1cnJlbnREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbik7XG4gICAgICAgIHZhciBuZXh0RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24uYWRkKHNob3Quc3BlZWQpKTtcbiAgICAgICAgcmV0dXJuIG5leHREaXN0YW5jZSA8IGN1cnJlbnREaXN0YW5jZTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0NvbGxpc2lvbiA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHZhciBmID0gc2hvdC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHQgPSBzaG90LnBvc2l0aW9uLmFkZChzaG90LnNwZWVkKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSB0aGlzLnNob3RzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLmJyZWFrYWJsZSAmJiBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzXzEuZGVmYXVsdC5jYWxjRGlzdGFuY2UoZiwgdCwgYWN0b3IucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc291cmNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VyID0gdGhpcy5zb3VyY2Vyc1tpXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IHNob3Qub3duZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBVdGlsc18xLmRlZmF1bHQuY2FsY0Rpc3RhbmNlKGYsIHQsIHNvdXJjZXIucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHNob3Quc2l6ZSArIHNvdXJjZXIuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgcmV0dXJuIHNob3QucG9zaXRpb24ueSA8IDA7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuY29tcHV0ZUNlbnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgdmFyIHN1bVggPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdW1YIC8gY291bnQ7XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUucGxheWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBsYXllcnMgPSB7fTtcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7XG4gICAgICAgICAgICBwbGF5ZXJzW3NvdXJjZXIuaWRdID0geyBuYW1lOiBzb3VyY2VyLm5hbWUgfHwgc291cmNlci5hY2NvdW50LCBhY2NvdW50OiBzb3VyY2VyLmFjY291bnQsIGNvbG9yOiBzb3VyY2VyLmNvbG9yIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGxheWVycztcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlcnNEdW1wID0gW107XG4gICAgICAgIHZhciBzaG90c0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIGZ4RHVtcCA9IFtdO1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeER1bXAucHVzaChmeC5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGY6IHRoaXMuZnJhbWUsXG4gICAgICAgICAgICBzOiBzb3VyY2Vyc0R1bXAsXG4gICAgICAgICAgICBiOiBzaG90c0R1bXAsXG4gICAgICAgICAgICB4OiBmeER1bXBcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBGaWVsZDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBGaWVsZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEZ4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGeChmaWVsZCwgcG9zaXRpb24sIHNwZWVkLCBsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgIH1cbiAgICBGeC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSB0aGlzLmZyYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZUZ4KHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGeC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICAgIH07XG4gICAgRngucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpOiB0aGlzLmlkLFxuICAgICAgICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgZjogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIGw6IE1hdGgucm91bmQodGhpcy5sZW5ndGgpXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gRng7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRng7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFNob3RfMSA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIExhc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGFzZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGFzZXIoZmllbGQsIG93bmVyLCBkaXJlY3Rpb24sIHBvd2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lciwgXCJMYXNlclwiKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSA1O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDg7IH07XG4gICAgICAgIHRoaXMuc3BlZWQgPSBWXzEuZGVmYXVsdC5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XG4gICAgICAgIHRoaXMubW9tZW50dW0gPSBDb25maWdzXzEuZGVmYXVsdC5MQVNFUl9NT01FTlRVTTtcbiAgICB9XG4gICAgTGFzZXIucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5hY3Rpb24uY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5tb21lbnR1bSAtPSBDb25maWdzXzEuZGVmYXVsdC5MQVNFUl9BVFRFTlVBVElPTjtcbiAgICAgICAgaWYgKHRoaXMubW9tZW50dW0gPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBMYXNlcjtcbn0oU2hvdF8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IExhc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBTaG90XzEgPSByZXF1aXJlKCcuL1Nob3QnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBNaXNzaWxlQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9NaXNzaWxlQ29tbWFuZCcpO1xudmFyIE1pc3NpbGVDb250cm9sbGVyXzEgPSByZXF1aXJlKCcuL01pc3NpbGVDb250cm9sbGVyJyk7XG52YXIgQ29uc3RzXzEgPSByZXF1aXJlKCcuL0NvbnN0cycpO1xudmFyIE1pc3NpbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGUoZmllbGQsIG93bmVyLCBhaSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIsIFwiTWlzc2lsZVwiKTtcbiAgICAgICAgdGhpcy5haSA9IGFpO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMTA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMTAgKyBfdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IDEwMDtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFpID0gYWk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBNaXNzaWxlQ29udHJvbGxlcl8xLmRlZmF1bHQodGhpcyk7XG4gICAgfVxuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vbkFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgIH07XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoYXR0YWNrKSB7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KGF0dGFjayk7XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uICsgZGlyZWN0aW9uO1xuICAgIH07XG4gICAgcmV0dXJuIE1pc3NpbGU7XG59KFNob3RfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBNaXNzaWxlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb21tYW5kKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMubWlzc2lsZSA9IG1pc3NpbGU7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgTWlzc2lsZUNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSAwO1xuICAgICAgICB0aGlzLnNwZWVkRG93biA9IDA7XG4gICAgICAgIHRoaXMudHVybiA9IDA7XG4gICAgfTtcbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmRpcmVjdGlvbiArPSB0aGlzLnR1cm47XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZCA9IFZfMS5kZWZhdWx0LmRpcmVjdGlvbih0aGlzLm1pc3NpbGUuZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5hZGQobm9ybWFsaXplZC5tdWx0aXBseSh0aGlzLnNwZWVkVXApKTtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5tdWx0aXBseSgxIC0gdGhpcy5zcGVlZERvd24pO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgLT0gKHRoaXMuc3BlZWRVcCArIHRoaXMuc3BlZWREb3duICogMykgKiBDb25maWdzXzEuZGVmYXVsdC5GVUVMX0NPU1Q7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE1pc3NpbGVDb21tYW5kO1xufShDb21tYW5kXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTWlzc2lsZUNvbW1hbmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgTWlzc2lsZUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNaXNzaWxlQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNaXNzaWxlQ29udHJvbGxlcihtaXNzaWxlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG1pc3NpbGUpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1pc3NpbGUuZGlyZWN0aW9uOyB9O1xuICAgICAgICB2YXIgZmllbGQgPSBtaXNzaWxlLmZpZWxkO1xuICAgICAgICB2YXIgY29tbWFuZCA9IG1pc3NpbGUuY29tbWFuZDtcbiAgICAgICAgdGhpcy5mdWVsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5mdWVsOyB9O1xuICAgICAgICB0aGlzLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgbWlzc2lsZS53YWl0ICs9IDEuNTtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IG1pc3NpbGUub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzXzEuZGVmYXVsdC5jcmVhdGVSYWRhcihtaXNzaWxlLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwZWVkVXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnNwZWVkVXAgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5zcGVlZERvd24gPSAwLjE7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVyblJpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gLTk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybkxlZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSA5O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gTWlzc2lsZUNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXJfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlQ29udHJvbGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQWN0b3JfMSA9IHJlcXVpcmUoJy4vQWN0b3InKTtcbnZhciBGeF8xID0gcmVxdWlyZSgnLi9GeCcpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU2hvdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNob3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2hvdChmaWVsZCwgb3duZXIsIHR5cGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLnBvc2l0aW9uLngsIG93bmVyLnBvc2l0aW9uLnkpO1xuICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAwO1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDA7IH07XG4gICAgICAgIHRoaXMuYnJlYWthYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIFNob3QucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vbkFjdGlvbigpO1xuICAgICAgICB2YXIgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xuICAgICAgICBpZiAoY29sbGlkZWQpIHtcbiAgICAgICAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVGeHMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLmNyZWF0ZUZ4cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgpO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KFV0aWxzXzEuZGVmYXVsdC5yYW5kKDEpIC0gMC41LCBVdGlsc18xLmRlZmF1bHQucmFuZCgxKSAtIDAuNSk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoXzEgPSBVdGlsc18xLmRlZmF1bHQucmFuZCg4KSArIDQ7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeF8xLmRlZmF1bHQodGhpcy5maWVsZCwgcG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLmFkZChzcGVlZCksIGxlbmd0aF8xKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLnJlYWN0aW9uID0gZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgc291cmNlci50ZW1wZXJhdHVyZSArPSB0aGlzLnRlbXBlcmF0dXJlO1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9O1xuICAgIFNob3QucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvOiB0aGlzLm93bmVyLmlkLFxuICAgICAgICAgICAgaTogdGhpcy5pZCxcbiAgICAgICAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcbiAgICAgICAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxuICAgICAgICAgICAgczogdGhpcy50eXBlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gU2hvdDtcbn0oQWN0b3JfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTaG90O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgU2hvdFBhcmFtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaG90UGFyYW0oKSB7XG4gICAgfVxuICAgIHJldHVybiBTaG90UGFyYW07XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2hvdFBhcmFtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBjaGFpbmNob21wXzEgPSByZXF1aXJlKCcuLi8uLi9saWJzL2NoYWluY2hvbXAnKTtcbnZhciBBY3Rvcl8xID0gcmVxdWlyZSgnLi9BY3RvcicpO1xudmFyIFNvdXJjZXJDb21tYW5kXzEgPSByZXF1aXJlKCcuL1NvdXJjZXJDb21tYW5kJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vU291cmNlckNvbnRyb2xsZXInKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBDb25zdHNfMSA9IHJlcXVpcmUoJy4vQ29uc3RzJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBMYXNlcl8xID0gcmVxdWlyZSgnLi9MYXNlcicpO1xudmFyIE1pc3NpbGVfMSA9IHJlcXVpcmUoJy4vTWlzc2lsZScpO1xudmFyIEZ4XzEgPSByZXF1aXJlKCcuL0Z4Jyk7XG52YXIgU291cmNlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlcihmaWVsZCwgeCwgeSwgYWksIGFjY291bnQsIG5hbWUsIGNvbG9yKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCB4LCB5KTtcbiAgICAgICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gQ29uZmlnc18xLmRlZmF1bHQuSU5JVElBTF9TSElFTEQ7XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBDb25maWdzXzEuZGVmYXVsdC5JTklUSUFMX01JU1NJTEVfQU1NTztcbiAgICAgICAgdGhpcy5mdWVsID0gQ29uZmlnc18xLmRlZmF1bHQuSU5JVElBTF9GVUVMO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9SSUdIVCA6IENvbnN0c18xLmRlZmF1bHQuRElSRUNUSU9OX0xFRlQ7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IG5ldyBTb3VyY2VyQ29tbWFuZF8xLmRlZmF1bHQodGhpcyk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTb3VyY2VyQ29udHJvbGxlcl8xLmRlZmF1bHQodGhpcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5haSA9IGNoYWluY2hvbXBfMS5kZWZhdWx0KGFpLCBzY29wZSkgfHwgc2NvcGUubW9kdWxlICYmIHNjb3BlLm1vZHVsZS5leHBvcnRzO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5haSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgU291cmNlci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWkgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XG4gICAgICAgICAgICB0aGlzLmFpKHRoaXMuY29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5hbGl2ZSAmJiBVdGlsc18xLmRlZmF1bHQucmFuZCg4KSA8IDEpIHtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDE2KSAtIDgpO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KFV0aWxzXzEuZGVmYXVsdC5yYW5kKDEpIC0gMC41LCBVdGlsc18xLmRlZmF1bHQucmFuZCgxKSArIDAuNSk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gVXRpbHNfMS5kZWZhdWx0LnJhbmQoOCkgKyA0O1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRnhfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWlyIHJlc2lzdGFuY2VcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgICAgIC8vIGdyYXZpdHlcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlnc18xLmRlZmF1bHQuR1JBVklUWSk7XG4gICAgICAgIC8vIGNvbnRyb2wgYWx0aXR1ZGUgYnkgdGhlIGludmlzaWJsZSBoYW5kXG4gICAgICAgIGlmIChDb25maWdzXzEuZGVmYXVsdC5UT1BfSU5WSVNJQkxFX0hBTkQgPCB0aGlzLnBvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgIHZhciBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzXzEuZGVmYXVsdC5UT1BfSU5WSVNJQkxFX0hBTkQpICogMC4xO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlnc18xLmRlZmF1bHQuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb250cm9sIGRpc3RhbmNlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxuICAgICAgICB2YXIgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xuICAgICAgICBpZiAoQ29uZmlnc18xLmRlZmF1bHQuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcbiAgICAgICAgICAgIHZhciBuID0gZGlmZiA8IDAgPyAtMSA6IDE7XG4gICAgICAgICAgICB2YXIgaW52aXNpYmxlSGFuZCA9IChNYXRoLmFicyhkaWZmKSAtIENvbmZpZ3NfMS5kZWZhdWx0LkRJU1RBTkNFX0JPUkRBUikgKiBDb25maWdzXzEuZGVmYXVsdC5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCAqIG47XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCArIGludmlzaWJsZUhhbmQsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ28gaW50byB0aGUgZ3JvdW5kXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3NfMS5kZWZhdWx0LkdST1VORF9EQU1BR0VfU0NBTEUpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIDApO1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWXzEuZGVmYXVsdCh0aGlzLnNwZWVkLngsIDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlnc18xLmRlZmF1bHQuQ09PTF9ET1dOO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XG4gICAgICAgIC8vIG92ZXJoZWF0XG4gICAgICAgIHZhciBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfQk9SREVSKTtcbiAgICAgICAgaWYgKDAgPCBvdmVyaGVhdCkge1xuICAgICAgICAgICAgdmFyIGxpbmVhckRhbWFnZSA9IG92ZXJoZWF0ICogQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XG4gICAgICAgICAgICB2YXIgcG93ZXJEYW1hZ2UgPSBNYXRoLnBvdyhvdmVyaGVhdCAqIENvbmZpZ3NfMS5kZWZhdWx0Lk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gXCJMYXNlclwiKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdmFyIHNob3QgPSBuZXcgTGFzZXJfMS5kZWZhdWx0KHRoaXMuZmllbGQsIHRoaXMsIGRpcmVjdGlvbiwgcGFyYW0ucG93ZXIpO1xuICAgICAgICAgICAgc2hvdC5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGVBbW1vKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pc3NpbGUgPSBuZXcgTWlzc2lsZV8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYWkpO1xuICAgICAgICAgICAgICAgIG1pc3NpbGUucmVhY3Rpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChtaXNzaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU291cmNlci5wcm90b3R5cGUub3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gQ29uc3RzXzEuZGVmYXVsdC5ESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWxzXzEuZGVmYXVsdC50b09wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLmFkZChzaG90LnNwZWVkLm11bHRpcGx5KENvbmZpZ3NfMS5kZWZhdWx0Lk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XG4gICAgICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaTogdGhpcy5pZCxcbiAgICAgICAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcbiAgICAgICAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxuICAgICAgICAgICAgaDogTWF0aC5yb3VuZCh0aGlzLnNoaWVsZCksXG4gICAgICAgICAgICB0OiBNYXRoLnJvdW5kKHRoaXMudGVtcGVyYXR1cmUpLFxuICAgICAgICAgICAgYTogdGhpcy5taXNzaWxlQW1tbyxcbiAgICAgICAgICAgIGY6IE1hdGgucm91bmQodGhpcy5mdWVsKVxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIFNvdXJjZXI7XG59KEFjdG9yXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU291cmNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgU291cmNlckNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29tbWFuZChzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnNvdXJjZXIgPSBzb3VyY2VyO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5haGVhZCA9IDA7XG4gICAgICAgIHRoaXMuYXNjZW50ID0gMDtcbiAgICAgICAgdGhpcy50dXJuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmlyZSA9IG51bGw7XG4gICAgfTtcbiAgICBTb3VyY2VyQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlyZSkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZpcmUodGhpcy5maXJlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50dXJuKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5zcGVlZCA9IHRoaXMuc291cmNlci5zcGVlZC5hZGQodGhpcy5haGVhZCAqIHRoaXMuc291cmNlci5kaXJlY3Rpb24sIHRoaXMuYXNjZW50KTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsIC09IChNYXRoLmFicyh0aGlzLmFoZWFkKSArIE1hdGguYWJzKHRoaXMuYXNjZW50KSkgKiBDb25maWdzXzEuZGVmYXVsdC5GVUVMX0NPU1Q7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMuc291cmNlci5mdWVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFNvdXJjZXJDb21tYW5kO1xufShDb21tYW5kXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU291cmNlckNvbW1hbmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vQ29udHJvbGxlcicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU2hvdFBhcmFtXzEgPSByZXF1aXJlKCcuL1Nob3RQYXJhbScpO1xudmFyIFNvdXJjZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlckNvbnRyb2xsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU291cmNlckNvbnRyb2xsZXIoc291cmNlcikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2VyKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLnNoaWVsZDsgfTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIudGVtcGVyYXR1cmU7IH07XG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLm1pc3NpbGVBbW1vOyB9O1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzb3VyY2VyLmZ1ZWw7IH07XG4gICAgICAgIHZhciBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xuICAgICAgICB0aGlzLnNjYW5FbmVteSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3NfMS5kZWZhdWx0LlNDQU5fV0FJVDtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgIHZhciByYWRhciA9IFV0aWxzXzEuZGVmYXVsdC5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY2FuQXR0YWNrID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlnc18xLmRlZmF1bHQuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuQXR0YWNrKHNvdXJjZXIsIHJhZGFyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5haGVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAwLjg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYWhlYWQgPSAtMC40O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gMC45O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlc2NlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmFzY2VudCA9IC0wLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZUxhc2VyID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgcG93ZXIpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZSA9IG5ldyBTaG90UGFyYW1fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUucG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ0xhc2VyJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTWlzc2lsZSA9IGZ1bmN0aW9uIChhaSkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbV8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5haSA9IGFpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLnNob3RUeXBlID0gJ01pc3NpbGUnO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gU291cmNlckNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXJfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29udHJvbGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIEVQU0lMT04gPSAxMGUtMTI7XG52YXIgVXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFV0aWxzKCkge1xuICAgIH1cbiAgICBVdGlscy5jcmVhdGVSYWRhciA9IGZ1bmN0aW9uIChjLCBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkge1xuICAgICAgICB2YXIgY2hlY2tEaXN0YW5jZSA9IGZ1bmN0aW9uICh0KSB7IHJldHVybiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlOyB9O1xuICAgICAgICBpZiAoMzYwIDw9IGFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xuICAgICAgICB2YXIgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcbiAgICAgICAgaWYgKGFuZ2xlIDwgMTgwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGNoZWNrTGVmdCh0KSAmJiBjaGVja1JpZ2h0KHQpICYmIGNoZWNrRGlzdGFuY2UodCk7IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuc2lkZSA9IGZ1bmN0aW9uIChiYXNlLCBkZWdyZWUpIHtcbiAgICAgICAgdmFyIHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBuZXcgVl8xLmRlZmF1bHQoTWF0aC5jb3MocmFkaWFuKSwgTWF0aC5zaW4ocmFkaWFuKSk7XG4gICAgICAgIHZhciBwcmV2aW91c2x5ID0gYmFzZS54ICogZGlyZWN0aW9uLnkgLSBiYXNlLnkgKiBkaXJlY3Rpb24ueCAtIEVQU0lMT047XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gMCA8PSB0YXJnZXQueCAqIGRpcmVjdGlvbi55IC0gdGFyZ2V0LnkgKiBkaXJlY3Rpb24ueCAtIHByZXZpb3VzbHk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBVdGlscy5jYWxjRGlzdGFuY2UgPSBmdW5jdGlvbiAoZiwgdCwgcCkge1xuICAgICAgICB2YXIgdG9Gcm9tID0gdC5zdWJ0cmFjdChmKTtcbiAgICAgICAgdmFyIHBGcm9tID0gcC5zdWJ0cmFjdChmKTtcbiAgICAgICAgaWYgKHRvRnJvbS5kb3QocEZyb20pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBGcm9tLmxlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xuICAgICAgICB2YXIgcFRvID0gcC5zdWJ0cmFjdCh0KTtcbiAgICAgICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xuICAgIH07XG4gICAgVXRpbHMudG9SYWRpYW4gPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgfTtcbiAgICBVdGlscy50b09wcG9zaXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICBkZWdyZWUgPSBkZWdyZWUgJSAzNjA7XG4gICAgICAgIGlmIChkZWdyZWUgPCAwKSB7XG4gICAgICAgICAgICBkZWdyZWUgPSBkZWdyZWUgKyAzNjA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZ3JlZSA8PSAxODApIHtcbiAgICAgICAgICAgIHJldHVybiAoOTAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoMjcwIC0gZGVncmVlKSAqIDIgKyBkZWdyZWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnJhbmQgPSBmdW5jdGlvbiAocmVuZ2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiByZW5nZTtcbiAgICB9O1xuICAgIHJldHVybiBVdGlscztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBVdGlscztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFYgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFYoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgdiwgdGhpcy55ICsgeSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHYsIHkpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtIHYsIHRoaXMueSAtIHkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LCB0aGlzLnkgKiB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5tb2R1bG8gPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LngsIHRoaXMueSAlIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdiwgdGhpcy55ICUgdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZExlbmd0aCA9IE1hdGguc3FydCh0aGlzLmRvdCgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZW5ndGg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xuICAgICAgICB2YXIgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseShzY2FsZSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5hbmdsZUluUmFkaWFucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZEFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIGlmIChwb2ludCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MocmFkaWFuKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKHJhZGlhbik7XG4gICAgICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XG4gICAgfTtcbiAgICBWLmRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWKDEsIDApLnJvdGF0ZShkZWdyZWUpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUubWluaW1pemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7IHg6IE1hdGgucm91bmQodGhpcy54KSwgeTogTWF0aC5yb3VuZCh0aGlzLnkpIH07XG4gICAgfTtcbiAgICByZXR1cm4gVjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWO1xuIl19
