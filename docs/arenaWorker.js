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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBd0lBOztBQXhJQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBcUQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBa0MsRUFBRSxDQUFDO0FBRXBELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lB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QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNNLG9CQUFRLEdBQWY7UUFDRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFPLENBQUM7SUFDL0QsQ0FBQztJQUNILFFBQUM7QUFBRCxDQXZGQSxBQXVGQyxJQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBGaWVsZCBmcm9tICcuLi9jb3JlL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi4vY29yZS9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xyXG5pbXBvcnQgVGlja0V2ZW50TGlzdGVuZXIgZnJvbSAnLi4vY29yZS9UaWNrRXZlbnRMaXN0ZW5lcic7XHJcbmltcG9ydCB7IFBsYXllcnNEdW1wLCBGcmFtZUR1bXAsIFJlc3VsdER1bXAgfSBmcm9tICcuLi9jb3JlL0R1bXAnO1xyXG5pbXBvcnQgRXhwb3NlZFNjcmlwdExvYWRlciBmcm9tICcuLi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXJJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY29sb3I6IHN0cmluZztcclxuICBzb3VyY2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbml0aWFsUGFyYW1ldGVyIHtcclxuICBpc0RlbW86IGJvb2xlYW47XHJcbiAgc291cmNlczogUGxheWVySW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYXRhID0gTmV4dENvbW1hbmQgfCBQbGF5ZXJzQ29tbWFuZCB8IFByZVRoaW5rQ29tbWFuZCB8IFBvc3RUaGlua0NvbW1hbmQgfCBGaW5pc2hlZENvbW1hbmQgfCBFbmRPZkdhbWVDb21tYW5kIHwgRXJyb3JDb21tYW5kO1xyXG5cclxuaW50ZXJmYWNlIE5leHRDb21tYW5kIHtcclxuICBjb21tYW5kOiAnTmV4dCc7XHJcbiAgaXNzdWVkSWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBsYXllcnNDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUGxheWVycyc7XHJcbiAgcGxheWVyczogUGxheWVyc0R1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQcmVUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQcmVUaGluayc7XHJcbiAgaWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQb3N0VGhpbmsnO1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgbG9hZGVkRnJhbWU6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZpbmlzaGVkQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0ZpbmlzaGVkJztcclxuICByZXN1bHQ6IFJlc3VsdER1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBFbmRPZkdhbWVDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRW5kT2ZHYW1lJztcclxuICBmcmFtZXM6IEZyYW1lRHVtcFtdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRXJyb3JDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRXJyb3InO1xyXG4gIGVycm9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbmRlY2xhcmUgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobWVzc2FnZTogRGF0YSk6IHZvaWQ7XHJcblxyXG5sZXQgaXNzdWVJZCA9IDA7XHJcbmNvbnN0IGlzc3VlID0gKCkgPT4gaXNzdWVJZCsrO1xyXG5jb25zdCBjYWxsYmFja3M6IHsgW2lkOiBudW1iZXJdOiAoKSA9PiB2b2lkOyB9ID0ge307XHJcblxyXG5vbm1lc3NhZ2UgPSAoeyBkYXRhIH0pID0+IHtcclxuICBpZiAoZGF0YS5pc3N1ZWRJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjYWxsYmFja3NbZGF0YS5pc3N1ZWRJZF0oKTtcclxuICAgIGRlbGV0ZSBjYWxsYmFja3NbZGF0YS5pc3N1ZWRJZF07XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGNvbnN0IGluaXRpYWxQYXJhbWV0ZXIgPSBkYXRhIGFzIEluaXRpYWxQYXJhbWV0ZXI7XHJcbiAgY29uc3QgaXNEZW1vID0gaW5pdGlhbFBhcmFtZXRlci5pc0RlbW8gYXMgYm9vbGVhbjtcclxuICBjb25zdCBwbGF5ZXJzID0gaW5pdGlhbFBhcmFtZXRlci5zb3VyY2VzIGFzIFBsYXllckluZm9bXTtcclxuICBjb25zdCBmcmFtZXM6IEZyYW1lRHVtcFtdID0gW107XHJcbiAgY29uc3QgbGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyID0ge1xyXG4gICAgd2FpdE5leHRUaWNrOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzc3VlZElkID0gaXNzdWUoKTtcclxuICAgICAgICBjYWxsYmFja3NbaXNzdWVkSWRdID0gcmVzb2x2ZTtcclxuICAgICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICBpc3N1ZWRJZCxcclxuICAgICAgICAgIGNvbW1hbmQ6ICdOZXh0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblByZVRoaW5rOiAoc291cmNlcklkOiBudW1iZXIpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGNvbW1hbmQ6ICdQcmVUaGluaycsXHJcbiAgICAgICAgaWQ6IHNvdXJjZXJJZFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblBvc3RUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiAnUG9zdFRoaW5rJyxcclxuICAgICAgICBpZDogc291cmNlcklkLFxyXG4gICAgICAgIGxvYWRlZEZyYW1lOiBmcmFtZXMubGVuZ3RoXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRnJhbWU6IChmaWVsZER1bXA6IEZyYW1lRHVtcCkgPT4ge1xyXG4gICAgICBmcmFtZXMucHVzaChmaWVsZER1bXApO1xyXG4gICAgfSxcclxuICAgIG9uRmluaXNoZWQ6IChyZXN1bHQ6IFJlc3VsdER1bXApID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIHJlc3VsdCxcclxuICAgICAgICBjb21tYW5kOiAnRmluaXNoZWQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRW5kT2ZHYW1lOiAoKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBmcmFtZXMsXHJcbiAgICAgICAgY29tbWFuZDogJ0VuZE9mR2FtZSdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25FcnJvcjogKGVycm9yOiBzdHJpbmcpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICAgIGNvbW1hbmQ6ICdFcnJvcidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoRXhwb3NlZFNjcmlwdExvYWRlciwgaXNEZW1vKTtcclxuICBwbGF5ZXJzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgZmllbGQucmVnaXN0ZXJTb3VyY2VyKHZhbHVlLnNvdXJjZSwgdmFsdWUubmFtZSwgdmFsdWUubmFtZSwgdmFsdWUuY29sb3IpO1xyXG4gIH0pO1xyXG5cclxuICBwb3N0TWVzc2FnZSh7XHJcbiAgICBjb21tYW5kOiAnUGxheWVycycsXHJcbiAgICBwbGF5ZXJzOiBmaWVsZC5wbGF5ZXJzKClcclxuICB9KTtcclxuXHJcbiAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBmaWVsZC5jb21waWxlKGxpc3RlbmVyKTtcclxuICAgIGZvciAobGV0IGNvdW50ID0gMDsgY291bnQgPCAxMDAwMCAmJiAhZmllbGQuaXNGaW5pc2hlZDsgY291bnQrKykge1xyXG4gICAgICBhd2FpdCBmaWVsZC50aWNrKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICB9LCAwKTtcclxufTtcclxuIiwiaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIHtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICBwdWJsaWMgcG9zaXRpb246IFY7XHJcbiAgcHVibGljIHNwZWVkOiBWO1xyXG4gIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlcjtcclxuICBwdWJsaWMgc2l6ZSA9IENvbmZpZ3MuQ09MTElTSU9OX1NJWkU7XHJcbiAgcHVibGljIHdhaXQgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgdGhpcy53YWl0ID0gMDtcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih4LCB5KTtcclxuICAgIHRoaXMuc3BlZWQgPSBuZXcgVigwLCAwKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0aGluaygpIHtcclxuICAgIGlmICh0aGlzLndhaXQgPD0gMCkge1xyXG4gICAgICB0aGlzLndhaXQgPSAwO1xyXG4gICAgICB0aGlzLm9uVGhpbmsoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2FpdCA9IHRoaXMud2FpdCAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpOiB2b2lkIHtcclxuICAgIC8vIG5vdCB0aGluayBhbnl0aGluZy5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKTogdm9pZCB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxpbWVudGF0aW9uJyk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmQge1xyXG4gIHByaXZhdGUgaXNBY2NlcHRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyB2YWxpZGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb21tYW5kLicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwdWJsaWMgYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcclxuICB9XHJcbiAgcHVibGljIHVuYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ3Mge1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9TSElFTEQgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX0ZVRUwgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX01JU1NJTEVfQU1NTyA9IDIwO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfQVRURU5VQVRJT04gPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfTU9NRU5UVU0gPSAxMjg7XHJcbiAgcHVibGljIHN0YXRpYyBGVUVMX0NPU1QgPSAwLjI0O1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09MTElTSU9OX1NJWkUgPSA0O1xyXG4gIHB1YmxpYyBzdGF0aWMgU0NBTl9XQUlUID0gMC4zNTtcclxuICBwdWJsaWMgc3RhdGljIFNQRUVEX1JFU0lTVEFOQ0UgPSAwLjk2O1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JBVklUWSA9IDAuMTtcclxuICBwdWJsaWMgc3RhdGljIFRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0JPUkRBUiA9IDQwMDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9CT1JERVIgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XHJcbiAgcHVibGljIHN0YXRpYyBHUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcclxuICBwdWJsaWMgc3RhdGljIENPT0xfRE9XTiA9IDAuNTtcclxuICBwdWJsaWMgc3RhdGljIE9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnN0cyB7XHJcbiAgcHVibGljIHN0YXRpYyBESVJFQ1RJT05fUklHSFQgPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUSU9OX0xFRlQgPSAtMTtcclxuICBwdWJsaWMgc3RhdGljIFZFUlRJQ0FMX1VQID0gJ3ZlcnRpYWxfdXAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVkVSVElDQUxfRE9XTiA9ICd2ZXJ0aWFsX2Rvd24nO1xyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgcHVibGljIGZyYW1lOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIGFsdGl0dWRlOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHdhaXQ6IChmcmFtZTogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBmdWVsOiAoKSA9PiBudW1iZXI7XHJcblxyXG4gIHByaXZhdGUgZnJhbWVzT2ZMaWZlOiBudW1iZXIgPSAwO1xyXG4gIHB1YmxpYyBwcmVUaGluayA9ICgpID0+IHtcclxuICAgIHRoaXMuZnJhbWVzT2ZMaWZlKys7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihhY3RvcjogQWN0b3IpIHtcclxuICAgIHRoaXMuZnJhbWUgPSAoKSA9PiB0aGlzLmZyYW1lc09mTGlmZTtcclxuICAgIHRoaXMuYWx0aXR1ZGUgPSAoKSA9PiBhY3Rvci5wb3NpdGlvbi55O1xyXG4gICAgdGhpcy53YWl0ID0gKGZyYW1lOiBudW1iZXIpID0+IHtcclxuICAgICAgaWYgKDAgPCBmcmFtZSkge1xyXG4gICAgICAgIGFjdG9yLndhaXQgKz0gZnJhbWU7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBTY3JpcHRMb2FkZXIsIHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3QoY29uc3RydWN0b3I6IGFueSwgYXJnczogc3RyaW5nW10pIHtcclxuICBmdW5jdGlvbiBmdW4oKSB7XHJcbiAgICByZXR1cm4gY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgfVxyXG4gIGZ1bi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgcmV0dXJuIG5ldyAoZnVuIGFzIGFueSkoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwb3NlZFNjcmlwdExvYWRlciBpbXBsZW1lbnRzIFNjcmlwdExvYWRlciB7XHJcbiAgcHJpdmF0ZSBhcmdWYWx1ZXM6IGFueVtdO1xyXG4gIHByaXZhdGUgYXJnTmFtZXM6IHN0cmluZ1tdO1xyXG4gIHByaXZhdGUgYmFubGlzdDogc3RyaW5nW107XHJcbiAgcHJpdmF0ZSBjb25zb2xlOiBDb25zb2xlTGlrZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbnNvbGUgPSB7IGxvZzogKC4uLm1lc3NhZ2UpID0+IHsgLyogbm90aGluZy4uICovIH0gfTtcclxuICAgIGNvbnN0IGFsbG93TGlicyA9IHtcclxuICAgICAgT2JqZWN0LCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgQXJyYXksIERhdGUsIE1hdGgsIFJlZ0V4cCwgSlNPTiwgTmFOLCBJbmZpbml0eSwgdW5kZWZpbmVkLCBwYXJzZUludCwgcGFyc2VGbG9hdCwgaXNOYU4sIGlzRmluaXRlLFxyXG4gICAgICBjb25zb2xlOiB0aGlzLmNvbnNvbGVcclxuICAgIH07XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWZ1bmN0aW9uLWNvbnN0cnVjdG9yLXdpdGgtc3RyaW5nLWFyZ3NcclxuICAgIGNvbnN0IGdsb2JhbCA9IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xyXG4gICAgdGhpcy5iYW5saXN0ID0gWydfX3Byb3RvX18nLCAncHJvdG90eXBlJ107XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXHJcbiAgICBmb3IgKGNvbnN0IHRhcmdldCBpbiBnbG9iYWwpIHtcclxuICAgICAgdGhpcy5iYW5saXN0LnB1c2godGFyZ2V0KTtcclxuICAgIH1cclxuICAgIGxldCBhcmdOYW1lcyA9IE9iamVjdC5rZXlzKGFsbG93TGlicyk7XHJcbiAgICBhcmdOYW1lcyA9IGFyZ05hbWVzLmNvbmNhdCh0aGlzLmJhbmxpc3QuZmlsdGVyKHZhbHVlID0+IGFyZ05hbWVzLmluZGV4T2YodmFsdWUpID49IDApKTtcclxuICAgIHRoaXMuYXJnTmFtZXMgPSBhcmdOYW1lcztcclxuICAgIHRoaXMuYXJnVmFsdWVzID0gT2JqZWN0LmtleXMoYWxsb3dMaWJzKS5tYXAoa2V5ID0+IChhbGxvd0xpYnMgYXMgYW55KVtrZXldKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0RlYnVnZ2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRFeHBvc2VkQ29uc29sZSgpOiBDb25zb2xlTGlrZSB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uc29sZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKHNjcmlwdDogc3RyaW5nKTogYW55IHtcclxuICAgIGxldCBhcmdOYW1lczogc3RyaW5nW10gPSBbXTtcclxuICAgIGFyZ05hbWVzID0gYXJnTmFtZXMuY29uY2F0KHRoaXMuYXJnTmFtZXMpO1xyXG4gICAgYXJnTmFtZXMucHVzaCgnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNjcmlwdCk7XHJcbiAgICByZXR1cm4gY29uc3RydWN0KEZ1bmN0aW9uLCBhcmdOYW1lcykuYXBwbHkodW5kZWZpbmVkLCB0aGlzLmFyZ1ZhbHVlcyk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IE1pc3NpbGUgZnJvbSAnLi9NaXNzaWxlJztcclxuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCBUaWNrRXZlbnRMaXN0ZW5lciBmcm9tICcuL1RpY2tFdmVudExpc3RlbmVyJztcclxuaW1wb3J0IHsgRnJhbWVEdW1wLCBSZXN1bHREdW1wLCBTb3VyY2VyRHVtcCwgU2hvdER1bXAsIEZ4RHVtcCwgUGxheWVyc0R1bXAsIERlYnVnRHVtcCB9IGZyb20gJy4vRHVtcCc7XHJcbmltcG9ydCBTY3JpcHRMb2FkZXIsIHsgU2NyaXB0TG9hZGVyQ29uc3RydWN0b3IgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5jb25zdCBERU1PX0ZSQU1FX0xFTkdUSCA9IDEyODtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZWxkIHtcclxuICBwcml2YXRlIGN1cnJlbnRJZCA9IDA7XHJcbiAgcHJpdmF0ZSBzb3VyY2VyczogU291cmNlcltdO1xyXG4gIHByaXZhdGUgc2hvdHM6IFNob3RbXTtcclxuICBwcml2YXRlIGZ4czogRnhbXTtcclxuICBwcml2YXRlIGZyYW1lOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSByZXN1bHQ6IFJlc3VsdER1bXA7XHJcbiAgcHVibGljIGNlbnRlcjogbnVtYmVyO1xyXG4gIHB1YmxpYyBpc0ZpbmlzaGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgZHVtbXlFbmVteTogViA9IG5ldyBWKDAsIDE1MCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2NyaXB0TG9hZGVyQ29uc3RydWN0b3I6IFNjcmlwdExvYWRlckNvbnN0cnVjdG9yLCBwdWJsaWMgaXNEZW1vOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gICAgdGhpcy5zb3VyY2VycyA9IFtdO1xyXG4gICAgdGhpcy5zaG90cyA9IFtdO1xyXG4gICAgdGhpcy5meHMgPSBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWdpc3RlclNvdXJjZXIoc291cmNlOiBzdHJpbmcsIGFjY291bnQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBzaWRlID0gKHRoaXMuc291cmNlcnMubGVuZ3RoICUgMiA9PT0gMCkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCB4ID0gVXRpbHMucmFuZCg4MCkgKyAxNjAgKiBzaWRlO1xyXG4gICAgY29uc3QgeSA9IFV0aWxzLnJhbmQoMTYwKSArIDgwO1xyXG4gICAgdGhpcy5hZGRTb3VyY2VyKG5ldyBTb3VyY2VyKHRoaXMsIHgsIHksIHNvdXJjZSwgYWNjb3VudCwgbmFtZSwgY29sb3IpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciwgdGhpbms6IChzb3VyY2VyOiBTb3VyY2VyKSA9PiB2b2lkKSB7XHJcbiAgICBmb3IgKGNvbnN0IHNvdXJjZXIgb2YgdGhpcy5zb3VyY2Vycykge1xyXG4gICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgICAgdGhpbmsoc291cmNlcik7XHJcbiAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBjb21waWxlKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzb3VyY2VyLmNvbXBpbGUobmV3IHRoaXMuc2NyaXB0TG9hZGVyQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbGlzdGVuZXIub25FcnJvcihgVGhlcmUgaXMgYW4gZXJyb3IgaW4geW91ciBjb2RlOuOAgCR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkU291cmNlcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzb3VyY2VyLmlkID0gdGhpcy5jdXJyZW50SWQrKztcclxuICAgIHRoaXMuc291cmNlcnMucHVzaChzb3VyY2VyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRTaG90KHNob3Q6IFNob3QpIHtcclxuICAgIHNob3QuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZVNob3QodGFyZ2V0OiBTaG90KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hvdHMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgaWYgKDAgPD0gaW5kZXgpIHtcclxuICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZEZ4KGZ4OiBGeCkge1xyXG4gICAgZnguaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5meHMucHVzaChmeCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlRngodGFyZ2V0OiBGeCkge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZ4cy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICBpZiAoMCA8PSBpbmRleCkge1xyXG4gICAgICB0aGlzLmZ4cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHRpY2sobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAodGhpcy5mcmFtZSA9PT0gMCkge1xyXG4gICAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTsgLy8gU2F2ZSB0aGUgMCBmcmFtZS5cclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBiZSB1c2VkIGluIHRoZSBpbnZpc2libGUgaGFuZC5cclxuICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XHJcblxyXG4gICAgLy8gVGhpbmsgcGhhc2VcclxuICAgIGF3YWl0IHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgc291cmNlci50aGluaygpO1xyXG4gICAgICB0aGlzLnNob3RzLmZpbHRlcigoc2hvdCA9PiBzaG90Lm93bmVyLmlkID09PSBzb3VyY2VyLmlkKSkuZm9yRWFjaChzaG90ID0+IHNob3QudGhpbmsoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBY3Rpb24gcGhhc2VcclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XHJcbiAgICB0aGlzLnNob3RzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XHJcblxyXG4gICAgLy8gTW92ZSBwaGFzZVxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcbiAgICB0aGlzLnNob3RzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IubW92ZSgpKTtcclxuICAgIHRoaXMuZnhzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IubW92ZSgpKTtcclxuXHJcbiAgICAvLyBDaGVjayBwaGFzZVxyXG4gICAgdGhpcy5jaGVja0ZpbmlzaChsaXN0ZW5lcik7XHJcbiAgICB0aGlzLmNoZWNrRW5kT2ZHYW1lKGxpc3RlbmVyKTtcclxuXHJcbiAgICB0aGlzLmZyYW1lKys7XHJcblxyXG4gICAgLy8gb25GcmFtZVxyXG4gICAgbGlzdGVuZXIub25GcmFtZSh0aGlzLmR1bXAoKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRmluaXNoKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgaWYgKHRoaXMuaXNEZW1vKSB7XHJcbiAgICAgIGlmIChERU1PX0ZSQU1FX0xFTkdUSCA8IHRoaXMuZnJhbWUpIHtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHtcclxuICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxyXG4gICAgICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgICAgIGlzRHJhdzogbnVsbCxcclxuICAgICAgICAgIHdpbm5lcklkOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzdWx0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKHNvdXJjZXIpID0+IHsgc291cmNlci5hbGl2ZSA9IDAgPCBzb3VyY2VyLnNoaWVsZDsgfSk7XHJcbiAgICBjb25zdCBzdXJ2aXZlcnMgPSB0aGlzLnNvdXJjZXJzLmZpbHRlcihzb3VyY2VyID0+IHNvdXJjZXIuYWxpdmUpO1xyXG5cclxuICAgIGlmICgxIDwgc3Vydml2ZXJzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cnZpdmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgY29uc3Qgc3Vydml2ZXIgPSBzdXJ2aXZlcnNbMF07XHJcbiAgICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICAgIHdpbm5lcklkOiBzdXJ2aXZlci5pZCxcclxuICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICB0aW1lb3V0OiBudWxsLFxyXG4gICAgICAgIGlzRHJhdzogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBubyBzdXJ2aXZlci4uIGRyYXcuLi5cclxuICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICB3aW5uZXJJZDogbnVsbCxcclxuICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXHJcbiAgICAgIGlzRHJhdzogdHJ1ZVxyXG4gICAgfTtcclxuICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0VuZE9mR2FtZShsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRmluaXNoZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzdWx0LmZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7IC8vIFJlY29yZCBzb21lIGZyYW1lcyBldmVuIGFmdGVyIGRlY2lkZWQuXHJcbiAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkVuZW15KG93bmVyOiBTb3VyY2VyLCByYWRhcjogKHQ6IFYpID0+IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbyAmJiB0aGlzLnNvdXJjZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gcmFkYXIodGhpcy5kdW1teUVuZW15KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Vycy5zb21lKChzb3VyY2VyKSA9PiB7XHJcbiAgICAgIHJldHVybiBzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IG93bmVyICYmIHJhZGFyKHNvdXJjZXIucG9zaXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkF0dGFjayhvd25lcjogU291cmNlciwgcmFkYXI6ICh0OiBWKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaG90cy5zb21lKChzaG90KSA9PiB7XHJcbiAgICAgIHJldHVybiBzaG90Lm93bmVyICE9PSBvd25lciAmJiByYWRhcihzaG90LnBvc2l0aW9uKSAmJiB0aGlzLmlzSW5jb21pbmcob3duZXIsIHNob3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzSW5jb21pbmcob3duZXI6IFNvdXJjZXIsIHNob3Q6IFNob3QpIHtcclxuICAgIGNvbnN0IG93bmVyUG9zaXRpb24gPSBvd25lci5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGFjdG9yUG9zaXRpb24gPSBzaG90LnBvc2l0aW9uO1xyXG4gICAgY29uc3QgY3VycmVudERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uKTtcclxuICAgIGNvbnN0IG5leHREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCkpO1xyXG4gICAgcmV0dXJuIG5leHREaXN0YW5jZSA8IGN1cnJlbnREaXN0YW5jZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjaGVja0NvbGxpc2lvbihzaG90OiBTaG90KTogQWN0b3IgfCBudWxsIHtcclxuICAgIGNvbnN0IGYgPSBzaG90LnBvc2l0aW9uO1xyXG4gICAgY29uc3QgdCA9IHNob3QucG9zaXRpb24uYWRkKHNob3Quc3BlZWQpO1xyXG5cclxuICAgIGNvbnN0IGNvbGxpZGVkU2hvdCA9IHRoaXMuc2hvdHMuZmluZCgoYWN0b3IpID0+IHtcclxuICAgICAgcmV0dXJuIGFjdG9yLmJyZWFrYWJsZSAmJiBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lciAmJlxyXG4gICAgICAgIFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbikgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoY29sbGlkZWRTaG90KSB7XHJcbiAgICAgIHJldHVybiBjb2xsaWRlZFNob3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWRTb3VyY2VyID0gdGhpcy5zb3VyY2Vycy5maW5kKChzb3VyY2VyKSA9PiB7XHJcbiAgICAgIHJldHVybiBzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IHNob3Qub3duZXIgJiZcclxuICAgICAgICBVdGlscy5jYWxjRGlzdGFuY2UoZiwgdCwgc291cmNlci5wb3NpdGlvbikgPCBzaG90LnNpemUgKyBzb3VyY2VyLnNpemU7XHJcbiAgICB9KTtcclxuICAgIGlmIChjb2xsaWRlZFNvdXJjZXIpIHtcclxuICAgICAgcmV0dXJuIGNvbGxpZGVkU291cmNlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjaGVja0NvbGxpc2lvbkVudmlyb21lbnQoc2hvdDogU2hvdCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHNob3QucG9zaXRpb24ueSA8IDA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXB1dGVDZW50ZXIoKTogbnVtYmVyIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgaWYgKHNvdXJjZXIuYWxpdmUpIHtcclxuICAgICAgICBzdW1YICs9IHNvdXJjZXIucG9zaXRpb24ueDtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzdW1YIC8gY291bnQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcGxheWVycygpIHtcclxuICAgIGNvbnN0IHBsYXllcnM6IFBsYXllcnNEdW1wID0ge307XHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKHNvdXJjZXIpID0+IHtcclxuICAgICAgcGxheWVyc1tzb3VyY2VyLmlkXSA9IHtcclxuICAgICAgICBuYW1lOiBzb3VyY2VyLm5hbWUgfHwgc291cmNlci5hY2NvdW50LFxyXG4gICAgICAgIGFjY291bnQ6IHNvdXJjZXIuYWNjb3VudCxcclxuICAgICAgICBjb2xvcjogc291cmNlci5jb2xvclxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcGxheWVycztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZHVtcCgpOiBGcmFtZUR1bXAge1xyXG4gICAgY29uc3Qgc291cmNlcnNEdW1wOiBTb3VyY2VyRHVtcFtdID0gW107XHJcbiAgICBjb25zdCBzaG90c0R1bXA6IFNob3REdW1wW10gPSBbXTtcclxuICAgIGNvbnN0IGZ4RHVtcDogRnhEdW1wW10gPSBbXTtcclxuICAgIGNvbnN0IGRlYnVnRHVtcDogRGVidWdEdW1wID0geyBsb2dzOiBbXSB9O1xyXG5cclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuICAgICAgc291cmNlcnNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgICAgaWYgKGFjdG9yLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUpIHtcclxuICAgICAgICBkZWJ1Z0R1bXAubG9ncyA9IGRlYnVnRHVtcC5sb2dzLmNvbmNhdChhY3Rvci5kdW1wRGVidWcoKS5sb2dzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaXNUaGlua2FibGUgPSAoeDogU2hvdCk6IHggaXMgTWlzc2lsZSA9PiB4LnR5cGUgPT09ICdNaXNzaWxlJztcclxuICAgIHRoaXMuc2hvdHMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgICAgaWYgKGFjdG9yLm93bmVyLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUgJiYgaXNUaGlua2FibGUoYWN0b3IpKSB7XHJcbiAgICAgICAgZGVidWdEdW1wLmxvZ3MgPSBkZWJ1Z0R1bXAubG9ncy5jb25jYXQoYWN0b3IuZHVtcERlYnVnKCkubG9ncyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaCgoZngpID0+IHtcclxuICAgICAgZnhEdW1wLnB1c2goZnguZHVtcCgpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGY6IHRoaXMuZnJhbWUsXHJcbiAgICAgIHM6IHNvdXJjZXJzRHVtcCxcclxuICAgICAgYjogc2hvdHNEdW1wLFxyXG4gICAgICB4OiBmeER1bXAsXHJcbiAgICAgIGRlYnVnOiBkZWJ1Z0R1bXBcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVQYXJhbSB7XHJcbiAgcHVibGljIHN0YXRpYyBsYXNlcihwb3dlcjogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlcik6IEZpcmVQYXJhbSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgRmlyZVBhcmFtKCk7XHJcbiAgICByZXN1bHQucG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XHJcbiAgICByZXN1bHQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG4gICAgcmVzdWx0LnNob3RUeXBlID0gJ0xhc2VyJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgbWlzc2lsZShib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xyXG4gICAgcmVzdWx0LmJvdCA9IGJvdDtcclxuICAgIHJlc3VsdC5zaG90VHlwZSA9ICdNaXNzaWxlJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgcHVibGljIHBvd2VyOiBudW1iZXI7XHJcbiAgcHVibGljIHNob3RUeXBlOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgeyBGeER1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRngge1xyXG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgcHVibGljIHBvc2l0aW9uOiBWLCBwdWJsaWMgc3BlZWQ6IFYsIHB1YmxpYyBsZW5ndGg6IG51bWJlcikge1xyXG4gICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlKCkge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogRnhEdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZjogdGhpcy5mcmFtZSxcclxuICAgICAgbDogTWF0aC5yb3VuZCh0aGlzLmxlbmd0aClcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFzZXIgZXh0ZW5kcyBTaG90IHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSA1O1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiA4O1xyXG4gIHByaXZhdGUgbW9tZW50dW06IG51bWJlcjtcclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXIsIHBvd2VyOiBudW1iZXIpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ0xhc2VyJyk7XHJcbiAgICB0aGlzLnNwZWVkID0gVi5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XHJcbiAgICB0aGlzLm1vbWVudHVtID0gQ29uZmlncy5MQVNFUl9NT01FTlRVTTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBzdXBlci5hY3Rpb24oKTtcclxuICAgIHRoaXMubW9tZW50dW0gLT0gQ29uZmlncy5MQVNFUl9BVFRFTlVBVElPTjtcclxuICAgIGlmICh0aGlzLm1vbWVudHVtIDwgMCkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IE1pc3NpbGVDb21tYW5kIGZyb20gJy4vTWlzc2lsZUNvbW1hbmQnO1xyXG5pbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgeyBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZSBleHRlbmRzIFNob3Qge1xyXG4gIHB1YmxpYyB0ZW1wZXJhdHVyZSA9IDEwO1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiAxMCArIHRoaXMuc3BlZWQubGVuZ3RoKCkgKiAyO1xyXG4gIHB1YmxpYyBmdWVsID0gMTAwO1xyXG4gIHB1YmxpYyBicmVha2FibGUgPSB0cnVlO1xyXG5cclxuICBwdWJsaWMgY29tbWFuZDogTWlzc2lsZUNvbW1hbmQ7XHJcbiAgcHVibGljIGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyO1xyXG4gIHByaXZhdGUgZGVidWdEdW1wOiBEZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKGZpZWxkOiBGaWVsZCwgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyBib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkge1xyXG4gICAgc3VwZXIoZmllbGQsIG93bmVyLCAnTWlzc2lsZScpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBvd25lci5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fUklHSFQgPyAwIDogMTgwO1xyXG4gICAgdGhpcy5zcGVlZCA9IG93bmVyLnNwZWVkO1xyXG4gICAgdGhpcy5jb21tYW5kID0gbmV3IE1pc3NpbGVDb21tYW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgTWlzc2lsZUNvbnRyb2xsZXIodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpIHtcclxuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG5cclxuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkgeyAvLyBDYW5jZWwgdGhpbmtpbmdcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XHJcbiAgICAgIHRoaXMuZGVidWdEdW1wID0geyBsb2dzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5vd25lci5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25BY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xyXG4gICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcclxuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uSGl0KGF0dGFjazogU2hvdCkge1xyXG4gICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xyXG4gICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KGF0dGFjayk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb3Bwb3NpdGUoZGlyZWN0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uICsgZGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZGVidWdEdW1wLmxvZ3MucHVzaChtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wRGVidWcoKTogRGVidWdEdW1wIHtcclxuICAgIHJldHVybiB0aGlzLmRlYnVnRHVtcDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbW1hbmQgZnJvbSAnLi9Db21tYW5kJztcclxuaW1wb3J0IE1pc3NpbGUgZnJvbSAnLi9NaXNzaWxlJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICBwdWJsaWMgc3BlZWRVcDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzcGVlZERvd246IG51bWJlcjtcclxuICBwdWJsaWMgdHVybjogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWlzc2lsZTogTWlzc2lsZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpIHtcclxuICAgIHRoaXMuc3BlZWRVcCA9IDA7XHJcbiAgICB0aGlzLnNwZWVkRG93biA9IDA7XHJcbiAgICB0aGlzLnR1cm4gPSAwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICBpZiAoMCA8IHRoaXMubWlzc2lsZS5mdWVsKSB7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5kaXJlY3Rpb24gKz0gdGhpcy50dXJuO1xyXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gVi5kaXJlY3Rpb24odGhpcy5taXNzaWxlLmRpcmVjdGlvbik7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5hZGQobm9ybWFsaXplZC5tdWx0aXBseSh0aGlzLnNwZWVkVXApKTtcclxuICAgICAgdGhpcy5taXNzaWxlLnNwZWVkID0gdGhpcy5taXNzaWxlLnNwZWVkLm11bHRpcGx5KDEgLSB0aGlzLnNwZWVkRG93bik7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5mdWVsIC09ICh0aGlzLnNwZWVkVXAgKyB0aGlzLnNwZWVkRG93biAqIDMpICogQ29uZmlncy5GVUVMX0NPU1Q7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5taXNzaWxlLmZ1ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaXNzaWxlQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBkaXJlY3Rpb246ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgc2NhbkVuZW15OiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiBib29sZWFuO1xyXG4gIHB1YmxpYyBzcGVlZFVwOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzcGVlZERvd246ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm5SaWdodDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgdHVybkxlZnQ6ICgpID0+IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyBsb2c6ICguLi5tZXNzYWdlczogYW55W10pID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKG1pc3NpbGUpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xyXG5cclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IG1pc3NpbGUuZnVlbDtcclxuXHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XHJcbiAgICAgIGNvbnN0IG1pc3NpbGVEaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgbWlzc2lsZURpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkRG93biA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy50dXJuUmlnaHQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gLTk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gOTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgbWlzc2lsZS5sb2cobWVzc2FnZS5tYXAodmFsdWUgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpLmpvaW4oJywgJykpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb25uZWN0Q29uc29sZShjb25zb2xlOiBDb25zb2xlTGlrZSB8IG51bGwpIHtcclxuICAgIGlmIChjb25zb2xlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nID0gdGhpcy5sb2cuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IHsgU2hvdER1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaG90IGV4dGVuZHMgQWN0b3Ige1xyXG4gIHB1YmxpYyB0ZW1wZXJhdHVyZSA9IDA7XHJcbiAgcHVibGljIGRhbWFnZSA9ICgpID0+IDA7XHJcbiAgcHVibGljIGJyZWFrYWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIHB1YmxpYyBvd25lcjogU291cmNlciwgcHVibGljIHR5cGU6IHN0cmluZykge1xyXG4gICAgc3VwZXIoZmllbGQsIG93bmVyLnBvc2l0aW9uLngsIG93bmVyLnBvc2l0aW9uLnkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFjdGlvbigpIHtcclxuICAgIHRoaXMub25BY3Rpb24oKTtcclxuXHJcbiAgICBjb25zdCBjb2xsaWRlZCA9IHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb24odGhpcyk7XHJcbiAgICBpZiAoY29sbGlkZWQpIHtcclxuICAgICAgY29sbGlkZWQub25IaXQodGhpcyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZmllbGQuY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50KHRoaXMpKSB7XHJcbiAgICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcclxuICAgICAgdGhpcy5jcmVhdGVGeHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRnhzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChVdGlscy5yYW5kKDE2KSAtIDgsIFV0aWxzLnJhbmQoMTYpIC0gOCk7XHJcbiAgICAgIGNvbnN0IHNwZWVkID0gbmV3IFYoVXRpbHMucmFuZCgxKSAtIDAuNSwgVXRpbHMucmFuZCgxKSAtIDAuNSk7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IFV0aWxzLnJhbmQoOCkgKyA0O1xyXG4gICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeCh0aGlzLmZpZWxkLCBwb3NpdGlvbiwgdGhpcy5zcGVlZC5kaXZpZGUoMikuYWRkKHNwZWVkKSwgbGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVhY3Rpb24oc291cmNlcjogU291cmNlcikge1xyXG4gICAgc291cmNlci50ZW1wZXJhdHVyZSArPSB0aGlzLnRlbXBlcmF0dXJlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uQWN0aW9uKCkge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogU2hvdER1bXAge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbzogdGhpcy5vd25lci5pZCxcclxuICAgICAgaTogdGhpcy5pZCxcclxuICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxyXG4gICAgICBkOiB0aGlzLmRpcmVjdGlvbixcclxuICAgICAgczogdGhpcy50eXBlXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXJDb21tYW5kIGZyb20gJy4vU291cmNlckNvbW1hbmQnO1xyXG5pbXBvcnQgU291cmNlckNvbnRyb2xsZXIgZnJvbSAnLi9Tb3VyY2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCBGaXJlUGFyYW0gZnJvbSAnLi9GaXJlUGFyYW0nO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgQ29uc3RzIGZyb20gJy4vQ29uc3RzJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xyXG5pbXBvcnQgTGFzZXIgZnJvbSAnLi9MYXNlcic7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCB7IFNvdXJjZXJEdW1wLCBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCBTY3JpcHRMb2FkZXIsIHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5pbnRlcmZhY2UgRXhwb3J0U2NvcGUge1xyXG4gIG1vZHVsZToge1xyXG4gICAgZXhwb3J0czogKChjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcikgPT4gdm9pZCkgfCBudWxsO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXIgZXh0ZW5kcyBBY3RvciB7XHJcbiAgcHVibGljIGFsaXZlID0gdHJ1ZTtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xyXG4gIHB1YmxpYyBzaGllbGQgPSBDb25maWdzLklOSVRJQUxfU0hJRUxEO1xyXG4gIHB1YmxpYyBtaXNzaWxlQW1tbyA9IENvbmZpZ3MuSU5JVElBTF9NSVNTSUxFX0FNTU87XHJcbiAgcHVibGljIGZ1ZWwgPSBDb25maWdzLklOSVRJQUxfRlVFTDtcclxuXHJcbiAgcHVibGljIGNvbW1hbmQ6IFNvdXJjZXJDb21tYW5kO1xyXG4gIHB1YmxpYyBzY3JpcHRMb2FkZXI6IFNjcmlwdExvYWRlcjtcclxuICBwcml2YXRlIGNvbnRyb2xsZXI6IFNvdXJjZXJDb250cm9sbGVyO1xyXG4gIHByaXZhdGUgYm90OiAoKGNvbnRyb2xsZXI6IFNvdXJjZXJDb250cm9sbGVyKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgZGVidWdEdW1wOiBEZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlciwgcHVibGljIGFpU291cmNlOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgYWNjb3VudDogc3RyaW5nLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY29sb3I6IHN0cmluZykge1xyXG5cclxuICAgIHN1cGVyKGZpZWxkLCB4LCB5KTtcclxuXHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBDb25zdHMuRElSRUNUSU9OX1JJR0hUIDogQ29uc3RzLkRJUkVDVElPTl9MRUZUO1xyXG4gICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbXBpbGUoc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXIpIHtcclxuICAgIHRoaXMuc2NyaXB0TG9hZGVyID0gc2NyaXB0TG9hZGVyO1xyXG4gICAgdGhpcy5ib3QgPSBzY3JpcHRMb2FkZXIubG9hZCh0aGlzLmFpU291cmNlKTtcclxuICAgIGlmICghdGhpcy5ib3QpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnRnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJldHVybmVkLicgfTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdGhpcy5ib3QgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnUmV0dXJuZWQgaXMgbm90IGEgRnVuY3Rpb24uJyB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKSB7XHJcbiAgICBpZiAodGhpcy5ib3QgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XHJcbiAgICAgIHRoaXMuZGVidWdEdW1wID0geyBsb2dzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFjdGlvbigpIHtcclxuICAgIGlmICghdGhpcy5hbGl2ZSAmJiBVdGlscy5yYW5kKDgpIDwgMSkge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFV0aWxzLnJhbmQoMTYpIC0gOCwgVXRpbHMucmFuZCgxNikgLSA4KTtcclxuICAgICAgY29uc3Qgc3BlZWQgPSBuZXcgVihVdGlscy5yYW5kKDEpIC0gMC41LCBVdGlscy5yYW5kKDEpICsgMC41KTtcclxuICAgICAgY29uc3QgbGVuZ3RoID0gVXRpbHMucmFuZCg4KSArIDQ7XHJcbiAgICAgIHRoaXMuZmllbGQuYWRkRngobmV3IEZ4KHRoaXMuZmllbGQsIHBvc2l0aW9uLCBzcGVlZCwgbGVuZ3RoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWlyIHJlc2lzdGFuY2VcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XHJcblxyXG4gICAgLy8gZ3Jhdml0eVxyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlncy5HUkFWSVRZKTtcclxuXHJcbiAgICAvLyBjb250cm9sIGFsdGl0dWRlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxyXG4gICAgaWYgKENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EIDwgdGhpcy5wb3NpdGlvbi55KSB7XHJcbiAgICAgIGNvbnN0IGludmlzaWJsZVBvd2VyID0gKHRoaXMucG9zaXRpb24ueSAtIENvbmZpZ3MuVE9QX0lOVklTSUJMRV9IQU5EKSAqIDAuMTtcclxuICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuc3VidHJhY3QoMCwgQ29uZmlncy5HUkFWSVRZICogaW52aXNpYmxlUG93ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnRyb2wgZGlzdGFuY2UgYnkgdGhlIGludmlzaWJsZSBoYW5kXHJcbiAgICBjb25zdCBkaWZmID0gdGhpcy5maWVsZC5jZW50ZXIgLSB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICBpZiAoQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIgPCBNYXRoLmFicyhkaWZmKSkge1xyXG4gICAgICBjb25zdCBuID0gZGlmZiA8IDAgPyAtMSA6IDE7XHJcbiAgICAgIGNvbnN0IGludmlzaWJsZUhhbmQgPSAoTWF0aC5hYnMoZGlmZikgLSBDb25maWdzLkRJU1RBTkNFX0JPUkRBUikgKiBDb25maWdzLkRJU1RBTkNFX0lOVklTSUJMRV9IQU5EICogbjtcclxuICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHRoaXMucG9zaXRpb24ueCArIGludmlzaWJsZUhhbmQsIHRoaXMucG9zaXRpb24ueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ28gaW50byB0aGUgZ3JvdW5kXHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55IDwgMCkge1xyXG4gICAgICB0aGlzLnNoaWVsZCAtPSAoLXRoaXMuc3BlZWQueSAqIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRSk7XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLngsIDApO1xyXG4gICAgICB0aGlzLnNwZWVkID0gbmV3IFYodGhpcy5zcGVlZC54LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlIC09IENvbmZpZ3MuQ09PTF9ET1dOO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IE1hdGgubWF4KHRoaXMudGVtcGVyYXR1cmUsIDApO1xyXG5cclxuICAgIC8vIG92ZXJoZWF0XHJcbiAgICBjb25zdCBvdmVyaGVhdCA9ICh0aGlzLnRlbXBlcmF0dXJlIC0gQ29uZmlncy5PVkVSSEVBVF9CT1JERVIpO1xyXG4gICAgaWYgKDAgPCBvdmVyaGVhdCkge1xyXG4gICAgICBjb25zdCBsaW5lYXJEYW1hZ2UgPSBvdmVyaGVhdCAqIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XHJcbiAgICAgIGNvbnN0IHBvd2VyRGFtYWdlID0gTWF0aC5wb3cob3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xyXG4gICAgICB0aGlzLnNoaWVsZCAtPSAobGluZWFyRGFtYWdlICsgcG93ZXJEYW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XHJcblxyXG4gICAgdGhpcy5jb21tYW5kLmV4ZWN1dGUoKTtcclxuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpcmUocGFyYW06IEZpcmVQYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSAnTGFzZXInKSB7XHJcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMub3Bwb3NpdGUocGFyYW0uZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgc2hvdCA9IG5ldyBMYXNlcih0aGlzLmZpZWxkLCB0aGlzLCBkaXJlY3Rpb24sIHBhcmFtLnBvd2VyKTtcclxuICAgICAgc2hvdC5yZWFjdGlvbih0aGlzKTtcclxuICAgICAgdGhpcy5maWVsZC5hZGRTaG90KHNob3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ01pc3NpbGUnKSB7XHJcbiAgICAgIGlmICgwIDwgdGhpcy5taXNzaWxlQW1tbykge1xyXG4gICAgICAgIGNvbnN0IG1pc3NpbGUgPSBuZXcgTWlzc2lsZSh0aGlzLmZpZWxkLCB0aGlzLCBwYXJhbS5ib3QpO1xyXG4gICAgICAgIG1pc3NpbGUucmVhY3Rpb24odGhpcyk7XHJcbiAgICAgICAgdGhpcy5taXNzaWxlQW1tby0tO1xyXG4gICAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChtaXNzaWxlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9wcG9zaXRlKGRpcmVjdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9MRUZUKSB7XHJcbiAgICAgIHJldHVybiBVdGlscy50b09wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uSGl0KHNob3Q6IFNob3QpIHtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLmFkZChzaG90LnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuT05fSElUX1NQRUVEX0dJVkVOX1JBVEUpKTtcclxuICAgIHRoaXMuc2hpZWxkIC09IHNob3QuZGFtYWdlKCk7XHJcbiAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcclxuICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChzaG90KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2gobWVzc2FnZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpOiBTb3VyY2VyRHVtcCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxyXG4gICAgICBoOiBNYXRoLmNlaWwodGhpcy5zaGllbGQpLFxyXG4gICAgICB0OiBNYXRoLmNlaWwodGhpcy50ZW1wZXJhdHVyZSksXHJcbiAgICAgIGE6IHRoaXMubWlzc2lsZUFtbW8sXHJcbiAgICAgIGY6IE1hdGguY2VpbCh0aGlzLmZ1ZWwpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXBEZWJ1ZygpOiBEZWJ1Z0R1bXAge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVidWdEdW1wO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29tbWFuZCBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIGFoZWFkOiBudW1iZXI7XHJcbiAgcHVibGljIGFzY2VudDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0dXJuOiBib29sZWFuO1xyXG4gIHB1YmxpYyBmaXJlOiBGaXJlUGFyYW0gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlcjogU291cmNlcikge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpIHtcclxuICAgIHRoaXMuYWhlYWQgPSAwO1xyXG4gICAgdGhpcy5hc2NlbnQgPSAwO1xyXG4gICAgdGhpcy50dXJuID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpcmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICBpZiAodGhpcy5maXJlKSB7XHJcbiAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHVybikge1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcclxuICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlncy5GVUVMX0NPU1Q7XHJcbiAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XHJcbmltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuaW1wb3J0IHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBzaGllbGQ6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmU6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW86ICgpID0+IG51bWJlcjtcclxuXHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc2NhbkF0dGFjazogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGFoZWFkOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBiYWNrOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBhc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRlc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm46ICgpID0+IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyBmaXJlTGFzZXI6IChkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZmlyZU1pc3NpbGU6IChib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc291cmNlcjogU291cmNlcikge1xyXG4gICAgc3VwZXIoc291cmNlcik7XHJcblxyXG4gICAgdGhpcy5zaGllbGQgPSAoKSA9PiBzb3VyY2VyLnNoaWVsZDtcclxuICAgIHRoaXMudGVtcGVyYXR1cmUgPSAoKSA9PiBzb3VyY2VyLnRlbXBlcmF0dXJlO1xyXG4gICAgdGhpcy5taXNzaWxlQW1tbyA9ICgpID0+IHNvdXJjZXIubWlzc2lsZUFtbW87XHJcbiAgICB0aGlzLmZ1ZWwgPSAoKSA9PiBzb3VyY2VyLmZ1ZWw7XHJcblxyXG4gICAgY29uc3QgZmllbGQgPSBzb3VyY2VyLmZpZWxkO1xyXG4gICAgY29uc3QgY29tbWFuZCA9IHNvdXJjZXIuY29tbWFuZDtcclxuICAgIHRoaXMuc2NhbkVuZW15ID0gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3MuU0NBTl9XQUlUO1xyXG4gICAgICBjb25zdCBvcHBvc2l0ZWREaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRSZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgb3Bwb3NpdGVkRGlyZWN0aW9uLCBhbmdsZSwgbm9ybWFsaXplZFJlbmdlKTtcclxuICAgICAgcmV0dXJuIGZpZWxkLnNjYW5FbmVteShzb3VyY2VyLCByYWRhcik7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5zY2FuQXR0YWNrID0gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgc291cmNlci53YWl0ICs9IENvbmZpZ3MuU0NBTl9XQUlUO1xyXG4gICAgICBjb25zdCBvcHBvc2l0ZWREaXJlY3Rpb24gPSBzb3VyY2VyLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRSZW5nZSA9IHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIoc291cmNlci5wb3NpdGlvbiwgb3Bwb3NpdGVkRGlyZWN0aW9uLCBhbmdsZSwgbm9ybWFsaXplZFJlbmdlKTtcclxuICAgICAgcmV0dXJuIGZpZWxkLnNjYW5BdHRhY2soc291cmNlciwgcmFkYXIpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYWhlYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5haGVhZCA9IDAuODtcclxuICAgIH07XHJcbiAgICB0aGlzLmJhY2sgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5haGVhZCA9IC0wLjQ7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5hc2NlbnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5hc2NlbnQgPSAwLjk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5kZXNjZW50ID0gKCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuYXNjZW50ID0gLTAuOTtcclxuICAgIH07XHJcbiAgICB0aGlzLnR1cm4gPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5maXJlTGFzZXIgPSAoZGlyZWN0aW9uLCBwb3dlcikgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuZmlyZSA9IEZpcmVQYXJhbS5sYXNlcihwb3dlciwgZGlyZWN0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5maXJlTWlzc2lsZSA9IChib3QpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmZpcmUgPSBGaXJlUGFyYW0ubWlzc2lsZShib3QpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgc291cmNlci5sb2cobWVzc2FnZS5tYXAodmFsdWUgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpLmpvaW4oJywgJykpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb25uZWN0Q29uc29sZShjb25zb2xlOiBDb25zb2xlTGlrZSB8IG51bGwpIHtcclxuICAgIGlmIChjb25zb2xlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nID0gdGhpcy5sb2cuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcblxyXG5jb25zdCBFUFNJTE9OID0gMTBlLTEyO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xyXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlUmFkYXIoYzogViwgZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlOiBudW1iZXIpOiAodDogVikgPT4gYm9vbGVhbiB7XHJcbiAgICBjb25zdCBjaGVja0Rpc3RhbmNlID0gKHQ6IFYpID0+IGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7XHJcblxyXG4gICAgaWYgKDM2MCA8PSBhbmdsZSkge1xyXG4gICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XHJcbiAgICBjb25zdCBjaGVja1JpZ2h0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyAxODAgLSBhbmdsZSAvIDIpO1xyXG5cclxuICAgIGlmIChhbmdsZSA8IDE4MCkge1xyXG4gICAgICByZXR1cm4gdCA9PiBjaGVja0xlZnQodCkgJiYgY2hlY2tSaWdodCh0KSAmJiBjaGVja0Rpc3RhbmNlKHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQgPT4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBzaWRlKGJhc2U6IFYsIGRlZ3JlZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcmFkaWFuID0gVXRpbHMudG9SYWRpYW4oZGVncmVlKTtcclxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IG5ldyBWKE1hdGguY29zKHJhZGlhbiksIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgY29uc3QgcHJldmlvdXNseSA9IGJhc2UueCAqIGRpcmVjdGlvbi55IC0gYmFzZS55ICogZGlyZWN0aW9uLnggLSBFUFNJTE9OO1xyXG4gICAgcmV0dXJuICh0YXJnZXQ6IFYpID0+IHtcclxuICAgICAgcmV0dXJuIDAgPD0gdGFyZ2V0LnggKiBkaXJlY3Rpb24ueSAtIHRhcmdldC55ICogZGlyZWN0aW9uLnggLSBwcmV2aW91c2x5O1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY2FsY0Rpc3RhbmNlKGY6IFYsIHQ6IFYsIHA6IFYpOiBudW1iZXIge1xyXG4gICAgY29uc3QgdG9Gcm9tID0gdC5zdWJ0cmFjdChmKTtcclxuICAgIGNvbnN0IHBGcm9tID0gcC5zdWJ0cmFjdChmKTtcclxuICAgIGlmICh0b0Zyb20uZG90KHBGcm9tKSA8IEVQU0lMT04pIHtcclxuICAgICAgcmV0dXJuIHBGcm9tLmxlbmd0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZyb21UbyA9IGYuc3VidHJhY3QodCk7XHJcbiAgICBjb25zdCBwVG8gPSBwLnN1YnRyYWN0KHQpO1xyXG4gICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcclxuICAgICAgcmV0dXJuIHBUby5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTWF0aC5hYnModG9Gcm9tLmNyb3NzKHBGcm9tKSAvIHRvRnJvbS5sZW5ndGgoKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHRvUmFkaWFuKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHRvT3Bwb3NpdGUoZGVncmVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IFV0aWxzLm5vcm1hbGl6ZURlZ3JlZShkZWdyZWUpO1xyXG4gICAgaWYgKG5vcm1hbGl6ZWQgPD0gMTgwKSB7XHJcbiAgICAgIHJldHVybiAoOTAgLSBub3JtYWxpemVkKSAqIDIgKyBub3JtYWxpemVkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgyNzAgLSBub3JtYWxpemVkKSAqIDIgKyBub3JtYWxpemVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgbm9ybWFsaXplRGVncmVlKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCByZW1haW5kZXIgPSBkZWdyZWUgJSAzNjA7XHJcbiAgICByZXR1cm4gcmVtYWluZGVyIDwgMCA/IHJlbWFpbmRlciArIDM2MCA6IHJlbWFpbmRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcmFuZChyZW5nZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogcmVuZ2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFYge1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlZExlbmd0aDogbnVtYmVyO1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlZEFuZ2xlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGQodjogVik6IFY7XHJcbiAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFY7XHJcbiAgcHVibGljIGFkZCh2OiBhbnksIHk/OiBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgKHYueCB8fCAwKSwgdGhpcy55ICsgKHYueSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgKHYgfHwgMCksIHRoaXMueSArICh5IHx8IDApKTtcclxuICB9XHJcbiAgcHVibGljIHN1YnRyYWN0KHY6IFYpOiBWO1xyXG4gIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFY7XHJcbiAgcHVibGljIHN1YnRyYWN0KHY6IGFueSwgeT86IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSAodi54IHx8IDApLCB0aGlzLnkgLSAodi55IHx8IDApKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgVih0aGlzLnggLSAodiB8fCAwKSwgdGhpcy55IC0gKHkgfHwgMCkpO1xyXG4gIH1cclxuICBwdWJsaWMgbXVsdGlwbHkodjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdiwgdGhpcy55ICogdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBkaXZpZGUodjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdiwgdGhpcy55IC8gdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBtb2R1bG8odjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LngsIHRoaXMueSAlIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdiwgdGhpcy55ICUgdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBuZWdhdGUoKTogViB7XHJcbiAgICByZXR1cm4gbmV3IFYoLXRoaXMueCwgLXRoaXMueSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBkaXN0YW5jZSh2OiBWKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHYpLmxlbmd0aCgpO1xyXG4gIH1cclxuICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZW5ndGg7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGN1bGF0ZWRMZW5ndGggPSBNYXRoLnNxcnQodGhpcy5kb3QoKSk7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xyXG4gIH1cclxuICBwdWJsaWMgbm9ybWFsaXplKCk6IFYge1xyXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICBjb25zdCBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XHJcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseShzY2FsZSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBhbmdsZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoKSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgfVxyXG4gIHB1YmxpYyBhbmdsZUluUmFkaWFucygpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZEFuZ2xlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcclxuICAgIH1cclxuICAgIHRoaXMuY2FsY3VsYXRlZEFuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCB0aGlzLngpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZEFuZ2xlO1xyXG4gIH1cclxuICBwdWJsaWMgZG90KHBvaW50OiBWID0gdGhpcyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueCArIHRoaXMueSAqIHBvaW50Lnk7XHJcbiAgfVxyXG4gIHB1YmxpYyBjcm9zcyhwb2ludDogVik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueSAtIHRoaXMueSAqIHBvaW50Lng7XHJcbiAgfVxyXG4gIHB1YmxpYyByb3RhdGUoZGVncmVlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHJhZGlhbiA9IGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgcmV0dXJuIG5ldyBWKGNvcyAqIHRoaXMueCAtIHNpbiAqIHRoaXMueSwgY29zICogdGhpcy55ICsgc2luICogdGhpcy54KTtcclxuICB9XHJcbiAgcHVibGljIHN0YXRpYyBkaXJlY3Rpb24oZGVncmVlOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgVigxLCAwKS5yb3RhdGUoZGVncmVlKTtcclxuICB9XHJcbiAgcHVibGljIG1pbmltaXplKCkge1xyXG4gICAgcmV0dXJuIHsgeDogTWF0aC5yb3VuZCh0aGlzLngpLCB5OiBNYXRoLnJvdW5kKHRoaXMueSkgfSBhcyBWO1xyXG4gIH1cclxufVxyXG4iXX0=
