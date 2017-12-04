(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("../core/Field");
var ExposedScriptLoader_1 = require("../core/ExposedScriptLoader");
var issueId = 0;
var issue = function () { return issueId++; };
var callbacks = {};
onmessage = function (_a) {
    var data = _a.data;
    if (data.issuedId !== undefined) {
        callbacks[data.issuedId]();
        delete callbacks[data.issuedId];
        return;
    }
    var initialParameter = data;
    var isDemo = initialParameter.isDemo;
    var players = initialParameter.sources;
    var frames = [];
    var listener = {
        waitNextTick: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var issuedId = issue();
                        callbacks[issuedId] = resolve;
                        postMessage({
                            issuedId: issuedId,
                            command: 'Next'
                        });
                    })];
            });
        }); },
        onPreThink: function (sourcerId) {
            postMessage({
                command: 'PreThink',
                id: sourcerId
            });
        },
        onPostThink: function (sourcerId) {
            postMessage({
                command: 'PostThink',
                id: sourcerId,
                loadedFrame: frames.length
            });
        },
        onFrame: function (fieldDump) {
            frames.push(fieldDump);
        },
        onFinished: function (result) {
            postMessage({
                result: result,
                command: 'Finished'
            });
        },
        onEndOfGame: function () {
            postMessage({
                frames: frames,
                command: 'EndOfGame'
            });
        },
        onError: function (error) {
            postMessage({
                error: error,
                command: 'Error'
            });
        }
    };
    var field = new Field_1.default(ExposedScriptLoader_1.default, isDemo);
    players.forEach(function (value, index) {
        field.registerSourcer(value.source, value.name, value.name, value.color);
    });
    postMessage({
        command: 'Players',
        players: field.players()
    });
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, field.compile(listener)];
                case 1:
                    _a.sent();
                    count = 0;
                    _a.label = 2;
                case 2:
                    if (!(count < 10000 && !field.isFinished)) return [3 /*break*/, 5];
                    return [4 /*yield*/, field.tick(listener)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    count++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    }); }, 0);
};

},{"../core/ExposedScriptLoader":7,"../core/Field":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var V_1 = require("./V");
var Configs_1 = require("./Configs");
var Actor = /** @class */ (function () {
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
            this.wait = this.wait - 1;
        }
    };
    Actor.prototype.onThink = function () {
        // not think anything.
    };
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
exports.default = Actor;

},{"./Configs":4,"./V":20}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Command = /** @class */ (function () {
    function Command() {
        this.isAccepted = false;
    }
    Command.prototype.validate = function () {
        if (!this.isAccepted) {
            throw new Error('Invalid command.');
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
exports.default = Command;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configs = /** @class */ (function () {
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
exports.default = Configs;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consts = /** @class */ (function () {
    function Consts() {
    }
    Consts.DIRECTION_RIGHT = 1;
    Consts.DIRECTION_LEFT = -1;
    Consts.VERTICAL_UP = 'vertial_up';
    Consts.VERTICAL_DOWN = 'vertial_down';
    return Consts;
}());
exports.default = Consts;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller(actor) {
        var _this = this;
        this.framesOfLife = 0;
        this.preThink = function () {
            _this.framesOfLife++;
        };
        this.frame = function () { return _this.framesOfLife; };
        this.altitude = function () { return actor.position.y; };
        this.wait = function (frame) {
            if (0 < frame) {
                actor.wait += frame;
            }
        };
    }
    return Controller;
}());
exports.default = Controller;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function construct(constructor, args) {
    function fun() {
        return constructor.apply(this, args);
    }
    fun.prototype = constructor.prototype;
    return new fun();
}
var ExposedScriptLoader = /** @class */ (function () {
    function ExposedScriptLoader() {
        this.console = { log: function () {
                var message = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    message[_i] = arguments[_i];
                }
            } };
        var allowLibs = {
            Object: Object, String: String, Number: Number, Boolean: Boolean, Array: Array, Date: Date, Math: Math, RegExp: RegExp, JSON: JSON, NaN: NaN, Infinity: Infinity, undefined: undefined, parseInt: parseInt, parseFloat: parseFloat, isNaN: isNaN, isFinite: isFinite,
            console: this.console
        };
        // tslint:disable-next-line:no-function-constructor-with-string-args
        var global = new Function('return this')();
        this.banlist = ['__proto__', 'prototype'];
        // tslint:disable-next-line:forin
        for (var target in global) {
            this.banlist.push(target);
        }
        var argNames = Object.keys(allowLibs);
        argNames = argNames.concat(this.banlist.filter(function (value) { return argNames.indexOf(value) >= 0; }));
        this.argNames = argNames;
        this.argValues = Object.keys(allowLibs).map(function (key) { return allowLibs[key]; });
    }
    ExposedScriptLoader.prototype.isDebuggable = function () {
        return true;
    };
    ExposedScriptLoader.prototype.getExposedConsole = function () {
        return this.console;
    };
    ExposedScriptLoader.prototype.load = function (script) {
        var argNames = [];
        argNames = argNames.concat(this.argNames);
        argNames.push('"use strict";\n' + script);
        return construct(Function, argNames).apply(undefined, this.argValues);
    };
    return ExposedScriptLoader;
}());
exports.default = ExposedScriptLoader;

},{}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var V_1 = require("./V");
var Sourcer_1 = require("./Sourcer");
var Utils_1 = require("./Utils");
var DEMO_FRAME_LENGTH = 128;
var Field = /** @class */ (function () {
    function Field(scriptLoaderConstructor, isDemo) {
        if (isDemo === void 0) { isDemo = false; }
        this.scriptLoaderConstructor = scriptLoaderConstructor;
        this.isDemo = isDemo;
        this.currentId = 0;
        this.isFinished = false;
        this.dummyEnemy = new V_1.default(0, 150);
        this.frame = 0;
        this.sourcers = [];
        this.shots = [];
        this.fxs = [];
    }
    Field.prototype.registerSourcer = function (source, account, name, color) {
        var side = (this.sourcers.length % 2 === 0) ? -1 : 1;
        var x = Utils_1.default.rand(80) + 160 * side;
        var y = Utils_1.default.rand(160) + 80;
        this.addSourcer(new Sourcer_1.default(this, x, y, source, account, name, color));
    };
    Field.prototype.process = function (listener, think) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, sourcer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.sourcers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        sourcer = _a[_i];
                        listener.onPreThink(sourcer.id);
                        return [4 /*yield*/, listener.waitNextTick()];
                    case 2:
                        _b.sent();
                        think(sourcer);
                        listener.onPostThink(sourcer.id);
                        return [4 /*yield*/, listener.waitNextTick()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Field.prototype.compile = function (listener) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.process(listener, function (sourcer) {
                        try {
                            sourcer.compile(new _this.scriptLoaderConstructor());
                        }
                        catch (error) {
                            listener.onError("There is an error in your code:\u3000" + error.message);
                        }
                    })];
            });
        });
    };
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.frame === 0) {
                            listener.onFrame(this.dump()); // Save the 0 frame.
                        }
                        // To be used in the invisible hand.
                        this.center = this.computeCenter();
                        // Think phase
                        return [4 /*yield*/, this.process(listener, function (sourcer) {
                                sourcer.think();
                                _this.shots.filter((function (shot) { return shot.owner.id === sourcer.id; })).forEach(function (shot) { return shot.think(); });
                            })];
                    case 1:
                        // Think phase
                        _a.sent();
                        // Action phase
                        this.sourcers.forEach(function (actor) { return actor.action(); });
                        this.shots.forEach(function (actor) { return actor.action(); });
                        this.fxs.forEach(function (actor) { return actor.action(); });
                        // Move phase
                        this.sourcers.forEach(function (actor) { return actor.move(); });
                        this.shots.forEach(function (actor) { return actor.move(); });
                        this.fxs.forEach(function (actor) { return actor.move(); });
                        // Check phase
                        this.checkFinish(listener);
                        this.checkEndOfGame(listener);
                        this.frame++;
                        // onFrame
                        listener.onFrame(this.dump());
                        return [2 /*return*/];
                }
            });
        });
    };
    Field.prototype.checkFinish = function (listener) {
        if (this.isDemo) {
            if (DEMO_FRAME_LENGTH < this.frame) {
                this.result = {
                    frame: this.frame,
                    timeout: null,
                    isDraw: null,
                    winnerId: null
                };
                listener.onFinished(this.result);
            }
            return;
        }
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
                timeout: null,
                isDraw: false
            };
            listener.onFinished(this.result);
            return;
        }
        // no surviver.. draw...
        this.result = {
            winnerId: null,
            timeout: null,
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
        var collidedShot = this.shots.find(function (actor) {
            return actor.breakable && actor.owner !== shot.owner &&
                Utils_1.default.calcDistance(f, t, actor.position) < shot.size + actor.size;
        });
        if (collidedShot) {
            return collidedShot;
        }
        var collidedSourcer = this.sourcers.find(function (sourcer) {
            return sourcer.alive && sourcer !== shot.owner &&
                Utils_1.default.calcDistance(f, t, sourcer.position) < shot.size + sourcer.size;
        });
        if (collidedSourcer) {
            return collidedSourcer;
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
            players[sourcer.id] = {
                name: sourcer.name || sourcer.account,
                account: sourcer.account,
                color: sourcer.color
            };
        });
        return players;
    };
    Field.prototype.dump = function () {
        var sourcersDump = [];
        var shotsDump = [];
        var fxDump = [];
        var debugDump = { logs: [] };
        this.sourcers.forEach(function (actor) {
            sourcersDump.push(actor.dump());
            if (actor.scriptLoader.isDebuggable) {
                debugDump.logs = debugDump.logs.concat(actor.dumpDebug().logs);
            }
        });
        var isThinkable = function (x) { return x.type === 'Missile'; };
        this.shots.forEach(function (actor) {
            shotsDump.push(actor.dump());
            if (actor.owner.scriptLoader.isDebuggable && isThinkable(actor)) {
                debugDump.logs = debugDump.logs.concat(actor.dumpDebug().logs);
            }
        });
        this.fxs.forEach(function (fx) {
            fxDump.push(fx.dump());
        });
        return {
            f: this.frame,
            s: sourcersDump,
            b: shotsDump,
            x: fxDump,
            debug: debugDump
        };
    };
    return Field;
}());
exports.default = Field;

},{"./Sourcer":16,"./Utils":19,"./V":20}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FireParam = /** @class */ (function () {
    function FireParam() {
    }
    FireParam.laser = function (power, direction) {
        var result = new FireParam();
        result.power = Math.min(Math.max(power || 8, 3), 8);
        result.direction = direction;
        result.shotType = 'Laser';
        return result;
    };
    FireParam.missile = function (bot) {
        var result = new FireParam();
        result.bot = bot;
        result.shotType = 'Missile';
        return result;
    };
    return FireParam;
}());
exports.default = FireParam;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fx = /** @class */ (function () {
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
exports.default = Fx;

},{}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Shot_1 = require("./Shot");
var V_1 = require("./V");
var Configs_1 = require("./Configs");
var Laser = /** @class */ (function (_super) {
    __extends(Laser, _super);
    function Laser(field, owner, direction, power) {
        var _this = _super.call(this, field, owner, 'Laser') || this;
        _this.direction = direction;
        _this.temperature = 5;
        _this.damage = function () { return 8; };
        _this.speed = V_1.default.direction(direction).multiply(power);
        _this.momentum = Configs_1.default.LASER_MOMENTUM;
        return _this;
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
exports.default = Laser;

},{"./Configs":4,"./Shot":15,"./V":20}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Shot_1 = require("./Shot");
var Configs_1 = require("./Configs");
var MissileCommand_1 = require("./MissileCommand");
var MissileController_1 = require("./MissileController");
var Consts_1 = require("./Consts");
var Missile = /** @class */ (function (_super) {
    __extends(Missile, _super);
    function Missile(field, owner, bot) {
        var _this = _super.call(this, field, owner, 'Missile') || this;
        _this.bot = bot;
        _this.temperature = 10;
        _this.damage = function () { return 10 + _this.speed.length() * 2; };
        _this.fuel = 100;
        _this.breakable = true;
        _this.debugDump = { logs: [] };
        _this.direction = owner.direction === Consts_1.default.DIRECTION_RIGHT ? 0 : 180;
        _this.speed = owner.speed;
        _this.command = new MissileCommand_1.default(_this);
        _this.command.reset();
        _this.controller = new MissileController_1.default(_this);
        return _this;
    }
    Missile.prototype.onThink = function () {
        this.command.reset();
        if (this.fuel <= 0) {
            return;
        }
        try {
            this.command.accept();
            this.controller.preThink();
            this.debugDump = { logs: [] };
            this.controller.connectConsole(this.owner.scriptLoader.getExposedConsole());
            this.bot(this.controller);
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
    Missile.prototype.log = function (message) {
        this.debugDump.logs.push(message);
    };
    Missile.prototype.dumpDebug = function () {
        return this.debugDump;
    };
    return Missile;
}(Shot_1.default));
exports.default = Missile;

},{"./Configs":4,"./Consts":5,"./MissileCommand":13,"./MissileController":14,"./Shot":15}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Command_1 = require("./Command");
var Configs_1 = require("./Configs");
var V_1 = require("./V");
var MissileCommand = /** @class */ (function (_super) {
    __extends(MissileCommand, _super);
    function MissileCommand(missile) {
        var _this = _super.call(this) || this;
        _this.missile = missile;
        _this.reset();
        return _this;
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
exports.default = MissileCommand;

},{"./Command":3,"./Configs":4,"./V":20}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Controller_1 = require("./Controller");
var Utils_1 = require("./Utils");
var MissileController = /** @class */ (function (_super) {
    __extends(MissileController, _super);
    function MissileController(missile) {
        var _this = _super.call(this, missile) || this;
        _this.direction = function () { return missile.direction; };
        var field = missile.field;
        var command = missile.command;
        _this.fuel = function () { return missile.fuel; };
        _this.scanEnemy = function (direction, angle, renge) {
            command.validate();
            missile.wait += 1.5;
            var missileDirection = missile.opposite(direction);
            var radar = Utils_1.default.createRadar(missile.position, missileDirection, angle, renge || Number.MAX_VALUE);
            return missile.field.scanEnemy(missile.owner, radar);
        };
        _this.speedUp = function () {
            command.validate();
            command.speedUp = 0.8;
        };
        _this.speedDown = function () {
            command.validate();
            command.speedDown = 0.1;
        };
        _this.turnRight = function () {
            command.validate();
            command.turn = -9;
        };
        _this.turnLeft = function () {
            command.validate();
            command.turn = 9;
        };
        var isString = function (value) { return Object.prototype.toString.call(value) === '[object String]'; };
        _this.log = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            missile.log(message.map(function (value) { return isString(value) ? value : JSON.stringify(value); }).join(', '));
        };
        return _this;
    }
    MissileController.prototype.connectConsole = function (console) {
        if (console) {
            console.log = this.log.bind(this);
        }
    };
    return MissileController;
}(Controller_1.default));
exports.default = MissileController;

},{"./Controller":6,"./Utils":19}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Actor_1 = require("./Actor");
var Fx_1 = require("./Fx");
var V_1 = require("./V");
var Utils_1 = require("./Utils");
var Shot = /** @class */ (function (_super) {
    __extends(Shot, _super);
    function Shot(field, owner, type) {
        var _this = _super.call(this, field, owner.position.x, owner.position.y) || this;
        _this.owner = owner;
        _this.type = type;
        _this.temperature = 0;
        _this.damage = function () { return 0; };
        _this.breakable = false;
        return _this;
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
exports.default = Shot;

},{"./Actor":2,"./Fx":10,"./Utils":19,"./V":20}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Actor_1 = require("./Actor");
var SourcerCommand_1 = require("./SourcerCommand");
var SourcerController_1 = require("./SourcerController");
var Configs_1 = require("./Configs");
var Consts_1 = require("./Consts");
var Utils_1 = require("./Utils");
var V_1 = require("./V");
var Laser_1 = require("./Laser");
var Missile_1 = require("./Missile");
var Fx_1 = require("./Fx");
var Sourcer = /** @class */ (function (_super) {
    __extends(Sourcer, _super);
    function Sourcer(field, x, y, aiSource, account, name, color) {
        var _this = _super.call(this, field, x, y) || this;
        _this.aiSource = aiSource;
        _this.account = account;
        _this.name = name;
        _this.color = color;
        _this.alive = true;
        _this.temperature = 0;
        _this.shield = Configs_1.default.INITIAL_SHIELD;
        _this.missileAmmo = Configs_1.default.INITIAL_MISSILE_AMMO;
        _this.fuel = Configs_1.default.INITIAL_FUEL;
        _this.bot = null;
        _this.debugDump = { logs: [] };
        _this.direction = Math.random() < 0.5 ? Consts_1.default.DIRECTION_RIGHT : Consts_1.default.DIRECTION_LEFT;
        _this.command = new SourcerCommand_1.default(_this);
        _this.controller = new SourcerController_1.default(_this);
        return _this;
    }
    Sourcer.prototype.compile = function (scriptLoader) {
        this.scriptLoader = scriptLoader;
        this.bot = scriptLoader.load(this.aiSource);
        if (!this.bot) {
            throw { message: 'Function has not been returned.' };
        }
        if (typeof this.bot !== 'function') {
            throw { message: 'Returned is not a Function.' };
        }
    };
    Sourcer.prototype.onThink = function () {
        if (this.bot === null || !this.alive) {
            return;
        }
        try {
            this.command.accept();
            this.controller.preThink();
            this.debugDump = { logs: [] };
            this.controller.connectConsole(this.scriptLoader.getExposedConsole());
            this.bot(this.controller);
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
            var length_1 = Utils_1.default.rand(8) + 4;
            this.field.addFx(new Fx_1.default(this.field, position, speed, length_1));
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
        if (param.shotType === 'Laser') {
            var direction = this.opposite(param.direction);
            var shot = new Laser_1.default(this.field, this, direction, param.power);
            shot.reaction(this);
            this.field.addShot(shot);
        }
        if (param.shotType === 'Missile') {
            if (0 < this.missileAmmo) {
                var missile = new Missile_1.default(this.field, this, param.bot);
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
        return direction;
    };
    Sourcer.prototype.onHit = function (shot) {
        this.speed = this.speed.add(shot.speed.multiply(Configs_1.default.ON_HIT_SPEED_GIVEN_RATE));
        this.shield -= shot.damage();
        this.shield = Math.max(0, this.shield);
        this.field.removeShot(shot);
    };
    Sourcer.prototype.log = function (message) {
        this.debugDump.logs.push(message);
    };
    Sourcer.prototype.dump = function () {
        return {
            i: this.id,
            p: this.position.minimize(),
            d: this.direction,
            h: Math.ceil(this.shield),
            t: Math.ceil(this.temperature),
            a: this.missileAmmo,
            f: Math.ceil(this.fuel)
        };
    };
    Sourcer.prototype.dumpDebug = function () {
        return this.debugDump;
    };
    return Sourcer;
}(Actor_1.default));
exports.default = Sourcer;

},{"./Actor":2,"./Configs":4,"./Consts":5,"./Fx":10,"./Laser":11,"./Missile":12,"./SourcerCommand":17,"./SourcerController":18,"./Utils":19,"./V":20}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Command_1 = require("./Command");
var Configs_1 = require("./Configs");
var SourcerCommand = /** @class */ (function (_super) {
    __extends(SourcerCommand, _super);
    function SourcerCommand(sourcer) {
        var _this = _super.call(this) || this;
        _this.sourcer = sourcer;
        _this.reset();
        return _this;
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
exports.default = SourcerCommand;

},{"./Command":3,"./Configs":4}],18:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Controller_1 = require("./Controller");
var Configs_1 = require("./Configs");
var Utils_1 = require("./Utils");
var FireParam_1 = require("./FireParam");
var SourcerController = /** @class */ (function (_super) {
    __extends(SourcerController, _super);
    function SourcerController(sourcer) {
        var _this = _super.call(this, sourcer) || this;
        _this.shield = function () { return sourcer.shield; };
        _this.temperature = function () { return sourcer.temperature; };
        _this.missileAmmo = function () { return sourcer.missileAmmo; };
        _this.fuel = function () { return sourcer.fuel; };
        var field = sourcer.field;
        var command = sourcer.command;
        _this.scanEnemy = function (direction, angle, renge) {
            command.validate();
            sourcer.wait += Configs_1.default.SCAN_WAIT;
            var oppositedDirection = sourcer.opposite(direction);
            var normalizedRenge = renge || Number.MAX_VALUE;
            var radar = Utils_1.default.createRadar(sourcer.position, oppositedDirection, angle, normalizedRenge);
            return field.scanEnemy(sourcer, radar);
        };
        _this.scanAttack = function (direction, angle, renge) {
            command.validate();
            sourcer.wait += Configs_1.default.SCAN_WAIT;
            var oppositedDirection = sourcer.opposite(direction);
            var normalizedRenge = renge || Number.MAX_VALUE;
            var radar = Utils_1.default.createRadar(sourcer.position, oppositedDirection, angle, normalizedRenge);
            return field.scanAttack(sourcer, radar);
        };
        _this.ahead = function () {
            command.validate();
            command.ahead = 0.8;
        };
        _this.back = function () {
            command.validate();
            command.ahead = -0.4;
        };
        _this.ascent = function () {
            command.validate();
            command.ascent = 0.9;
        };
        _this.descent = function () {
            command.validate();
            command.ascent = -0.9;
        };
        _this.turn = function () {
            command.validate();
            command.turn = true;
        };
        _this.fireLaser = function (direction, power) {
            command.validate();
            command.fire = FireParam_1.default.laser(power, direction);
        };
        _this.fireMissile = function (bot) {
            command.validate();
            command.fire = FireParam_1.default.missile(bot);
        };
        var isString = function (value) { return Object.prototype.toString.call(value) === '[object String]'; };
        _this.log = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            sourcer.log(message.map(function (value) { return isString(value) ? value : JSON.stringify(value); }).join(', '));
        };
        return _this;
    }
    SourcerController.prototype.connectConsole = function (console) {
        if (console) {
            console.log = this.log.bind(this);
        }
    };
    return SourcerController;
}(Controller_1.default));
exports.default = SourcerController;

},{"./Configs":4,"./Controller":6,"./FireParam":9,"./Utils":19}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var V_1 = require("./V");
var EPSILON = 10e-12;
var Utils = /** @class */ (function () {
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
        return function (t) { return (checkLeft(t) || checkRight(t)) && checkDistance(t); };
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
        var normalized = Utils.normalizeDegree(degree);
        if (normalized <= 180) {
            return (90 - normalized) * 2 + normalized;
        }
        return (270 - normalized) * 2 + normalized;
    };
    Utils.normalizeDegree = function (degree) {
        var remainder = degree % 360;
        return remainder < 0 ? remainder + 360 : remainder;
    };
    Utils.rand = function (renge) {
        return Math.random() * renge;
    };
    return Utils;
}());
exports.default = Utils;

},{"./V":20}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var V = /** @class */ (function () {
    function V(x, y) {
        this.x = x;
        this.y = y;
    }
    V.prototype.add = function (v, y) {
        if (v instanceof V) {
            return new V(this.x + (v.x || 0), this.y + (v.y || 0));
        }
        return new V(this.x + (v || 0), this.y + (y || 0));
    };
    V.prototype.subtract = function (v, y) {
        if (v instanceof V) {
            return new V(this.x - (v.x || 0), this.y - (v.y || 0));
        }
        return new V(this.x - (v || 0), this.y - (y || 0));
    };
    V.prototype.multiply = function (v) {
        if (v instanceof V) {
            return new V(this.x * v.x, this.y * v.y);
        }
        return new V(this.x * v, this.y * v);
    };
    V.prototype.divide = function (v) {
        if (v instanceof V) {
            return new V(this.x / v.x, this.y / v.y);
        }
        return new V(this.x / v, this.y / v);
    };
    V.prototype.modulo = function (v) {
        if (v instanceof V) {
            return new V(this.x % v.x, this.y % v.y);
        }
        return new V(this.x % v, this.y % v);
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
        this.calculatedLength = Math.sqrt(this.dot());
        return this.calculatedLength;
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
        this.calculatedAngle = Math.atan2(-this.y, this.x);
        return this.calculatedAngle;
    };
    V.prototype.dot = function (point) {
        if (point === void 0) { point = this; }
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
exports.default = V;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBd0lBOztBQXhJQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBcUQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBa0MsRUFBRSxDQUFDO0FBRXBELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDM0IsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRCxJQUFNLGdCQUFnQixHQUFHLElBQXdCLENBQUM7SUFDbEQsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBaUIsQ0FBQztJQUNsRCxJQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUF1QixDQUFDO0lBQ3pELElBQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDL0IsSUFBTSxRQUFRLEdBQXNCO1FBQ2xDLFlBQVksRUFBRTs7Z0JBQ1osc0JBQU8sSUFBSSxPQUFPLENBQU8sVUFBQyxPQUFPO3dCQUMvQixJQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQzt3QkFDekIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQzt3QkFDOUIsV0FBVyxDQUFDOzRCQUNWLFFBQVEsVUFBQTs0QkFDUixPQUFPLEVBQUUsTUFBTTt5QkFDaEIsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxFQUFDOzthQUNKO1FBQ0QsVUFBVSxFQUFFLFVBQUMsU0FBaUI7WUFDNUIsV0FBVyxDQUFDO2dCQUNWLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixFQUFFLEVBQUUsU0FBUzthQUNkLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxXQUFXLEVBQUUsVUFBQyxTQUFpQjtZQUM3QixXQUFXLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLEVBQUUsRUFBRSxTQUFTO2dCQUNiLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTTthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsU0FBb0I7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsVUFBVSxFQUFFLFVBQUMsTUFBa0I7WUFDN0IsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsVUFBVTthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsV0FBVzthQUNyQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsS0FBYTtZQUNyQixXQUFXLENBQUM7Z0JBQ1YsS0FBSyxPQUFBO2dCQUNMLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRixDQUFDO0lBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsNkJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsV0FBVyxDQUFDO1FBQ1YsT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7S0FDekIsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDOzs7O3dCQUNULHFCQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUE3QixTQUE2QixDQUFDO29CQUNyQixLQUFLLEdBQUcsQ0FBQzs7O3lCQUFFLENBQUEsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7b0JBQ3BELHFCQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUExQixTQUEwQixDQUFDOzs7b0JBRDJCLEtBQUssRUFBRSxDQUFBOzs7OztTQUdoRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQyxDQUFDOzs7OztBQ3JJRix5QkFBb0I7QUFDcEIscUNBQWdDO0FBR2hDO0lBUUUsZUFBbUIsS0FBWSxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQWxDLFVBQUssR0FBTCxLQUFLLENBQU87UUFIeEIsU0FBSSxHQUFHLGlCQUFPLENBQUMsY0FBYyxDQUFDO1FBQzlCLFNBQUksR0FBRyxDQUFDLENBQUM7UUFHZCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxXQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxXQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTSxxQkFBSyxHQUFaO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFTSx1QkFBTyxHQUFkO1FBQ0Usc0JBQXNCO0lBQ3hCLENBQUM7SUFFTSxzQkFBTSxHQUFiO1FBQ0UsYUFBYTtJQUNmLENBQUM7SUFFTSxvQkFBSSxHQUFYO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLHFCQUFLLEdBQVosVUFBYSxJQUFVO1FBQ3JCLGFBQWE7SUFDZixDQUFDO0lBRU0sb0JBQUksR0FBWDtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0gsWUFBQztBQUFELENBMUNBLEFBMENDLElBQUE7Ozs7OztBQ2hERDtJQUFBO1FBQ1UsZUFBVSxHQUFHLEtBQUssQ0FBQztJQVk3QixDQUFDO0lBWFEsMEJBQVEsR0FBZjtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDSCxDQUFDO0lBQ00sd0JBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFDTSwwQkFBUSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUNILGNBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTs7Ozs7O0FDYkQ7SUFBQTtJQW9CQSxDQUFDO0lBbkJlLHNCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLG9CQUFZLEdBQUcsR0FBRyxDQUFDO0lBQ25CLDRCQUFvQixHQUFHLEVBQUUsQ0FBQztJQUMxQix5QkFBaUIsR0FBRyxDQUFDLENBQUM7SUFDdEIsc0JBQWMsR0FBRyxHQUFHLENBQUM7SUFDckIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsc0JBQWMsR0FBRyxDQUFDLENBQUM7SUFDbkIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsd0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLGVBQU8sR0FBRyxHQUFHLENBQUM7SUFDZCwwQkFBa0IsR0FBRyxHQUFHLENBQUM7SUFDekIsdUJBQWUsR0FBRyxHQUFHLENBQUM7SUFDdEIsK0JBQXVCLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLHVCQUFlLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLHFDQUE2QixHQUFHLElBQUksQ0FBQztJQUNyQyxvQ0FBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsMkJBQW1CLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLGlCQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLCtCQUF1QixHQUFHLEdBQUcsQ0FBQztJQUM5QyxjQUFDO0NBcEJELEFBb0JDLElBQUE7a0JBcEJvQixPQUFPOzs7OztBQ0E1QjtJQUFBO0lBS0EsQ0FBQztJQUplLHNCQUFlLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLHFCQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsa0JBQVcsR0FBRyxZQUFZLENBQUM7SUFDM0Isb0JBQWEsR0FBRyxjQUFjLENBQUM7SUFDL0MsYUFBQztDQUxELEFBS0MsSUFBQTtrQkFMb0IsTUFBTTs7Ozs7QUNHM0I7SUFXRSxvQkFBWSxLQUFZO1FBQXhCLGlCQVFDO1FBYk8saUJBQVksR0FBVyxDQUFDLENBQUM7UUFDMUIsYUFBUSxHQUFHO1lBQ2hCLEtBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUE7UUFHQyxJQUFJLENBQUMsS0FBSyxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsWUFBWSxFQUFqQixDQUFpQixDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBTSxPQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFoQixDQUFnQixDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBQyxLQUFhO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO1lBQ3RCLENBQUM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQXBCQSxBQW9CQyxJQUFBOzs7Ozs7QUNyQkQsbUJBQW1CLFdBQWdCLEVBQUUsSUFBYztJQUNqRDtRQUNFLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ3RDLE1BQU0sQ0FBQyxJQUFLLEdBQVcsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFRDtJQU1FO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRTtnQkFBQyxpQkFBVTtxQkFBVixVQUFVLEVBQVYscUJBQVUsRUFBVixJQUFVO29CQUFWLDRCQUFVOztZQUF1QixDQUFDLEVBQUUsQ0FBQztRQUM1RCxJQUFNLFNBQVMsR0FBRztZQUNoQixNQUFNLFFBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxTQUFTLFdBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxRQUFRLFVBQUE7WUFDakksT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFFRixvRUFBb0U7UUFDcEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTFDLGlDQUFpQztRQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDRCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQyxTQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVNLDBDQUFZLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwrQ0FBaUIsR0FBeEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sa0NBQUksR0FBWCxVQUFZLE1BQWM7UUFDeEIsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBQzVCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDSCwwQkFBQztBQUFELENBekNBLEFBeUNDLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkRELHlCQUFvQjtBQUVwQixxQ0FBZ0M7QUFJaEMsaUNBQTRCO0FBSzVCLElBQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDO0FBRTlCO0lBWUUsZUFBb0IsdUJBQWdELEVBQVMsTUFBdUI7UUFBdkIsdUJBQUEsRUFBQSxjQUF1QjtRQUFoRiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFYNUYsY0FBUyxHQUFHLENBQUMsQ0FBQztRQU9mLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFFM0IsZUFBVSxHQUFNLElBQUksV0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdwQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTSwrQkFBZSxHQUF0QixVQUF1QixNQUFjLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxLQUFhO1FBQ2pGLElBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sQ0FBQyxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN0QyxJQUFNLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFWSx1QkFBTyxHQUFwQixVQUFxQixRQUEyQixFQUFFLEtBQWlDOzs7Ozs7OEJBQzlDLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUTs7OzZCQUFiLENBQUEsY0FBYSxDQUFBO3dCQUF4QixPQUFPO3dCQUNoQixRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDaEMscUJBQU0sUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFBOzt3QkFBN0IsU0FBNkIsQ0FBQzt3QkFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNmLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNqQyxxQkFBTSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDOzs7d0JBTFYsSUFBYSxDQUFBOzs7Ozs7S0FPcEM7SUFFWSx1QkFBTyxHQUFwQixVQUFxQixRQUEyQjs7OztnQkFDOUMsc0JBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxPQUFnQjt3QkFDN0MsSUFBSSxDQUFDOzRCQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO3dCQUN0RCxDQUFDO3dCQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ2YsUUFBUSxDQUFDLE9BQU8sQ0FBQywwQ0FBbUMsS0FBSyxDQUFDLE9BQVMsQ0FBQyxDQUFDO3dCQUN2RSxDQUFDO29CQUNILENBQUMsQ0FBQyxFQUFDOzs7S0FDSjtJQUVNLDBCQUFVLEdBQWpCLFVBQWtCLE9BQWdCO1FBQ2hDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSx1QkFBTyxHQUFkLFVBQWUsSUFBVTtRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0sMEJBQVUsR0FBakIsVUFBa0IsTUFBWTtRQUM1QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVNLHFCQUFLLEdBQVosVUFBYSxFQUFNO1FBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBUSxHQUFmLFVBQWdCLE1BQVU7UUFDeEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFWSxvQkFBSSxHQUFqQixVQUFrQixRQUEyQjs7Ozs7O3dCQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7d0JBQ3JELENBQUM7d0JBRUQsb0NBQW9DO3dCQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFFbkMsY0FBYzt3QkFDZCxxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLE9BQWdCO2dDQUM1QyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBQ2hCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsRUFBRSxFQUE1QixDQUE0QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7NEJBQzFGLENBQUMsQ0FBQyxFQUFBOzt3QkFKRixjQUFjO3dCQUNkLFNBR0UsQ0FBQzt3QkFFSCxlQUFlO3dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7d0JBRTFDLGFBQWE7d0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7d0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFaLENBQVksQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQzt3QkFFeEMsY0FBYzt3QkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUU5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBRWIsVUFBVTt3QkFDVixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDOzs7OztLQUMvQjtJQUVPLDJCQUFXLEdBQW5CLFVBQW9CLFFBQTJCO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHO29CQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsTUFBTSxFQUFFLElBQUk7b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQztnQkFDRixRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sSUFBTyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBRWpFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsS0FBSzthQUNkLENBQUM7WUFDRixRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxJQUFJO1NBQ2IsQ0FBQztRQUNGLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTyw4QkFBYyxHQUF0QixVQUF1QixRQUEyQjtRQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDO0lBRU0seUJBQVMsR0FBaEIsVUFBaUIsS0FBYyxFQUFFLEtBQXdCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTztZQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sMEJBQVUsR0FBakIsVUFBa0IsS0FBYyxFQUFFLEtBQXdCO1FBQTFELGlCQUlDO1FBSEMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTtZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTywwQkFBVSxHQUFsQixVQUFtQixLQUFjLEVBQUUsSUFBVTtRQUMzQyxJQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ3JDLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDcEMsSUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RCxJQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVNLDhCQUFjLEdBQXJCLFVBQXNCLElBQVU7UUFDOUIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN4QixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUs7Z0JBQ2xELGVBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87WUFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLO2dCQUM1QyxlQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSx3Q0FBd0IsR0FBL0IsVUFBZ0MsSUFBVTtRQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTyw2QkFBYSxHQUFyQjtRQUNFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBZ0I7WUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxFQUFFLENBQUM7WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRU0sdUJBQU8sR0FBZDtRQUNFLElBQU0sT0FBTyxHQUFnQixFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO1lBQzVCLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUc7Z0JBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPO2dCQUNyQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87Z0JBQ3hCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSzthQUNyQixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxvQkFBSSxHQUFaO1FBQ0UsSUFBTSxZQUFZLEdBQWtCLEVBQUUsQ0FBQztRQUN2QyxJQUFNLFNBQVMsR0FBZSxFQUFFLENBQUM7UUFDakMsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQU0sU0FBUyxHQUFjLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMxQixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakUsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFPLElBQW1CLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQXBCLENBQW9CLENBQUM7UUFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pFLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2IsQ0FBQyxFQUFFLFlBQVk7WUFDZixDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxNQUFNO1lBQ1QsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQztJQUNKLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0E1UkEsQUE0UkMsSUFBQTs7Ozs7O0FDdlNEO0lBQUE7SUFrQkEsQ0FBQztJQWpCZSxlQUFLLEdBQW5CLFVBQW9CLEtBQWEsRUFBRSxTQUFpQjtRQUNsRCxJQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ2EsaUJBQU8sR0FBckIsVUFBc0IsR0FBNEM7UUFDaEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNqQixNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFLSCxnQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7Ozs7OztBQ2hCRDtJQUlFLFlBQW1CLEtBQVksRUFBUyxRQUFXLEVBQVMsS0FBUSxFQUFTLE1BQWM7UUFBeEUsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUFTLGFBQVEsR0FBUixRQUFRLENBQUc7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN6RixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU0sbUJBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFTSxpQkFBSSxHQUFYO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLGlCQUFJLEdBQVg7UUFDRSxNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDVixDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDM0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2IsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUMzQixDQUFDO0lBQ0osQ0FBQztJQUNILFNBQUM7QUFBRCxDQTNCQSxBQTJCQyxJQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDL0JELCtCQUEwQjtBQUkxQix5QkFBb0I7QUFDcEIscUNBQWdDO0FBRWhDO0lBQW1DLHlCQUFJO0lBSXJDLGVBQVksS0FBWSxFQUFFLEtBQWMsRUFBUyxTQUFpQixFQUFFLEtBQWE7UUFBakYsWUFDRSxrQkFBTSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUc3QjtRQUpnRCxlQUFTLEdBQVQsU0FBUyxDQUFRO1FBSDNELGlCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFlBQU0sR0FBRyxjQUFNLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQztRQUl0QixLQUFJLENBQUMsS0FBSyxHQUFHLFdBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQU8sQ0FBQyxjQUFjLENBQUM7O0lBQ3pDLENBQUM7SUFFTSxzQkFBTSxHQUFiO1FBQ0UsaUJBQU0sTUFBTSxXQUFFLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxJQUFJLGlCQUFPLENBQUMsaUJBQWlCLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBQ0gsWUFBQztBQUFELENBakJBLEFBaUJDLENBakJrQyxjQUFJLEdBaUJ0Qzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCRCwrQkFBMEI7QUFNMUIscUNBQWdDO0FBQ2hDLG1EQUE4QztBQUM5Qyx5REFBb0Q7QUFDcEQsbUNBQThCO0FBRzlCO0lBQXFDLDJCQUFJO0lBVXZDLGlCQUFZLEtBQVksRUFBRSxLQUFjLEVBQVMsR0FBNEM7UUFBN0YsWUFDRSxrQkFBTSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQU0vQjtRQVBnRCxTQUFHLEdBQUgsR0FBRyxDQUF5QztRQVR0RixpQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixZQUFNLEdBQUcsY0FBTSxPQUFBLEVBQUUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQztRQUM1QyxVQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ1gsZUFBUyxHQUFHLElBQUksQ0FBQztRQUloQixlQUFTLEdBQWMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFJMUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxLQUFLLGdCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN0RSxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHdCQUFjLENBQUMsS0FBSSxDQUFDLENBQUM7UUFDeEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksMkJBQWlCLENBQUMsS0FBSSxDQUFDLENBQUM7O0lBQ2hELENBQUM7SUFFTSx5QkFBTyxHQUFkO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVNLDBCQUFRLEdBQWY7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLHVCQUFLLEdBQVosVUFBYSxNQUFZO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSwwQkFBUSxHQUFmLFVBQWdCLFNBQWlCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUNwQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLE9BQWU7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSwyQkFBUyxHQUFoQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0E1REEsQUE0REMsQ0E1RG9DLGNBQUksR0E0RHhDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekVELHFDQUFnQztBQUdoQyxxQ0FBZ0M7QUFDaEMseUJBQW9CO0FBRXBCO0lBQTRDLGtDQUFPO0lBS2pELHdCQUFtQixPQUFnQjtRQUFuQyxZQUNFLGlCQUFPLFNBRVI7UUFIa0IsYUFBTyxHQUFQLE9BQU8sQ0FBUztRQUVqQyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0lBQ2YsQ0FBQztJQUVNLDhCQUFLLEdBQVo7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRU0sZ0NBQU8sR0FBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNwQyxJQUFNLFVBQVUsR0FBRyxXQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDN0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0ExQkEsQUEwQkMsQ0ExQjJDLGlCQUFPLEdBMEJsRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2hDRCwyQ0FBc0M7QUFHdEMsaUNBQTRCO0FBRzVCO0lBQStDLHFDQUFVO0lBVXZELDJCQUFZLE9BQWdCO1FBQTVCLFlBQ0Usa0JBQU0sT0FBTyxDQUFDLFNBdUNmO1FBdENDLEtBQUksQ0FBQyxTQUFTLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxTQUFTLEVBQWpCLENBQWlCLENBQUM7UUFFekMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM1QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRWhDLEtBQUksQ0FBQyxJQUFJLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQVosQ0FBWSxDQUFDO1FBRS9CLEtBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDdkMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO1lBQ3BCLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRCxJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBRUYsS0FBSSxDQUFDLE9BQU8sR0FBRztZQUNiLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQzFCLENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQztRQUNGLElBQU0sUUFBUSxHQUFHLFVBQUMsS0FBVSxJQUFzQixPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsRUFBM0QsQ0FBMkQsQ0FBQztRQUM5RyxLQUFJLENBQUMsR0FBRyxHQUFHO1lBQUMsaUJBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLDRCQUFpQjs7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQS9DLENBQStDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRyxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLE9BQTJCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQXpEQSxBQXlEQyxDQXpEOEMsb0JBQVUsR0F5RHhEOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RELGlDQUE0QjtBQUM1QiwyQkFBc0I7QUFFdEIseUJBQW9CO0FBQ3BCLGlDQUE0QjtBQUU1QjtJQUFrQyx3QkFBSztJQUtyQyxjQUFZLEtBQVksRUFBUyxLQUFjLEVBQVMsSUFBWTtRQUFwRSxZQUNFLGtCQUFNLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUNqRDtRQUZnQyxXQUFLLEdBQUwsS0FBSyxDQUFTO1FBQVMsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUo3RCxpQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixZQUFNLEdBQUcsY0FBTSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7UUFDakIsZUFBUyxHQUFHLEtBQUssQ0FBQzs7SUFJekIsQ0FBQztJQUVNLHFCQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNiLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFFTyx3QkFBUyxHQUFqQjtRQUNFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzlELElBQU0sUUFBTSxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksWUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFGLENBQUM7SUFDSCxDQUFDO0lBRU0sdUJBQVEsR0FBZixVQUFnQixPQUFnQjtRQUM5QixPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVNLHVCQUFRLEdBQWY7UUFDRSxhQUFhO0lBQ2YsQ0FBQztJQUVNLG1CQUFJLEdBQVg7UUFDRSxNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNWLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUMzQixDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDakIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FsREEsQUFrREMsQ0FsRGlDLGVBQUssR0FrRHRDOzs7Ozs7Ozs7Ozs7Ozs7O0FDMURELGlDQUE0QjtBQUU1QixtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELHFDQUFnQztBQUNoQyxtQ0FBOEI7QUFDOUIsaUNBQTRCO0FBQzVCLHlCQUFvQjtBQUVwQixpQ0FBNEI7QUFDNUIscUNBQWdDO0FBRWhDLDJCQUFzQjtBQVN0QjtJQUFxQywyQkFBSztJQWF4QyxpQkFDRSxLQUFZLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBUyxRQUFnQixFQUNwRCxPQUFlLEVBQVMsSUFBWSxFQUFTLEtBQWE7UUFGbkUsWUFJRSxrQkFBTSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUtuQjtRQVI0QyxjQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ3BELGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxVQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQWQ1RCxXQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsaUJBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsWUFBTSxHQUFHLGlCQUFPLENBQUMsY0FBYyxDQUFDO1FBQ2hDLGlCQUFXLEdBQUcsaUJBQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUMzQyxVQUFJLEdBQUcsaUJBQU8sQ0FBQyxZQUFZLENBQUM7UUFLM0IsU0FBRyxHQUFxRCxJQUFJLENBQUM7UUFDN0QsZUFBUyxHQUFjLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBUTFDLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3RGLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSx3QkFBYyxDQUFDLEtBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSwyQkFBaUIsQ0FBQyxLQUFJLENBQUMsQ0FBQzs7SUFDaEQsQ0FBQztJQUVNLHlCQUFPLEdBQWQsVUFBZSxZQUEwQjtRQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLENBQUM7UUFDdkQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztRQUNuRCxDQUFDO0lBQ0gsQ0FBQztJQUVNLHlCQUFPLEdBQWQ7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVNLHdCQUFNLEdBQWI7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFDLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM5RCxJQUFNLFFBQU0sR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNELFVBQVU7UUFDVixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJELHlDQUF5QztRQUN6QyxFQUFFLENBQUMsQ0FBQyxpQkFBTyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFNLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDNUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsaUJBQU8sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVELHlDQUF5QztRQUN6QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxpQkFBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLGlCQUFPLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxXQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksV0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxXQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELElBQUksQ0FBQyxXQUFXLElBQUksaUJBQU8sQ0FBQyxTQUFTLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakQsV0FBVztRQUNYLElBQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzlELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQU0sWUFBWSxHQUFHLFFBQVEsR0FBRyxpQkFBTyxDQUFDLDZCQUE2QixDQUFDO1lBQ3RFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLGlCQUFPLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxzQkFBSSxHQUFYLFVBQVksS0FBZ0I7UUFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELElBQU0sSUFBSSxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTSwwQkFBUSxHQUFmLFVBQWdCLFNBQWlCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssZ0JBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxlQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSx1QkFBSyxHQUFaLFVBQWEsSUFBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxxQkFBRyxHQUFWLFVBQVcsT0FBZTtRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLHNCQUFJLEdBQVg7UUFDRSxNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDVixDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDM0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ2pCLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUM5QixDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN4QixDQUFDO0lBQ0osQ0FBQztJQUVNLDJCQUFTLEdBQWhCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNILGNBQUM7QUFBRCxDQTNKQSxBQTJKQyxDQTNKb0MsZUFBSyxHQTJKekM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqTEQscUNBQWdDO0FBRWhDLHFDQUFnQztBQUdoQztJQUE0QyxrQ0FBTztJQU1qRCx3QkFBbUIsT0FBZ0I7UUFBbkMsWUFDRSxpQkFBTyxTQUVSO1FBSGtCLGFBQU8sR0FBUCxPQUFPLENBQVM7UUFFakMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUNmLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRU0sZ0NBQU8sR0FBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDeEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FqQ0EsQUFpQ0MsQ0FqQzJDLGlCQUFPLEdBaUNsRDs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDRCwyQ0FBc0M7QUFHdEMscUNBQWdDO0FBQ2hDLGlDQUE0QjtBQUM1Qix5Q0FBb0M7QUFJcEM7SUFBK0MscUNBQVU7SUFtQnZELDJCQUFZLE9BQWdCO1FBQTVCLFlBQ0Usa0JBQU0sT0FBTyxDQUFDLFNBNERmO1FBMURDLEtBQUksQ0FBQyxNQUFNLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxNQUFNLEVBQWQsQ0FBYyxDQUFDO1FBQ25DLEtBQUksQ0FBQyxXQUFXLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxXQUFXLEVBQW5CLENBQW1CLENBQUM7UUFDN0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLFdBQVcsRUFBbkIsQ0FBbUIsQ0FBQztRQUM3QyxLQUFJLENBQUMsSUFBSSxHQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxFQUFaLENBQVksQ0FBQztRQUUvQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDaEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN2QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM5RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN4QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM5RixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLEtBQUssR0FBRztZQUNYLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDdkIsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLE1BQU0sR0FBRztZQUNaLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUN2QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLElBQUksR0FBRztZQUNWLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsU0FBUyxHQUFHLFVBQUMsU0FBUyxFQUFFLEtBQUs7WUFDaEMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxXQUFXLEdBQUcsVUFBQyxHQUFHO1lBQ3JCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQztRQUVGLElBQU0sUUFBUSxHQUFHLFVBQUMsS0FBVSxJQUFzQixPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsRUFBM0QsQ0FBMkQsQ0FBQztRQUM5RyxLQUFJLENBQUMsR0FBRyxHQUFHO1lBQUMsaUJBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLDRCQUFpQjs7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQS9DLENBQStDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRyxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLE9BQTJCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQXZGQSxBQXVGQyxDQXZGOEMsb0JBQVUsR0F1RnhEOzs7Ozs7QUNoR0QseUJBQW9CO0FBR3BCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUV2QjtJQUFBO0lBOERBLENBQUM7SUE3RGUsaUJBQVcsR0FBekIsVUFBMEIsQ0FBSSxFQUFFLFNBQWlCLEVBQUUsS0FBYSxFQUFFLEtBQWE7UUFDN0UsSUFBTSxhQUFhLEdBQUcsVUFBQyxDQUFJLElBQUssT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBdEIsQ0FBc0IsQ0FBQztRQUV2RCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDO1FBQ2hFLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQW5ELENBQW1ELENBQUM7SUFDbEUsQ0FBQztJQUVhLFVBQUksR0FBbEIsVUFBbUIsSUFBTyxFQUFFLE1BQWM7UUFDeEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFNLFNBQVMsR0FBRyxJQUFJLFdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUN6RSxNQUFNLENBQUMsVUFBQyxNQUFTO1lBQ2YsTUFBTSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUMzRSxDQUFDLENBQUM7SUFDSixDQUFDO0lBRWEsa0JBQVksR0FBMUIsVUFBMkIsQ0FBSSxFQUFFLENBQUksRUFBRSxDQUFJO1FBQ3pDLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFYSxjQUFRLEdBQXRCLFVBQXVCLE1BQWM7UUFDbkMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDckMsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM1QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDN0MsQ0FBQztJQUVjLHFCQUFlLEdBQTlCLFVBQStCLE1BQWM7UUFDM0MsSUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUMvQixNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUM7SUFFYSxVQUFJLEdBQWxCLFVBQW1CLEtBQWE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUNILFlBQUM7QUFBRCxDQTlEQSxBQThEQyxJQUFBOzs7Ozs7QUNuRUQ7SUFJRSxXQUFtQixDQUFTLEVBQVMsQ0FBUztRQUEzQixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUM5QyxDQUFDO0lBSU0sZUFBRyxHQUFWLFVBQVcsQ0FBTSxFQUFFLENBQVU7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBR00sb0JBQVEsR0FBZixVQUFnQixDQUFNLEVBQUUsQ0FBVTtRQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDTSxvQkFBUSxHQUFmLFVBQWdCLENBQWE7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNNLGtCQUFNLEdBQWIsVUFBYyxDQUFhO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTSxrQkFBTSxHQUFiLFVBQWMsQ0FBYTtRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ00sa0JBQU0sR0FBYjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNNLG9CQUFRLEdBQWYsVUFBZ0IsQ0FBSTtRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ00sa0JBQU0sR0FBYjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBQ00scUJBQVMsR0FBaEI7UUFDRSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBTSxLQUFLLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDTSxpQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBQ00sMEJBQWMsR0FBckI7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUNNLGVBQUcsR0FBVixVQUFXLEtBQWU7UUFBZixzQkFBQSxFQUFBLFlBQWU7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNNLGlCQUFLLEdBQVosVUFBYSxLQUFRO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDTSxrQkFBTSxHQUFiLFVBQWMsTUFBYztRQUMxQixJQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBQ2EsV0FBUyxHQUF2QixVQUF3QixNQUFjO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDTSxvQkFBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBTyxDQUFDO0lBQy9ELENBQUM7SUFDSCxRQUFDO0FBQUQsQ0F2RkEsQUF1RkMsSUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRmllbGQgZnJvbSAnLi4vY29yZS9GaWVsZCc7XG5pbXBvcnQgU291cmNlciBmcm9tICcuLi9jb3JlL1NvdXJjZXInO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xuaW1wb3J0IFRpY2tFdmVudExpc3RlbmVyIGZyb20gJy4uL2NvcmUvVGlja0V2ZW50TGlzdGVuZXInO1xuaW1wb3J0IHsgUGxheWVyc0R1bXAsIEZyYW1lRHVtcCwgUmVzdWx0RHVtcCB9IGZyb20gJy4uL2NvcmUvRHVtcCc7XG5pbXBvcnQgRXhwb3NlZFNjcmlwdExvYWRlciBmcm9tICcuLi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllckluZm8ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7XG4gIHNvdXJjZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEluaXRpYWxQYXJhbWV0ZXIge1xuICBpc0RlbW86IGJvb2xlYW47XG4gIHNvdXJjZXM6IFBsYXllckluZm9bXTtcbn1cblxuZXhwb3J0IHR5cGUgRGF0YSA9IE5leHRDb21tYW5kIHwgUGxheWVyc0NvbW1hbmQgfCBQcmVUaGlua0NvbW1hbmQgfCBQb3N0VGhpbmtDb21tYW5kIHwgRmluaXNoZWRDb21tYW5kIHwgRW5kT2ZHYW1lQ29tbWFuZCB8IEVycm9yQ29tbWFuZDtcblxuaW50ZXJmYWNlIE5leHRDb21tYW5kIHtcbiAgY29tbWFuZDogJ05leHQnO1xuICBpc3N1ZWRJZDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgUGxheWVyc0NvbW1hbmQge1xuICBjb21tYW5kOiAnUGxheWVycyc7XG4gIHBsYXllcnM6IFBsYXllcnNEdW1wO1xufVxuXG5pbnRlcmZhY2UgUHJlVGhpbmtDb21tYW5kIHtcbiAgY29tbWFuZDogJ1ByZVRoaW5rJztcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFBvc3RUaGlua0NvbW1hbmQge1xuICBjb21tYW5kOiAnUG9zdFRoaW5rJztcbiAgaWQ6IG51bWJlcjtcbiAgbG9hZGVkRnJhbWU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIEZpbmlzaGVkQ29tbWFuZCB7XG4gIGNvbW1hbmQ6ICdGaW5pc2hlZCc7XG4gIHJlc3VsdDogUmVzdWx0RHVtcDtcbn1cblxuaW50ZXJmYWNlIEVuZE9mR2FtZUNvbW1hbmQge1xuICBjb21tYW5kOiAnRW5kT2ZHYW1lJztcbiAgZnJhbWVzOiBGcmFtZUR1bXBbXTtcbn1cblxuaW50ZXJmYWNlIEVycm9yQ29tbWFuZCB7XG4gIGNvbW1hbmQ6ICdFcnJvcic7XG4gIGVycm9yOiBzdHJpbmc7XG59XG5cbmRlY2xhcmUgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobWVzc2FnZTogRGF0YSk6IHZvaWQ7XG5cbmxldCBpc3N1ZUlkID0gMDtcbmNvbnN0IGlzc3VlID0gKCkgPT4gaXNzdWVJZCsrO1xuY29uc3QgY2FsbGJhY2tzOiB7IFtpZDogbnVtYmVyXTogKCkgPT4gdm9pZDsgfSA9IHt9O1xuXG5vbm1lc3NhZ2UgPSAoeyBkYXRhIH0pID0+IHtcbiAgaWYgKGRhdGEuaXNzdWVkSWQgIT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGxiYWNrc1tkYXRhLmlzc3VlZElkXSgpO1xuICAgIGRlbGV0ZSBjYWxsYmFja3NbZGF0YS5pc3N1ZWRJZF07XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGluaXRpYWxQYXJhbWV0ZXIgPSBkYXRhIGFzIEluaXRpYWxQYXJhbWV0ZXI7XG4gIGNvbnN0IGlzRGVtbyA9IGluaXRpYWxQYXJhbWV0ZXIuaXNEZW1vIGFzIGJvb2xlYW47XG4gIGNvbnN0IHBsYXllcnMgPSBpbml0aWFsUGFyYW1ldGVyLnNvdXJjZXMgYXMgUGxheWVySW5mb1tdO1xuICBjb25zdCBmcmFtZXM6IEZyYW1lRHVtcFtdID0gW107XG4gIGNvbnN0IGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciA9IHtcbiAgICB3YWl0TmV4dFRpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBpc3N1ZWRJZCA9IGlzc3VlKCk7XG4gICAgICAgIGNhbGxiYWNrc1tpc3N1ZWRJZF0gPSByZXNvbHZlO1xuICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgaXNzdWVkSWQsXG4gICAgICAgICAgY29tbWFuZDogJ05leHQnXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvblByZVRoaW5rOiAoc291cmNlcklkOiBudW1iZXIpID0+IHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29tbWFuZDogJ1ByZVRoaW5rJyxcbiAgICAgICAgaWQ6IHNvdXJjZXJJZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBvblBvc3RUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvbW1hbmQ6ICdQb3N0VGhpbmsnLFxuICAgICAgICBpZDogc291cmNlcklkLFxuICAgICAgICBsb2FkZWRGcmFtZTogZnJhbWVzLmxlbmd0aFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkZyYW1lOiAoZmllbGREdW1wOiBGcmFtZUR1bXApID0+IHtcbiAgICAgIGZyYW1lcy5wdXNoKGZpZWxkRHVtcCk7XG4gICAgfSxcbiAgICBvbkZpbmlzaGVkOiAocmVzdWx0OiBSZXN1bHREdW1wKSA9PiB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgY29tbWFuZDogJ0ZpbmlzaGVkJ1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkVuZE9mR2FtZTogKCkgPT4ge1xuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBmcmFtZXMsXG4gICAgICAgIGNvbW1hbmQ6ICdFbmRPZkdhbWUnXG4gICAgICB9KTtcbiAgICB9LFxuICAgIG9uRXJyb3I6IChlcnJvcjogc3RyaW5nKSA9PiB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGVycm9yLFxuICAgICAgICBjb21tYW5kOiAnRXJyb3InXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoRXhwb3NlZFNjcmlwdExvYWRlciwgaXNEZW1vKTtcbiAgcGxheWVycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICBmaWVsZC5yZWdpc3RlclNvdXJjZXIodmFsdWUuc291cmNlLCB2YWx1ZS5uYW1lLCB2YWx1ZS5uYW1lLCB2YWx1ZS5jb2xvcik7XG4gIH0pO1xuXG4gIHBvc3RNZXNzYWdlKHtcbiAgICBjb21tYW5kOiAnUGxheWVycycsXG4gICAgcGxheWVyczogZmllbGQucGxheWVycygpXG4gIH0pO1xuXG4gIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGZpZWxkLmNvbXBpbGUobGlzdGVuZXIpO1xuICAgIGZvciAobGV0IGNvdW50ID0gMDsgY291bnQgPCAxMDAwMCAmJiAhZmllbGQuaXNGaW5pc2hlZDsgY291bnQrKykge1xuICAgICAgYXdhaXQgZmllbGQudGljayhsaXN0ZW5lcik7XG4gICAgfVxuICB9LCAwKTtcbn07XG4iLCJpbXBvcnQgQ29uc3RzIGZyb20gJy4vQ29uc3RzJztcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcbmltcG9ydCBWIGZyb20gJy4vVic7XG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3Ige1xuICBwdWJsaWMgaWQ6IG51bWJlcjtcbiAgcHVibGljIHBvc2l0aW9uOiBWO1xuICBwdWJsaWMgc3BlZWQ6IFY7XG4gIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlcjtcbiAgcHVibGljIHNpemUgPSBDb25maWdzLkNPTExJU0lPTl9TSVpFO1xuICBwdWJsaWMgd2FpdCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLndhaXQgPSAwO1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih4LCB5KTtcbiAgICB0aGlzLnNwZWVkID0gbmV3IFYoMCwgMCk7XG4gIH1cblxuICBwdWJsaWMgdGhpbmsoKSB7XG4gICAgaWYgKHRoaXMud2FpdCA8PSAwKSB7XG4gICAgICB0aGlzLndhaXQgPSAwO1xuICAgICAgdGhpcy5vblRoaW5rKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud2FpdCA9IHRoaXMud2FpdCAtIDE7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uVGhpbmsoKTogdm9pZCB7XG4gICAgLy8gbm90IHRoaW5rIGFueXRoaW5nLlxuICB9XG5cbiAgcHVibGljIGFjdGlvbigpOiB2b2lkIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICBwdWJsaWMgbW92ZSgpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XG4gIH1cblxuICBwdWJsaWMgb25IaXQoc2hvdDogU2hvdCkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIHB1YmxpYyBkdW1wKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxpbWVudGF0aW9uJyk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmQge1xuICBwcml2YXRlIGlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgcHVibGljIHZhbGlkYXRlKCkge1xuICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29tbWFuZC4nKTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGFjY2VwdCgpIHtcbiAgICB0aGlzLmlzQWNjZXB0ZWQgPSB0cnVlO1xuICB9XG4gIHB1YmxpYyB1bmFjY2VwdCgpIHtcbiAgICB0aGlzLmlzQWNjZXB0ZWQgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlncyB7XG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9TSElFTEQgPSAxMDA7XG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9GVUVMID0gMTAwO1xuICBwdWJsaWMgc3RhdGljIElOSVRJQUxfTUlTU0lMRV9BTU1PID0gMjA7XG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfQVRURU5VQVRJT04gPSAxO1xuICBwdWJsaWMgc3RhdGljIExBU0VSX01PTUVOVFVNID0gMTI4O1xuICBwdWJsaWMgc3RhdGljIEZVRUxfQ09TVCA9IDAuMjQ7XG4gIHB1YmxpYyBzdGF0aWMgQ09MTElTSU9OX1NJWkUgPSA0O1xuICBwdWJsaWMgc3RhdGljIFNDQU5fV0FJVCA9IDAuMzU7XG4gIHB1YmxpYyBzdGF0aWMgU1BFRURfUkVTSVNUQU5DRSA9IDAuOTY7XG4gIHB1YmxpYyBzdGF0aWMgR1JBVklUWSA9IDAuMTtcbiAgcHVibGljIHN0YXRpYyBUT1BfSU5WSVNJQkxFX0hBTkQgPSA0ODA7XG4gIHB1YmxpYyBzdGF0aWMgRElTVEFOQ0VfQk9SREFSID0gNDAwO1xuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfQk9SREVSID0gMTAwO1xuICBwdWJsaWMgc3RhdGljIE9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUID0gMC4wNTtcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XG4gIHB1YmxpYyBzdGF0aWMgR1JPVU5EX0RBTUFHRV9TQ0FMRSA9IDE7XG4gIHB1YmxpYyBzdGF0aWMgQ09PTF9ET1dOID0gMC41O1xuICBwdWJsaWMgc3RhdGljIE9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uc3RzIHtcbiAgcHVibGljIHN0YXRpYyBESVJFQ1RJT05fUklHSFQgPSAxO1xuICBwdWJsaWMgc3RhdGljIERJUkVDVElPTl9MRUZUID0gLTE7XG4gIHB1YmxpYyBzdGF0aWMgVkVSVElDQUxfVVAgPSAndmVydGlhbF91cCc7XG4gIHB1YmxpYyBzdGF0aWMgVkVSVElDQUxfRE9XTiA9ICd2ZXJ0aWFsX2Rvd24nO1xufVxuIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyIHtcbiAgcHVibGljIGZyYW1lOiAoKSA9PiBudW1iZXI7XG4gIHB1YmxpYyBhbHRpdHVkZTogKCkgPT4gbnVtYmVyO1xuICBwdWJsaWMgd2FpdDogKGZyYW1lOiBudW1iZXIpID0+IHZvaWQ7XG4gIHB1YmxpYyBmdWVsOiAoKSA9PiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBmcmFtZXNPZkxpZmU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBwcmVUaGluayA9ICgpID0+IHtcbiAgICB0aGlzLmZyYW1lc09mTGlmZSsrO1xuICB9XG5cbiAgY29uc3RydWN0b3IoYWN0b3I6IEFjdG9yKSB7XG4gICAgdGhpcy5mcmFtZSA9ICgpID0+IHRoaXMuZnJhbWVzT2ZMaWZlO1xuICAgIHRoaXMuYWx0aXR1ZGUgPSAoKSA9PiBhY3Rvci5wb3NpdGlvbi55O1xuICAgIHRoaXMud2FpdCA9IChmcmFtZTogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAoMCA8IGZyYW1lKSB7XG4gICAgICAgIGFjdG9yLndhaXQgKz0gZnJhbWU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IFNjcmlwdExvYWRlciwgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcblxuZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yOiBhbnksIGFyZ3M6IHN0cmluZ1tdKSB7XG4gIGZ1bmN0aW9uIGZ1bigpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cbiAgZnVuLnByb3RvdHlwZSA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgcmV0dXJuIG5ldyAoZnVuIGFzIGFueSkoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwb3NlZFNjcmlwdExvYWRlciBpbXBsZW1lbnRzIFNjcmlwdExvYWRlciB7XG4gIHByaXZhdGUgYXJnVmFsdWVzOiBhbnlbXTtcbiAgcHJpdmF0ZSBhcmdOYW1lczogc3RyaW5nW107XG4gIHByaXZhdGUgYmFubGlzdDogc3RyaW5nW107XG4gIHByaXZhdGUgY29uc29sZTogQ29uc29sZUxpa2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25zb2xlID0geyBsb2c6ICguLi5tZXNzYWdlKSA9PiB7IC8qIG5vdGhpbmcuLiAqLyB9IH07XG4gICAgY29uc3QgYWxsb3dMaWJzID0ge1xuICAgICAgT2JqZWN0LCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgQXJyYXksIERhdGUsIE1hdGgsIFJlZ0V4cCwgSlNPTiwgTmFOLCBJbmZpbml0eSwgdW5kZWZpbmVkLCBwYXJzZUludCwgcGFyc2VGbG9hdCwgaXNOYU4sIGlzRmluaXRlLFxuICAgICAgY29uc29sZTogdGhpcy5jb25zb2xlXG4gICAgfTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1mdW5jdGlvbi1jb25zdHJ1Y3Rvci13aXRoLXN0cmluZy1hcmdzXG4gICAgY29uc3QgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgdGhpcy5iYW5saXN0ID0gWydfX3Byb3RvX18nLCAncHJvdG90eXBlJ107XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICBmb3IgKGNvbnN0IHRhcmdldCBpbiBnbG9iYWwpIHtcbiAgICAgIHRoaXMuYmFubGlzdC5wdXNoKHRhcmdldCk7XG4gICAgfVxuICAgIGxldCBhcmdOYW1lcyA9IE9iamVjdC5rZXlzKGFsbG93TGlicyk7XG4gICAgYXJnTmFtZXMgPSBhcmdOYW1lcy5jb25jYXQodGhpcy5iYW5saXN0LmZpbHRlcih2YWx1ZSA9PiBhcmdOYW1lcy5pbmRleE9mKHZhbHVlKSA+PSAwKSk7XG4gICAgdGhpcy5hcmdOYW1lcyA9IGFyZ05hbWVzO1xuICAgIHRoaXMuYXJnVmFsdWVzID0gT2JqZWN0LmtleXMoYWxsb3dMaWJzKS5tYXAoa2V5ID0+IChhbGxvd0xpYnMgYXMgYW55KVtrZXldKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0RlYnVnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RXhwb3NlZENvbnNvbGUoKTogQ29uc29sZUxpa2UgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5jb25zb2xlO1xuICB9XG5cbiAgcHVibGljIGxvYWQoc2NyaXB0OiBzdHJpbmcpOiBhbnkge1xuICAgIGxldCBhcmdOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBhcmdOYW1lcyA9IGFyZ05hbWVzLmNvbmNhdCh0aGlzLmFyZ05hbWVzKTtcbiAgICBhcmdOYW1lcy5wdXNoKCdcInVzZSBzdHJpY3RcIjtcXG4nICsgc2NyaXB0KTtcbiAgICByZXR1cm4gY29uc3RydWN0KEZ1bmN0aW9uLCBhcmdOYW1lcykuYXBwbHkodW5kZWZpbmVkLCB0aGlzLmFyZ1ZhbHVlcyk7XG4gIH1cbn1cbiIsImltcG9ydCBWIGZyb20gJy4vVic7XG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XG5pbXBvcnQgVGlja0V2ZW50TGlzdGVuZXIgZnJvbSAnLi9UaWNrRXZlbnRMaXN0ZW5lcic7XG5pbXBvcnQgeyBGcmFtZUR1bXAsIFJlc3VsdER1bXAsIFNvdXJjZXJEdW1wLCBTaG90RHVtcCwgRnhEdW1wLCBQbGF5ZXJzRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcbmltcG9ydCBTY3JpcHRMb2FkZXIsIHsgU2NyaXB0TG9hZGVyQ29uc3RydWN0b3IgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XG5cbmNvbnN0IERFTU9fRlJBTUVfTEVOR1RIID0gMTI4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZCB7XG4gIHByaXZhdGUgY3VycmVudElkID0gMDtcbiAgcHJpdmF0ZSBzb3VyY2VyczogU291cmNlcltdO1xuICBwcml2YXRlIHNob3RzOiBTaG90W107XG4gIHByaXZhdGUgZnhzOiBGeFtdO1xuICBwcml2YXRlIGZyYW1lOiBudW1iZXI7XG4gIHByaXZhdGUgcmVzdWx0OiBSZXN1bHREdW1wO1xuICBwdWJsaWMgY2VudGVyOiBudW1iZXI7XG4gIHB1YmxpYyBpc0ZpbmlzaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBkdW1teUVuZW15OiBWID0gbmV3IFYoMCwgMTUwKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjcmlwdExvYWRlckNvbnN0cnVjdG9yOiBTY3JpcHRMb2FkZXJDb25zdHJ1Y3RvciwgcHVibGljIGlzRGVtbzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgdGhpcy5zb3VyY2VycyA9IFtdO1xuICAgIHRoaXMuc2hvdHMgPSBbXTtcbiAgICB0aGlzLmZ4cyA9IFtdO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyU291cmNlcihzb3VyY2U6IHN0cmluZywgYWNjb3VudDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzaWRlID0gKHRoaXMuc291cmNlcnMubGVuZ3RoICUgMiA9PT0gMCkgPyAtMSA6IDE7XG4gICAgY29uc3QgeCA9IFV0aWxzLnJhbmQoODApICsgMTYwICogc2lkZTtcbiAgICBjb25zdCB5ID0gVXRpbHMucmFuZCgxNjApICsgODA7XG4gICAgdGhpcy5hZGRTb3VyY2VyKG5ldyBTb3VyY2VyKHRoaXMsIHgsIHksIHNvdXJjZSwgYWNjb3VudCwgbmFtZSwgY29sb3IpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciwgdGhpbms6IChzb3VyY2VyOiBTb3VyY2VyKSA9PiB2b2lkKSB7XG4gICAgZm9yIChjb25zdCBzb3VyY2VyIG9mIHRoaXMuc291cmNlcnMpIHtcbiAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcbiAgICAgIHRoaW5rKHNvdXJjZXIpO1xuICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc291cmNlci5pZCk7XG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY29tcGlsZShsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzKGxpc3RlbmVyLCAoc291cmNlcjogU291cmNlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc291cmNlci5jb21waWxlKG5ldyB0aGlzLnNjcmlwdExvYWRlckNvbnN0cnVjdG9yKCkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbGlzdGVuZXIub25FcnJvcihgVGhlcmUgaXMgYW4gZXJyb3IgaW4geW91ciBjb2RlOuOAgCR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTb3VyY2VyKHNvdXJjZXI6IFNvdXJjZXIpIHtcbiAgICBzb3VyY2VyLmlkID0gdGhpcy5jdXJyZW50SWQrKztcbiAgICB0aGlzLnNvdXJjZXJzLnB1c2goc291cmNlcik7XG4gIH1cblxuICBwdWJsaWMgYWRkU2hvdChzaG90OiBTaG90KSB7XG4gICAgc2hvdC5pZCA9IHRoaXMuY3VycmVudElkKys7XG4gICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZVNob3QodGFyZ2V0OiBTaG90KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnNob3RzLmluZGV4T2YodGFyZ2V0KTtcbiAgICBpZiAoMCA8PSBpbmRleCkge1xuICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRGeChmeDogRngpIHtcbiAgICBmeC5pZCA9IHRoaXMuY3VycmVudElkKys7XG4gICAgdGhpcy5meHMucHVzaChmeCk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlRngodGFyZ2V0OiBGeCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5meHMuaW5kZXhPZih0YXJnZXQpO1xuICAgIGlmICgwIDw9IGluZGV4KSB7XG4gICAgICB0aGlzLmZ4cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB0aWNrKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLmZyYW1lID09PSAwKSB7XG4gICAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTsgLy8gU2F2ZSB0aGUgMCBmcmFtZS5cbiAgICB9XG5cbiAgICAvLyBUbyBiZSB1c2VkIGluIHRoZSBpbnZpc2libGUgaGFuZC5cbiAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xuXG4gICAgLy8gVGhpbmsgcGhhc2VcbiAgICBhd2FpdCB0aGlzLnByb2Nlc3MobGlzdGVuZXIsIChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XG4gICAgICBzb3VyY2VyLnRoaW5rKCk7XG4gICAgICB0aGlzLnNob3RzLmZpbHRlcigoc2hvdCA9PiBzaG90Lm93bmVyLmlkID09PSBzb3VyY2VyLmlkKSkuZm9yRWFjaChzaG90ID0+IHNob3QudGhpbmsoKSk7XG4gICAgfSk7XG5cbiAgICAvLyBBY3Rpb24gcGhhc2VcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xuICAgIHRoaXMuc2hvdHMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XG4gICAgdGhpcy5meHMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XG5cbiAgICAvLyBNb3ZlIHBoYXNlXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XG4gICAgdGhpcy5meHMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5tb3ZlKCkpO1xuXG4gICAgLy8gQ2hlY2sgcGhhc2VcbiAgICB0aGlzLmNoZWNrRmluaXNoKGxpc3RlbmVyKTtcbiAgICB0aGlzLmNoZWNrRW5kT2ZHYW1lKGxpc3RlbmVyKTtcblxuICAgIHRoaXMuZnJhbWUrKztcblxuICAgIC8vIG9uRnJhbWVcbiAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tGaW5pc2gobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuaXNEZW1vKSB7XG4gICAgICBpZiAoREVNT19GUkFNRV9MRU5HVEggPCB0aGlzLmZyYW1lKSB7XG4gICAgICAgIHRoaXMucmVzdWx0ID0ge1xuICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICAgICAgaXNEcmF3OiBudWxsLFxuICAgICAgICAgIHdpbm5lcklkOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlc3VsdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaCgoc291cmNlcikgPT4geyBzb3VyY2VyLmFsaXZlID0gMCA8IHNvdXJjZXIuc2hpZWxkOyB9KTtcbiAgICBjb25zdCBzdXJ2aXZlcnMgPSB0aGlzLnNvdXJjZXJzLmZpbHRlcihzb3VyY2VyID0+IHNvdXJjZXIuYWxpdmUpO1xuXG4gICAgaWYgKDEgPCBzdXJ2aXZlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN1cnZpdmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHN1cnZpdmVyID0gc3Vydml2ZXJzWzBdO1xuICAgICAgdGhpcy5yZXN1bHQgPSB7XG4gICAgICAgIHdpbm5lcklkOiBzdXJ2aXZlci5pZCxcbiAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXG4gICAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICAgIGlzRHJhdzogZmFsc2VcbiAgICAgIH07XG4gICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBubyBzdXJ2aXZlci4uIGRyYXcuLi5cbiAgICB0aGlzLnJlc3VsdCA9IHtcbiAgICAgIHdpbm5lcklkOiBudWxsLFxuICAgICAgdGltZW91dDogbnVsbCxcbiAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxuICAgICAgaXNEcmF3OiB0cnVlXG4gICAgfTtcbiAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tFbmRPZkdhbWUobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuaXNGaW5pc2hlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0RlbW8pIHtcbiAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlc3VsdC5mcmFtZSA8IHRoaXMuZnJhbWUgLSA5MCkgeyAvLyBSZWNvcmQgc29tZSBmcmFtZXMgZXZlbiBhZnRlciBkZWNpZGVkLlxuICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNjYW5FbmVteShvd25lcjogU291cmNlciwgcmFkYXI6ICh0OiBWKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuaXNEZW1vICYmIHRoaXMuc291cmNlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcmFkYXIodGhpcy5kdW1teUVuZW15KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Vycy5zb21lKChzb3VyY2VyKSA9PiB7XG4gICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzY2FuQXR0YWNrKG93bmVyOiBTb3VyY2VyLCByYWRhcjogKHQ6IFYpID0+IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG90cy5zb21lKChzaG90KSA9PiB7XG4gICAgICByZXR1cm4gc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoc2hvdC5wb3NpdGlvbikgJiYgdGhpcy5pc0luY29taW5nKG93bmVyLCBzaG90KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaXNJbmNvbWluZyhvd25lcjogU291cmNlciwgc2hvdDogU2hvdCkge1xuICAgIGNvbnN0IG93bmVyUG9zaXRpb24gPSBvd25lci5wb3NpdGlvbjtcbiAgICBjb25zdCBhY3RvclBvc2l0aW9uID0gc2hvdC5wb3NpdGlvbjtcbiAgICBjb25zdCBjdXJyZW50RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24pO1xuICAgIGNvbnN0IG5leHREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCkpO1xuICAgIHJldHVybiBuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2U7XG4gIH1cblxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb24oc2hvdDogU2hvdCk6IEFjdG9yIHwgbnVsbCB7XG4gICAgY29uc3QgZiA9IHNob3QucG9zaXRpb247XG4gICAgY29uc3QgdCA9IHNob3QucG9zaXRpb24uYWRkKHNob3Quc3BlZWQpO1xuXG4gICAgY29uc3QgY29sbGlkZWRTaG90ID0gdGhpcy5zaG90cy5maW5kKChhY3RvcikgPT4ge1xuICAgICAgcmV0dXJuIGFjdG9yLmJyZWFrYWJsZSAmJiBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lciAmJlxuICAgICAgICBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgYWN0b3IucG9zaXRpb24pIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZTtcbiAgICB9KTtcbiAgICBpZiAoY29sbGlkZWRTaG90KSB7XG4gICAgICByZXR1cm4gY29sbGlkZWRTaG90O1xuICAgIH1cblxuICAgIGNvbnN0IGNvbGxpZGVkU291cmNlciA9IHRoaXMuc291cmNlcnMuZmluZCgoc291cmNlcikgPT4ge1xuICAgICAgcmV0dXJuIHNvdXJjZXIuYWxpdmUgJiYgc291cmNlciAhPT0gc2hvdC5vd25lciAmJlxuICAgICAgICBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgc291cmNlci5wb3NpdGlvbikgPCBzaG90LnNpemUgKyBzb3VyY2VyLnNpemU7XG4gICAgfSk7XG4gICAgaWYgKGNvbGxpZGVkU291cmNlcikge1xuICAgICAgcmV0dXJuIGNvbGxpZGVkU291cmNlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBjaGVja0NvbGxpc2lvbkVudmlyb21lbnQoc2hvdDogU2hvdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlQ2VudGVyKCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBsZXQgc3VtWCA9IDA7XG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XG4gICAgICBpZiAoc291cmNlci5hbGl2ZSkge1xuICAgICAgICBzdW1YICs9IHNvdXJjZXIucG9zaXRpb24ueDtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xuICB9XG5cbiAgcHVibGljIHBsYXllcnMoKSB7XG4gICAgY29uc3QgcGxheWVyczogUGxheWVyc0R1bXAgPSB7fTtcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKHNvdXJjZXIpID0+IHtcbiAgICAgIHBsYXllcnNbc291cmNlci5pZF0gPSB7XG4gICAgICAgIG5hbWU6IHNvdXJjZXIubmFtZSB8fCBzb3VyY2VyLmFjY291bnQsXG4gICAgICAgIGFjY291bnQ6IHNvdXJjZXIuYWNjb3VudCxcbiAgICAgICAgY29sb3I6IHNvdXJjZXIuY29sb3JcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHBsYXllcnM7XG4gIH1cblxuICBwcml2YXRlIGR1bXAoKTogRnJhbWVEdW1wIHtcbiAgICBjb25zdCBzb3VyY2Vyc0R1bXA6IFNvdXJjZXJEdW1wW10gPSBbXTtcbiAgICBjb25zdCBzaG90c0R1bXA6IFNob3REdW1wW10gPSBbXTtcbiAgICBjb25zdCBmeER1bXA6IEZ4RHVtcFtdID0gW107XG4gICAgY29uc3QgZGVidWdEdW1wOiBEZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdIH07XG5cbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKGFjdG9yKSA9PiB7XG4gICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xuICAgICAgaWYgKGFjdG9yLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUpIHtcbiAgICAgICAgZGVidWdEdW1wLmxvZ3MgPSBkZWJ1Z0R1bXAubG9ncy5jb25jYXQoYWN0b3IuZHVtcERlYnVnKCkubG9ncyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBpc1RoaW5rYWJsZSA9ICh4OiBTaG90KTogeCBpcyBNaXNzaWxlID0+IHgudHlwZSA9PT0gJ01pc3NpbGUnO1xuICAgIHRoaXMuc2hvdHMuZm9yRWFjaCgoYWN0b3IpID0+IHtcbiAgICAgIHNob3RzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XG4gICAgICBpZiAoYWN0b3Iub3duZXIuc2NyaXB0TG9hZGVyLmlzRGVidWdnYWJsZSAmJiBpc1RoaW5rYWJsZShhY3RvcikpIHtcbiAgICAgICAgZGVidWdEdW1wLmxvZ3MgPSBkZWJ1Z0R1bXAubG9ncy5jb25jYXQoYWN0b3IuZHVtcERlYnVnKCkubG9ncyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5meHMuZm9yRWFjaCgoZngpID0+IHtcbiAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZjogdGhpcy5mcmFtZSxcbiAgICAgIHM6IHNvdXJjZXJzRHVtcCxcbiAgICAgIGI6IHNob3RzRHVtcCxcbiAgICAgIHg6IGZ4RHVtcCxcbiAgICAgIGRlYnVnOiBkZWJ1Z0R1bXBcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVQYXJhbSB7XG4gIHB1YmxpYyBzdGF0aWMgbGFzZXIocG93ZXI6IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIpOiBGaXJlUGFyYW0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBGaXJlUGFyYW0oKTtcbiAgICByZXN1bHQucG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XG4gICAgcmVzdWx0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICByZXN1bHQuc2hvdFR5cGUgPSAnTGFzZXInO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtaXNzaWxlKGJvdDogKGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xuICAgIHJlc3VsdC5ib3QgPSBib3Q7XG4gICAgcmVzdWx0LnNob3RUeXBlID0gJ01pc3NpbGUnO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcHVibGljIGJvdDogKGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyKSA9PiB2b2lkO1xuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XG4gIHB1YmxpYyBwb3dlcjogbnVtYmVyO1xuICBwdWJsaWMgc2hvdFR5cGU6IHN0cmluZztcbn1cbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcbmltcG9ydCBWIGZyb20gJy4vVic7XG5pbXBvcnQgeyBGeER1bXAgfSBmcm9tICcuL0R1bXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGeCB7XG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgcHVibGljIHBvc2l0aW9uOiBWLCBwdWJsaWMgc3BlZWQ6IFYsIHB1YmxpYyBsZW5ndGg6IG51bWJlcikge1xuICAgIHRoaXMuZnJhbWUgPSAwO1xuICB9XG5cbiAgcHVibGljIGFjdGlvbigpIHtcbiAgICB0aGlzLmZyYW1lKys7XG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcbiAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG1vdmUoKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xuICB9XG5cbiAgcHVibGljIGR1bXAoKTogRnhEdW1wIHtcbiAgICByZXR1cm4ge1xuICAgICAgaTogdGhpcy5pZCxcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcbiAgICAgIGY6IHRoaXMuZnJhbWUsXG4gICAgICBsOiBNYXRoLnJvdW5kKHRoaXMubGVuZ3RoKVxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xuaW1wb3J0IFYgZnJvbSAnLi9WJztcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhc2VyIGV4dGVuZHMgU2hvdCB7XG4gIHB1YmxpYyB0ZW1wZXJhdHVyZSA9IDU7XG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiA4O1xuICBwcml2YXRlIG1vbWVudHVtOiBudW1iZXI7XG4gIGNvbnN0cnVjdG9yKGZpZWxkOiBGaWVsZCwgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikge1xuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ0xhc2VyJyk7XG4gICAgdGhpcy5zcGVlZCA9IFYuZGlyZWN0aW9uKGRpcmVjdGlvbikubXVsdGlwbHkocG93ZXIpO1xuICAgIHRoaXMubW9tZW50dW0gPSBDb25maWdzLkxBU0VSX01PTUVOVFVNO1xuICB9XG5cbiAgcHVibGljIGFjdGlvbigpIHtcbiAgICBzdXBlci5hY3Rpb24oKTtcbiAgICB0aGlzLm1vbWVudHVtIC09IENvbmZpZ3MuTEFTRVJfQVRURU5VQVRJT047XG4gICAgaWYgKHRoaXMubW9tZW50dW0gPCAwKSB7XG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcbmltcG9ydCBWIGZyb20gJy4vVic7XG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xuaW1wb3J0IE1pc3NpbGVDb21tYW5kIGZyb20gJy4vTWlzc2lsZUNvbW1hbmQnO1xuaW1wb3J0IE1pc3NpbGVDb250cm9sbGVyIGZyb20gJy4vTWlzc2lsZUNvbnRyb2xsZXInO1xuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XG5pbXBvcnQgeyBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaXNzaWxlIGV4dGVuZHMgU2hvdCB7XG4gIHB1YmxpYyB0ZW1wZXJhdHVyZSA9IDEwO1xuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gMTAgKyB0aGlzLnNwZWVkLmxlbmd0aCgpICogMjtcbiAgcHVibGljIGZ1ZWwgPSAxMDA7XG4gIHB1YmxpYyBicmVha2FibGUgPSB0cnVlO1xuXG4gIHB1YmxpYyBjb21tYW5kOiBNaXNzaWxlQ29tbWFuZDtcbiAgcHVibGljIGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyO1xuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wID0geyBsb2dzOiBbXSB9O1xuXG4gIGNvbnN0cnVjdG9yKGZpZWxkOiBGaWVsZCwgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyBib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkge1xuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ01pc3NpbGUnKTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IG93bmVyLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XG4gICAgdGhpcy5zcGVlZCA9IG93bmVyLnNwZWVkO1xuICAgIHRoaXMuY29tbWFuZCA9IG5ldyBNaXNzaWxlQ29tbWFuZCh0aGlzKTtcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgTWlzc2lsZUNvbnRyb2xsZXIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgb25UaGluaygpIHtcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcblxuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkgeyAvLyBDYW5jZWwgdGhpbmtpbmdcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xuICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XG4gICAgICB0aGlzLmRlYnVnRHVtcCA9IHsgbG9nczogW10gfTtcbiAgICAgIHRoaXMuY29udHJvbGxlci5jb25uZWN0Q29uc29sZSh0aGlzLm93bmVyLnNjcmlwdExvYWRlci5nZXRFeHBvc2VkQ29uc29sZSgpKTtcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQWN0aW9uKCkge1xuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XG4gICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkhpdChhdHRhY2s6IFNob3QpIHtcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KGF0dGFjayk7XG4gIH1cblxuICBwdWJsaWMgb3Bwb3NpdGUoZGlyZWN0aW9uOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBsb2cobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHVibGljIGR1bXBEZWJ1ZygpOiBEZWJ1Z0R1bXAge1xuICAgIHJldHVybiB0aGlzLmRlYnVnRHVtcDtcbiAgfVxufVxuIiwiaW1wb3J0IENvbW1hbmQgZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xuaW1wb3J0IFYgZnJvbSAnLi9WJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcbiAgcHVibGljIHNwZWVkVXA6IG51bWJlcjtcbiAgcHVibGljIHNwZWVkRG93bjogbnVtYmVyO1xuICBwdWJsaWMgdHVybjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtaXNzaWxlOiBNaXNzaWxlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgdGhpcy5zcGVlZFVwID0gMDtcbiAgICB0aGlzLnNwZWVkRG93biA9IDA7XG4gICAgdGhpcy50dXJuID0gMDtcbiAgfVxuXG4gIHB1YmxpYyBleGVjdXRlKCkge1xuICAgIGlmICgwIDwgdGhpcy5taXNzaWxlLmZ1ZWwpIHtcbiAgICAgIHRoaXMubWlzc2lsZS5kaXJlY3Rpb24gKz0gdGhpcy50dXJuO1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xuICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLmFkZChub3JtYWxpemVkLm11bHRpcGx5KHRoaXMuc3BlZWRVcCkpO1xuICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xuICAgICAgdGhpcy5taXNzaWxlLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLm1pc3NpbGUuZnVlbCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xuaW1wb3J0IE1pc3NpbGUgZnJvbSAnLi9NaXNzaWxlJztcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcbmltcG9ydCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaXNzaWxlQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xuICBwdWJsaWMgZGlyZWN0aW9uOiAoKSA9PiBudW1iZXI7XG4gIHB1YmxpYyBzY2FuRW5lbXk6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IGJvb2xlYW47XG4gIHB1YmxpYyBzcGVlZFVwOiAoKSA9PiB2b2lkO1xuICBwdWJsaWMgc3BlZWREb3duOiAoKSA9PiB2b2lkO1xuICBwdWJsaWMgdHVyblJpZ2h0OiAoKSA9PiB2b2lkO1xuICBwdWJsaWMgdHVybkxlZnQ6ICgpID0+IHZvaWQ7XG5cbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihtaXNzaWxlOiBNaXNzaWxlKSB7XG4gICAgc3VwZXIobWlzc2lsZSk7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcblxuICAgIGNvbnN0IGZpZWxkID0gbWlzc2lsZS5maWVsZDtcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xuXG4gICAgdGhpcy5mdWVsID0gKCkgPT4gbWlzc2lsZS5mdWVsO1xuXG4gICAgdGhpcy5zY2FuRW5lbXkgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XG4gICAgICBjb25zdCBtaXNzaWxlRGlyZWN0aW9uID0gbWlzc2lsZS5vcHBvc2l0ZShkaXJlY3Rpb24pO1xuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihtaXNzaWxlLnBvc2l0aW9uLCBtaXNzaWxlRGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xuICAgIH07XG5cbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICBjb21tYW5kLnNwZWVkVXAgPSAwLjg7XG4gICAgfTtcblxuICAgIHRoaXMuc3BlZWREb3duID0gKCkgPT4ge1xuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgY29tbWFuZC5zcGVlZERvd24gPSAwLjE7XG4gICAgfTtcblxuICAgIHRoaXMudHVyblJpZ2h0ID0gKCkgPT4ge1xuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgY29tbWFuZC50dXJuID0gLTk7XG4gICAgfTtcblxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICBjb21tYW5kLnR1cm4gPSA5O1xuICAgIH07XG4gICAgY29uc3QgaXNTdHJpbmcgPSAodmFsdWU6IGFueSk6IHZhbHVlIGlzIHN0cmluZyA9PiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBTdHJpbmddJztcbiAgICB0aGlzLmxvZyA9ICguLi5tZXNzYWdlOiBhbnlbXSkgPT4ge1xuICAgICAgbWlzc2lsZS5sb2cobWVzc2FnZS5tYXAodmFsdWUgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpLmpvaW4oJywgJykpO1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XG4gICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUubG9nID0gdGhpcy5sb2cuYmluZCh0aGlzKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XG5pbXBvcnQgeyBTaG90RHVtcCB9IGZyb20gJy4vRHVtcCc7XG5pbXBvcnQgViBmcm9tICcuL1YnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaG90IGV4dGVuZHMgQWN0b3Ige1xuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gMDtcbiAgcHVibGljIGJyZWFrYWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGZpZWxkOiBGaWVsZCwgcHVibGljIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgdHlwZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoZmllbGQsIG93bmVyLnBvc2l0aW9uLngsIG93bmVyLnBvc2l0aW9uLnkpO1xuICB9XG5cbiAgcHVibGljIGFjdGlvbigpIHtcbiAgICB0aGlzLm9uQWN0aW9uKCk7XG5cbiAgICBjb25zdCBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XG4gICAgaWYgKGNvbGxpZGVkKSB7XG4gICAgICBjb2xsaWRlZC5vbkhpdCh0aGlzKTtcbiAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50KHRoaXMpKSB7XG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XG4gICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRnhzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzLnJhbmQoMTYpIC0gOCwgVXRpbHMucmFuZCgxNikgLSA4KTtcbiAgICAgIGNvbnN0IHNwZWVkID0gbmV3IFYoVXRpbHMucmFuZCgxKSAtIDAuNSwgVXRpbHMucmFuZCgxKSAtIDAuNSk7XG4gICAgICBjb25zdCBsZW5ndGggPSBVdGlscy5yYW5kKDgpICsgNDtcbiAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4KHRoaXMuZmllbGQsIHBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKS5hZGQoc3BlZWQpLCBsZW5ndGgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVhY3Rpb24oc291cmNlcjogU291cmNlcikge1xuICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcbiAgfVxuXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICBwdWJsaWMgZHVtcCgpOiBTaG90RHVtcCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG86IHRoaXMub3duZXIuaWQsXG4gICAgICBpOiB0aGlzLmlkLFxuICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxuICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXG4gICAgICBzOiB0aGlzLnR5cGVcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XG5pbXBvcnQgU291cmNlckNvbW1hbmQgZnJvbSAnLi9Tb3VyY2VyQ29tbWFuZCc7XG5pbXBvcnQgU291cmNlckNvbnRyb2xsZXIgZnJvbSAnLi9Tb3VyY2VyQ29udHJvbGxlcic7XG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XG5pbXBvcnQgQ29uc3RzIGZyb20gJy4vQ29uc3RzJztcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcbmltcG9ydCBWIGZyb20gJy4vVic7XG5pbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xuaW1wb3J0IExhc2VyIGZyb20gJy4vTGFzZXInO1xuaW1wb3J0IE1pc3NpbGUgZnJvbSAnLi9NaXNzaWxlJztcbmltcG9ydCB7IFNvdXJjZXJEdW1wLCBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xuaW1wb3J0IFNjcmlwdExvYWRlciwgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcblxuaW50ZXJmYWNlIEV4cG9ydFNjb3BlIHtcbiAgbW9kdWxlOiB7XG4gICAgZXhwb3J0czogKChjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcikgPT4gdm9pZCkgfCBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyIGV4dGVuZHMgQWN0b3Ige1xuICBwdWJsaWMgYWxpdmUgPSB0cnVlO1xuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xuICBwdWJsaWMgc2hpZWxkID0gQ29uZmlncy5JTklUSUFMX1NISUVMRDtcbiAgcHVibGljIG1pc3NpbGVBbW1vID0gQ29uZmlncy5JTklUSUFMX01JU1NJTEVfQU1NTztcbiAgcHVibGljIGZ1ZWwgPSBDb25maWdzLklOSVRJQUxfRlVFTDtcblxuICBwdWJsaWMgY29tbWFuZDogU291cmNlckNvbW1hbmQ7XG4gIHB1YmxpYyBzY3JpcHRMb2FkZXI6IFNjcmlwdExvYWRlcjtcbiAgcHJpdmF0ZSBjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcjtcbiAgcHJpdmF0ZSBib3Q6ICgoY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXIpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZGVidWdEdW1wOiBEZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlciwgcHVibGljIGFpU291cmNlOiBzdHJpbmcsXG4gICAgcHVibGljIGFjY291bnQ6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNvbG9yOiBzdHJpbmcpIHtcblxuICAgIHN1cGVyKGZpZWxkLCB4LCB5KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IENvbnN0cy5ESVJFQ1RJT05fUklHSFQgOiBDb25zdHMuRElSRUNUSU9OX0xFRlQ7XG4gICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kKHRoaXMpO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTb3VyY2VyQ29udHJvbGxlcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBjb21waWxlKHNjcmlwdExvYWRlcjogU2NyaXB0TG9hZGVyKSB7XG4gICAgdGhpcy5zY3JpcHRMb2FkZXIgPSBzY3JpcHRMb2FkZXI7XG4gICAgdGhpcy5ib3QgPSBzY3JpcHRMb2FkZXIubG9hZCh0aGlzLmFpU291cmNlKTtcbiAgICBpZiAoIXRoaXMuYm90KSB7XG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdGdW5jdGlvbiBoYXMgbm90IGJlZW4gcmV0dXJuZWQuJyB9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMuYm90ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdSZXR1cm5lZCBpcyBub3QgYSBGdW5jdGlvbi4nIH07XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uVGhpbmsoKSB7XG4gICAgaWYgKHRoaXMuYm90ID09PSBudWxsIHx8ICF0aGlzLmFsaXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcbiAgICAgIHRoaXMuY29udHJvbGxlci5wcmVUaGluaygpO1xuICAgICAgdGhpcy5kZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdIH07XG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XG4gICAgICB0aGlzLmJvdCh0aGlzLmNvbnRyb2xsZXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFjdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgVXRpbHMucmFuZCg4KSA8IDEpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHMucmFuZCgxNikgLSA4LCBVdGlscy5yYW5kKDE2KSAtIDgpO1xuICAgICAgY29uc3Qgc3BlZWQgPSBuZXcgVihVdGlscy5yYW5kKDEpIC0gMC41LCBVdGlscy5yYW5kKDEpICsgMC41KTtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IFV0aWxzLnJhbmQoOCkgKyA0O1xuICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgcG9zaXRpb24sIHNwZWVkLCBsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvLyBhaXIgcmVzaXN0YW5jZVxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XG5cbiAgICAvLyBncmF2aXR5XG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlncy5HUkFWSVRZKTtcblxuICAgIC8vIGNvbnRyb2wgYWx0aXR1ZGUgYnkgdGhlIGludmlzaWJsZSBoYW5kXG4gICAgaWYgKENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EIDwgdGhpcy5wb3NpdGlvbi55KSB7XG4gICAgICBjb25zdCBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzLkdSQVZJVFkgKiBpbnZpc2libGVQb3dlcik7XG4gICAgfVxuXG4gICAgLy8gY29udHJvbCBkaXN0YW5jZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcbiAgICBjb25zdCBkaWZmID0gdGhpcy5maWVsZC5jZW50ZXIgLSB0aGlzLnBvc2l0aW9uLng7XG4gICAgaWYgKENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcbiAgICAgIGNvbnN0IG4gPSBkaWZmIDwgMCA/IC0xIDogMTtcbiAgICAgIGNvbnN0IGludmlzaWJsZUhhbmQgPSAoTWF0aC5hYnMoZGlmZikgLSBDb25maWdzLkRJU1RBTkNFX0JPUkRBUikgKiBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EICogbjtcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLnggKyBpbnZpc2libGVIYW5kLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgIH1cblxuICAgIC8vIGdvIGludG8gdGhlIGdyb3VuZFxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRSk7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYodGhpcy5wb3NpdGlvbi54LCAwKTtcbiAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVih0aGlzLnNwZWVkLngsIDApO1xuICAgIH1cblxuICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlncy5DT09MX0RPV047XG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IE1hdGgubWF4KHRoaXMudGVtcGVyYXR1cmUsIDApO1xuXG4gICAgLy8gb3ZlcmhlYXRcbiAgICBjb25zdCBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlncy5PVkVSSEVBVF9CT1JERVIpO1xuICAgIGlmICgwIDwgb3ZlcmhlYXQpIHtcbiAgICAgIGNvbnN0IGxpbmVhckRhbWFnZSA9IG92ZXJoZWF0ICogQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVDtcbiAgICAgIGNvbnN0IHBvd2VyRGFtYWdlID0gTWF0aC5wb3cob3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xuICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcbiAgICB9XG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG5cbiAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xuICB9XG5cbiAgcHVibGljIGZpcmUocGFyYW06IEZpcmVQYXJhbSkge1xuICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ0xhc2VyJykge1xuICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xuICAgICAgY29uc3Qgc2hvdCA9IG5ldyBMYXNlcih0aGlzLmZpZWxkLCB0aGlzLCBkaXJlY3Rpb24sIHBhcmFtLnBvd2VyKTtcbiAgICAgIHNob3QucmVhY3Rpb24odGhpcyk7XG4gICAgICB0aGlzLmZpZWxkLmFkZFNob3Qoc2hvdCk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSAnTWlzc2lsZScpIHtcbiAgICAgIGlmICgwIDwgdGhpcy5taXNzaWxlQW1tbykge1xuICAgICAgICBjb25zdCBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYm90KTtcbiAgICAgICAgbWlzc2lsZS5yZWFjdGlvbih0aGlzKTtcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xuICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3QobWlzc2lsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9wcG9zaXRlKGRpcmVjdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fTEVGVCkge1xuICAgICAgcmV0dXJuIFV0aWxzLnRvT3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuYWRkKHNob3Quc3BlZWQubXVsdGlwbHkoQ29uZmlncy5PTl9ISVRfU1BFRURfR0lWRU5fUkFURSkpO1xuICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XG4gICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHNob3QpO1xuICB9XG5cbiAgcHVibGljIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2gobWVzc2FnZSk7XG4gIH1cblxuICBwdWJsaWMgZHVtcCgpOiBTb3VyY2VyRHVtcCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGk6IHRoaXMuaWQsXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXG4gICAgICBkOiB0aGlzLmRpcmVjdGlvbixcbiAgICAgIGg6IE1hdGguY2VpbCh0aGlzLnNoaWVsZCksXG4gICAgICB0OiBNYXRoLmNlaWwodGhpcy50ZW1wZXJhdHVyZSksXG4gICAgICBhOiB0aGlzLm1pc3NpbGVBbW1vLFxuICAgICAgZjogTWF0aC5jZWlsKHRoaXMuZnVlbClcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGR1bXBEZWJ1ZygpOiBEZWJ1Z0R1bXAge1xuICAgIHJldHVybiB0aGlzLmRlYnVnRHVtcDtcbiAgfVxufVxuIiwiaW1wb3J0IENvbW1hbmQgZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XG4gIHB1YmxpYyBhaGVhZDogbnVtYmVyO1xuICBwdWJsaWMgYXNjZW50OiBudW1iZXI7XG4gIHB1YmxpYyB0dXJuOiBib29sZWFuO1xuICBwdWJsaWMgZmlyZTogRmlyZVBhcmFtIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlcjogU291cmNlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcHVibGljIHJlc2V0KCkge1xuICAgIHRoaXMuYWhlYWQgPSAwO1xuICAgIHRoaXMuYXNjZW50ID0gMDtcbiAgICB0aGlzLnR1cm4gPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUgPSBudWxsO1xuICB9XG5cbiAgcHVibGljIGV4ZWN1dGUoKSB7XG4gICAgaWYgKHRoaXMuZmlyZSkge1xuICAgICAgdGhpcy5zb3VyY2VyLmZpcmUodGhpcy5maXJlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50dXJuKSB7XG4gICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xuICAgIH1cblxuICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcbiAgICAgIHRoaXMuc291cmNlci5zcGVlZCA9IHRoaXMuc291cmNlci5zcGVlZC5hZGQodGhpcy5haGVhZCAqIHRoaXMuc291cmNlci5kaXJlY3Rpb24sIHRoaXMuYXNjZW50KTtcbiAgICAgIHRoaXMuc291cmNlci5mdWVsIC09IChNYXRoLmFicyh0aGlzLmFoZWFkKSArIE1hdGguYWJzKHRoaXMuYXNjZW50KSkgKiBDb25maWdzLkZVRUxfQ09TVDtcbiAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyJztcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XG5pbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XG5pbXBvcnQgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlckNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcbiAgcHVibGljIHNoaWVsZDogKCkgPT4gbnVtYmVyO1xuICBwdWJsaWMgdGVtcGVyYXR1cmU6ICgpID0+IG51bWJlcjtcbiAgcHVibGljIG1pc3NpbGVBbW1vOiAoKSA9PiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcbiAgcHVibGljIHNjYW5BdHRhY2s6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbiAgcHVibGljIGFoZWFkOiAoKSA9PiB2b2lkO1xuICBwdWJsaWMgYmFjazogKCkgPT4gdm9pZDtcbiAgcHVibGljIGFzY2VudDogKCkgPT4gdm9pZDtcbiAgcHVibGljIGRlc2NlbnQ6ICgpID0+IHZvaWQ7XG4gIHB1YmxpYyB0dXJuOiAoKSA9PiB2b2lkO1xuXG4gIHB1YmxpYyBmaXJlTGFzZXI6IChkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikgPT4gdm9pZDtcbiAgcHVibGljIGZpcmVNaXNzaWxlOiAoYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQpID0+IHZvaWQ7XG5cbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihzb3VyY2VyOiBTb3VyY2VyKSB7XG4gICAgc3VwZXIoc291cmNlcik7XG5cbiAgICB0aGlzLnNoaWVsZCA9ICgpID0+IHNvdXJjZXIuc2hpZWxkO1xuICAgIHRoaXMudGVtcGVyYXR1cmUgPSAoKSA9PiBzb3VyY2VyLnRlbXBlcmF0dXJlO1xuICAgIHRoaXMubWlzc2lsZUFtbW8gPSAoKSA9PiBzb3VyY2VyLm1pc3NpbGVBbW1vO1xuICAgIHRoaXMuZnVlbCA9ICgpID0+IHNvdXJjZXIuZnVlbDtcblxuICAgIGNvbnN0IGZpZWxkID0gc291cmNlci5maWVsZDtcbiAgICBjb25zdCBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xuICAgIHRoaXMuc2NhbkVuZW15ID0gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSA9PiB7XG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XG4gICAgICBjb25zdCBvcHBvc2l0ZWREaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XG4gICAgICBjb25zdCBub3JtYWxpemVkUmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xuICAgICAgcmV0dXJuIGZpZWxkLnNjYW5FbmVteShzb3VyY2VyLCByYWRhcik7XG4gICAgfTtcbiAgICB0aGlzLnNjYW5BdHRhY2sgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzLlNDQU5fV0FJVDtcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRSZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICBjb25zdCByYWRhciA9IFV0aWxzLmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIG9wcG9zaXRlZERpcmVjdGlvbiwgYW5nbGUsIG5vcm1hbGl6ZWRSZW5nZSk7XG4gICAgICByZXR1cm4gZmllbGQuc2NhbkF0dGFjayhzb3VyY2VyLCByYWRhcik7XG4gICAgfTtcbiAgICB0aGlzLmFoZWFkID0gKCkgPT4ge1xuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xuICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcbiAgICB9O1xuICAgIHRoaXMuYmFjayA9ICgpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIGNvbW1hbmQuYWhlYWQgPSAtMC40O1xuICAgIH07XG4gICAgdGhpcy5hc2NlbnQgPSAoKSA9PiB7XG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XG4gICAgICBjb21tYW5kLmFzY2VudCA9IDAuOTtcbiAgICB9O1xuICAgIHRoaXMuZGVzY2VudCA9ICgpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcbiAgICB9O1xuICAgIHRoaXMudHVybiA9ICgpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIGNvbW1hbmQudHVybiA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMuZmlyZUxhc2VyID0gKGRpcmVjdGlvbiwgcG93ZXIpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIGNvbW1hbmQuZmlyZSA9IEZpcmVQYXJhbS5sYXNlcihwb3dlciwgZGlyZWN0aW9uKTtcbiAgICB9O1xuXG4gICAgdGhpcy5maXJlTWlzc2lsZSA9IChib3QpID0+IHtcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcbiAgICAgIGNvbW1hbmQuZmlyZSA9IEZpcmVQYXJhbS5taXNzaWxlKGJvdCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGlzU3RyaW5nID0gKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzdHJpbmcgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcbiAgICAgIHNvdXJjZXIubG9nKG1lc3NhZ2UubWFwKHZhbHVlID0+IGlzU3RyaW5nKHZhbHVlKSA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpKS5qb2luKCcsICcpKTtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNvbm5lY3RDb25zb2xlKGNvbnNvbGU6IENvbnNvbGVMaWtlIHwgbnVsbCkge1xuICAgIGlmIChjb25zb2xlKSB7XG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgViBmcm9tICcuL1YnO1xuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XG5cbmNvbnN0IEVQU0lMT04gPSAxMGUtMTI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcbiAgcHVibGljIHN0YXRpYyBjcmVhdGVSYWRhcihjOiBWLCBkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U6IG51bWJlcik6ICh0OiBWKSA9PiBib29sZWFuIHtcbiAgICBjb25zdCBjaGVja0Rpc3RhbmNlID0gKHQ6IFYpID0+IGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7XG5cbiAgICBpZiAoMzYwIDw9IGFuZ2xlKSB7XG4gICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XG4gICAgY29uc3QgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcblxuICAgIGlmIChhbmdsZSA8IDE4MCkge1xuICAgICAgcmV0dXJuIHQgPT4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHQgPT4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzaWRlKGJhc2U6IFYsIGRlZ3JlZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gbmV3IFYoTWF0aC5jb3MocmFkaWFuKSwgTWF0aC5zaW4ocmFkaWFuKSk7XG4gICAgY29uc3QgcHJldmlvdXNseSA9IGJhc2UueCAqIGRpcmVjdGlvbi55IC0gYmFzZS55ICogZGlyZWN0aW9uLnggLSBFUFNJTE9OO1xuICAgIHJldHVybiAodGFyZ2V0OiBWKSA9PiB7XG4gICAgICByZXR1cm4gMCA8PSB0YXJnZXQueCAqIGRpcmVjdGlvbi55IC0gdGFyZ2V0LnkgKiBkaXJlY3Rpb24ueCAtIHByZXZpb3VzbHk7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY2FsY0Rpc3RhbmNlKGY6IFYsIHQ6IFYsIHA6IFYpOiBudW1iZXIge1xuICAgIGNvbnN0IHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XG4gICAgY29uc3QgcEZyb20gPSBwLnN1YnRyYWN0KGYpO1xuICAgIGlmICh0b0Zyb20uZG90KHBGcm9tKSA8IEVQU0lMT04pIHtcbiAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xuICAgIGNvbnN0IHBUbyA9IHAuc3VidHJhY3QodCk7XG4gICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcbiAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyB0b1JhZGlhbihkZWdyZWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgdG9PcHBvc2l0ZShkZWdyZWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IFV0aWxzLm5vcm1hbGl6ZURlZ3JlZShkZWdyZWUpO1xuICAgIGlmIChub3JtYWxpemVkIDw9IDE4MCkge1xuICAgICAgcmV0dXJuICg5MCAtIG5vcm1hbGl6ZWQpICogMiArIG5vcm1hbGl6ZWQ7XG4gICAgfVxuICAgIHJldHVybiAoMjcwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIG5vcm1hbGl6ZURlZ3JlZShkZWdyZWU6IG51bWJlcikge1xuICAgIGNvbnN0IHJlbWFpbmRlciA9IGRlZ3JlZSAlIDM2MDtcbiAgICByZXR1cm4gcmVtYWluZGVyIDwgMCA/IHJlbWFpbmRlciArIDM2MCA6IHJlbWFpbmRlcjtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcmFuZChyZW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWIHtcbiAgcHJpdmF0ZSBjYWxjdWxhdGVkTGVuZ3RoOiBudW1iZXI7XG4gIHByaXZhdGUgY2FsY3VsYXRlZEFuZ2xlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge1xuICB9XG5cbiAgcHVibGljIGFkZCh2OiBWKTogVjtcbiAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFY7XG4gIHB1YmxpYyBhZGQodjogYW55LCB5PzogbnVtYmVyKTogViB7XG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgKHYueCB8fCAwKSwgdGhpcy55ICsgKHYueSB8fCAwKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVih0aGlzLnggKyAodiB8fCAwKSwgdGhpcy55ICsgKHkgfHwgMCkpO1xuICB9XG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBWKTogVjtcbiAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyKTogVjtcbiAgcHVibGljIHN1YnRyYWN0KHY6IGFueSwgeT86IG51bWJlcik6IFYge1xuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAtICh2LnggfHwgMCksIHRoaXMueSAtICh2LnkgfHwgMCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYgfHwgMCksIHRoaXMueSAtICh5IHx8IDApKTtcbiAgfVxuICBwdWJsaWMgbXVsdGlwbHkodjogViB8IG51bWJlcik6IFYge1xuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xuICB9XG4gIHB1YmxpYyBkaXZpZGUodjogViB8IG51bWJlcik6IFYge1xuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xuICB9XG4gIHB1YmxpYyBtb2R1bG8odjogViB8IG51bWJlcik6IFYge1xuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYueCwgdGhpcy55ICUgdi55KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xuICB9XG4gIHB1YmxpYyBuZWdhdGUoKTogViB7XG4gICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xuICB9XG4gIHB1YmxpYyBkaXN0YW5jZSh2OiBWKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcbiAgfVxuICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVkTGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZW5ndGg7XG4gIH1cbiAgcHVibGljIG5vcm1hbGl6ZSgpOiBWIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5sZW5ndGgoKTtcbiAgICBjb25zdCBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xuICB9XG4gIHB1YmxpYyBhbmdsZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xuICB9XG4gIHB1YmxpYyBhbmdsZUluUmFkaWFucygpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRBbmdsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZEFuZ2xlO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XG4gIH1cbiAgcHVibGljIGRvdChwb2ludDogViA9IHRoaXMpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnggKiBwb2ludC54ICsgdGhpcy55ICogcG9pbnQueTtcbiAgfVxuICBwdWJsaWMgY3Jvc3MocG9pbnQ6IFYpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnggKiBwb2ludC55IC0gdGhpcy55ICogcG9pbnQueDtcbiAgfVxuICBwdWJsaWMgcm90YXRlKGRlZ3JlZTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmFkaWFuID0gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbik7XG4gICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcbiAgICByZXR1cm4gbmV3IFYoY29zICogdGhpcy54IC0gc2luICogdGhpcy55LCBjb3MgKiB0aGlzLnkgKyBzaW4gKiB0aGlzLngpO1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGlyZWN0aW9uKGRlZ3JlZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBWKDEsIDApLnJvdGF0ZShkZWdyZWUpO1xuICB9XG4gIHB1YmxpYyBtaW5pbWl6ZSgpIHtcbiAgICByZXR1cm4geyB4OiBNYXRoLnJvdW5kKHRoaXMueCksIHk6IE1hdGgucm91bmQodGhpcy55KSB9IGFzIFY7XG4gIH1cbn1cbiJdfQ==
