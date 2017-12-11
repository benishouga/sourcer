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
        this.console = {
            log: function () {
                var message = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    message[_i] = arguments[_i];
                }
                /* nothing.. */
            }
        };
        var allowLibs = {
            Object: Object,
            String: String,
            Number: Number,
            Boolean: Boolean,
            Array: Array,
            Date: Date,
            Math: Math,
            RegExp: RegExp,
            JSON: JSON,
            NaN: NaN,
            Infinity: Infinity,
            undefined: undefined,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            isFinite: isFinite,
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
        var side = this.sourcers.length % 2 === 0 ? -1 : 1;
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
                                _this.shots.filter(function (shot) { return shot.owner.id === sourcer.id; }).forEach(function (shot) { return shot.think(); });
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
        this.sourcers.forEach(function (sourcer) {
            sourcer.alive = 0 < sourcer.shield;
        });
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
            // Record some frames even after decided.
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
            return (actor.breakable &&
                actor.owner !== shot.owner &&
                Utils_1.default.calcDistance(f, t, actor.position) < shot.size + actor.size);
        });
        if (collidedShot) {
            return collidedShot;
        }
        var collidedSourcer = this.sourcers.find(function (sourcer) {
            return (sourcer.alive && sourcer !== shot.owner && Utils_1.default.calcDistance(f, t, sourcer.position) < shot.size + sourcer.size);
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
            // Cancel thinking
            return;
        }
        try {
            this.command.accept();
            this.controller.preThink();
            this.debugDump = { logs: [], arcs: [] };
            this.controller.connectConsole(this.owner.scriptLoader.getExposedConsole());
            this.bot(this.controller);
        }
        catch (error) {
            this.command.reset();
            this.debugDump.logs.push({ message: "Missile function error: " + error.message, color: 'red' });
        }
        finally {
            this.command.unaccept();
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
        this.debugDump.logs.push({ message: message });
    };
    Missile.prototype.scanDebug = function (direction, angle, renge) {
        this.debugDump.arcs.push({ direction: direction, angle: angle, renge: renge });
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
            missile.log(message.map(function (value) { return (isString(value) ? value : JSON.stringify(value)); }).join(', '));
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
            this.debugDump.logs.push({ message: "Sourcer function error: " + error.message, color: 'red' });
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
            this.shield -= -this.speed.y * Configs_1.default.GROUND_DAMAGE_SCALE;
            this.position = new V_1.default(this.position.x, 0);
            this.speed = new V_1.default(this.speed.x, 0);
        }
        this.temperature -= Configs_1.default.COOL_DOWN;
        this.temperature = Math.max(this.temperature, 0);
        // overheat
        var overheat = this.temperature - Configs_1.default.OVERHEAT_BORDER;
        if (0 < overheat) {
            var linearDamage = overheat * Configs_1.default.OVERHEAT_DAMAGE_LINEAR_WEIGHT;
            var powerDamage = Math.pow(overheat * Configs_1.default.OVERHEAT_DAMAGE_POWER_WEIGHT, 2);
            this.shield -= linearDamage + powerDamage;
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
        this.debugDump.logs.push({ message: message });
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
            sourcer.log(message.map(function (value) { return (isString(value) ? value : JSON.stringify(value)); }).join(', '));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBK0lBOztBQS9JQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBNEQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBaUMsRUFBRSxDQUFDO0FBRW5ELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lB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QU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ00sb0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQU8sQ0FBQztJQUMvRCxDQUFDO0lBQ0gsUUFBQztBQUFELENBdEZBLEFBc0ZDLElBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4uL2NvcmUvRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuLi9jb3JlL1NvdXJjZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vY29yZS9VdGlscyc7XHJcbmltcG9ydCBUaWNrRXZlbnRMaXN0ZW5lciBmcm9tICcuLi9jb3JlL1RpY2tFdmVudExpc3RlbmVyJztcclxuaW1wb3J0IHsgUGxheWVyc0R1bXAsIEZyYW1lRHVtcCwgUmVzdWx0RHVtcCB9IGZyb20gJy4uL2NvcmUvRHVtcCc7XHJcbmltcG9ydCBFeHBvc2VkU2NyaXB0TG9hZGVyIGZyb20gJy4uL2NvcmUvRXhwb3NlZFNjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllckluZm8ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBjb2xvcjogc3RyaW5nO1xyXG4gIHNvdXJjZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluaXRpYWxQYXJhbWV0ZXIge1xyXG4gIGlzRGVtbzogYm9vbGVhbjtcclxuICBzb3VyY2VzOiBQbGF5ZXJJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIERhdGEgPVxyXG4gIHwgTmV4dENvbW1hbmRcclxuICB8IFBsYXllcnNDb21tYW5kXHJcbiAgfCBQcmVUaGlua0NvbW1hbmRcclxuICB8IFBvc3RUaGlua0NvbW1hbmRcclxuICB8IEZpbmlzaGVkQ29tbWFuZFxyXG4gIHwgRW5kT2ZHYW1lQ29tbWFuZFxyXG4gIHwgRXJyb3JDb21tYW5kO1xyXG5cclxuaW50ZXJmYWNlIE5leHRDb21tYW5kIHtcclxuICBjb21tYW5kOiAnTmV4dCc7XHJcbiAgaXNzdWVkSWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBsYXllcnNDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUGxheWVycyc7XHJcbiAgcGxheWVyczogUGxheWVyc0R1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQcmVUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQcmVUaGluayc7XHJcbiAgaWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQb3N0VGhpbmsnO1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgbG9hZGVkRnJhbWU6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZpbmlzaGVkQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0ZpbmlzaGVkJztcclxuICByZXN1bHQ6IFJlc3VsdER1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBFbmRPZkdhbWVDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRW5kT2ZHYW1lJztcclxuICBmcmFtZXM6IEZyYW1lRHVtcFtdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRXJyb3JDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRXJyb3InO1xyXG4gIGVycm9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbmRlY2xhcmUgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobWVzc2FnZTogRGF0YSk6IHZvaWQ7XHJcblxyXG5sZXQgaXNzdWVJZCA9IDA7XHJcbmNvbnN0IGlzc3VlID0gKCkgPT4gaXNzdWVJZCsrO1xyXG5jb25zdCBjYWxsYmFja3M6IHsgW2lkOiBudW1iZXJdOiAoKSA9PiB2b2lkIH0gPSB7fTtcclxuXHJcbm9ubWVzc2FnZSA9ICh7IGRhdGEgfSkgPT4ge1xyXG4gIGlmIChkYXRhLmlzc3VlZElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGNhbGxiYWNrc1tkYXRhLmlzc3VlZElkXSgpO1xyXG4gICAgZGVsZXRlIGNhbGxiYWNrc1tkYXRhLmlzc3VlZElkXTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgaW5pdGlhbFBhcmFtZXRlciA9IGRhdGEgYXMgSW5pdGlhbFBhcmFtZXRlcjtcclxuICBjb25zdCBpc0RlbW8gPSBpbml0aWFsUGFyYW1ldGVyLmlzRGVtbyBhcyBib29sZWFuO1xyXG4gIGNvbnN0IHBsYXllcnMgPSBpbml0aWFsUGFyYW1ldGVyLnNvdXJjZXMgYXMgUGxheWVySW5mb1tdO1xyXG4gIGNvbnN0IGZyYW1lczogRnJhbWVEdW1wW10gPSBbXTtcclxuICBjb25zdCBsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIgPSB7XHJcbiAgICB3YWl0TmV4dFRpY2s6IGFzeW5jICgpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzc3VlZElkID0gaXNzdWUoKTtcclxuICAgICAgICBjYWxsYmFja3NbaXNzdWVkSWRdID0gcmVzb2x2ZTtcclxuICAgICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICBpc3N1ZWRJZCxcclxuICAgICAgICAgIGNvbW1hbmQ6ICdOZXh0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblByZVRoaW5rOiAoc291cmNlcklkOiBudW1iZXIpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGNvbW1hbmQ6ICdQcmVUaGluaycsXHJcbiAgICAgICAgaWQ6IHNvdXJjZXJJZFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblBvc3RUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiAnUG9zdFRoaW5rJyxcclxuICAgICAgICBpZDogc291cmNlcklkLFxyXG4gICAgICAgIGxvYWRlZEZyYW1lOiBmcmFtZXMubGVuZ3RoXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRnJhbWU6IChmaWVsZER1bXA6IEZyYW1lRHVtcCkgPT4ge1xyXG4gICAgICBmcmFtZXMucHVzaChmaWVsZER1bXApO1xyXG4gICAgfSxcclxuICAgIG9uRmluaXNoZWQ6IChyZXN1bHQ6IFJlc3VsdER1bXApID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIHJlc3VsdCxcclxuICAgICAgICBjb21tYW5kOiAnRmluaXNoZWQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRW5kT2ZHYW1lOiAoKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBmcmFtZXMsXHJcbiAgICAgICAgY29tbWFuZDogJ0VuZE9mR2FtZSdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25FcnJvcjogKGVycm9yOiBzdHJpbmcpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICAgIGNvbW1hbmQ6ICdFcnJvcidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoRXhwb3NlZFNjcmlwdExvYWRlciwgaXNEZW1vKTtcclxuICBwbGF5ZXJzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgZmllbGQucmVnaXN0ZXJTb3VyY2VyKHZhbHVlLnNvdXJjZSwgdmFsdWUubmFtZSwgdmFsdWUubmFtZSwgdmFsdWUuY29sb3IpO1xyXG4gIH0pO1xyXG5cclxuICBwb3N0TWVzc2FnZSh7XHJcbiAgICBjb21tYW5kOiAnUGxheWVycycsXHJcbiAgICBwbGF5ZXJzOiBmaWVsZC5wbGF5ZXJzKClcclxuICB9KTtcclxuXHJcbiAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBmaWVsZC5jb21waWxlKGxpc3RlbmVyKTtcclxuICAgIGZvciAobGV0IGNvdW50ID0gMDsgY291bnQgPCAxMDAwMCAmJiAhZmllbGQuaXNGaW5pc2hlZDsgY291bnQrKykge1xyXG4gICAgICBhd2FpdCBmaWVsZC50aWNrKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICB9LCAwKTtcclxufTtcclxuIiwiaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIHtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICBwdWJsaWMgcG9zaXRpb246IFY7XHJcbiAgcHVibGljIHNwZWVkOiBWO1xyXG4gIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlcjtcclxuICBwdWJsaWMgc2l6ZSA9IENvbmZpZ3MuQ09MTElTSU9OX1NJWkU7XHJcbiAgcHVibGljIHdhaXQgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgdGhpcy53YWl0ID0gMDtcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih4LCB5KTtcclxuICAgIHRoaXMuc3BlZWQgPSBuZXcgVigwLCAwKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0aGluaygpIHtcclxuICAgIGlmICh0aGlzLndhaXQgPD0gMCkge1xyXG4gICAgICB0aGlzLndhaXQgPSAwO1xyXG4gICAgICB0aGlzLm9uVGhpbmsoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2FpdCA9IHRoaXMud2FpdCAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpOiB2b2lkIHtcclxuICAgIC8vIG5vdCB0aGluayBhbnl0aGluZy5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKTogdm9pZCB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxpbWVudGF0aW9uJyk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmQge1xyXG4gIHByaXZhdGUgaXNBY2NlcHRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyB2YWxpZGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb21tYW5kLicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwdWJsaWMgYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcclxuICB9XHJcbiAgcHVibGljIHVuYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ3Mge1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9TSElFTEQgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX0ZVRUwgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX01JU1NJTEVfQU1NTyA9IDIwO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfQVRURU5VQVRJT04gPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfTU9NRU5UVU0gPSAxMjg7XHJcbiAgcHVibGljIHN0YXRpYyBGVUVMX0NPU1QgPSAwLjI0O1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09MTElTSU9OX1NJWkUgPSA0O1xyXG4gIHB1YmxpYyBzdGF0aWMgU0NBTl9XQUlUID0gMC4zNTtcclxuICBwdWJsaWMgc3RhdGljIFNQRUVEX1JFU0lTVEFOQ0UgPSAwLjk2O1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JBVklUWSA9IDAuMTtcclxuICBwdWJsaWMgc3RhdGljIFRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0JPUkRBUiA9IDQwMDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9CT1JERVIgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XHJcbiAgcHVibGljIHN0YXRpYyBHUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcclxuICBwdWJsaWMgc3RhdGljIENPT0xfRE9XTiA9IDAuNTtcclxuICBwdWJsaWMgc3RhdGljIE9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnN0cyB7XHJcbiAgcHVibGljIHN0YXRpYyBESVJFQ1RJT05fUklHSFQgPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUSU9OX0xFRlQgPSAtMTtcclxuICBwdWJsaWMgc3RhdGljIFZFUlRJQ0FMX1VQID0gJ3ZlcnRpYWxfdXAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVkVSVElDQUxfRE9XTiA9ICd2ZXJ0aWFsX2Rvd24nO1xyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgcHVibGljIGZyYW1lOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIGFsdGl0dWRlOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHdhaXQ6IChmcmFtZTogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBmdWVsOiAoKSA9PiBudW1iZXI7XHJcblxyXG4gIHByaXZhdGUgZnJhbWVzT2ZMaWZlOiBudW1iZXIgPSAwO1xyXG4gIHB1YmxpYyBwcmVUaGluayA9ICgpID0+IHtcclxuICAgIHRoaXMuZnJhbWVzT2ZMaWZlKys7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IoYWN0b3I6IEFjdG9yKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gKCkgPT4gdGhpcy5mcmFtZXNPZkxpZmU7XHJcbiAgICB0aGlzLmFsdGl0dWRlID0gKCkgPT4gYWN0b3IucG9zaXRpb24ueTtcclxuICAgIHRoaXMud2FpdCA9IChmcmFtZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmICgwIDwgZnJhbWUpIHtcclxuICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yOiBhbnksIGFyZ3M6IHN0cmluZ1tdKSB7XHJcbiAgZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH1cclxuICBmdW4ucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG4gIHJldHVybiBuZXcgKGZ1biBhcyBhbnkpKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zZWRTY3JpcHRMb2FkZXIgaW1wbGVtZW50cyBTY3JpcHRMb2FkZXIge1xyXG4gIHByaXZhdGUgYXJnVmFsdWVzOiBhbnlbXTtcclxuICBwcml2YXRlIGFyZ05hbWVzOiBzdHJpbmdbXTtcclxuICBwcml2YXRlIGJhbmxpc3Q6IHN0cmluZ1tdO1xyXG4gIHByaXZhdGUgY29uc29sZTogQ29uc29sZUxpa2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25zb2xlID0ge1xyXG4gICAgICBsb2c6ICguLi5tZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgLyogbm90aGluZy4uICovXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCBhbGxvd0xpYnMgPSB7XHJcbiAgICAgIE9iamVjdCxcclxuICAgICAgU3RyaW5nLFxyXG4gICAgICBOdW1iZXIsXHJcbiAgICAgIEJvb2xlYW4sXHJcbiAgICAgIEFycmF5LFxyXG4gICAgICBEYXRlLFxyXG4gICAgICBNYXRoLFxyXG4gICAgICBSZWdFeHAsXHJcbiAgICAgIEpTT04sXHJcbiAgICAgIE5hTixcclxuICAgICAgSW5maW5pdHksXHJcbiAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgcGFyc2VJbnQsXHJcbiAgICAgIHBhcnNlRmxvYXQsXHJcbiAgICAgIGlzTmFOLFxyXG4gICAgICBpc0Zpbml0ZSxcclxuICAgICAgY29uc29sZTogdGhpcy5jb25zb2xlXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1mdW5jdGlvbi1jb25zdHJ1Y3Rvci13aXRoLXN0cmluZy1hcmdzXHJcbiAgICBjb25zdCBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcclxuICAgIHRoaXMuYmFubGlzdCA9IFsnX19wcm90b19fJywgJ3Byb3RvdHlwZSddO1xyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxyXG4gICAgZm9yIChjb25zdCB0YXJnZXQgaW4gZ2xvYmFsKSB7XHJcbiAgICAgIHRoaXMuYmFubGlzdC5wdXNoKHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBsZXQgYXJnTmFtZXMgPSBPYmplY3Qua2V5cyhhbGxvd0xpYnMpO1xyXG4gICAgYXJnTmFtZXMgPSBhcmdOYW1lcy5jb25jYXQodGhpcy5iYW5saXN0LmZpbHRlcih2YWx1ZSA9PiBhcmdOYW1lcy5pbmRleE9mKHZhbHVlKSA+PSAwKSk7XHJcbiAgICB0aGlzLmFyZ05hbWVzID0gYXJnTmFtZXM7XHJcbiAgICB0aGlzLmFyZ1ZhbHVlcyA9IE9iamVjdC5rZXlzKGFsbG93TGlicykubWFwKGtleSA9PiAoYWxsb3dMaWJzIGFzIGFueSlba2V5XSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNEZWJ1Z2dhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0RXhwb3NlZENvbnNvbGUoKTogQ29uc29sZUxpa2UgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnNvbGU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZChzY3JpcHQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICBsZXQgYXJnTmFtZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBhcmdOYW1lcyA9IGFyZ05hbWVzLmNvbmNhdCh0aGlzLmFyZ05hbWVzKTtcclxuICAgIGFyZ05hbWVzLnB1c2goJ1widXNlIHN0cmljdFwiO1xcbicgKyBzY3JpcHQpO1xyXG4gICAgcmV0dXJuIGNvbnN0cnVjdChGdW5jdGlvbiwgYXJnTmFtZXMpLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5hcmdWYWx1ZXMpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgVGlja0V2ZW50TGlzdGVuZXIgZnJvbSAnLi9UaWNrRXZlbnRMaXN0ZW5lcic7XHJcbmltcG9ydCB7IEZyYW1lRHVtcCwgUmVzdWx0RHVtcCwgU291cmNlckR1bXAsIFNob3REdW1wLCBGeER1bXAsIFBsYXllcnNEdW1wLCBEZWJ1Z0R1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5pbXBvcnQgU2NyaXB0TG9hZGVyLCB7IFNjcmlwdExvYWRlckNvbnN0cnVjdG9yIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuY29uc3QgREVNT19GUkFNRV9MRU5HVEggPSAxMjg7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZCB7XHJcbiAgcHJpdmF0ZSBjdXJyZW50SWQgPSAwO1xyXG4gIHByaXZhdGUgc291cmNlcnM6IFNvdXJjZXJbXTtcclxuICBwcml2YXRlIHNob3RzOiBTaG90W107XHJcbiAgcHJpdmF0ZSBmeHM6IEZ4W107XHJcbiAgcHJpdmF0ZSBmcmFtZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgcmVzdWx0OiBSZXN1bHREdW1wO1xyXG4gIHB1YmxpYyBjZW50ZXI6IG51bWJlcjtcclxuICBwdWJsaWMgaXNGaW5pc2hlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGR1bW15RW5lbXk6IFYgPSBuZXcgVigwLCAxNTApO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjcmlwdExvYWRlckNvbnN0cnVjdG9yOiBTY3JpcHRMb2FkZXJDb25zdHJ1Y3RvciwgcHVibGljIGlzRGVtbzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgIHRoaXMuc291cmNlcnMgPSBbXTtcclxuICAgIHRoaXMuc2hvdHMgPSBbXTtcclxuICAgIHRoaXMuZnhzID0gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVnaXN0ZXJTb3VyY2VyKHNvdXJjZTogc3RyaW5nLCBhY2NvdW50OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZykge1xyXG4gICAgY29uc3Qgc2lkZSA9IHRoaXMuc291cmNlcnMubGVuZ3RoICUgMiA9PT0gMCA/IC0xIDogMTtcclxuICAgIGNvbnN0IHggPSBVdGlscy5yYW5kKDgwKSArIDE2MCAqIHNpZGU7XHJcbiAgICBjb25zdCB5ID0gVXRpbHMucmFuZCgxNjApICsgODA7XHJcbiAgICB0aGlzLmFkZFNvdXJjZXIobmV3IFNvdXJjZXIodGhpcywgeCwgeSwgc291cmNlLCBhY2NvdW50LCBuYW1lLCBjb2xvcikpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHByb2Nlc3MobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyLCB0aGluazogKHNvdXJjZXI6IFNvdXJjZXIpID0+IHZvaWQpIHtcclxuICAgIGZvciAoY29uc3Qgc291cmNlciBvZiB0aGlzLnNvdXJjZXJzKSB7XHJcbiAgICAgIGxpc3RlbmVyLm9uUHJlVGhpbmsoc291cmNlci5pZCk7XHJcbiAgICAgIGF3YWl0IGxpc3RlbmVyLndhaXROZXh0VGljaygpO1xyXG4gICAgICB0aGluayhzb3VyY2VyKTtcclxuICAgICAgbGlzdGVuZXIub25Qb3N0VGhpbmsoc291cmNlci5pZCk7XHJcbiAgICAgIGF3YWl0IGxpc3RlbmVyLndhaXROZXh0VGljaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGNvbXBpbGUobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzKGxpc3RlbmVyLCAoc291cmNlcjogU291cmNlcikgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNvdXJjZXIuY29tcGlsZShuZXcgdGhpcy5zY3JpcHRMb2FkZXJDb25zdHJ1Y3RvcigpKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsaXN0ZW5lci5vbkVycm9yKGBUaGVyZSBpcyBhbiBlcnJvciBpbiB5b3VyIGNvZGU644CAJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRTb3VyY2VyKHNvdXJjZXI6IFNvdXJjZXIpIHtcclxuICAgIHNvdXJjZXIuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5zb3VyY2Vycy5wdXNoKHNvdXJjZXIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFNob3Qoc2hvdDogU2hvdCkge1xyXG4gICAgc2hvdC5pZCA9IHRoaXMuY3VycmVudElkKys7XHJcbiAgICB0aGlzLnNob3RzLnB1c2goc2hvdCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlU2hvdCh0YXJnZXQ6IFNob3QpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zaG90cy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICBpZiAoMCA8PSBpbmRleCkge1xyXG4gICAgICB0aGlzLnNob3RzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkRngoZng6IEZ4KSB7XHJcbiAgICBmeC5pZCA9IHRoaXMuY3VycmVudElkKys7XHJcbiAgICB0aGlzLmZ4cy5wdXNoKGZ4KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVGeCh0YXJnZXQ6IEZ4KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZnhzLmluZGV4T2YodGFyZ2V0KTtcclxuICAgIGlmICgwIDw9IGluZGV4KSB7XHJcbiAgICAgIHRoaXMuZnhzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgdGljayhsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmZyYW1lID09PSAwKSB7XHJcbiAgICAgIGxpc3RlbmVyLm9uRnJhbWUodGhpcy5kdW1wKCkpOyAvLyBTYXZlIHRoZSAwIGZyYW1lLlxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvIGJlIHVzZWQgaW4gdGhlIGludmlzaWJsZSBoYW5kLlxyXG4gICAgdGhpcy5jZW50ZXIgPSB0aGlzLmNvbXB1dGVDZW50ZXIoKTtcclxuXHJcbiAgICAvLyBUaGluayBwaGFzZVxyXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKGxpc3RlbmVyLCAoc291cmNlcjogU291cmNlcikgPT4ge1xyXG4gICAgICBzb3VyY2VyLnRoaW5rKCk7XHJcbiAgICAgIHRoaXMuc2hvdHMuZmlsdGVyKHNob3QgPT4gc2hvdC5vd25lci5pZCA9PT0gc291cmNlci5pZCkuZm9yRWFjaChzaG90ID0+IHNob3QudGhpbmsoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBY3Rpb24gcGhhc2VcclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XHJcbiAgICB0aGlzLnNob3RzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5hY3Rpb24oKSk7XHJcblxyXG4gICAgLy8gTW92ZSBwaGFzZVxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcbiAgICB0aGlzLnNob3RzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IubW92ZSgpKTtcclxuICAgIHRoaXMuZnhzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IubW92ZSgpKTtcclxuXHJcbiAgICAvLyBDaGVjayBwaGFzZVxyXG4gICAgdGhpcy5jaGVja0ZpbmlzaChsaXN0ZW5lcik7XHJcbiAgICB0aGlzLmNoZWNrRW5kT2ZHYW1lKGxpc3RlbmVyKTtcclxuXHJcbiAgICB0aGlzLmZyYW1lKys7XHJcblxyXG4gICAgLy8gb25GcmFtZVxyXG4gICAgbGlzdGVuZXIub25GcmFtZSh0aGlzLmR1bXAoKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRmluaXNoKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgaWYgKHRoaXMuaXNEZW1vKSB7XHJcbiAgICAgIGlmIChERU1PX0ZSQU1FX0xFTkdUSCA8IHRoaXMuZnJhbWUpIHtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHtcclxuICAgICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxyXG4gICAgICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgICAgIGlzRHJhdzogbnVsbCxcclxuICAgICAgICAgIHdpbm5lcklkOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzdWx0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goc291cmNlciA9PiB7XHJcbiAgICAgIHNvdXJjZXIuYWxpdmUgPSAwIDwgc291cmNlci5zaGllbGQ7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHN1cnZpdmVycyA9IHRoaXMuc291cmNlcnMuZmlsdGVyKHNvdXJjZXIgPT4gc291cmNlci5hbGl2ZSk7XHJcblxyXG4gICAgaWYgKDEgPCBzdXJ2aXZlcnMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3Vydml2ZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBjb25zdCBzdXJ2aXZlciA9IHN1cnZpdmVyc1swXTtcclxuICAgICAgdGhpcy5yZXN1bHQgPSB7XHJcbiAgICAgICAgd2lubmVySWQ6IHN1cnZpdmVyLmlkLFxyXG4gICAgICAgIGZyYW1lOiB0aGlzLmZyYW1lLFxyXG4gICAgICAgIHRpbWVvdXQ6IG51bGwsXHJcbiAgICAgICAgaXNEcmF3OiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICBsaXN0ZW5lci5vbkZpbmlzaGVkKHRoaXMucmVzdWx0KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vIHN1cnZpdmVyLi4gZHJhdy4uLlxyXG4gICAgdGhpcy5yZXN1bHQgPSB7XHJcbiAgICAgIHdpbm5lcklkOiBudWxsLFxyXG4gICAgICB0aW1lb3V0OiBudWxsLFxyXG4gICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgaXNEcmF3OiB0cnVlXHJcbiAgICB9O1xyXG4gICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRW5kT2ZHYW1lKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgaWYgKHRoaXMuaXNGaW5pc2hlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLnJlc3VsdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEZW1vKSB7XHJcbiAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXN1bHQuZnJhbWUgPCB0aGlzLmZyYW1lIC0gOTApIHtcclxuICAgICAgLy8gUmVjb3JkIHNvbWUgZnJhbWVzIGV2ZW4gYWZ0ZXIgZGVjaWRlZC5cclxuICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgbGlzdGVuZXIub25FbmRPZkdhbWUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzY2FuRW5lbXkob3duZXI6IFNvdXJjZXIsIHJhZGFyOiAodDogVikgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaXNEZW1vICYmIHRoaXMuc291cmNlcnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiByYWRhcih0aGlzLmR1bW15RW5lbXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNvdXJjZXJzLnNvbWUoc291cmNlciA9PiB7XHJcbiAgICAgIHJldHVybiBzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IG93bmVyICYmIHJhZGFyKHNvdXJjZXIucG9zaXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkF0dGFjayhvd25lcjogU291cmNlciwgcmFkYXI6ICh0OiBWKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaG90cy5zb21lKHNob3QgPT4ge1xyXG4gICAgICByZXR1cm4gc2hvdC5vd25lciAhPT0gb3duZXIgJiYgcmFkYXIoc2hvdC5wb3NpdGlvbikgJiYgdGhpcy5pc0luY29taW5nKG93bmVyLCBzaG90KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0luY29taW5nKG93bmVyOiBTb3VyY2VyLCBzaG90OiBTaG90KSB7XHJcbiAgICBjb25zdCBvd25lclBvc2l0aW9uID0gb3duZXIucG9zaXRpb247XHJcbiAgICBjb25zdCBhY3RvclBvc2l0aW9uID0gc2hvdC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGN1cnJlbnREaXN0YW5jZSA9IG93bmVyUG9zaXRpb24uZGlzdGFuY2UoYWN0b3JQb3NpdGlvbik7XHJcbiAgICBjb25zdCBuZXh0RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24uYWRkKHNob3Quc3BlZWQpKTtcclxuICAgIHJldHVybiBuZXh0RGlzdGFuY2UgPCBjdXJyZW50RGlzdGFuY2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb24oc2hvdDogU2hvdCk6IEFjdG9yIHwgbnVsbCB7XHJcbiAgICBjb25zdCBmID0gc2hvdC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IHQgPSBzaG90LnBvc2l0aW9uLmFkZChzaG90LnNwZWVkKTtcclxuXHJcbiAgICBjb25zdCBjb2xsaWRlZFNob3QgPSB0aGlzLnNob3RzLmZpbmQoYWN0b3IgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIGFjdG9yLmJyZWFrYWJsZSAmJlxyXG4gICAgICAgIGFjdG9yLm93bmVyICE9PSBzaG90Lm93bmVyICYmXHJcbiAgICAgICAgVXRpbHMuY2FsY0Rpc3RhbmNlKGYsIHQsIGFjdG9yLnBvc2l0aW9uKSA8IHNob3Quc2l6ZSArIGFjdG9yLnNpemVcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGNvbGxpZGVkU2hvdCkge1xyXG4gICAgICByZXR1cm4gY29sbGlkZWRTaG90O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbGxpZGVkU291cmNlciA9IHRoaXMuc291cmNlcnMuZmluZChzb3VyY2VyID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBzb3VyY2VyLmFsaXZlICYmIHNvdXJjZXIgIT09IHNob3Qub3duZXIgJiYgVXRpbHMuY2FsY0Rpc3RhbmNlKGYsIHQsIHNvdXJjZXIucG9zaXRpb24pIDwgc2hvdC5zaXplICsgc291cmNlci5zaXplXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGlmIChjb2xsaWRlZFNvdXJjZXIpIHtcclxuICAgICAgcmV0dXJuIGNvbGxpZGVkU291cmNlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjaGVja0NvbGxpc2lvbkVudmlyb21lbnQoc2hvdDogU2hvdCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHNob3QucG9zaXRpb24ueSA8IDA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXB1dGVDZW50ZXIoKTogbnVtYmVyIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgaWYgKHNvdXJjZXIuYWxpdmUpIHtcclxuICAgICAgICBzdW1YICs9IHNvdXJjZXIucG9zaXRpb24ueDtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzdW1YIC8gY291bnQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcGxheWVycygpIHtcclxuICAgIGNvbnN0IHBsYXllcnM6IFBsYXllcnNEdW1wID0ge307XHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goc291cmNlciA9PiB7XHJcbiAgICAgIHBsYXllcnNbc291cmNlci5pZF0gPSB7XHJcbiAgICAgICAgbmFtZTogc291cmNlci5uYW1lIHx8IHNvdXJjZXIuYWNjb3VudCxcclxuICAgICAgICBhY2NvdW50OiBzb3VyY2VyLmFjY291bnQsXHJcbiAgICAgICAgY29sb3I6IHNvdXJjZXIuY29sb3JcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHBsYXllcnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGR1bXAoKTogRnJhbWVEdW1wIHtcclxuICAgIGNvbnN0IHNvdXJjZXJzRHVtcDogU291cmNlckR1bXBbXSA9IFtdO1xyXG4gICAgY29uc3Qgc2hvdHNEdW1wOiBTaG90RHVtcFtdID0gW107XHJcbiAgICBjb25zdCBmeER1bXA6IEZ4RHVtcFtdID0gW107XHJcblxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKGFjdG9yID0+IHtcclxuICAgICAgc291cmNlcnNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGlzVGhpbmthYmxlID0gKHg6IFNob3QpOiB4IGlzIE1pc3NpbGUgPT4geC50eXBlID09PSAnTWlzc2lsZSc7XHJcbiAgICB0aGlzLnNob3RzLmZvckVhY2goYWN0b3IgPT4ge1xyXG4gICAgICBzaG90c0R1bXAucHVzaChhY3Rvci5kdW1wKCkpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmZ4cy5mb3JFYWNoKGZ4ID0+IHtcclxuICAgICAgZnhEdW1wLnB1c2goZnguZHVtcCgpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGY6IHRoaXMuZnJhbWUsXHJcbiAgICAgIHM6IHNvdXJjZXJzRHVtcCxcclxuICAgICAgYjogc2hvdHNEdW1wLFxyXG4gICAgICB4OiBmeER1bXBcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVQYXJhbSB7XHJcbiAgcHVibGljIHN0YXRpYyBsYXNlcihwb3dlcjogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlcik6IEZpcmVQYXJhbSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgRmlyZVBhcmFtKCk7XHJcbiAgICByZXN1bHQucG93ZXIgPSBNYXRoLm1pbihNYXRoLm1heChwb3dlciB8fCA4LCAzKSwgOCk7XHJcbiAgICByZXN1bHQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG4gICAgcmVzdWx0LnNob3RUeXBlID0gJ0xhc2VyJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgbWlzc2lsZShib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xyXG4gICAgcmVzdWx0LmJvdCA9IGJvdDtcclxuICAgIHJlc3VsdC5zaG90VHlwZSA9ICdNaXNzaWxlJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgcHVibGljIHBvd2VyOiBudW1iZXI7XHJcbiAgcHVibGljIHNob3RUeXBlOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgeyBGeER1bXAgfSBmcm9tICcuL0R1bXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRngge1xyXG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgcHVibGljIHBvc2l0aW9uOiBWLCBwdWJsaWMgc3BlZWQ6IFYsIHB1YmxpYyBsZW5ndGg6IG51bWJlcikge1xyXG4gICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHRoaXMuZnJhbWUpIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVGeCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlKCkge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuc3BlZWQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogRnhEdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZjogdGhpcy5mcmFtZSxcclxuICAgICAgbDogTWF0aC5yb3VuZCh0aGlzLmxlbmd0aClcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFzZXIgZXh0ZW5kcyBTaG90IHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSA1O1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiA4O1xyXG4gIHByaXZhdGUgbW9tZW50dW06IG51bWJlcjtcclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXIsIHBvd2VyOiBudW1iZXIpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ0xhc2VyJyk7XHJcbiAgICB0aGlzLnNwZWVkID0gVi5kaXJlY3Rpb24oZGlyZWN0aW9uKS5tdWx0aXBseShwb3dlcik7XHJcbiAgICB0aGlzLm1vbWVudHVtID0gQ29uZmlncy5MQVNFUl9NT01FTlRVTTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBzdXBlci5hY3Rpb24oKTtcclxuICAgIHRoaXMubW9tZW50dW0gLT0gQ29uZmlncy5MQVNFUl9BVFRFTlVBVElPTjtcclxuICAgIGlmICh0aGlzLm1vbWVudHVtIDwgMCkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBGeCBmcm9tICcuL0Z4JztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IE1pc3NpbGVDb21tYW5kIGZyb20gJy4vTWlzc2lsZUNvbW1hbmQnO1xyXG5pbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgeyBEZWJ1Z0R1bXAsIFNob3REdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGUgZXh0ZW5kcyBTaG90IHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAxMDtcclxuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gMTAgKyB0aGlzLnNwZWVkLmxlbmd0aCgpICogMjtcclxuICBwdWJsaWMgZnVlbCA9IDEwMDtcclxuICBwdWJsaWMgYnJlYWthYmxlID0gdHJ1ZTtcclxuXHJcbiAgcHVibGljIGNvbW1hbmQ6IE1pc3NpbGVDb21tYW5kO1xyXG4gIHB1YmxpYyBjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcjtcclxuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wO1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQsIG93bmVyOiBTb3VyY2VyLCBwdWJsaWMgYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lciwgJ01pc3NpbGUnKTtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gb3duZXIuZGlyZWN0aW9uID09PSBDb25zdHMuRElSRUNUSU9OX1JJR0hUID8gMCA6IDE4MDtcclxuICAgIHRoaXMuc3BlZWQgPSBvd25lci5zcGVlZDtcclxuICAgIHRoaXMuY29tbWFuZCA9IG5ldyBNaXNzaWxlQ29tbWFuZCh0aGlzKTtcclxuICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1pc3NpbGVDb250cm9sbGVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKSB7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5mdWVsIDw9IDApIHtcclxuICAgICAgLy8gQ2FuY2VsIHRoaW5raW5nXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQuYWNjZXB0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5wcmVUaGluaygpO1xyXG4gICAgICB0aGlzLmRlYnVnRHVtcCA9IHsgbG9nczogW10sIGFyY3M6IFtdIH07XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5jb25uZWN0Q29uc29sZSh0aGlzLm93bmVyLnNjcmlwdExvYWRlci5nZXRFeHBvc2VkQ29uc29sZSgpKTtcclxuICAgICAgdGhpcy5ib3QodGhpcy5jb250cm9sbGVyKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gICAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2goeyBtZXNzYWdlOiBgTWlzc2lsZSBmdW5jdGlvbiBlcnJvcjogJHtlcnJvci5tZXNzYWdlfWAsIGNvbG9yOiAncmVkJyB9KTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC51bmFjY2VwdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uQWN0aW9uKCkge1xyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlncy5TUEVFRF9SRVNJU1RBTkNFKTtcclxuICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChhdHRhY2s6IFNob3QpIHtcclxuICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdCh0aGlzKTtcclxuICAgIHRoaXMuZmllbGQucmVtb3ZlU2hvdChhdHRhY2spO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9wcG9zaXRlKGRpcmVjdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiArIGRpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2goeyBtZXNzYWdlIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5EZWJ1ZyhkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpIHtcclxuICAgIHRoaXMuZGVidWdEdW1wLmFyY3MucHVzaCh7IGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKTogU2hvdER1bXAge1xyXG4gICAgY29uc3Qgc3VwZXJEdW1wID0gc3VwZXIuZHVtcCgpO1xyXG4gICAgaWYgKHRoaXMub3duZXIuc2NyaXB0TG9hZGVyLmlzRGVidWdnYWJsZSkge1xyXG4gICAgICBzdXBlckR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlckR1bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb21tYW5kIGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGVDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIHNwZWVkVXA6IG51bWJlcjtcclxuICBwdWJsaWMgc3BlZWREb3duOiBudW1iZXI7XHJcbiAgcHVibGljIHR1cm46IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNwZWVkVXAgPSAwO1xyXG4gICAgdGhpcy5zcGVlZERvd24gPSAwO1xyXG4gICAgdGhpcy50dXJuID0gMDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5tdWx0aXBseSgxIC0gdGhpcy5zcGVlZERvd24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyJztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc3BlZWRVcDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgc3BlZWREb3duOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyB0dXJuUmlnaHQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm5MZWZ0OiAoKSA9PiB2b2lkO1xyXG5cclxuICBwdWJsaWMgbG9nOiAoLi4ubWVzc2FnZXM6IGFueVtdKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzY2FuRGVidWc6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKG1pc3NpbGUpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xyXG5cclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IG1pc3NpbGUuZnVlbDtcclxuXHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XHJcbiAgICAgIGNvbnN0IG1pc3NpbGVEaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgbWlzc2lsZURpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkRG93biA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy50dXJuUmlnaHQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gLTk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gOTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBtaXNzaWxlLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiAoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUuc2NhbkRlYnVnKG1pc3NpbGUub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCB7IFNob3REdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hvdCBleHRlbmRzIEFjdG9yIHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiAwO1xyXG4gIHB1YmxpYyBicmVha2FibGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBwdWJsaWMgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lci5wb3NpdGlvbi54LCBvd25lci5wb3NpdGlvbi55KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9uQWN0aW9uKCk7XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xyXG4gICAgaWYgKGNvbGxpZGVkKSB7XHJcbiAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZ4cygpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHMucmFuZCgxNikgLSA4LCBVdGlscy5yYW5kKDE2KSAtIDgpO1xyXG4gICAgICBjb25zdCBzcGVlZCA9IG5ldyBWKFV0aWxzLnJhbmQoMSkgLSAwLjUsIFV0aWxzLnJhbmQoMSkgLSAwLjUpO1xyXG4gICAgICBjb25zdCBsZW5ndGggPSBVdGlscy5yYW5kKDgpICsgNDtcclxuICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgcG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLmFkZChzcGVlZCksIGxlbmd0aCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlYWN0aW9uKHNvdXJjZXI6IFNvdXJjZXIpIHtcclxuICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNob3REdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG86IHRoaXMub3duZXIuaWQsXHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXHJcbiAgICAgIHM6IHRoaXMudHlwZVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyQ29tbWFuZCBmcm9tICcuL1NvdXJjZXJDb21tYW5kJztcclxuaW1wb3J0IFNvdXJjZXJDb250cm9sbGVyIGZyb20gJy4vU291cmNlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IExhc2VyIGZyb20gJy4vTGFzZXInO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgeyBTb3VyY2VyRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xyXG5pbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuaW50ZXJmYWNlIEV4cG9ydFNjb3BlIHtcclxuICBtb2R1bGU6IHtcclxuICAgIGV4cG9ydHM6ICgoY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXIpID0+IHZvaWQpIHwgbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyIGV4dGVuZHMgQWN0b3Ige1xyXG4gIHB1YmxpYyBhbGl2ZSA9IHRydWU7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMDtcclxuICBwdWJsaWMgc2hpZWxkID0gQ29uZmlncy5JTklUSUFMX1NISUVMRDtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW8gPSBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PO1xyXG4gIHB1YmxpYyBmdWVsID0gQ29uZmlncy5JTklUSUFMX0ZVRUw7XHJcblxyXG4gIHB1YmxpYyBjb21tYW5kOiBTb3VyY2VyQ29tbWFuZDtcclxuICBwdWJsaWMgc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXI7XHJcbiAgcHJpdmF0ZSBjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcjtcclxuICBwcml2YXRlIGJvdDogKChjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcikgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wID0geyBsb2dzOiBbXSwgYXJjczogW10gfTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBmaWVsZDogRmllbGQsXHJcbiAgICB4OiBudW1iZXIsXHJcbiAgICB5OiBudW1iZXIsXHJcbiAgICBwdWJsaWMgYWlTb3VyY2U6IHN0cmluZyxcclxuICAgIHB1YmxpYyBhY2NvdW50OiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmdcclxuICApIHtcclxuICAgIHN1cGVyKGZpZWxkLCB4LCB5KTtcclxuXHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBDb25zdHMuRElSRUNUSU9OX1JJR0hUIDogQ29uc3RzLkRJUkVDVElPTl9MRUZUO1xyXG4gICAgdGhpcy5jb21tYW5kID0gbmV3IFNvdXJjZXJDb21tYW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFNvdXJjZXJDb250cm9sbGVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbXBpbGUoc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXIpIHtcclxuICAgIHRoaXMuc2NyaXB0TG9hZGVyID0gc2NyaXB0TG9hZGVyO1xyXG4gICAgdGhpcy5ib3QgPSBzY3JpcHRMb2FkZXIubG9hZCh0aGlzLmFpU291cmNlKTtcclxuICAgIGlmICghdGhpcy5ib3QpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnRnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJldHVybmVkLicgfTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdGhpcy5ib3QgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhyb3cgeyBtZXNzYWdlOiAnUmV0dXJuZWQgaXMgbm90IGEgRnVuY3Rpb24uJyB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKSB7XHJcbiAgICBpZiAodGhpcy5ib3QgPT09IG51bGwgfHwgIXRoaXMuYWxpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5hY2NlcHQoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnByZVRoaW5rKCk7XHJcbiAgICAgIHRoaXMuZGVidWdEdW1wID0geyBsb2dzOiBbXSwgYXJjczogW10gfTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmNvbm5lY3RDb25zb2xlKHRoaXMuc2NyaXB0TG9hZGVyLmdldEV4cG9zZWRDb25zb2xlKCkpO1xyXG4gICAgICB0aGlzLmJvdCh0aGlzLmNvbnRyb2xsZXIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZTogYFNvdXJjZXIgZnVuY3Rpb24gZXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gLCBjb2xvcjogJ3JlZCcgfSk7XHJcbiAgICAgIHRoaXMuY29tbWFuZC5yZXNldCgpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5jb21tYW5kLnVuYWNjZXB0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLmFsaXZlICYmIFV0aWxzLnJhbmQoOCkgPCAxKSB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHMucmFuZCgxNikgLSA4LCBVdGlscy5yYW5kKDE2KSAtIDgpO1xyXG4gICAgICBjb25zdCBzcGVlZCA9IG5ldyBWKFV0aWxzLnJhbmQoMSkgLSAwLjUsIFV0aWxzLnJhbmQoMSkgKyAwLjUpO1xyXG4gICAgICBjb25zdCBsZW5ndGggPSBVdGlscy5yYW5kKDgpICsgNDtcclxuICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgcG9zaXRpb24sIHNwZWVkLCBsZW5ndGgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhaXIgcmVzaXN0YW5jZVxyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQubXVsdGlwbHkoQ29uZmlncy5TUEVFRF9SRVNJU1RBTkNFKTtcclxuXHJcbiAgICAvLyBncmF2aXR5XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzLkdSQVZJVFkpO1xyXG5cclxuICAgIC8vIGNvbnRyb2wgYWx0aXR1ZGUgYnkgdGhlIGludmlzaWJsZSBoYW5kXHJcbiAgICBpZiAoQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQgPCB0aGlzLnBvc2l0aW9uLnkpIHtcclxuICAgICAgY29uc3QgaW52aXNpYmxlUG93ZXIgPSAodGhpcy5wb3NpdGlvbi55IC0gQ29uZmlncy5UT1BfSU5WSVNJQkxFX0hBTkQpICogMC4xO1xyXG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5zdWJ0cmFjdCgwLCBDb25maWdzLkdSQVZJVFkgKiBpbnZpc2libGVQb3dlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29udHJvbCBkaXN0YW5jZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcclxuICAgIGNvbnN0IGRpZmYgPSB0aGlzLmZpZWxkLmNlbnRlciAtIHRoaXMucG9zaXRpb24ueDtcclxuICAgIGlmIChDb25maWdzLkRJU1RBTkNFX0JPUkRBUiA8IE1hdGguYWJzKGRpZmYpKSB7XHJcbiAgICAgIGNvbnN0IG4gPSBkaWZmIDwgMCA/IC0xIDogMTtcclxuICAgICAgY29uc3QgaW52aXNpYmxlSGFuZCA9IChNYXRoLmFicyhkaWZmKSAtIENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSKSAqIENvbmZpZ3MuRElTVEFOQ0VfSU5WSVNJQkxFX0hBTkQgKiBuO1xyXG4gICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYodGhpcy5wb3NpdGlvbi54ICsgaW52aXNpYmxlSGFuZCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBnbyBpbnRvIHRoZSBncm91bmRcclxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgIHRoaXMuc2hpZWxkIC09IC10aGlzLnNwZWVkLnkgKiBDb25maWdzLkdST1VORF9EQU1BR0VfU0NBTEU7XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLngsIDApO1xyXG4gICAgICB0aGlzLnNwZWVkID0gbmV3IFYodGhpcy5zcGVlZC54LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlIC09IENvbmZpZ3MuQ09PTF9ET1dOO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IE1hdGgubWF4KHRoaXMudGVtcGVyYXR1cmUsIDApO1xyXG5cclxuICAgIC8vIG92ZXJoZWF0XHJcbiAgICBjb25zdCBvdmVyaGVhdCA9IHRoaXMudGVtcGVyYXR1cmUgLSBDb25maWdzLk9WRVJIRUFUX0JPUkRFUjtcclxuICAgIGlmICgwIDwgb3ZlcmhlYXQpIHtcclxuICAgICAgY29uc3QgbGluZWFyRGFtYWdlID0gb3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9MSU5FQVJfV0VJR0hUO1xyXG4gICAgICBjb25zdCBwb3dlckRhbWFnZSA9IE1hdGgucG93KG92ZXJoZWF0ICogQ29uZmlncy5PVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hULCAyKTtcclxuICAgICAgdGhpcy5zaGllbGQgLT0gbGluZWFyRGFtYWdlICsgcG93ZXJEYW1hZ2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNoaWVsZCA9IE1hdGgubWF4KDAsIHRoaXMuc2hpZWxkKTtcclxuXHJcbiAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmlyZShwYXJhbTogRmlyZVBhcmFtKSB7XHJcbiAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdMYXNlcicpIHtcclxuICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5vcHBvc2l0ZShwYXJhbS5kaXJlY3Rpb24pO1xyXG4gICAgICBjb25zdCBzaG90ID0gbmV3IExhc2VyKHRoaXMuZmllbGQsIHRoaXMsIGRpcmVjdGlvbiwgcGFyYW0ucG93ZXIpO1xyXG4gICAgICBzaG90LnJlYWN0aW9uKHRoaXMpO1xyXG4gICAgICB0aGlzLmZpZWxkLmFkZFNob3Qoc2hvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBhcmFtLnNob3RUeXBlID09PSAnTWlzc2lsZScpIHtcclxuICAgICAgaWYgKDAgPCB0aGlzLm1pc3NpbGVBbW1vKSB7XHJcbiAgICAgICAgY29uc3QgbWlzc2lsZSA9IG5ldyBNaXNzaWxlKHRoaXMuZmllbGQsIHRoaXMsIHBhcmFtLmJvdCk7XHJcbiAgICAgICAgbWlzc2lsZS5yZWFjdGlvbih0aGlzKTtcclxuICAgICAgICB0aGlzLm1pc3NpbGVBbW1vLS07XHJcbiAgICAgICAgdGhpcy5maWVsZC5hZGRTaG90KG1pc3NpbGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb3Bwb3NpdGUoZGlyZWN0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBDb25zdHMuRElSRUNUSU9OX0xFRlQpIHtcclxuICAgICAgcmV0dXJuIFV0aWxzLnRvT3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoc2hvdDogU2hvdCkge1xyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMuc3BlZWQuYWRkKHNob3Quc3BlZWQubXVsdGlwbHkoQ29uZmlncy5PTl9ISVRfU1BFRURfR0lWRU5fUkFURSkpO1xyXG4gICAgdGhpcy5zaGllbGQgLT0gc2hvdC5kYW1hZ2UoKTtcclxuICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xyXG4gICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHNob3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZGVidWdEdW1wLmxvZ3MucHVzaCh7IG1lc3NhZ2UgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkRlYnVnKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAuYXJjcy5wdXNoKHsgZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpOiBTb3VyY2VyRHVtcCB7XHJcbiAgICBjb25zdCBkdW1wOiBTb3VyY2VyRHVtcCA9IHtcclxuICAgICAgaTogdGhpcy5pZCxcclxuICAgICAgcDogdGhpcy5wb3NpdGlvbi5taW5pbWl6ZSgpLFxyXG4gICAgICBkOiB0aGlzLmRpcmVjdGlvbixcclxuICAgICAgaDogTWF0aC5jZWlsKHRoaXMuc2hpZWxkKSxcclxuICAgICAgdDogTWF0aC5jZWlsKHRoaXMudGVtcGVyYXR1cmUpLFxyXG4gICAgICBhOiB0aGlzLm1pc3NpbGVBbW1vLFxyXG4gICAgICBmOiBNYXRoLmNlaWwodGhpcy5mdWVsKVxyXG4gICAgfTtcclxuICAgIGlmICh0aGlzLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUpIHtcclxuICAgICAgZHVtcC5kZWJ1ZyA9IHRoaXMuZGVidWdEdW1wO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGR1bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb21tYW5kIGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBGaXJlUGFyYW0gZnJvbSAnLi9GaXJlUGFyYW0nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlckNvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICBwdWJsaWMgYWhlYWQ6IG51bWJlcjtcclxuICBwdWJsaWMgYXNjZW50OiBudW1iZXI7XHJcbiAgcHVibGljIHR1cm46IGJvb2xlYW47XHJcbiAgcHVibGljIGZpcmU6IEZpcmVQYXJhbSB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2V0KCkge1xyXG4gICAgdGhpcy5haGVhZCA9IDA7XHJcbiAgICB0aGlzLmFzY2VudCA9IDA7XHJcbiAgICB0aGlzLnR1cm4gPSBmYWxzZTtcclxuICAgIHRoaXMuZmlyZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXhlY3V0ZSgpIHtcclxuICAgIGlmICh0aGlzLmZpcmUpIHtcclxuICAgICAgdGhpcy5zb3VyY2VyLmZpcmUodGhpcy5maXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy50dXJuKSB7XHJcbiAgICAgIHRoaXMuc291cmNlci5kaXJlY3Rpb24gKj0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKDAgPCB0aGlzLnNvdXJjZXIuZnVlbCkge1xyXG4gICAgICB0aGlzLnNvdXJjZXIuc3BlZWQgPSB0aGlzLnNvdXJjZXIuc3BlZWQuYWRkKHRoaXMuYWhlYWQgKiB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uLCB0aGlzLmFzY2VudCk7XHJcbiAgICAgIHRoaXMuc291cmNlci5mdWVsIC09IChNYXRoLmFicyh0aGlzLmFoZWFkKSArIE1hdGguYWJzKHRoaXMuYXNjZW50KSkgKiBDb25maWdzLkZVRUxfQ09TVDtcclxuICAgICAgdGhpcy5zb3VyY2VyLmZ1ZWwgPSBNYXRoLm1heCgwLCB0aGlzLnNvdXJjZXIuZnVlbCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcic7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuaW1wb3J0IE1pc3NpbGVDb250cm9sbGVyIGZyb20gJy4vTWlzc2lsZUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgcHVibGljIHNoaWVsZDogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyB0ZW1wZXJhdHVyZTogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyBtaXNzaWxlQW1tbzogKCkgPT4gbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgc2NhbkVuZW15OiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiBib29sZWFuO1xyXG4gIHB1YmxpYyBzY2FuQXR0YWNrOiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiBib29sZWFuO1xyXG5cclxuICBwdWJsaWMgYWhlYWQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGFzY2VudDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgZGVzY2VudDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgdHVybjogKCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIGZpcmVMYXNlcjogKGRpcmVjdGlvbjogbnVtYmVyLCBwb3dlcjogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBmaXJlTWlzc2lsZTogKGJvdDogKGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyKSA9PiB2b2lkKSA9PiB2b2lkO1xyXG5cclxuICBwdWJsaWMgbG9nOiAoLi4ubWVzc2FnZXM6IGFueVtdKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzY2FuRGVidWc6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNvdXJjZXI6IFNvdXJjZXIpIHtcclxuICAgIHN1cGVyKHNvdXJjZXIpO1xyXG5cclxuICAgIHRoaXMuc2hpZWxkID0gKCkgPT4gc291cmNlci5zaGllbGQ7XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gKCkgPT4gc291cmNlci50ZW1wZXJhdHVyZTtcclxuICAgIHRoaXMubWlzc2lsZUFtbW8gPSAoKSA9PiBzb3VyY2VyLm1pc3NpbGVBbW1vO1xyXG4gICAgdGhpcy5mdWVsID0gKCkgPT4gc291cmNlci5mdWVsO1xyXG5cclxuICAgIGNvbnN0IGZpZWxkID0gc291cmNlci5maWVsZDtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBzb3VyY2VyLmNvbW1hbmQ7XHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzLlNDQU5fV0FJVDtcclxuICAgICAgY29uc3Qgb3Bwb3NpdGVkRGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xyXG4gICAgICBjb25zdCBub3JtYWxpemVkUmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICBjb25zdCByYWRhciA9IFV0aWxzLmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIG9wcG9zaXRlZERpcmVjdGlvbiwgYW5nbGUsIG5vcm1hbGl6ZWRSZW5nZSk7XHJcbiAgICAgIHJldHVybiBmaWVsZC5zY2FuRW5lbXkoc291cmNlciwgcmFkYXIpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuc2NhbkF0dGFjayA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIud2FpdCArPSBDb25maWdzLlNDQU5fV0FJVDtcclxuICAgICAgY29uc3Qgb3Bwb3NpdGVkRGlyZWN0aW9uID0gc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pO1xyXG4gICAgICBjb25zdCBub3JtYWxpemVkUmVuZ2UgPSByZW5nZSB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICBjb25zdCByYWRhciA9IFV0aWxzLmNyZWF0ZVJhZGFyKHNvdXJjZXIucG9zaXRpb24sIG9wcG9zaXRlZERpcmVjdGlvbiwgYW5nbGUsIG5vcm1hbGl6ZWRSZW5nZSk7XHJcbiAgICAgIHJldHVybiBmaWVsZC5zY2FuQXR0YWNrKHNvdXJjZXIsIHJhZGFyKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmFoZWFkID0gKCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuYWhlYWQgPSAwLjg7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5iYWNrID0gKCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuYWhlYWQgPSAtMC40O1xyXG4gICAgfTtcclxuICAgIHRoaXMuYXNjZW50ID0gKCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuYXNjZW50ID0gMC45O1xyXG4gICAgfTtcclxuICAgIHRoaXMuZGVzY2VudCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFzY2VudCA9IC0wLjk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy50dXJuID0gKCkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQudHVybiA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZmlyZUxhc2VyID0gKGRpcmVjdGlvbiwgcG93ZXIpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmZpcmUgPSBGaXJlUGFyYW0ubGFzZXIocG93ZXIsIGRpcmVjdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZmlyZU1pc3NpbGUgPSBib3QgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIGNvbW1hbmQuZmlyZSA9IEZpcmVQYXJhbS5taXNzaWxlKGJvdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGlzU3RyaW5nID0gKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzdHJpbmcgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbiAgICB0aGlzLmxvZyA9ICguLi5tZXNzYWdlOiBhbnlbXSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIubG9nKG1lc3NhZ2UubWFwKHZhbHVlID0+IChpc1N0cmluZyh2YWx1ZSkgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSkpLmpvaW4oJywgJykpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuc2NhbkRlYnVnID0gKGRpcmVjdGlvbiwgYW5nbGUsIHJlbmdlKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgc291cmNlci5zY2FuRGVidWcoc291cmNlci5vcHBvc2l0ZShkaXJlY3Rpb24pLCBhbmdsZSwgcmVuZ2UpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb25uZWN0Q29uc29sZShjb25zb2xlOiBDb25zb2xlTGlrZSB8IG51bGwpIHtcclxuICAgIGlmIChjb25zb2xlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nID0gdGhpcy5sb2cuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcblxyXG5jb25zdCBFUFNJTE9OID0gMTBlLTEyO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xyXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlUmFkYXIoYzogViwgZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlOiBudW1iZXIpOiAodDogVikgPT4gYm9vbGVhbiB7XHJcbiAgICBjb25zdCBjaGVja0Rpc3RhbmNlID0gKHQ6IFYpID0+IGMuZGlzdGFuY2UodCkgPD0gcmVuZ2U7XHJcblxyXG4gICAgaWYgKDM2MCA8PSBhbmdsZSkge1xyXG4gICAgICByZXR1cm4gY2hlY2tEaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGVja0xlZnQgPSBVdGlscy5zaWRlKGMsIGRpcmVjdGlvbiArIGFuZ2xlIC8gMik7XHJcbiAgICBjb25zdCBjaGVja1JpZ2h0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyAxODAgLSBhbmdsZSAvIDIpO1xyXG5cclxuICAgIGlmIChhbmdsZSA8IDE4MCkge1xyXG4gICAgICByZXR1cm4gdCA9PiBjaGVja0xlZnQodCkgJiYgY2hlY2tSaWdodCh0KSAmJiBjaGVja0Rpc3RhbmNlKHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQgPT4gKGNoZWNrTGVmdCh0KSB8fCBjaGVja1JpZ2h0KHQpKSAmJiBjaGVja0Rpc3RhbmNlKHQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBzaWRlKGJhc2U6IFYsIGRlZ3JlZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcmFkaWFuID0gVXRpbHMudG9SYWRpYW4oZGVncmVlKTtcclxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IG5ldyBWKE1hdGguY29zKHJhZGlhbiksIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgY29uc3QgcHJldmlvdXNseSA9IGJhc2UueCAqIGRpcmVjdGlvbi55IC0gYmFzZS55ICogZGlyZWN0aW9uLnggLSBFUFNJTE9OO1xyXG4gICAgcmV0dXJuICh0YXJnZXQ6IFYpID0+IHtcclxuICAgICAgcmV0dXJuIDAgPD0gdGFyZ2V0LnggKiBkaXJlY3Rpb24ueSAtIHRhcmdldC55ICogZGlyZWN0aW9uLnggLSBwcmV2aW91c2x5O1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY2FsY0Rpc3RhbmNlKGY6IFYsIHQ6IFYsIHA6IFYpOiBudW1iZXIge1xyXG4gICAgY29uc3QgdG9Gcm9tID0gdC5zdWJ0cmFjdChmKTtcclxuICAgIGNvbnN0IHBGcm9tID0gcC5zdWJ0cmFjdChmKTtcclxuICAgIGlmICh0b0Zyb20uZG90KHBGcm9tKSA8IEVQU0lMT04pIHtcclxuICAgICAgcmV0dXJuIHBGcm9tLmxlbmd0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZyb21UbyA9IGYuc3VidHJhY3QodCk7XHJcbiAgICBjb25zdCBwVG8gPSBwLnN1YnRyYWN0KHQpO1xyXG4gICAgaWYgKGZyb21Uby5kb3QocFRvKSA8IEVQU0lMT04pIHtcclxuICAgICAgcmV0dXJuIHBUby5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTWF0aC5hYnModG9Gcm9tLmNyb3NzKHBGcm9tKSAvIHRvRnJvbS5sZW5ndGgoKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHRvUmFkaWFuKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHRvT3Bwb3NpdGUoZGVncmVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IFV0aWxzLm5vcm1hbGl6ZURlZ3JlZShkZWdyZWUpO1xyXG4gICAgaWYgKG5vcm1hbGl6ZWQgPD0gMTgwKSB7XHJcbiAgICAgIHJldHVybiAoOTAgLSBub3JtYWxpemVkKSAqIDIgKyBub3JtYWxpemVkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgyNzAgLSBub3JtYWxpemVkKSAqIDIgKyBub3JtYWxpemVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgbm9ybWFsaXplRGVncmVlKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCByZW1haW5kZXIgPSBkZWdyZWUgJSAzNjA7XHJcbiAgICByZXR1cm4gcmVtYWluZGVyIDwgMCA/IHJlbWFpbmRlciArIDM2MCA6IHJlbWFpbmRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcmFuZChyZW5nZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogcmVuZ2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFYge1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlZExlbmd0aDogbnVtYmVyO1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlZEFuZ2xlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHt9XHJcblxyXG4gIHB1YmxpYyBhZGQodjogVik6IFY7XHJcbiAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFY7XHJcbiAgcHVibGljIGFkZCh2OiBhbnksIHk/OiBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgKHYueCB8fCAwKSwgdGhpcy55ICsgKHYueSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICsgKHYgfHwgMCksIHRoaXMueSArICh5IHx8IDApKTtcclxuICB9XHJcbiAgcHVibGljIHN1YnRyYWN0KHY6IFYpOiBWO1xyXG4gIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFY7XHJcbiAgcHVibGljIHN1YnRyYWN0KHY6IGFueSwgeT86IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLSAodi54IHx8IDApLCB0aGlzLnkgLSAodi55IHx8IDApKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgVih0aGlzLnggLSAodiB8fCAwKSwgdGhpcy55IC0gKHkgfHwgMCkpO1xyXG4gIH1cclxuICBwdWJsaWMgbXVsdGlwbHkodjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdiwgdGhpcy55ICogdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBkaXZpZGUodjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdiwgdGhpcy55IC8gdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBtb2R1bG8odjogViB8IG51bWJlcik6IFYge1xyXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBWKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVih0aGlzLnggJSB2LngsIHRoaXMueSAlIHYueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdiwgdGhpcy55ICUgdik7XHJcbiAgfVxyXG4gIHB1YmxpYyBuZWdhdGUoKTogViB7XHJcbiAgICByZXR1cm4gbmV3IFYoLXRoaXMueCwgLXRoaXMueSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBkaXN0YW5jZSh2OiBWKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHYpLmxlbmd0aCgpO1xyXG4gIH1cclxuICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZW5ndGg7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGN1bGF0ZWRMZW5ndGggPSBNYXRoLnNxcnQodGhpcy5kb3QoKSk7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xyXG4gIH1cclxuICBwdWJsaWMgbm9ybWFsaXplKCk6IFYge1xyXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICBjb25zdCBzY2FsZSA9IGN1cnJlbnQgIT09IDAgPyAxIC8gY3VycmVudCA6IDA7XHJcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseShzY2FsZSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBhbmdsZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoKSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgfVxyXG4gIHB1YmxpYyBhbmdsZUluUmFkaWFucygpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZEFuZ2xlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcclxuICAgIH1cclxuICAgIHRoaXMuY2FsY3VsYXRlZEFuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCB0aGlzLngpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZEFuZ2xlO1xyXG4gIH1cclxuICBwdWJsaWMgZG90KHBvaW50OiBWID0gdGhpcyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueCArIHRoaXMueSAqIHBvaW50Lnk7XHJcbiAgfVxyXG4gIHB1YmxpYyBjcm9zcyhwb2ludDogVik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy54ICogcG9pbnQueSAtIHRoaXMueSAqIHBvaW50Lng7XHJcbiAgfVxyXG4gIHB1YmxpYyByb3RhdGUoZGVncmVlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHJhZGlhbiA9IGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgcmV0dXJuIG5ldyBWKGNvcyAqIHRoaXMueCAtIHNpbiAqIHRoaXMueSwgY29zICogdGhpcy55ICsgc2luICogdGhpcy54KTtcclxuICB9XHJcbiAgcHVibGljIHN0YXRpYyBkaXJlY3Rpb24oZGVncmVlOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgVigxLCAwKS5yb3RhdGUoZGVncmVlKTtcclxuICB9XHJcbiAgcHVibGljIG1pbmltaXplKCkge1xyXG4gICAgcmV0dXJuIHsgeDogTWF0aC5yb3VuZCh0aGlzLngpLCB5OiBNYXRoLnJvdW5kKHRoaXMueSkgfSBhcyBWO1xyXG4gIH1cclxufVxyXG4iXX0=
