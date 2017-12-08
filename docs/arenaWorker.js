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
        this.sourcers.forEach(function (actor) {
            sourcersDump.push(actor.dump());
        });
        var isThinkable = function (x) { return x.type === 'Missile'; };
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
            this.debugDump = { logs: [], arcs: [] };
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
    Missile.prototype.scanDebug = function (direction, angle, renge) {
        this.debugDump.arcs.push({ angle: angle, renge: renge, direction: -direction });
    };
    Missile.prototype.dump = function () {
        var superDump = _super.prototype.dump.call(this);
        if (this.owner.scriptLoader.isDebuggable) {
            superDump.debug = this.debugDump;
        }
        return superDump;
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
            command.validate();
            missile.log(message.map(function (value) { return isString(value) ? value : JSON.stringify(value); }).join(', '));
        };
        _this.scanDebug = function (direction, angle, renge) {
            command.validate();
            missile.scanDebug(missile.opposite(direction), angle, renge);
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
        _this.debugDump = { logs: [], arcs: [] };
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
            this.debugDump = { logs: [], arcs: [] };
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
    Sourcer.prototype.scanDebug = function (direction, angle, renge) {
        this.debugDump.arcs.push({ direction: direction, angle: angle, renge: renge });
    };
    Sourcer.prototype.dump = function () {
        var dump = {
            i: this.id,
            p: this.position.minimize(),
            d: this.direction,
            h: Math.ceil(this.shield),
            t: Math.ceil(this.temperature),
            a: this.missileAmmo,
            f: Math.ceil(this.fuel)
        };
        if (this.scriptLoader.isDebuggable) {
            dump.debug = this.debugDump;
        }
        return dump;
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
            command.validate();
            sourcer.log(message.map(function (value) { return isString(value) ? value : JSON.stringify(value); }).join(', '));
        };
        _this.scanDebug = function (direction, angle, renge) {
            command.validate();
            sourcer.scanDebug(sourcer.opposite(direction), angle, renge);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBd0lBOztBQXhJQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBcUQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBa0MsRUFBRSxDQUFDO0FBRXBELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lB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Q0FBQztJQUNNLGlCQUFLLEdBQVosVUFBYSxLQUFRO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDTSxrQkFBTSxHQUFiLFVBQWMsTUFBYztRQUMxQixJQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBQ2EsV0FBUyxHQUF2QixVQUF3QixNQUFjO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDTSxvQkFBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBTyxDQUFDO0lBQy9ELENBQUM7SUFDSCxRQUFDO0FBQUQsQ0F2RkEsQUF1RkMsSUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRmllbGQgZnJvbSAnLi4vY29yZS9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4uL2NvcmUvU291cmNlcic7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuLi9jb3JlL1V0aWxzJztcclxuaW1wb3J0IFRpY2tFdmVudExpc3RlbmVyIGZyb20gJy4uL2NvcmUvVGlja0V2ZW50TGlzdGVuZXInO1xyXG5pbXBvcnQgeyBQbGF5ZXJzRHVtcCwgRnJhbWVEdW1wLCBSZXN1bHREdW1wIH0gZnJvbSAnLi4vY29yZS9EdW1wJztcclxuaW1wb3J0IEV4cG9zZWRTY3JpcHRMb2FkZXIgZnJvbSAnLi4vY29yZS9FeHBvc2VkU2NyaXB0TG9hZGVyJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVySW5mbyB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGNvbG9yOiBzdHJpbmc7XHJcbiAgc291cmNlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5pdGlhbFBhcmFtZXRlciB7XHJcbiAgaXNEZW1vOiBib29sZWFuO1xyXG4gIHNvdXJjZXM6IFBsYXllckluZm9bXTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRGF0YSA9IE5leHRDb21tYW5kIHwgUGxheWVyc0NvbW1hbmQgfCBQcmVUaGlua0NvbW1hbmQgfCBQb3N0VGhpbmtDb21tYW5kIHwgRmluaXNoZWRDb21tYW5kIHwgRW5kT2ZHYW1lQ29tbWFuZCB8IEVycm9yQ29tbWFuZDtcclxuXHJcbmludGVyZmFjZSBOZXh0Q29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ05leHQnO1xyXG4gIGlzc3VlZElkOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQbGF5ZXJzQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ1BsYXllcnMnO1xyXG4gIHBsYXllcnM6IFBsYXllcnNEdW1wO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUHJlVGhpbmtDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUHJlVGhpbmsnO1xyXG4gIGlkOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3N0VGhpbmtDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUG9zdFRoaW5rJztcclxuICBpZDogbnVtYmVyO1xyXG4gIGxvYWRlZEZyYW1lOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBGaW5pc2hlZENvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdGaW5pc2hlZCc7XHJcbiAgcmVzdWx0OiBSZXN1bHREdW1wO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRW5kT2ZHYW1lQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0VuZE9mR2FtZSc7XHJcbiAgZnJhbWVzOiBGcmFtZUR1bXBbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEVycm9yQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0Vycm9yJztcclxuICBlcnJvcjogc3RyaW5nO1xyXG59XHJcblxyXG5kZWNsYXJlIGZ1bmN0aW9uIHBvc3RNZXNzYWdlKG1lc3NhZ2U6IERhdGEpOiB2b2lkO1xyXG5cclxubGV0IGlzc3VlSWQgPSAwO1xyXG5jb25zdCBpc3N1ZSA9ICgpID0+IGlzc3VlSWQrKztcclxuY29uc3QgY2FsbGJhY2tzOiB7IFtpZDogbnVtYmVyXTogKCkgPT4gdm9pZDsgfSA9IHt9O1xyXG5cclxub25tZXNzYWdlID0gKHsgZGF0YSB9KSA9PiB7XHJcbiAgaWYgKGRhdGEuaXNzdWVkSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgY2FsbGJhY2tzW2RhdGEuaXNzdWVkSWRdKCk7XHJcbiAgICBkZWxldGUgY2FsbGJhY2tzW2RhdGEuaXNzdWVkSWRdO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBpbml0aWFsUGFyYW1ldGVyID0gZGF0YSBhcyBJbml0aWFsUGFyYW1ldGVyO1xyXG4gIGNvbnN0IGlzRGVtbyA9IGluaXRpYWxQYXJhbWV0ZXIuaXNEZW1vIGFzIGJvb2xlYW47XHJcbiAgY29uc3QgcGxheWVycyA9IGluaXRpYWxQYXJhbWV0ZXIuc291cmNlcyBhcyBQbGF5ZXJJbmZvW107XHJcbiAgY29uc3QgZnJhbWVzOiBGcmFtZUR1bXBbXSA9IFtdO1xyXG4gIGNvbnN0IGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciA9IHtcclxuICAgIHdhaXROZXh0VGljazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBpc3N1ZWRJZCA9IGlzc3VlKCk7XHJcbiAgICAgICAgY2FsbGJhY2tzW2lzc3VlZElkXSA9IHJlc29sdmU7XHJcbiAgICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgaXNzdWVkSWQsXHJcbiAgICAgICAgICBjb21tYW5kOiAnTmV4dCdcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25QcmVUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiAnUHJlVGhpbmsnLFxyXG4gICAgICAgIGlkOiBzb3VyY2VySWRcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25Qb3N0VGhpbms6IChzb3VyY2VySWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgY29tbWFuZDogJ1Bvc3RUaGluaycsXHJcbiAgICAgICAgaWQ6IHNvdXJjZXJJZCxcclxuICAgICAgICBsb2FkZWRGcmFtZTogZnJhbWVzLmxlbmd0aFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbkZyYW1lOiAoZmllbGREdW1wOiBGcmFtZUR1bXApID0+IHtcclxuICAgICAgZnJhbWVzLnB1c2goZmllbGREdW1wKTtcclxuICAgIH0sXHJcbiAgICBvbkZpbmlzaGVkOiAocmVzdWx0OiBSZXN1bHREdW1wKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICByZXN1bHQsXHJcbiAgICAgICAgY29tbWFuZDogJ0ZpbmlzaGVkJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbkVuZE9mR2FtZTogKCkgPT4ge1xyXG4gICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgZnJhbWVzLFxyXG4gICAgICAgIGNvbW1hbmQ6ICdFbmRPZkdhbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRXJyb3I6IChlcnJvcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBlcnJvcixcclxuICAgICAgICBjb21tYW5kOiAnRXJyb3InXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKEV4cG9zZWRTY3JpcHRMb2FkZXIsIGlzRGVtbyk7XHJcbiAgcGxheWVycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgIGZpZWxkLnJlZ2lzdGVyU291cmNlcih2YWx1ZS5zb3VyY2UsIHZhbHVlLm5hbWUsIHZhbHVlLm5hbWUsIHZhbHVlLmNvbG9yKTtcclxuICB9KTtcclxuXHJcbiAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgY29tbWFuZDogJ1BsYXllcnMnLFxyXG4gICAgcGxheWVyczogZmllbGQucGxheWVycygpXHJcbiAgfSk7XHJcblxyXG4gIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgZmllbGQuY29tcGlsZShsaXN0ZW5lcik7XHJcbiAgICBmb3IgKGxldCBjb3VudCA9IDA7IGNvdW50IDwgMTAwMDAgJiYgIWZpZWxkLmlzRmluaXNoZWQ7IGNvdW50KyspIHtcclxuICAgICAgYXdhaXQgZmllbGQudGljayhsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgfSwgMCk7XHJcbn07XHJcbiIsImltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciB7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHBvc2l0aW9uOiBWO1xyXG4gIHB1YmxpYyBzcGVlZDogVjtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgcHVibGljIHNpemUgPSBDb25maWdzLkNPTExJU0lPTl9TSVpFO1xyXG4gIHB1YmxpYyB3YWl0ID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIHRoaXMud2FpdCA9IDA7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYoeCwgeSk7XHJcbiAgICB0aGlzLnNwZWVkID0gbmV3IFYoMCwgMCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdGhpbmsoKSB7XHJcbiAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcclxuICAgICAgdGhpcy53YWl0ID0gMDtcclxuICAgICAgdGhpcy5vblRoaW5rKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLndhaXQgPSB0aGlzLndhaXQgLSAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKTogdm9pZCB7XHJcbiAgICAvLyBub3QgdGhpbmsgYW55dGhpbmcuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCk6IHZvaWQge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1vdmUoKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoc2hvdDogU2hvdCkge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsaW1lbnRhdGlvbicpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kIHtcclxuICBwcml2YXRlIGlzQWNjZXB0ZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgdmFsaWRhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNBY2NlcHRlZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29tbWFuZC4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHVibGljIGFjY2VwdCgpIHtcclxuICAgIHRoaXMuaXNBY2NlcHRlZCA9IHRydWU7XHJcbiAgfVxyXG4gIHB1YmxpYyB1bmFjY2VwdCgpIHtcclxuICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWdzIHtcclxuICBwdWJsaWMgc3RhdGljIElOSVRJQUxfU0hJRUxEID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9GVUVMID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcclxuICBwdWJsaWMgc3RhdGljIExBU0VSX0FUVEVOVUFUSU9OID0gMTtcclxuICBwdWJsaWMgc3RhdGljIExBU0VSX01PTUVOVFVNID0gMTI4O1xyXG4gIHB1YmxpYyBzdGF0aWMgRlVFTF9DT1NUID0gMC4yNDtcclxuICBwdWJsaWMgc3RhdGljIENPTExJU0lPTl9TSVpFID0gNDtcclxuICBwdWJsaWMgc3RhdGljIFNDQU5fV0FJVCA9IDAuMzU7XHJcbiAgcHVibGljIHN0YXRpYyBTUEVFRF9SRVNJU1RBTkNFID0gMC45NjtcclxuICBwdWJsaWMgc3RhdGljIEdSQVZJVFkgPSAwLjE7XHJcbiAgcHVibGljIHN0YXRpYyBUT1BfSU5WSVNJQkxFX0hBTkQgPSA0ODA7XHJcbiAgcHVibGljIHN0YXRpYyBESVNUQU5DRV9CT1JEQVIgPSA0MDA7XHJcbiAgcHVibGljIHN0YXRpYyBESVNUQU5DRV9JTlZJU0lCTEVfSEFORCA9IDAuMDA4O1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfQk9SREVSID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQgPSAwLjA1O1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCA9IDAuMDEyO1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JPVU5EX0RBTUFHRV9TQ0FMRSA9IDE7XHJcbiAgcHVibGljIHN0YXRpYyBDT09MX0RPV04gPSAwLjU7XHJcbiAgcHVibGljIHN0YXRpYyBPTl9ISVRfU1BFRURfR0lWRU5fUkFURSA9IDAuNDtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zdHMge1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUSU9OX1JJR0hUID0gMTtcclxuICBwdWJsaWMgc3RhdGljIERJUkVDVElPTl9MRUZUID0gLTE7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJUSUNBTF9VUCA9ICd2ZXJ0aWFsX3VwJztcclxuICBwdWJsaWMgc3RhdGljIFZFUlRJQ0FMX0RPV04gPSAndmVydGlhbF9kb3duJztcclxufVxyXG4iLCJpbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBmcmFtZTogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyBhbHRpdHVkZTogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyB3YWl0OiAoZnJhbWU6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZnVlbDogKCkgPT4gbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIGZyYW1lc09mTGlmZTogbnVtYmVyID0gMDtcclxuICBwdWJsaWMgcHJlVGhpbmsgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmZyYW1lc09mTGlmZSsrO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoYWN0b3I6IEFjdG9yKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gKCkgPT4gdGhpcy5mcmFtZXNPZkxpZmU7XHJcbiAgICB0aGlzLmFsdGl0dWRlID0gKCkgPT4gYWN0b3IucG9zaXRpb24ueTtcclxuICAgIHRoaXMud2FpdCA9IChmcmFtZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmICgwIDwgZnJhbWUpIHtcclxuICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yOiBhbnksIGFyZ3M6IHN0cmluZ1tdKSB7XHJcbiAgZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH1cclxuICBmdW4ucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG4gIHJldHVybiBuZXcgKGZ1biBhcyBhbnkpKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zZWRTY3JpcHRMb2FkZXIgaW1wbGVtZW50cyBTY3JpcHRMb2FkZXIge1xyXG4gIHByaXZhdGUgYXJnVmFsdWVzOiBhbnlbXTtcclxuICBwcml2YXRlIGFyZ05hbWVzOiBzdHJpbmdbXTtcclxuICBwcml2YXRlIGJhbmxpc3Q6IHN0cmluZ1tdO1xyXG4gIHByaXZhdGUgY29uc29sZTogQ29uc29sZUxpa2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25zb2xlID0geyBsb2c6ICguLi5tZXNzYWdlKSA9PiB7IC8qIG5vdGhpbmcuLiAqLyB9IH07XHJcbiAgICBjb25zdCBhbGxvd0xpYnMgPSB7XHJcbiAgICAgIE9iamVjdCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIEFycmF5LCBEYXRlLCBNYXRoLCBSZWdFeHAsIEpTT04sIE5hTiwgSW5maW5pdHksIHVuZGVmaW5lZCwgcGFyc2VJbnQsIHBhcnNlRmxvYXQsIGlzTmFOLCBpc0Zpbml0ZSxcclxuICAgICAgY29uc29sZTogdGhpcy5jb25zb2xlXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1mdW5jdGlvbi1jb25zdHJ1Y3Rvci13aXRoLXN0cmluZy1hcmdzXHJcbiAgICBjb25zdCBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcclxuICAgIHRoaXMuYmFubGlzdCA9IFsnX19wcm90b19fJywgJ3Byb3RvdHlwZSddO1xyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxyXG4gICAgZm9yIChjb25zdCB0YXJnZXQgaW4gZ2xvYmFsKSB7XHJcbiAgICAgIHRoaXMuYmFubGlzdC5wdXNoKHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBsZXQgYXJnTmFtZXMgPSBPYmplY3Qua2V5cyhhbGxvd0xpYnMpO1xyXG4gICAgYXJnTmFtZXMgPSBhcmdOYW1lcy5jb25jYXQodGhpcy5iYW5saXN0LmZpbHRlcih2YWx1ZSA9PiBhcmdOYW1lcy5pbmRleE9mKHZhbHVlKSA+PSAwKSk7XHJcbiAgICB0aGlzLmFyZ05hbWVzID0gYXJnTmFtZXM7XHJcbiAgICB0aGlzLmFyZ1ZhbHVlcyA9IE9iamVjdC5rZXlzKGFsbG93TGlicykubWFwKGtleSA9PiAoYWxsb3dMaWJzIGFzIGFueSlba2V5XSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNEZWJ1Z2dhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0RXhwb3NlZENvbnNvbGUoKTogQ29uc29sZUxpa2UgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnNvbGU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZChzY3JpcHQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICBsZXQgYXJnTmFtZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBhcmdOYW1lcyA9IGFyZ05hbWVzLmNvbmNhdCh0aGlzLmFyZ05hbWVzKTtcclxuICAgIGFyZ05hbWVzLnB1c2goJ1widXNlIHN0cmljdFwiO1xcbicgKyBzY3JpcHQpO1xyXG4gICAgcmV0dXJuIGNvbnN0cnVjdChGdW5jdGlvbiwgYXJnTmFtZXMpLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5hcmdWYWx1ZXMpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgVGlja0V2ZW50TGlzdGVuZXIgZnJvbSAnLi9UaWNrRXZlbnRMaXN0ZW5lcic7XHJcbmltcG9ydCB7IEZyYW1lRHVtcCwgUmVzdWx0RHVtcCwgU291cmNlckR1bXAsIFNob3REdW1wLCBGeER1bXAsIFBsYXllcnNEdW1wLCBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5pbXBvcnQgU2NyaXB0TG9hZGVyLCB7IFNjcmlwdExvYWRlckNvbnN0cnVjdG9yIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuY29uc3QgREVNT19GUkFNRV9MRU5HVEggPSAxMjg7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZCB7XHJcbiAgcHJpdmF0ZSBjdXJyZW50SWQgPSAwO1xyXG4gIHByaXZhdGUgc291cmNlcnM6IFNvdXJjZXJbXTtcclxuICBwcml2YXRlIHNob3RzOiBTaG90W107XHJcbiAgcHJpdmF0ZSBmeHM6IEZ4W107XHJcbiAgcHJpdmF0ZSBmcmFtZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgcmVzdWx0OiBSZXN1bHREdW1wO1xyXG4gIHB1YmxpYyBjZW50ZXI6IG51bWJlcjtcclxuICBwdWJsaWMgaXNGaW5pc2hlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGR1bW15RW5lbXk6IFYgPSBuZXcgVigwLCAxNTApO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjcmlwdExvYWRlckNvbnN0cnVjdG9yOiBTY3JpcHRMb2FkZXJDb25zdHJ1Y3RvciwgcHVibGljIGlzRGVtbzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgIHRoaXMuc291cmNlcnMgPSBbXTtcclxuICAgIHRoaXMuc2hvdHMgPSBbXTtcclxuICAgIHRoaXMuZnhzID0gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVnaXN0ZXJTb3VyY2VyKHNvdXJjZTogc3RyaW5nLCBhY2NvdW50OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZykge1xyXG4gICAgY29uc3Qgc2lkZSA9ICh0aGlzLnNvdXJjZXJzLmxlbmd0aCAlIDIgPT09IDApID8gLTEgOiAxO1xyXG4gICAgY29uc3QgeCA9IFV0aWxzLnJhbmQoODApICsgMTYwICogc2lkZTtcclxuICAgIGNvbnN0IHkgPSBVdGlscy5yYW5kKDE2MCkgKyA4MDtcclxuICAgIHRoaXMuYWRkU291cmNlcihuZXcgU291cmNlcih0aGlzLCB4LCB5LCBzb3VyY2UsIGFjY291bnQsIG5hbWUsIGNvbG9yKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcHJvY2VzcyhsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIsIHRoaW5rOiAoc291cmNlcjogU291cmNlcikgPT4gdm9pZCkge1xyXG4gICAgZm9yIChjb25zdCBzb3VyY2VyIG9mIHRoaXMuc291cmNlcnMpIHtcclxuICAgICAgbGlzdGVuZXIub25QcmVUaGluayhzb3VyY2VyLmlkKTtcclxuICAgICAgYXdhaXQgbGlzdGVuZXIud2FpdE5leHRUaWNrKCk7XHJcbiAgICAgIHRoaW5rKHNvdXJjZXIpO1xyXG4gICAgICBsaXN0ZW5lci5vblBvc3RUaGluayhzb3VyY2VyLmlkKTtcclxuICAgICAgYXdhaXQgbGlzdGVuZXIud2FpdE5leHRUaWNrKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgY29tcGlsZShsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIHJldHVybiB0aGlzLnByb2Nlc3MobGlzdGVuZXIsIChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc291cmNlci5jb21waWxlKG5ldyB0aGlzLnNjcmlwdExvYWRlckNvbnN0cnVjdG9yKCkpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxpc3RlbmVyLm9uRXJyb3IoYFRoZXJlIGlzIGFuIGVycm9yIGluIHlvdXIgY29kZTrjgIAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFNvdXJjZXIoc291cmNlcjogU291cmNlcikge1xyXG4gICAgc291cmNlci5pZCA9IHRoaXMuY3VycmVudElkKys7XHJcbiAgICB0aGlzLnNvdXJjZXJzLnB1c2goc291cmNlcik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkU2hvdChzaG90OiBTaG90KSB7XHJcbiAgICBzaG90LmlkID0gdGhpcy5jdXJyZW50SWQrKztcclxuICAgIHRoaXMuc2hvdHMucHVzaChzaG90KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVTaG90KHRhcmdldDogU2hvdCkge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnNob3RzLmluZGV4T2YodGFyZ2V0KTtcclxuICAgIGlmICgwIDw9IGluZGV4KSB7XHJcbiAgICAgIHRoaXMuc2hvdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRGeChmeDogRngpIHtcclxuICAgIGZ4LmlkID0gdGhpcy5jdXJyZW50SWQrKztcclxuICAgIHRoaXMuZnhzLnB1c2goZngpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUZ4KHRhcmdldDogRngpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5meHMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgaWYgKDAgPD0gaW5kZXgpIHtcclxuICAgICAgdGhpcy5meHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyB0aWNrKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgaWYgKHRoaXMuZnJhbWUgPT09IDApIHtcclxuICAgICAgbGlzdGVuZXIub25GcmFtZSh0aGlzLmR1bXAoKSk7IC8vIFNhdmUgdGhlIDAgZnJhbWUuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG8gYmUgdXNlZCBpbiB0aGUgaW52aXNpYmxlIGhhbmQuXHJcbiAgICB0aGlzLmNlbnRlciA9IHRoaXMuY29tcHV0ZUNlbnRlcigpO1xyXG5cclxuICAgIC8vIFRoaW5rIHBoYXNlXHJcbiAgICBhd2FpdCB0aGlzLnByb2Nlc3MobGlzdGVuZXIsIChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XHJcbiAgICAgIHNvdXJjZXIudGhpbmsoKTtcclxuICAgICAgdGhpcy5zaG90cy5maWx0ZXIoKHNob3QgPT4gc2hvdC5vd25lci5pZCA9PT0gc291cmNlci5pZCkpLmZvckVhY2goc2hvdCA9PiBzaG90LnRoaW5rKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQWN0aW9uIHBoYXNlXHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLmFjdGlvbigpKTtcclxuICAgIHRoaXMuZnhzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG5cclxuICAgIC8vIE1vdmUgcGhhc2VcclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5tb3ZlKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcbiAgICB0aGlzLmZ4cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgcGhhc2VcclxuICAgIHRoaXMuY2hlY2tGaW5pc2gobGlzdGVuZXIpO1xyXG4gICAgdGhpcy5jaGVja0VuZE9mR2FtZShsaXN0ZW5lcik7XHJcblxyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG5cclxuICAgIC8vIG9uRnJhbWVcclxuICAgIGxpc3RlbmVyLm9uRnJhbWUodGhpcy5kdW1wKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0ZpbmlzaChsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICBpZiAoREVNT19GUkFNRV9MRU5HVEggPCB0aGlzLmZyYW1lKSB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSB7XHJcbiAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXHJcbiAgICAgICAgICBpc0RyYXc6IG51bGwsXHJcbiAgICAgICAgICB3aW5uZXJJZDogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc3VsdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyKSA9PiB7IHNvdXJjZXIuYWxpdmUgPSAwIDwgc291cmNlci5zaGllbGQ7IH0pO1xyXG4gICAgY29uc3Qgc3Vydml2ZXJzID0gdGhpcy5zb3VyY2Vycy5maWx0ZXIoc291cmNlciA9PiBzb3VyY2VyLmFsaXZlKTtcclxuXHJcbiAgICBpZiAoMSA8IHN1cnZpdmVycy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdXJ2aXZlcnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGNvbnN0IHN1cnZpdmVyID0gc3Vydml2ZXJzWzBdO1xyXG4gICAgICB0aGlzLnJlc3VsdCA9IHtcclxuICAgICAgICB3aW5uZXJJZDogc3Vydml2ZXIuaWQsXHJcbiAgICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXHJcbiAgICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgICBpc0RyYXc6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm8gc3Vydml2ZXIuLiBkcmF3Li4uXHJcbiAgICB0aGlzLnJlc3VsdCA9IHtcclxuICAgICAgd2lubmVySWQ6IG51bGwsXHJcbiAgICAgIHRpbWVvdXQ6IG51bGwsXHJcbiAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxyXG4gICAgICBpc0RyYXc6IHRydWVcclxuICAgIH07XHJcbiAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2tFbmRPZkdhbWUobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAodGhpcy5pc0ZpbmlzaGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMucmVzdWx0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0RlbW8pIHtcclxuICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgbGlzdGVuZXIub25FbmRPZkdhbWUoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc3VsdC5mcmFtZSA8IHRoaXMuZnJhbWUgLSA5MCkgeyAvLyBSZWNvcmQgc29tZSBmcmFtZXMgZXZlbiBhZnRlciBkZWNpZGVkLlxyXG4gICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5FbmVteShvd25lcjogU291cmNlciwgcmFkYXI6ICh0OiBWKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5pc0RlbW8gJiYgdGhpcy5zb3VyY2Vycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIHJhZGFyKHRoaXMuZHVtbXlFbmVteSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlcnMuc29tZSgoc291cmNlcikgPT4ge1xyXG4gICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5BdHRhY2sob3duZXI6IFNvdXJjZXIsIHJhZGFyOiAodDogVikgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hvdHMuc29tZSgoc2hvdCkgPT4ge1xyXG4gICAgICByZXR1cm4gc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoc2hvdC5wb3NpdGlvbikgJiYgdGhpcy5pc0luY29taW5nKG93bmVyLCBzaG90KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0luY29taW5nKG93bmVyOiBTb3VyY2VyLCBzaG90OiBTaG90KSB7XHJcbiAgICBjb25zdCBvd25lclBvc2l0aW9uID0gb3duZXIucG9zaXRpb247XHJcbiAgICBjb25zdCBhY3RvclBvc2l0aW9uID0gc2hvdC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGN1cnJlbnREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbik7XHJcbiAgICBjb25zdCBuZXh0RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24uYWRkKHNob3Quc3BlZWQpKTtcclxuICAgIHJldHVybiBuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb24oc2hvdDogU2hvdCk6IEFjdG9yIHwgbnVsbCB7XHJcbiAgICBjb25zdCBmID0gc2hvdC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IHQgPSBzaG90LnBvc2l0aW9uLmFkZChzaG90LnNwZWVkKTtcclxuXHJcbiAgICBjb25zdCBjb2xsaWRlZFNob3QgPSB0aGlzLnNob3RzLmZpbmQoKGFjdG9yKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rvci5icmVha2FibGUgJiYgYWN0b3Iub3duZXIgIT09IHNob3Qub3duZXIgJiZcclxuICAgICAgICBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgYWN0b3IucG9zaXRpb24pIDwgc2hvdC5zaXplICsgYWN0b3Iuc2l6ZTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGNvbGxpZGVkU2hvdCkge1xyXG4gICAgICByZXR1cm4gY29sbGlkZWRTaG90O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbGxpZGVkU291cmNlciA9IHRoaXMuc291cmNlcnMuZmluZCgoc291cmNlcikgPT4ge1xyXG4gICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBzaG90Lm93bmVyICYmXHJcbiAgICAgICAgVXRpbHMuY2FsY0Rpc3RhbmNlKGYsIHQsIHNvdXJjZXIucG9zaXRpb24pIDwgc2hvdC5zaXplICsgc291cmNlci5zaXplO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoY29sbGlkZWRTb3VyY2VyKSB7XHJcbiAgICAgIHJldHVybiBjb2xsaWRlZFNvdXJjZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50KHNob3Q6IFNob3QpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wdXRlQ2VudGVyKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgbGV0IHN1bVggPSAwO1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XHJcbiAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XHJcbiAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBsYXllcnMoKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJzOiBQbGF5ZXJzRHVtcCA9IHt9O1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyKSA9PiB7XHJcbiAgICAgIHBsYXllcnNbc291cmNlci5pZF0gPSB7XHJcbiAgICAgICAgbmFtZTogc291cmNlci5uYW1lIHx8IHNvdXJjZXIuYWNjb3VudCxcclxuICAgICAgICBhY2NvdW50OiBzb3VyY2VyLmFjY291bnQsXHJcbiAgICAgICAgY29sb3I6IHNvdXJjZXIuY29sb3JcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHBsYXllcnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGR1bXAoKTogRnJhbWVEdW1wIHtcclxuICAgIGNvbnN0IHNvdXJjZXJzRHVtcDogU291cmNlckR1bXBbXSA9IFtdO1xyXG4gICAgY29uc3Qgc2hvdHNEdW1wOiBTaG90RHVtcFtdID0gW107XHJcbiAgICBjb25zdCBmeER1bXA6IEZ4RHVtcFtdID0gW107XHJcblxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG4gICAgICBzb3VyY2Vyc0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaXNUaGlua2FibGUgPSAoeDogU2hvdCk6IHggaXMgTWlzc2lsZSA9PiB4LnR5cGUgPT09ICdNaXNzaWxlJztcclxuICAgIHRoaXMuc2hvdHMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaCgoZngpID0+IHtcclxuICAgICAgZnhEdW1wLnB1c2goZnguZHVtcCgpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGY6IHRoaXMuZnJhbWUsXHJcbiAgICAgIHM6IHNvdXJjZXJzRHVtcCxcclxuICAgICAgYjogc2hvdHNEdW1wLFxyXG4gICAgICB4OiBmeER1bXBcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVQYXJhbSB7XHJcbiAgcHVibGljIHN0YXRpYyBsYXNlcihwb3dlcjogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlcik6IEZpcmVQYXJhbSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgRmlyZVBhcmFtKCk7XHJcbiAgICByZXN1bHQucG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XHJcbiAgICByZXN1bHQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG4gICAgcmVzdWx0LnNob3RUeXBlID0gJ0xhc2VyJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgbWlzc2lsZShib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xyXG4gICAgcmVzdWx0LmJvdCA9IGJvdDtcclxuICAgIHJlc3VsdC5zaG90VHlwZSA9ICdNaXNzaWxlJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgcHVibGljIHBvd2VyOiBudW1iZXI7XHJcbiAgcHVibGljIHNob3RUeXBlOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgeyBGeER1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRngge1xyXG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgcHVibGljIHBvc2l0aW9uOiBWLCBwdWJsaWMgc3BlZWQ6IFYsIHB1YmxpYyBsZW5ndGg6IG51bWJlcikge1xyXG4gICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlKCkge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogRnhEdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZjogdGhpcy5mcmFtZSxcclxuICAgICAgbDogTWF0aC5yb3VuZCh0aGlzLmxlbmd0aClcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFzZXIgZXh0ZW5kcyBTaG90IHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSA1O1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiA4O1xyXG4gIHByaXZhdGUgbW9tZW50dW06IG51bWJlcjtcclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXIsIHBvd2VyOiBudW1iZXIpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ0xhc2VyJyk7XHJcbiAgICB0aGlzLnNwZWVkID0gVi5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XHJcbiAgICB0aGlzLm1vbWVudHVtID0gQ29uZmlncy5MQVNFUl9NT01FTlRVTTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBzdXBlci5hY3Rpb24oKTtcclxuICAgIHRoaXMubW9tZW50dW0gLT0gQ29uZmlncy5MQVNFUl9BVFRFTlVBVElPTjtcclxuICAgIGlmICh0aGlzLm1vbWVudHVtIDwgMCkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IE1pc3NpbGVDb21tYW5kIGZyb20gJy4vTWlzc2lsZUNvbW1hbmQnO1xyXG5pbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgeyBEZWJ1Z0R1bXAsIFNob3REdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGUgZXh0ZW5kcyBTaG90IHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAxMDtcclxuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gMTAgKyB0aGlzLnNwZWVkLmxlbmd0aCgpICogMjtcclxuICBwdWJsaWMgZnVlbCA9IDEwMDtcclxuICBwdWJsaWMgYnJlYWthYmxlID0gdHJ1ZTtcclxuXHJcbiAgcHVibGljIGNvbW1hbmQ6IE1pc3NpbGVDb21tYW5kO1xyXG4gIHB1YmxpYyBjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcjtcclxuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wO1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ01pc3NpbGUnKTtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHMuRElSRUNUSU9OX1JJR0hUID8gMCA6IDE4MDtcclxuICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcclxuICAgIHRoaXMuY29tbWFuZCA9IG5ldyBNaXNzaWxlQ29tbWFuZCh0aGlzKTtcclxuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKSB7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5mdWVsIDw9IDApIHsgLy8gQ2FuY2VsIHRoaW5raW5nXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5wcmVUaGluaygpO1xyXG4gICAgICB0aGlzLmRlYnVnRHVtcCA9IHsgbG9nczogW10sIGFyY3M6IFtdIH07XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5jb25uZWN0Q29uc29sZSh0aGlzLm93bmVyLnNjcmlwdExvYWRlci5nZXRFeHBvc2VkQ29uc29sZSgpKTtcclxuICAgICAgdGhpcy5ib3QodGhpcy5jb250cm9sbGVyKTtcclxuICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XHJcbiAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoYXR0YWNrOiBTaG90KSB7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QoYXR0YWNrKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gKyBkaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5EZWJ1ZyhkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpIHtcclxuICAgIHRoaXMuZGVidWdEdW1wLmFyY3MucHVzaCh7IGFuZ2xlLCByZW5nZSwgZGlyZWN0aW9uOiAtZGlyZWN0aW9uIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogU2hvdER1bXAge1xyXG4gICAgY29uc3Qgc3VwZXJEdW1wID0gc3VwZXIuZHVtcCgpO1xyXG4gICAgaWYgKHRoaXMub3duZXIuc2NyaXB0TG9hZGVyLmlzRGVidWdnYWJsZSkge1xyXG4gICAgICBzdXBlckR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlckR1bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb21tYW5kIGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGVDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIHNwZWVkVXA6IG51bWJlcjtcclxuICBwdWJsaWMgc3BlZWREb3duOiBudW1iZXI7XHJcbiAgcHVibGljIHR1cm46IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNwZWVkVXAgPSAwO1xyXG4gICAgdGhpcy5zcGVlZERvd24gPSAwO1xyXG4gICAgdGhpcy50dXJuID0gMDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5tdWx0aXBseSgxIC0gdGhpcy5zcGVlZERvd24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyJztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc3BlZWRVcDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgc3BlZWREb3duOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyB0dXJuUmlnaHQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm5MZWZ0OiAoKSA9PiB2b2lkO1xyXG5cclxuICBwdWJsaWMgbG9nOiAoLi4ubWVzc2FnZXM6IGFueVtdKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzY2FuRGVidWc6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKG1pc3NpbGUpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xyXG5cclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IG1pc3NpbGUuZnVlbDtcclxuXHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XHJcbiAgICAgIGNvbnN0IG1pc3NpbGVEaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgbWlzc2lsZURpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkRG93biA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy50dXJuUmlnaHQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gLTk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gOTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBtaXNzaWxlLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiBpc1N0cmluZyh2YWx1ZSkgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSkuam9pbignLCAnKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5zY2FuRGVidWcgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBtaXNzaWxlLnNjYW5EZWJ1ZyhtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbiksIGFuZ2xlLCByZW5nZSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbm5lY3RDb25zb2xlKGNvbnNvbGU6IENvbnNvbGVMaWtlIHwgbnVsbCkge1xyXG4gICAgaWYgKGNvbnNvbGUpIHtcclxuICAgICAgY29uc29sZS5sb2cgPSB0aGlzLmxvZy5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xyXG5pbXBvcnQgeyBTaG90RHVtcCB9IGZyb20gJy4vRHVtcCc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNob3QgZXh0ZW5kcyBBY3RvciB7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMDtcclxuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gMDtcclxuICBwdWJsaWMgYnJlYWthYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGZpZWxkOiBGaWVsZCwgcHVibGljIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgdHlwZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihmaWVsZCwgb3duZXIucG9zaXRpb24ueCwgb3duZXIucG9zaXRpb24ueSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgdGhpcy5vbkFjdGlvbigpO1xyXG5cclxuICAgIGNvbnN0IGNvbGxpZGVkID0gdGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbih0aGlzKTtcclxuICAgIGlmIChjb2xsaWRlZCkge1xyXG4gICAgICBjb2xsaWRlZC5vbkhpdCh0aGlzKTtcclxuICAgICAgdGhpcy5jcmVhdGVGeHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5maWVsZC5jaGVja0NvbGxpc2lvbkVudmlyb21lbnQodGhpcykpIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVGeHMoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzLnJhbmQoMTYpIC0gOCwgVXRpbHMucmFuZCgxNikgLSA4KTtcclxuICAgICAgY29uc3Qgc3BlZWQgPSBuZXcgVihVdGlscy5yYW5kKDEpIC0gMC41LCBVdGlscy5yYW5kKDEpIC0gMC41KTtcclxuICAgICAgY29uc3QgbGVuZ3RoID0gVXRpbHMucmFuZCg4KSArIDQ7XHJcbiAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4KHRoaXMuZmllbGQsIHBvc2l0aW9uLCB0aGlzLnNwZWVkLmRpdmlkZSgyKS5hZGQoc3BlZWQpLCBsZW5ndGgpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWFjdGlvbihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzb3VyY2VyLnRlbXBlcmF0dXJlICs9IHRoaXMudGVtcGVyYXR1cmU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25BY3Rpb24oKSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpOiBTaG90RHVtcCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBvOiB0aGlzLm93bmVyLmlkLFxyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxyXG4gICAgICBzOiB0aGlzLnR5cGVcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgU291cmNlckNvbW1hbmQgZnJvbSAnLi9Tb3VyY2VyQ29tbWFuZCc7XHJcbmltcG9ydCBTb3VyY2VyQ29udHJvbGxlciBmcm9tICcuL1NvdXJjZXJDb250cm9sbGVyJztcclxuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBMYXNlciBmcm9tICcuL0xhc2VyJztcclxuaW1wb3J0IE1pc3NpbGUgZnJvbSAnLi9NaXNzaWxlJztcclxuaW1wb3J0IHsgU291cmNlckR1bXAsIERlYnVnRHVtcCB9IGZyb20gJy4vRHVtcCc7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IFNjcmlwdExvYWRlciwgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcclxuXHJcbmludGVyZmFjZSBFeHBvcnRTY29wZSB7XHJcbiAgbW9kdWxlOiB7XHJcbiAgICBleHBvcnRzOiAoKGNvbnRyb2xsZXI6IFNvdXJjZXJDb250cm9sbGVyKSA9PiB2b2lkKSB8IG51bGw7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlciBleHRlbmRzIEFjdG9yIHtcclxuICBwdWJsaWMgYWxpdmUgPSB0cnVlO1xyXG4gIHB1YmxpYyB0ZW1wZXJhdHVyZSA9IDA7XHJcbiAgcHVibGljIHNoaWVsZCA9IENvbmZpZ3MuSU5JVElBTF9TSElFTEQ7XHJcbiAgcHVibGljIG1pc3NpbGVBbW1vID0gQ29uZmlncy5JTklUSUFMX01JU1NJTEVfQU1NTztcclxuICBwdWJsaWMgZnVlbCA9IENvbmZpZ3MuSU5JVElBTF9GVUVMO1xyXG5cclxuICBwdWJsaWMgY29tbWFuZDogU291cmNlckNvbW1hbmQ7XHJcbiAgcHVibGljIHNjcmlwdExvYWRlcjogU2NyaXB0TG9hZGVyO1xyXG4gIHByaXZhdGUgY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXI7XHJcbiAgcHJpdmF0ZSBib3Q6ICgoY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXIpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBkZWJ1Z0R1bXA6IERlYnVnRHVtcCA9IHsgbG9nczogW10sIGFyY3M6IFtdIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlciwgcHVibGljIGFpU291cmNlOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgYWNjb3VudDogc3RyaW5nLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY29sb3I6IHN0cmluZykge1xyXG5cclxuICAgIHN1cGVyKGZpZWxkLCB4LCB5KTtcclxuXHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBDb25zdHMuRElSRUNUSU9OX1JJR0hUIDogQ29uc3RzLkRJUkVDVElPTl9MRUZUO1xyXG4gICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbXBpbGUoc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXIpIHtcclxuICAgIHRoaXMuc2NyaXB0TG9hZGVyID0gc2NyaXB0TG9hZGVyO1xyXG4gICAgdGhpcy5ib3QgPSBzY3JpcHRMb2FkZXIubG9hZCh0aGlzLmFpU291cmNlKTtcclxuICAgIGlmICghdGhpcy5ib3QpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnRnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJldHVybmVkLicgfTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdGhpcy5ib3QgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnUmV0dXJuZWQgaXMgbm90IGEgRnVuY3Rpb24uJyB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKSB7XHJcbiAgICBpZiAodGhpcy5ib3QgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XHJcbiAgICAgIHRoaXMuZGVidWdEdW1wID0geyBsb2dzOiBbXSwgYXJjczogW10gfTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmNvbm5lY3RDb25zb2xlKHRoaXMuc2NyaXB0TG9hZGVyLmdldEV4cG9zZWRDb25zb2xlKCkpO1xyXG4gICAgICB0aGlzLmJvdCh0aGlzLmNvbnRyb2xsZXIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgVXRpbHMucmFuZCg4KSA8IDEpIHtcclxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChVdGlscy5yYW5kKDE2KSAtIDgsIFV0aWxzLnJhbmQoMTYpIC0gOCk7XHJcbiAgICAgIGNvbnN0IHNwZWVkID0gbmV3IFYoVXRpbHMucmFuZCgxKSAtIDAuNSwgVXRpbHMucmFuZCgxKSArIDAuNSk7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IFV0aWxzLnJhbmQoOCkgKyA0O1xyXG4gICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeCh0aGlzLmZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFpciByZXNpc3RhbmNlXHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xyXG5cclxuICAgIC8vIGdyYXZpdHlcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSk7XHJcblxyXG4gICAgLy8gY29udHJvbCBhbHRpdHVkZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcclxuICAgIGlmIChDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xyXG4gICAgICBjb25zdCBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb250cm9sIGRpc3RhbmNlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxyXG4gICAgY29uc3QgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgaWYgKENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcclxuICAgICAgY29uc3QgbiA9IGRpZmYgPCAwID8gLTEgOiAxO1xyXG4gICAgICBjb25zdCBpbnZpc2libGVIYW5kID0gKE1hdGguYWJzKGRpZmYpIC0gQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIpICogQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCAqIG47XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLnggKyBpbnZpc2libGVIYW5kLCB0aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdvIGludG8gdGhlIGdyb3VuZFxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgdGhpcy5zaGllbGQgLT0gKC10aGlzLnNwZWVkLnkgKiBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEUpO1xyXG4gICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYodGhpcy5wb3NpdGlvbi54LCAwKTtcclxuICAgICAgdGhpcy5zcGVlZCA9IG5ldyBWKHRoaXMuc3BlZWQueCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSAtPSBDb25maWdzLkNPT0xfRE9XTjtcclxuICAgIHRoaXMudGVtcGVyYXR1cmUgPSBNYXRoLm1heCh0aGlzLnRlbXBlcmF0dXJlLCAwKTtcclxuXHJcbiAgICAvLyBvdmVyaGVhdFxyXG4gICAgY29uc3Qgb3ZlcmhlYXQgPSAodGhpcy50ZW1wZXJhdHVyZSAtIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSKTtcclxuICAgIGlmICgwIDwgb3ZlcmhlYXQpIHtcclxuICAgICAgY29uc3QgbGluZWFyRGFtYWdlID0gb3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUO1xyXG4gICAgICBjb25zdCBwb3dlckRhbWFnZSA9IE1hdGgucG93KG92ZXJoZWF0ICogQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hULCAyKTtcclxuICAgICAgdGhpcy5zaGllbGQgLT0gKGxpbmVhckRhbWFnZSArIHBvd2VyRGFtYWdlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xyXG5cclxuICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaXJlKHBhcmFtOiBGaXJlUGFyYW0pIHtcclxuICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ0xhc2VyJykge1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHNob3QgPSBuZXcgTGFzZXIodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XHJcbiAgICAgIHNob3QucmVhY3Rpb24odGhpcyk7XHJcbiAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xyXG4gICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcclxuICAgICAgICBjb25zdCBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYm90KTtcclxuICAgICAgICBtaXNzaWxlLnJlYWN0aW9uKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8tLTtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3QobWlzc2lsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fTEVGVCkge1xyXG4gICAgICByZXR1cm4gVXRpbHMudG9PcHBvc2l0ZShkaXJlY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5hZGQoc2hvdC5zcGVlZC5tdWx0aXBseShDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XHJcbiAgICB0aGlzLnNoaWVsZCAtPSBzaG90LmRhbWFnZSgpO1xyXG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5EZWJ1ZyhkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpIHtcclxuICAgIHRoaXMuZGVidWdEdW1wLmFyY3MucHVzaCh7IGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogU291cmNlckR1bXAge1xyXG4gICAgY29uc3QgZHVtcDogU291cmNlckR1bXAgPSB7XHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXHJcbiAgICAgIGg6IE1hdGguY2VpbCh0aGlzLnNoaWVsZCksXHJcbiAgICAgIHQ6IE1hdGguY2VpbCh0aGlzLnRlbXBlcmF0dXJlKSxcclxuICAgICAgYTogdGhpcy5taXNzaWxlQW1tbyxcclxuICAgICAgZjogTWF0aC5jZWlsKHRoaXMuZnVlbClcclxuICAgIH07XHJcbiAgICBpZiAodGhpcy5zY3JpcHRMb2FkZXIuaXNEZWJ1Z2dhYmxlKSB7XHJcbiAgICAgIGR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBkdW1wO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29tbWFuZCBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIGFoZWFkOiBudW1iZXI7XHJcbiAgcHVibGljIGFzY2VudDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0dXJuOiBib29sZWFuO1xyXG4gIHB1YmxpYyBmaXJlOiBGaXJlUGFyYW0gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlcjogU291cmNlcikge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpIHtcclxuICAgIHRoaXMuYWhlYWQgPSAwO1xyXG4gICAgdGhpcy5hc2NlbnQgPSAwO1xyXG4gICAgdGhpcy50dXJuID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpcmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICBpZiAodGhpcy5maXJlKSB7XHJcbiAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHVybikge1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcclxuICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlncy5GVUVMX0NPU1Q7XHJcbiAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XHJcbmltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuaW1wb3J0IHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBzaGllbGQ6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmU6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW86ICgpID0+IG51bWJlcjtcclxuXHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc2NhbkF0dGFjazogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGFoZWFkOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBiYWNrOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBhc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRlc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm46ICgpID0+IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyBmaXJlTGFzZXI6IChkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZmlyZU1pc3NpbGU6IChib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcclxuICBwdWJsaWMgc2NhbkRlYnVnOiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzdXBlcihzb3VyY2VyKTtcclxuXHJcbiAgICB0aGlzLnNoaWVsZCA9ICgpID0+IHNvdXJjZXIuc2hpZWxkO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9ICgpID0+IHNvdXJjZXIudGVtcGVyYXR1cmU7XHJcbiAgICB0aGlzLm1pc3NpbGVBbW1vID0gKCkgPT4gc291cmNlci5taXNzaWxlQW1tbztcclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IHNvdXJjZXIuZnVlbDtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xyXG4gICAgdGhpcy5zY2FuRW5lbXkgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5BdHRhY2sgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkF0dGFjayhzb3VyY2VyLCByYWRhcik7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5haGVhZCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gMC44O1xyXG4gICAgfTtcclxuICAgIHRoaXMuYmFjayA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gLTAuNDtcclxuICAgIH07XHJcbiAgICB0aGlzLmFzY2VudCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFzY2VudCA9IDAuOTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRlc2NlbnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5hc2NlbnQgPSAtMC45O1xyXG4gICAgfTtcclxuICAgIHRoaXMudHVybiA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnR1cm4gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVMYXNlciA9IChkaXJlY3Rpb24sIHBvd2VyKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5maXJlID0gRmlyZVBhcmFtLmxhc2VyKHBvd2VyLCBkaXJlY3Rpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVNaXNzaWxlID0gKGJvdCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuZmlyZSA9IEZpcmVQYXJhbS5taXNzaWxlKGJvdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGlzU3RyaW5nID0gKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzdHJpbmcgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbiAgICB0aGlzLmxvZyA9ICguLi5tZXNzYWdlOiBhbnlbXSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIubG9nKG1lc3NhZ2UubWFwKHZhbHVlID0+IGlzU3RyaW5nKHZhbHVlKSA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIuc2NhbkRlYnVnKHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5cclxuY29uc3QgRVBTSUxPTiA9IDEwZS0xMjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJhZGFyKGM6IFYsIGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2hlY2tEaXN0YW5jZSA9ICh0OiBWKSA9PiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlO1xyXG5cclxuICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcclxuICAgICAgcmV0dXJuIGNoZWNrRGlzdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xyXG4gICAgY29uc3QgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcclxuXHJcbiAgICBpZiAoYW5nbGUgPCAxODApIHtcclxuICAgICAgcmV0dXJuIHQgPT4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ID0+IChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgc2lkZShiYXNlOiBWLCBkZWdyZWU6IG51bWJlcik6ICh0OiBWKSA9PiBib29sZWFuIHtcclxuICAgIGNvbnN0IHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBuZXcgVihNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgIGNvbnN0IHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcclxuICAgIHJldHVybiAodGFyZ2V0OiBWKSA9PiB7XHJcbiAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGNhbGNEaXN0YW5jZShmOiBWLCB0OiBWLCBwOiBWKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XHJcbiAgICBjb25zdCBwRnJvbSA9IHAuc3VidHJhY3QoZik7XHJcbiAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xyXG4gICAgY29uc3QgcFRvID0gcC5zdWJ0cmFjdCh0KTtcclxuICAgIGlmIChmcm9tVG8uZG90KHBUbykgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b1JhZGlhbihkZWdyZWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b09wcG9zaXRlKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBVdGlscy5ub3JtYWxpemVEZWdyZWUoZGVncmVlKTtcclxuICAgIGlmIChub3JtYWxpemVkIDw9IDE4MCkge1xyXG4gICAgICByZXR1cm4gKDkwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICAgIH1cclxuICAgIHJldHVybiAoMjcwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIG5vcm1hbGl6ZURlZ3JlZShkZWdyZWU6IG51bWJlcikge1xyXG4gICAgY29uc3QgcmVtYWluZGVyID0gZGVncmVlICUgMzYwO1xyXG4gICAgcmV0dXJuIHJlbWFpbmRlciA8IDAgPyByZW1haW5kZXIgKyAzNjAgOiByZW1haW5kZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHJhbmQocmVuZ2U6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWIHtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRMZW5ndGg6IG51bWJlcjtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRBbmdsZTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkKHY6IFYpOiBWO1xyXG4gIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBhZGQodjogYW55LCB5PzogbnVtYmVyKTogViB7XHJcbiAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcclxuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2LnggfHwgMCksIHRoaXMueSArICh2LnkgfHwgMCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2IHx8IDApLCB0aGlzLnkgKyAoeSB8fCAwKSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBWKTogVjtcclxuICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBhbnksIHk/OiBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYueCB8fCAwKSwgdGhpcy55IC0gKHYueSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYgfHwgMCksIHRoaXMueSAtICh5IHx8IDApKTtcclxuICB9XHJcbiAgcHVibGljIG11bHRpcGx5KHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgZGl2aWRlKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbW9kdWxvKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdi54LCB0aGlzLnkgJSB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbmVnYXRlKCk6IFYge1xyXG4gICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xyXG4gIH1cclxuICBwdWJsaWMgZGlzdGFuY2UodjogVik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcclxuICB9XHJcbiAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jYWxjdWxhdGVkTGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcclxuICB9XHJcbiAgcHVibGljIG5vcm1hbGl6ZSgpOiBWIHtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgY29uc3Qgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGVJblJhZGlhbnMoKTogbnVtYmVyIHtcclxuICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRBbmdsZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcclxuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcclxuICB9XHJcbiAgcHVibGljIGRvdChwb2ludDogViA9IHRoaXMpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xyXG4gIH1cclxuICBwdWJsaWMgY3Jvc3MocG9pbnQ6IFYpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xyXG4gIH1cclxuICBwdWJsaWMgcm90YXRlKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG4gICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgZGlyZWN0aW9uKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtaW5pbWl6ZSgpIHtcclxuICAgIHJldHVybiB7IHg6IE1hdGgucm91bmQodGhpcy54KSwgeTogTWF0aC5yb3VuZCh0aGlzLnkpIH0gYXMgVjtcclxuICB9XHJcbn1cclxuIl19
