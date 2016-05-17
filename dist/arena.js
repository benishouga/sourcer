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
            if (256 < this.frame) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnRlcm1lZGlhdGUvbGlicy9jaGFpbmNob21wLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vYXJlbmEuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0FjdG9yLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25maWdzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Db25zdHMuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0NvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL0ZpZWxkLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9GeC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvTGFzZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGUuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL01pc3NpbGVDb21tYW5kLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9NaXNzaWxlQ29udHJvbGxlci5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU2hvdFBhcmFtLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC5qcyIsImludGVybWVkaWF0ZS9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIuanMiLCJpbnRlcm1lZGlhdGUvbWFpbi9jb3JlL1V0aWxzLmpzIiwiaW50ZXJtZWRpYXRlL21haW4vY29yZS9WLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBJbnZva2UgdW50cnVzdGVkIGd1ZXN0IGNvZGUgaW4gYSBzYW5kYm94LlxuICogVGhlIGd1ZXN0IGNvZGUgY2FuIGFjY2VzcyBvYmplY3RzIG9mIHRoZSBzdGFuZGFyZCBsaWJyYXJ5IG9mIEVDTUFTY3JpcHQuXG4gKlxuICogZnVuY3Rpb24gY2hhaW5jaG9tcChzY3JpcHQ6IHN0cmluZywgc2NvcGU/OiBhbnkgPSB7fSk6IGFueTtcbiAqXG4gKiB0aGlzLnBhcmFtIHNjcmlwdCBndWVzdCBjb2RlLlxuICogdGhpcy5wYXJhbSBzY29wZSBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyB3aWxsIGJlIGV4cG9zZWQgdG8gdGhlIGd1ZXN0IGNvZGUuXG4gKiB0aGlzLnJldHVybiByZXN1bHQgb2YgdGhlIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIGNoYWluY2hvbXAoc2NyaXB0LCBzY29wZSwgb3B0aW9ucyl7XG4gICAgLy8gRmlyc3QsIHlvdSBuZWVkIHRvIHBpbGUgYSBwaWNrZXQgdG8gdGllIGEgQ2hhaW4gQ2hvbXAuXG4gICAgLy8gSWYgdGhlIGVudmlyb25tZW50IGlzIGNoYW5nZWQsIHRoZSBwaWNrZXQgd2lsbCBkcm9wIG91dC5cbiAgICAvLyBZb3Ugc2hvdWxkIHJlbWFrZSBhIG5ldyBwaWNrZXQgZWFjaCB0aW1lIGFzIGxvbmcgYXPjgIB5b3UgYXJlIHNvIGJ1c3kuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgdGhlIGdsb2JhbCBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG11c3QgcmVtYWtlIGEgcGlja2V0LlxuICAgIHZhciBwaWNrZXQgPSBjaGFpbmNob21wLnBpY2soKTtcblxuICAgIC8vIE5leHQsIGdldCBuZXcgQ2hhaW4gQ2hvbXAgdGllZCB0aGUgcGlja2V0LlxuICAgIC8vIERpZmZlcmVudCBDaGFpbiBDaG9tcHMgaGF2ZSBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJZiB5b3UgbmVlZCBhIGRpZmZlcmVudCBmdW5jdGlvbiwgeW91IGNhbiBnZXQgYW5vdGhlciBvbmUuXG4gICAgdmFyIGNob21wID0gcGlja2V0KHNjcmlwdCwgc2NvcGUpO1xuXG4gICAgLy8gTGFzdCwgZmVlZCB0aGUgY2hvbXAgYW5kIGxldCBpdCByYW1wYWdlIVxuICAgIC8vIEEgY2hvbXAgZWF0cyBub3RoaW5nIGJ1dOOAgGEga2luZCBvZiBmZWVkIHRoYXQgdGhlIGNob21wIGF0ZSBhdCBmaXJzdC5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWYgb25seSBhIHZhbHVlIGluIHRoZSBzY29wZSBvYmplY3QgaXMgY2hhbmdlZCwgeW91IG5lZWQgbm90IHRvIHJlbWFrZSB0aGUgQ2hhaW4gQ2hvbXAgYW5kIHRoZSBwaWNrZXQuXG4gICAgcmV0dXJuIGNob21wKG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBzYW5kYm94XG4gKi9cbmNoYWluY2hvbXAucGljayA9IChmdW5jdGlvbigpe1xuICAgIC8vIER5bmFtaWMgaW5zdGFudGlhdGlvbiBpZGlvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYwNjc5Ny91c2Utb2YtYXBwbHktd2l0aC1uZXctb3BlcmF0b3ItaXMtdGhpcy1wb3NzaWJsZVxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdChjb25zdHJ1Y3RvciwgYXJncykge1xuICAgICAgICBmdW5jdGlvbiBGKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIEYucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCYW5uZWRWYXJzKCl7XG4gICAgICAgIC8vIGNvcnJlY3QgYmFubmVkIG9iamVjdCBuYW1lcy5cbiAgICAgICAgdmFyIGJhbm5lZCA9IFsnX19wcm90b19fJywgJ3Byb3RvdHlwZSddO1xuICAgICAgICBmdW5jdGlvbiBiYW4oayl7XG4gICAgICAgICAgICBpZihrICYmIGJhbm5lZC5pbmRleE9mKGspIDwgMCAmJiBrICE9PSAnZXZhbCcgJiYgay5tYXRjaCgvXltfJGEtekEtWl1bXyRhLXpBLVowLTldKiQvKSl7XG4gICAgICAgICAgICAgICAgYmFubmVkLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdsb2JhbCA9IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGdsb2JhbCkuZm9yRWFjaChiYW4pO1xuICAgICAgICBmb3IodmFyIGsgaW4gZ2xvYmFsKXtcbiAgICAgICAgICAgIGJhbihrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJhbiBhbGwgaWRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZShlbGVtKXtcbiAgICAgICAgICAgIGJhbihlbGVtLmdldEF0dHJpYnV0ZSAmJiBlbGVtLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB2YXIgY2hpbGRzID0gZWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNoaWxkcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdHJhdmVyc2UoY2hpbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vICoqKiogc3VwcG9ydCBub2RlLmpzIHN0YXJ0ICoqKipcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRyYXZlcnNlKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAqKioqIHN1cHBvcnQgbm9kZS5qcyBlbmQgKioqKlxuXG4gICAgICAgIHJldHVybiBiYW5uZWQ7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgb2YgZXhwb3NlZCBvYmplY3RzXG4gICAgZnVuY3Rpb24gZ2V0U3RkbGlicygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ09iamVjdCcgICAgICAgICAgICA6IE9iamVjdCxcbiAgICAgICAgICAgICdTdHJpbmcnICAgICAgICAgICAgOiBTdHJpbmcsXG4gICAgICAgICAgICAnTnVtYmVyJyAgICAgICAgICAgIDogTnVtYmVyLFxuICAgICAgICAgICAgJ0Jvb2xlYW4nICAgICAgICAgICA6IEJvb2xlYW4sXG4gICAgICAgICAgICAnQXJyYXknICAgICAgICAgICAgIDogQXJyYXksXG4gICAgICAgICAgICAnRGF0ZScgICAgICAgICAgICAgIDogRGF0ZSxcbiAgICAgICAgICAgICdNYXRoJyAgICAgICAgICAgICAgOiBNYXRoLFxuICAgICAgICAgICAgJ1JlZ0V4cCcgICAgICAgICAgICA6IFJlZ0V4cCxcbiAgICAgICAgICAgICdFcnJvcicgICAgICAgICAgICAgOiBFcnJvcixcbiAgICAgICAgICAgICdFdmFsRXJyb3InICAgICAgICAgOiBFdmFsRXJyb3IsXG4gICAgICAgICAgICAnUmFuZ2VFcnJvcicgICAgICAgIDogUmFuZ2VFcnJvcixcbiAgICAgICAgICAgICdSZWZlcmVuY2VFcnJvcicgICAgOiBSZWZlcmVuY2VFcnJvcixcbiAgICAgICAgICAgICdTeW50YXhFcnJvcicgICAgICAgOiBTeW50YXhFcnJvcixcbiAgICAgICAgICAgICdUeXBlRXJyb3InICAgICAgICAgOiBUeXBlRXJyb3IsXG4gICAgICAgICAgICAnVVJJRXJyb3InICAgICAgICAgIDogVVJJRXJyb3IsXG4gICAgICAgICAgICAnSlNPTicgICAgICAgICAgICAgIDogSlNPTixcbiAgICAgICAgICAgICdOYU4nICAgICAgICAgICAgICAgOiBOYU4sXG4gICAgICAgICAgICAnSW5maW5pdHknICAgICAgICAgIDogSW5maW5pdHksXG4gICAgICAgICAgICAndW5kZWZpbmVkJyAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BhcnNlSW50JyAgICAgICAgICA6IHBhcnNlSW50LFxuICAgICAgICAgICAgJ3BhcnNlRmxvYXQnICAgICAgICA6IHBhcnNlRmxvYXQsXG4gICAgICAgICAgICAnaXNOYU4nICAgICAgICAgICAgIDogaXNOYU4sXG4gICAgICAgICAgICAnaXNGaW5pdGUnICAgICAgICAgIDogaXNGaW5pdGUsXG4gICAgICAgICAgICAnZGVjb2RlVVJJJyAgICAgICAgIDogZGVjb2RlVVJJLFxuICAgICAgICAgICAgJ2RlY29kZVVSSUNvbXBvbmVudCc6IGRlY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgICAgICdlbmNvZGVVUkknICAgICAgICAgOiBlbmNvZGVVUkksXG4gICAgICAgICAgICAnZW5jb2RlVVJJQ29tcG9uZW50JzogZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGlzRnJlZXplZFN0ZExpYk9ianMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBzYW5kYm94LlxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICBpZihpc0ZyZWV6ZWRTdGRMaWJPYmpzID09IGZhbHNlKXtcbiAgICAgICAgICAgIHZhciBzdGRsaWJzID0gZ2V0U3RkbGlicygpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmcmVlemUodil7XG4gICAgICAgICAgICAgICAgaWYodiAmJiAodHlwZW9mIHYgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSAmJiAhIE9iamVjdC5pc0Zyb3plbih2KSl7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUodik7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHYpLmZvckVhY2goZnVuY3Rpb24oaywgaSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2W2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGlvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyZWV6ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyZWV6ZShzdGRsaWJzKTtcblxuICAgICAgICAgICAgLy8gZnJlZXplIEZ1bmN0aW9uLnByb3RvdHlwZVxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbigpeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FjY2VzcyB0byBcIkZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvclwiIGlzIG5vdCBhbGxvd2VkLicpIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnJlZXplKEZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgaXNGcmVlemVkU3RkTGliT2JqcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmFubmVkID0gZ2V0QmFubmVkVmFycygpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjcmVhdGUgc2FuZGJveGVkIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24oc2NyaXB0LCBzY29wZSl7XG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSBhcmd1bWVudHNcbiAgICAgICAgICAgIGlmKCAhICh0eXBlb2Ygc2NyaXB0ID09PSAnc3RyaW5nJyB8fCBzY3JpcHQgaW5zdGFuY2VvZiBTdHJpbmcgKSl7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSBkZWZhdWx0IHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LnNlYWwoc2NvcGUpO1xuXG4gICAgICAgICAgICAvLyBFeHBvc2UgY3VzdG9tIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHZhciBndWVzdEdsb2JhbCA9IGdldFN0ZGxpYnMoKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgIGd1ZXN0R2xvYmFsW2tdID0gc2NvcGVba107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKGd1ZXN0R2xvYmFsKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHNhbmRib3hlZCBmdW5jdGlvblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBPYmplY3Qua2V5cyhndWVzdEdsb2JhbCkuY29uY2F0KGJhbm5lZC5maWx0ZXIoZnVuY3Rpb24oYil7IHJldHVybiAhIGd1ZXN0R2xvYmFsLmhhc093blByb3BlcnR5KGIpOyB9KSk7XG4gICAgICAgICAgICBhcmdzLnB1c2goJ1widXNlIHN0cmljdFwiO1xcbicgKyBzY3JpcHQpO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uT2JqZWN0ID0gY29uc3RydWN0KEZ1bmN0aW9uLCBhcmdzKTtcblxuICAgICAgICAgICAgdmFyIHNhZmVFdmFsID0gZnVuY3Rpb24ocyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgcywgZ3Vlc3RHbG9iYWwpKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShzYWZlRXZhbCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW52b2tlIHNhbmRib3hlZCBmdW5jdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGludm9rZVNhbmRib3hlZEZ1bmN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGV2YWwgd2l0aCBzYWZlIGV2YWwtbGlrZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHZhciBfZXZhbCA9IGV2YWw7XG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5kZWJ1ZyAhPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwgPSBzYWZlRXZhbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgc2FuZGJveGVkIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN0b3JlIGRlZmF1bHQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Vlc3RHbG9iYWxba10gPSBzY29wZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbFxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gT2JqZWN0LmtleXMoZ3Vlc3RHbG9iYWwpLm1hcChmdW5jdGlvbihrKXsgcmV0dXJuIGd1ZXN0R2xvYmFsW2tdOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uT2JqZWN0LmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9ZmluYWxseXtcbiAgICAgICAgICAgICAgICAgICAgZXZhbCA9IF9ldmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBpbnZva2VTYW5kYm94ZWRGdW5jdGlvbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNhbmRib3hlZEZ1bmN0aW9uO1xuICAgIH07XG59KSgpO1xuXG4vL1xuY2hhaW5jaG9tcC5jYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBhcmdzLCBvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcblxuICAgIC8vIHJlcGxhY2UgZXZhbCB3aXRoIHNhZmUgZXZhbC1saWtlIGZ1bmN0aW9uXG4gICAgdmFyIF9ldmFsID0gZXZhbDtcbiAgICBpZihvcHRpb25zLmRlYnVnICE9PSB0cnVlKXtcbiAgICAgICAgZXZhbCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnl7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICBldmFsID0gX2V2YWw7XG4gICAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gY2hhaW5jaG9tcDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEZpZWxkXzEgPSByZXF1aXJlKCcuL2NvcmUvRmllbGQnKTtcbnZhciBTb3VyY2VyXzEgPSByZXF1aXJlKCcuL2NvcmUvU291cmNlcicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL2NvcmUvVXRpbHMnKTtcbmZ1bmN0aW9uIGNyZWF0ZShmaWVsZCwgc291cmNlLCBpbmRleCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBzaWRlID0gKGluZGV4ICUgMiA9PT0gMCkgPyAtMSA6IDE7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VyXzEuZGVmYXVsdChmaWVsZCwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoODApICsgMTYwICogc2lkZSwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoMTYwKSArIDgwLCBzb3VyY2UuYWksIHNvdXJjZS5hY2NvdW50LCBzb3VyY2UubmFtZSwgc291cmNlLmNvbG9yKTtcbn1cbm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGlzRGVtbyA9IGUuZGF0YS5pc0RlbW87XG4gICAgdmFyIHNvdXJjZXMgPSBlLmRhdGEuc291cmNlcztcbiAgICB2YXIgaWRUb0luZGV4ID0ge307XG4gICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgICBvblByZVRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQcmVUaGlua1wiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpZFRvSW5kZXhbc291cmNlcklkXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdFRoaW5rOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJQb3N0VGhpbmtcIixcbiAgICAgICAgICAgICAgICBpbmRleDogaWRUb0luZGV4W3NvdXJjZXJJZF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkZyYW1lOiBmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBcIkZyYW1lXCIsXG4gICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiRmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRW5kT2ZHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJFbmRPZkdhbWVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9nOiBmdW5jdGlvbiAoc291cmNlcklkKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uTG9nXCIpO1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiTG9nXCIsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGlkVG9JbmRleFtzb3VyY2VySWRdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBmaWVsZCA9IG5ldyBGaWVsZF8xLmRlZmF1bHQoaXNEZW1vKTtcbiAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIgc291cmNlciA9IGNyZWF0ZShmaWVsZCwgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgZmllbGQuYWRkU291cmNlcihzb3VyY2VyKTtcbiAgICAgICAgaWRUb0luZGV4W3NvdXJjZXIuaWRdID0gaW5kZXg7XG4gICAgfSk7XG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb21tYW5kOiBcIlBsYXllcnNcIixcbiAgICAgICAgcGxheWVyczogZmllbGQucGxheWVycygpXG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDAwMCAmJiAhZmllbGQuaXNGaW5pc2hlZDsgaSsrKSB7XG4gICAgICAgIGZpZWxkLnRpY2sobGlzdGVuZXIpO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBWXzEgPSByZXF1aXJlKCcuL1YnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBBY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWN0b3IoZmllbGQsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB0aGlzLnNpemUgPSBDb25maWdzXzEuZGVmYXVsdC5DT0xMSVNJT05fU0laRTtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy53YWl0ID0gMDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWXzEuZGVmYXVsdCh4LCB5KTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWXzEuZGVmYXVsdCgwLCAwKTtcbiAgICB9XG4gICAgQWN0b3IucHJvdG90eXBlLnRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMud2FpdCA9IDA7XG4gICAgICAgICAgICB0aGlzLm9uVGhpbmsoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FpdC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbm90IHRoaW5rIGFueXRoaW5nLlxuICAgIH07XG4gICAgO1xuICAgIEFjdG9yLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9O1xuICAgIEFjdG9yLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfTtcbiAgICBBY3Rvci5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGltZW50YXRpb24nKTtcbiAgICB9O1xuICAgIHJldHVybiBBY3Rvcjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBDb21tYW5kLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWNjZXB0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29tbWFuZC4gXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNBY2NlcHRlZCA9IHRydWU7XG4gICAgfTtcbiAgICBDb21tYW5kLnByb3RvdHlwZS51bmFjY2VwdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gQ29tbWFuZDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb21tYW5kO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29uZmlncyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uZmlncygpIHtcbiAgICB9XG4gICAgQ29uZmlncy5JTklUSUFMX1NISUVMRCA9IDEwMDtcbiAgICBDb25maWdzLklOSVRJQUxfRlVFTCA9IDEwMDtcbiAgICBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PID0gMjA7XG4gICAgQ29uZmlncy5MQVNFUl9BVFRFTlVBVElPTiA9IDE7XG4gICAgQ29uZmlncy5MQVNFUl9NT01FTlRVTSA9IDEyODtcbiAgICBDb25maWdzLkZVRUxfQ09TVCA9IDAuMjQ7XG4gICAgQ29uZmlncy5DT0xMSVNJT05fU0laRSA9IDQ7XG4gICAgQ29uZmlncy5TQ0FOX1dBSVQgPSAwLjM1O1xuICAgIENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSA9IDAuOTY7XG4gICAgQ29uZmlncy5HUkFWSVRZID0gMC4xO1xuICAgIENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EID0gNDgwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSID0gNDAwO1xuICAgIENvbmZpZ3MuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQgPSAwLjAwODtcbiAgICBDb25maWdzLk9WRVJIRUFUX0JPUkRFUiA9IDEwMDtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUID0gMC4wNTtcbiAgICBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQgPSAwLjAxMjtcbiAgICBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEUgPSAxO1xuICAgIENvbmZpZ3MuQ09PTF9ET1dOID0gMC41O1xuICAgIENvbmZpZ3MuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUgPSAwLjQ7XG4gICAgcmV0dXJuIENvbmZpZ3M7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29uZmlncztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvbnN0cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3RzKCkge1xuICAgIH1cbiAgICBDb25zdHMuRElSRUNUSU9OX1JJR0hUID0gMTtcbiAgICBDb25zdHMuRElSRUNUSU9OX0xFRlQgPSAtMTtcbiAgICBDb25zdHMuVkVSVElDQUxfVVAgPSBcInZlcnRpYWxfdXBcIjtcbiAgICBDb25zdHMuVkVSVElDQUxfRE9XTiA9IFwidmVydGlhbF9kb3duXCI7XG4gICAgcmV0dXJuIENvbnN0cztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb25zdHM7XG47XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb250cm9sbGVyKGFjdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY291bnRPZlRoaW5rcyA9IDA7XG4gICAgICAgIHRoaXMucHJlVGhpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jb3VudE9mVGhpbmtzKys7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzW19pIC0gMF0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbWVzc2FnZXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpZWxkID0gYWN0b3IuZmllbGQ7XG4gICAgICAgIHRoaXMuZnJhbWUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5jb3VudE9mVGhpbmtzOyB9O1xuICAgICAgICB0aGlzLmFsdGl0dWRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gYWN0b3IucG9zaXRpb24ueTsgfTtcbiAgICAgICAgdGhpcy53YWl0ID0gZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgICAgICAgICBpZiAoMCA8IGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgYWN0b3Iud2FpdCArPSBmcmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2xsZXI7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29udHJvbGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIFV0aWxzXzEgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgRmllbGQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZpZWxkKGlzRGVtbykge1xuICAgICAgICB0aGlzLmlzRGVtbyA9IGlzRGVtbztcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSAwO1xuICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kdW1teUVuZW15ID0gbmV3IFZfMS5kZWZhdWx0KDAsIDE1MCk7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB0aGlzLnNvdXJjZXJzID0gW107XG4gICAgICAgIHRoaXMuc2hvdHMgPSBbXTtcbiAgICAgICAgdGhpcy5meHMgPSBbXTtcbiAgICB9XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNvdXJjZXIgPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLmlkID0gdGhpcy5jdXJyZW50SWQrKztcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5wdXNoKHNvdXJjZXIpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmFkZFNob3QgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICBzaG90LmlkID0gdGhpcy5jdXJyZW50SWQrKztcbiAgICAgICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnJlbW92ZVNob3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuc2hvdHMuaW5kZXhPZih0YXJnZXQpO1xuICAgICAgICBpZiAoMCA8PSBpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuYWRkRnggPSBmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgZnguaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xuICAgICAgICB0aGlzLmZ4cy5wdXNoKGZ4KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5yZW1vdmVGeCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5meHMuaW5kZXhPZih0YXJnZXQpO1xuICAgICAgICBpZiAoMCA8PSBpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5meHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgLy8gVG8gYmUgdXNlZCBpbiB0aGUgaW52aXNpYmxlIGhhbmQuXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XG4gICAgICAgIC8vIFRoaW5rIHBoYXNlXG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzb3VyY2VyLmlkKTtcbiAgICAgICAgICAgIHNvdXJjZXIudGhpbmsoKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNob3Qub3duZXIuaWQpO1xuICAgICAgICAgICAgc2hvdC50aGluaygpO1xuICAgICAgICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc2hvdC5vd25lci5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBBY3Rpb24gcGhhc2VcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IuYWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBhY3Rvci5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnhzLmZvckVhY2goZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgICAgICBmeC5hY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIE1vdmUgcGhhc2VcbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zaG90cy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgICAgYWN0b3IubW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4Lm1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENoZWNrIHBoYXNlXG4gICAgICAgIHRoaXMuY2hlY2tGaW5pc2gobGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmNoZWNrRW5kT2ZHYW1lKGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICAvLyBvbkZyYW1lXG4gICAgICAgIGxpc3RlbmVyLm9uRnJhbWUodGhpcy5kdW1wKCkpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrRmluaXNoID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVtbykge1xuICAgICAgICAgICAgaWYgKDI1NiA8IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IHsgZnJhbWU6IHRoaXMuZnJhbWUgfTtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDmsbrlrprmuIjjgb9cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VyKSB7IHNvdXJjZXIuYWxpdmUgPSAwIDwgc291cmNlci5zaGllbGQ7IH0pO1xuICAgICAgICB2YXIgc3Vydml2ZXJzID0gdGhpcy5zb3VyY2Vycy5maWx0ZXIoZnVuY3Rpb24gKHNvdXJjZXIpIHsgcmV0dXJuIHNvdXJjZXIuYWxpdmU7IH0pO1xuICAgICAgICBpZiAoMSA8IHN1cnZpdmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3Vydml2ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdmFyIHN1cnZpdmVyID0gc3Vydml2ZXJzWzBdO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgd2lubmVySWQ6IHN1cnZpdmVyLmlkLFxuICAgICAgICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgICAgIGlzRHJhdzogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBubyBzdXJ2aXZlci4uIGRyYXcuLi5cbiAgICAgICAgdGhpcy5yZXN1bHQgPSB7XG4gICAgICAgICAgICB3aW5uZXJJZDogbnVsbCxcbiAgICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgaXNEcmF3OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrRW5kT2ZHYW1lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRmluaXNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMucmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNEZW1vKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGlzdGVuZXIub25FbmRPZkdhbWUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZXN1bHQuZnJhbWUgPCB0aGlzLmZyYW1lIC0gOTApIHtcbiAgICAgICAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGaWVsZC5wcm90b3R5cGUuc2NhbkVuZW15ID0gZnVuY3Rpb24gKG93bmVyLCByYWRhcikge1xuICAgICAgICBpZiAodGhpcy5pc0RlbW8gJiYgdGhpcy5zb3VyY2Vycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiByYWRhcih0aGlzLmR1bW15RW5lbXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXJzLnNvbWUoZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IG93bmVyICYmIHJhZGFyKHNvdXJjZXIucG9zaXRpb24pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5zY2FuQXR0YWNrID0gZnVuY3Rpb24gKG93bmVyLCByYWRhcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5zaG90cy5zb21lKGZ1bmN0aW9uIChzaG90KSB7XG4gICAgICAgICAgICByZXR1cm4gc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoc2hvdC5wb3NpdGlvbikgJiYgX3RoaXMuaXNJbmNvbWluZyhvd25lciwgc2hvdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmlzSW5jb21pbmcgPSBmdW5jdGlvbiAob3duZXIsIHNob3QpIHtcbiAgICAgICAgdmFyIG93bmVyUG9zaXRpb24gPSBvd25lci5wb3NpdGlvbjtcbiAgICAgICAgdmFyIGFjdG9yUG9zaXRpb24gPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICB2YXIgY3VycmVudERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uKTtcbiAgICAgICAgdmFyIG5leHREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCkpO1xuICAgICAgICByZXR1cm4gbmV4dERpc3RhbmNlIDwgY3VycmVudERpc3RhbmNlO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmNoZWNrQ29sbGlzaW9uID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdmFyIGYgPSBzaG90LnBvc2l0aW9uO1xuICAgICAgICB2YXIgdCA9IHNob3QucG9zaXRpb24uYWRkKHNob3Quc3BlZWQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhY3RvciA9IHRoaXMuc2hvdHNbaV07XG4gICAgICAgICAgICBpZiAoYWN0b3IuYnJlYWthYmxlICYmIGFjdG9yLm93bmVyICE9PSBzaG90Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gVXRpbHNfMS5kZWZhdWx0LmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VyY2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gc2hvdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IFV0aWxzXzEuZGVmYXVsdC5jYWxjRGlzdGFuY2UoZiwgdCwgc291cmNlci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgc2hvdC5zaXplICsgc291cmNlci5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQgPSBmdW5jdGlvbiAoc2hvdCkge1xuICAgICAgICByZXR1cm4gc2hvdC5wb3NpdGlvbi55IDwgMDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5jb21wdXRlQ2VudGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICB2YXIgc3VtWCA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICAgICAgaWYgKHNvdXJjZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICBzdW1YICs9IHNvdXJjZXIucG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1bVggLyBjb3VudDtcbiAgICB9O1xuICAgIEZpZWxkLnByb3RvdHlwZS5wbGF5ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGxheWVycyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZXIpIHtcbiAgICAgICAgICAgIHBsYXllcnNbc291cmNlci5pZF0gPSB7IG5hbWU6IHNvdXJjZXIubmFtZSB8fCBzb3VyY2VyLmFjY291bnQsIGFjY291bnQ6IHNvdXJjZXIuYWNjb3VudCwgY29sb3I6IHNvdXJjZXIuY29sb3IgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJzO1xuICAgIH07XG4gICAgRmllbGQucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2Vyc0R1bXAgPSBbXTtcbiAgICAgICAgdmFyIHNob3RzRHVtcCA9IFtdO1xuICAgICAgICB2YXIgZnhEdW1wID0gW107XG4gICAgICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICAgIHNvdXJjZXJzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNob3RzLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgICBzaG90c0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5meHMuZm9yRWFjaChmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZjogdGhpcy5mcmFtZSxcbiAgICAgICAgICAgIHM6IHNvdXJjZXJzRHVtcCxcbiAgICAgICAgICAgIGI6IHNob3RzRHVtcCxcbiAgICAgICAgICAgIHg6IGZ4RHVtcFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEZpZWxkO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEZpZWxkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRnggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZ4KGZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkge1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgfVxuICAgIEZ4LnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZ4LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gICAgfTtcbiAgICBGeC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGk6IHRoaXMuaWQsXG4gICAgICAgICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXG4gICAgICAgICAgICBmOiB0aGlzLmZyYW1lLFxuICAgICAgICAgICAgbDogTWF0aC5yb3VuZCh0aGlzLmxlbmd0aClcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBGeDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBGeDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU2hvdF8xID0gcmVxdWlyZSgnLi9TaG90Jyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgTGFzZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMYXNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMYXNlcihmaWVsZCwgb3duZXIsIGRpcmVjdGlvbiwgcG93ZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIG93bmVyLCBcIkxhc2VyXCIpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDU7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gODsgfTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IFZfMS5kZWZhdWx0LmRpcmVjdGlvbihkaXJlY3Rpb24pLm11bHRpcGx5KHBvd2VyKTtcbiAgICAgICAgdGhpcy5tb21lbnR1bSA9IENvbmZpZ3NfMS5kZWZhdWx0LkxBU0VSX01PTUVOVFVNO1xuICAgIH1cbiAgICBMYXNlci5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmFjdGlvbi5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLm1vbWVudHVtIC09IENvbmZpZ3NfMS5kZWZhdWx0LkxBU0VSX0FUVEVOVUFUSU9OO1xuICAgICAgICBpZiAodGhpcy5tb21lbnR1bSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIExhc2VyO1xufShTaG90XzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTGFzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFNob3RfMSA9IHJlcXVpcmUoJy4vU2hvdCcpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIE1pc3NpbGVDb21tYW5kXzEgPSByZXF1aXJlKCcuL01pc3NpbGVDb21tYW5kJyk7XG52YXIgTWlzc2lsZUNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoJy4vTWlzc2lsZUNvbnRyb2xsZXInKTtcbnZhciBDb25zdHNfMSA9IHJlcXVpcmUoJy4vQ29uc3RzJyk7XG52YXIgTWlzc2lsZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZShmaWVsZCwgb3duZXIsIGFpKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGZpZWxkLCBvd25lciwgXCJNaXNzaWxlXCIpO1xuICAgICAgICB0aGlzLmFpID0gYWk7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSAxMDtcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAxMCArIF90aGlzLnNwZWVkLmxlbmd0aCgpICogMjsgfTtcbiAgICAgICAgdGhpcy5mdWVsID0gMTAwO1xuICAgICAgICB0aGlzLmJyZWFrYWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYWkgPSBhaTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBvd25lci5kaXJlY3Rpb24gPT09IENvbnN0c18xLmRlZmF1bHQuRElSRUNUSU9OX1JJR0hUID8gMCA6IDE4MDtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG93bmVyLnNwZWVkO1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSBuZXcgTWlzc2lsZUNvbW1hbmRfMS5kZWZhdWx0KHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyXzEuZGVmYXVsdCh0aGlzKTtcbiAgICB9XG4gICAgTWlzc2lsZS5wcm90b3R5cGUub25UaGluayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuYWkodGhpcy5jb250cm9sbGVyKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9uQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzXzEuZGVmYXVsdC5TUEVFRF9SRVNJU1RBTkNFKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfTtcbiAgICBNaXNzaWxlLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChhdHRhY2spIHtcbiAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xuICAgICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QoYXR0YWNrKTtcbiAgICB9O1xuICAgIE1pc3NpbGUucHJvdG90eXBlLm9wcG9zaXRlID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gKyBkaXJlY3Rpb247XG4gICAgfTtcbiAgICByZXR1cm4gTWlzc2lsZTtcbn0oU2hvdF8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1pc3NpbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIE1pc3NpbGVDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWlzc2lsZUNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWlzc2lsZUNvbW1hbmQobWlzc2lsZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5taXNzaWxlID0gbWlzc2lsZTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICBNaXNzaWxlQ29tbWFuZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BlZWRVcCA9IDA7XG4gICAgICAgIHRoaXMuc3BlZWREb3duID0gMDtcbiAgICAgICAgdGhpcy50dXJuID0gMDtcbiAgICB9O1xuICAgIE1pc3NpbGVDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZS5mdWVsKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkID0gVl8xLmRlZmF1bHQuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLmFkZChub3JtYWxpemVkLm11bHRpcGx5KHRoaXMuc3BlZWRVcCkpO1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMubWlzc2lsZS5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5taXNzaWxlLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTWlzc2lsZUNvbW1hbmQ7XG59KENvbW1hbmRfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBNaXNzaWxlQ29tbWFuZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBNaXNzaWxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1pc3NpbGVDb250cm9sbGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1pc3NpbGVDb250cm9sbGVyKG1pc3NpbGUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbWlzc2lsZSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWlzc2lsZS5kaXJlY3Rpb247IH07XG4gICAgICAgIHZhciBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XG4gICAgICAgIHZhciBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtaXNzaWxlLmZ1ZWw7IH07XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBtaXNzaWxlLndhaXQgKz0gMS41O1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gbWlzc2lsZS5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKG1pc3NpbGUucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBtaXNzaWxlLmZpZWxkLnNjYW5FbmVteShtaXNzaWxlLm93bmVyLCByYWRhcik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BlZWRVcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuc3BlZWRVcCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGVlZERvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuUmlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLnR1cm4gPSAtOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuTGVmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQudHVybiA9IDk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBNaXNzaWxlQ29udHJvbGxlcjtcbn0oQ29udHJvbGxlcl8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1pc3NpbGVDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBBY3Rvcl8xID0gcmVxdWlyZSgnLi9BY3RvcicpO1xudmFyIEZ4XzEgPSByZXF1aXJlKCcuL0Z4Jyk7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTaG90ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2hvdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaG90KGZpZWxkLCBvd25lciwgdHlwZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBmaWVsZCwgb3duZXIucG9zaXRpb24ueCwgb3duZXIucG9zaXRpb24ueSk7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IDA7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfTtcbiAgICAgICAgdGhpcy5icmVha2FibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgU2hvdC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uQWN0aW9uKCk7XG4gICAgICAgIHZhciBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XG4gICAgICAgIGlmIChjb2xsaWRlZCkge1xuICAgICAgICAgICAgY29sbGlkZWQub25IaXQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVGeHMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUuY3JlYXRlRnhzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHNfMS5kZWZhdWx0LnJhbmQoMTYpIC0gOCwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoMTYpIC0gOCk7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBuZXcgVl8xLmRlZmF1bHQoVXRpbHNfMS5kZWZhdWx0LnJhbmQoMSkgLSAwLjUsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDEpIC0gMC41KTtcbiAgICAgICAgICAgIHZhciBsZW5ndGhfMSA9IFV0aWxzXzEuZGVmYXVsdC5yYW5kKDgpICsgNDtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4XzEuZGVmYXVsdCh0aGlzLmZpZWxkLCBwb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMikuYWRkKHNwZWVkKSwgbGVuZ3RoXzEpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUucmVhY3Rpb24gPSBmdW5jdGlvbiAoc291cmNlcikge1xuICAgICAgICBzb3VyY2VyLnRlbXBlcmF0dXJlICs9IHRoaXMudGVtcGVyYXR1cmU7XG4gICAgfTtcbiAgICBTaG90LnByb3RvdHlwZS5vbkFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH07XG4gICAgU2hvdC5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHRoaXMub3duZXIuaWQsXG4gICAgICAgICAgICBpOiB0aGlzLmlkLFxuICAgICAgICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXG4gICAgICAgICAgICBzOiB0aGlzLnR5cGVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBTaG90O1xufShBY3Rvcl8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNob3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBTaG90UGFyYW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNob3RQYXJhbSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIFNob3RQYXJhbTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTaG90UGFyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGNoYWluY2hvbXBfMSA9IHJlcXVpcmUoJy4uLy4uL2xpYnMvY2hhaW5jaG9tcCcpO1xudmFyIEFjdG9yXzEgPSByZXF1aXJlKCcuL0FjdG9yJyk7XG52YXIgU291cmNlckNvbW1hbmRfMSA9IHJlcXVpcmUoJy4vU291cmNlckNvbW1hbmQnKTtcbnZhciBTb3VyY2VyQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Tb3VyY2VyQ29udHJvbGxlcicpO1xudmFyIENvbmZpZ3NfMSA9IHJlcXVpcmUoJy4vQ29uZmlncycpO1xudmFyIENvbnN0c18xID0gcmVxdWlyZSgnLi9Db25zdHMnKTtcbnZhciBVdGlsc18xID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIFZfMSA9IHJlcXVpcmUoJy4vVicpO1xudmFyIExhc2VyXzEgPSByZXF1aXJlKCcuL0xhc2VyJyk7XG52YXIgTWlzc2lsZV8xID0gcmVxdWlyZSgnLi9NaXNzaWxlJyk7XG52YXIgRnhfMSA9IHJlcXVpcmUoJy4vRngnKTtcbnZhciBTb3VyY2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU291cmNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyKGZpZWxkLCB4LCB5LCBhaSwgYWNjb3VudCwgbmFtZSwgY29sb3IpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZmllbGQsIHgsIHkpO1xuICAgICAgICB0aGlzLmFjY291bnQgPSBhY2NvdW50O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gMDtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBDb25maWdzXzEuZGVmYXVsdC5JTklUSUFMX1NISUVMRDtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IENvbmZpZ3NfMS5kZWZhdWx0LklOSVRJQUxfTUlTU0lMRV9BTU1PO1xuICAgICAgICB0aGlzLmZ1ZWwgPSBDb25maWdzXzEuZGVmYXVsdC5JTklUSUFMX0ZVRUw7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IENvbnN0c18xLmRlZmF1bHQuRElSRUNUSU9OX1JJR0hUIDogQ29uc3RzXzEuZGVmYXVsdC5ESVJFQ1RJT05fTEVGVDtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyXzEuZGVmYXVsdCh0aGlzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHtcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0czogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFpID0gY2hhaW5jaG9tcF8xLmRlZmF1bHQoYWksIHNjb3BlKSB8fCBzY29wZS5tb2R1bGUgJiYgc2NvcGUubW9kdWxlLmV4cG9ydHM7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmFpID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vblRoaW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5haSA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuYWkodGhpcy5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlICYmIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDgpIDwgMSkge1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHNfMS5kZWZhdWx0LnJhbmQoMTYpIC0gOCwgVXRpbHNfMS5kZWZhdWx0LnJhbmQoMTYpIC0gOCk7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBuZXcgVl8xLmRlZmF1bHQoVXRpbHNfMS5kZWZhdWx0LnJhbmQoMSkgLSAwLjUsIFV0aWxzXzEuZGVmYXVsdC5yYW5kKDEpICsgMC41KTtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBVdGlsc18xLmRlZmF1bHQucmFuZCg4KSArIDQ7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeF8xLmRlZmF1bHQodGhpcy5maWVsZCwgcG9zaXRpb24sIHNwZWVkLCBsZW5ndGgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhaXIgcmVzaXN0YW5jZVxuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzXzEuZGVmYXVsdC5TUEVFRF9SRVNJU1RBTkNFKTtcbiAgICAgICAgLy8gZ3Jhdml0eVxuICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzXzEuZGVmYXVsdC5HUkFWSVRZKTtcbiAgICAgICAgLy8gY29udHJvbCBhbHRpdHVkZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcbiAgICAgICAgaWYgKENvbmZpZ3NfMS5kZWZhdWx0LlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xuICAgICAgICAgICAgdmFyIGludmlzaWJsZVBvd2VyID0gKHRoaXMucG9zaXRpb24ueSAtIENvbmZpZ3NfMS5kZWZhdWx0LlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzXzEuZGVmYXVsdC5HUkFWSVRZICogaW52aXNpYmxlUG93ZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRyb2wgZGlzdGFuY2UgYnkgdGhlIGludmlzaWJsZSBoYW5kXG4gICAgICAgIHZhciBkaWZmID0gdGhpcy5maWVsZC5jZW50ZXIgLSB0aGlzLnBvc2l0aW9uLng7XG4gICAgICAgIGlmIChDb25maWdzXzEuZGVmYXVsdC5ESVNUQU5DRV9CT1JEQVIgPCBNYXRoLmFicyhkaWZmKSkge1xuICAgICAgICAgICAgdmFyIG4gPSBkaWZmIDwgMCA/IC0xIDogMTtcbiAgICAgICAgICAgIHZhciBpbnZpc2libGVIYW5kID0gKE1hdGguYWJzKGRpZmYpIC0gQ29uZmlnc18xLmRlZmF1bHQuRElTVEFOQ0VfQk9SREFSKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EICogbjtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVl8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54ICsgaW52aXNpYmxlSGFuZCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnbyBpbnRvIHRoZSBncm91bmRcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkIC09ICgtdGhpcy5zcGVlZC55ICogQ29uZmlnc18xLmRlZmF1bHQuR1JPVU5EX0RBTUFHRV9TQ0FMRSk7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgMCk7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFZfMS5kZWZhdWx0KHRoaXMuc3BlZWQueCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSAtPSBDb25maWdzXzEuZGVmYXVsdC5DT09MX0RPV047XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBNYXRoLm1heCh0aGlzLnRlbXBlcmF0dXJlLCAwKTtcbiAgICAgICAgLy8gb3ZlcmhlYXRcbiAgICAgICAgdmFyIG92ZXJoZWF0ID0gKHRoaXMudGVtcGVyYXR1cmUgLSBDb25maWdzXzEuZGVmYXVsdC5PVkVSSEVBVF9CT1JERVIpO1xuICAgICAgICBpZiAoMCA8IG92ZXJoZWF0KSB7XG4gICAgICAgICAgICB2YXIgbGluZWFyRGFtYWdlID0gb3ZlcmhlYXQgKiBDb25maWdzXzEuZGVmYXVsdC5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVDtcbiAgICAgICAgICAgIHZhciBwb3dlckRhbWFnZSA9IE1hdGgucG93KG92ZXJoZWF0ICogQ29uZmlnc18xLmRlZmF1bHQuT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCwgMik7XG4gICAgICAgICAgICB0aGlzLnNoaWVsZCAtPSAobGluZWFyRGFtYWdlICsgcG93ZXJEYW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xuICAgICAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSBcIkxhc2VyXCIpIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB2YXIgc2hvdCA9IG5ldyBMYXNlcl8xLmRlZmF1bHQodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XG4gICAgICAgICAgICBzaG90LnJlYWN0aW9uKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KHNob3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ01pc3NpbGUnKSB7XG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWlzc2lsZSA9IG5ldyBNaXNzaWxlXzEuZGVmYXVsdCh0aGlzLmZpZWxkLCB0aGlzLCBwYXJhbS5haSk7XG4gICAgICAgICAgICAgICAgbWlzc2lsZS5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NpbGVBbW1vLS07XG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KG1pc3NpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VyY2VyLnByb3RvdHlwZS5vcHBvc2l0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBDb25zdHNfMS5kZWZhdWx0LkRJUkVDVElPTl9MRUZUKSB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHNfMS5kZWZhdWx0LnRvT3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24gKHNob3QpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuYWRkKHNob3Quc3BlZWQubXVsdGlwbHkoQ29uZmlnc18xLmRlZmF1bHQuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUpKTtcbiAgICAgICAgdGhpcy5zaGllbGQgLT0gc2hvdC5kYW1hZ2UoKTtcbiAgICAgICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG4gICAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChzaG90KTtcbiAgICB9O1xuICAgIFNvdXJjZXIucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpOiB0aGlzLmlkLFxuICAgICAgICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXG4gICAgICAgICAgICBoOiBNYXRoLnJvdW5kKHRoaXMuc2hpZWxkKSxcbiAgICAgICAgICAgIHQ6IE1hdGgucm91bmQodGhpcy50ZW1wZXJhdHVyZSksXG4gICAgICAgICAgICBhOiB0aGlzLm1pc3NpbGVBbW1vLFxuICAgICAgICAgICAgZjogTWF0aC5yb3VuZCh0aGlzLmZ1ZWwpXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlcjtcbn0oQWN0b3JfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb25maWdzXzEgPSByZXF1aXJlKCcuL0NvbmZpZ3MnKTtcbnZhciBTb3VyY2VyQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvdXJjZXJDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNvdXJjZXJDb21tYW5kKHNvdXJjZXIpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuc291cmNlciA9IHNvdXJjZXI7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgU291cmNlckNvbW1hbmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFoZWFkID0gMDtcbiAgICAgICAgdGhpcy5hc2NlbnQgPSAwO1xuICAgICAgICB0aGlzLnR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maXJlID0gbnVsbDtcbiAgICB9O1xuICAgIFNvdXJjZXJDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5maXJlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZXIuZmlyZSh0aGlzLmZpcmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnR1cm4pIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgPCB0aGlzLnNvdXJjZXIuZnVlbCkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgLT0gKE1hdGguYWJzKHRoaXMuYWhlYWQpICsgTWF0aC5hYnModGhpcy5hc2NlbnQpKSAqIENvbmZpZ3NfMS5kZWZhdWx0LkZVRUxfQ09TVDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU291cmNlckNvbW1hbmQ7XG59KENvbW1hbmRfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTb3VyY2VyQ29tbWFuZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29udHJvbGxlcl8xID0gcmVxdWlyZSgnLi9Db250cm9sbGVyJyk7XG52YXIgQ29uZmlnc18xID0gcmVxdWlyZSgnLi9Db25maWdzJyk7XG52YXIgVXRpbHNfMSA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTaG90UGFyYW1fMSA9IHJlcXVpcmUoJy4vU2hvdFBhcmFtJyk7XG52YXIgU291cmNlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb3VyY2VyQ29udHJvbGxlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb3VyY2VyQ29udHJvbGxlcihzb3VyY2VyKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZXIpO1xuICAgICAgICB0aGlzLnNoaWVsZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuc2hpZWxkOyB9O1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc291cmNlci50ZW1wZXJhdHVyZTsgfTtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIubWlzc2lsZUFtbW87IH07XG4gICAgICAgIHRoaXMuZnVlbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvdXJjZXIuZnVlbDsgfTtcbiAgICAgICAgdmFyIGZpZWxkID0gc291cmNlci5maWVsZDtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBzb3VyY2VyLmNvbW1hbmQ7XG4gICAgICAgIHRoaXMuc2NhbkVuZW15ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlnc18xLmRlZmF1bHQuU0NBTl9XQUlUO1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgdmFyIHJhZGFyID0gVXRpbHNfMS5kZWZhdWx0LmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5zY2FuRW5lbXkoc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNjYW5BdHRhY2sgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzXzEuZGVmYXVsdC5TQ0FOX1dBSVQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICB2YXIgcmFkYXIgPSBVdGlsc18xLmRlZmF1bHQuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnNjYW5BdHRhY2soc291cmNlciwgcmFkYXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFoZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5iYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5haGVhZCA9IC0wLjQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNjZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5hc2NlbnQgPSAwLjk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVzY2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50dXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC50dXJuID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlTGFzZXIgPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBwb3dlcikge1xuICAgICAgICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlID0gbmV3IFNob3RQYXJhbV8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5wb3dlciA9IE1hdGgubWluKE1hdGgubWF4KHBvd2VyIHx8IDgsIDMpLCA4KTtcbiAgICAgICAgICAgIGNvbW1hbmQuZmlyZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuc2hvdFR5cGUgPSAnTGFzZXInO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpcmVNaXNzaWxlID0gZnVuY3Rpb24gKGFpKSB7XG4gICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUgPSBuZXcgU2hvdFBhcmFtXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgY29tbWFuZC5maXJlLmFpID0gYWk7XG4gICAgICAgICAgICBjb21tYW5kLmZpcmUuc2hvdFR5cGUgPSAnTWlzc2lsZSc7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBTb3VyY2VyQ29udHJvbGxlcjtcbn0oQ29udHJvbGxlcl8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNvdXJjZXJDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVl8xID0gcmVxdWlyZSgnLi9WJyk7XG52YXIgRVBTSUxPTiA9IDEwZS0xMjtcbnZhciBVdGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXRpbHMoKSB7XG4gICAgfVxuICAgIFV0aWxzLmNyZWF0ZVJhZGFyID0gZnVuY3Rpb24gKGMsIGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSB7XG4gICAgICAgIHZhciBjaGVja0Rpc3RhbmNlID0gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7IH07XG4gICAgICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVja0Rpc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XG4gICAgICAgIHZhciBjaGVja1JpZ2h0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyAxODAgLSBhbmdsZSAvIDIpO1xuICAgICAgICBpZiAoYW5nbGUgPCAxODApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTsgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpOyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zaWRlID0gZnVuY3Rpb24gKGJhc2UsIGRlZ3JlZSkge1xuICAgICAgICB2YXIgcmFkaWFuID0gVXRpbHMudG9SYWRpYW4oZGVncmVlKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG5ldyBWXzEuZGVmYXVsdChNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcbiAgICAgICAgdmFyIHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFV0aWxzLmNhbGNEaXN0YW5jZSA9IGZ1bmN0aW9uIChmLCB0LCBwKSB7XG4gICAgICAgIHZhciB0b0Zyb20gPSB0LnN1YnRyYWN0KGYpO1xuICAgICAgICB2YXIgcEZyb20gPSBwLnN1YnRyYWN0KGYpO1xuICAgICAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gcEZyb20ubGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21UbyA9IGYuc3VidHJhY3QodCk7XG4gICAgICAgIHZhciBwVG8gPSBwLnN1YnRyYWN0KHQpO1xuICAgICAgICBpZiAoZnJvbVRvLmRvdChwVG8pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIHBUby5sZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnModG9Gcm9tLmNyb3NzKHBGcm9tKSAvIHRvRnJvbS5sZW5ndGgoKSk7XG4gICAgfTtcbiAgICBVdGlscy50b1JhZGlhbiA9IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB9O1xuICAgIFV0aWxzLnRvT3Bwb3NpdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSAlIDM2MDtcbiAgICAgICAgaWYgKGRlZ3JlZSA8IDApIHtcbiAgICAgICAgICAgIGRlZ3JlZSA9IGRlZ3JlZSArIDM2MDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVncmVlIDw9IDE4MCkge1xuICAgICAgICAgICAgcmV0dXJuICg5MCAtIGRlZ3JlZSkgKiAyICsgZGVncmVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgyNzAgLSBkZWdyZWUpICogMiArIGRlZ3JlZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMucmFuZCA9IGZ1bmN0aW9uIChyZW5nZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xuICAgIH07XG4gICAgcmV0dXJuIFV0aWxzO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFV0aWxzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgViA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIFYucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh2LCB5KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKyB2LCB0aGlzLnkgKyB5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAodiwgeSkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gdiwgdGhpcy55IC0geSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdiwgdGhpcy55IC8gdik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFYucHJvdG90eXBlLm1vZHVsbyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYueCwgdGhpcy55ICUgdi55KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LCB0aGlzLnkgJSB2KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFYoLXRoaXMueCwgLXRoaXMueSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHYpLmxlbmd0aCgpO1xuICAgIH07XG4gICAgVi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVkTGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMubGVuZ3RoKCk7XG4gICAgICAgIHZhciBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHNjYWxlKTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmdsZUluUmFkaWFucygpICogMTgwIC8gTWF0aC5QSTtcbiAgICB9O1xuICAgIFYucHJvdG90eXBlLmFuZ2xlSW5SYWRpYW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkQW5nbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEFuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCB0aGlzLngpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZEFuZ2xlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgaWYgKHBvaW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueCArIHRoaXMueSAqIHBvaW50Lnk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueSAtIHRoaXMueSAqIHBvaW50Lng7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHZhciByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWKGNvcyAqIHRoaXMueCAtIHNpbiAqIHRoaXMueSwgY29zICogdGhpcy55ICsgc2luICogdGhpcy54KTtcbiAgICB9O1xuICAgIFYuZGlyZWN0aW9uID0gZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XG4gICAgfTtcbiAgICBWLnByb3RvdHlwZS5taW5pbWl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHsgeDogTWF0aC5yb3VuZCh0aGlzLngpLCB5OiBNYXRoLnJvdW5kKHRoaXMueSkgfTtcbiAgICB9O1xuICAgIHJldHVybiBWO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFY7XG4iXX0=
