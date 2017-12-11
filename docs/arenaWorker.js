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
        if (this.owner.scriptLoader.isDebuggable()) {
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
        if (this.scriptLoader.isDebuggable()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBK0lBOztBQS9JQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBNEQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBaUMsRUFBRSxDQUFDO0FBRW5ELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDM0IsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRCxJQUFNLGdCQUFnQixHQUFHLElBQXdCLENBQUM7SUFDbEQsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBaUIsQ0FBQztJQUNsRCxJQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUF1QixDQUFDO0lBQ3pELElBQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDL0IsSUFBTSxRQUFRLEdBQXNCO1FBQ2xDLFlBQVksRUFBRTs7Z0JBQ1osc0JBQU8sSUFBSSxPQUFPLENBQU8sVUFBQSxPQUFPO3dCQUM5QixJQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQzt3QkFDekIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQzt3QkFDOUIsV0FBVyxDQUFDOzRCQUNWLFFBQVEsVUFBQTs0QkFDUixPQUFPLEVBQUUsTUFBTTt5QkFDaEIsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxFQUFDOzthQUNKO1FBQ0QsVUFBVSxFQUFFLFVBQUMsU0FBaUI7WUFDNUIsV0FBVyxDQUFDO2dCQUNWLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixFQUFFLEVBQUUsU0FBUzthQUNkLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxXQUFXLEVBQUUsVUFBQyxTQUFpQjtZQUM3QixXQUFXLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLEVBQUUsRUFBRSxTQUFTO2dCQUNiLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTTthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsU0FBb0I7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsVUFBVSxFQUFFLFVBQUMsTUFBa0I7WUFDN0IsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsVUFBVTthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsV0FBVzthQUNyQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsS0FBYTtZQUNyQixXQUFXLENBQUM7Z0JBQ1YsS0FBSyxPQUFBO2dCQUNMLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRixDQUFDO0lBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsNkJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsV0FBVyxDQUFDO1FBQ1YsT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7S0FDekIsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDOzs7O3dCQUNULHFCQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUE3QixTQUE2QixDQUFDO29CQUNyQixLQUFLLEdBQUcsQ0FBQzs7O3lCQUFFLENBQUEsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7b0JBQ3BELHFCQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUExQixTQUEwQixDQUFDOzs7b0JBRDJCLEtBQUssRUFBRSxDQUFBOzs7OztTQUdoRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQyxDQUFDOzs7O0FDNUlGLHlCQUFvQjtBQUNwQixxQ0FBZ0M7QUFHaEM7SUFRRSxlQUFtQixLQUFZLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFBbEMsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUh4QixTQUFJLEdBQUcsaUJBQU8sQ0FBQyxjQUFjLENBQUM7UUFDOUIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUdkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLHFCQUFLLEdBQVo7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSxzQkFBc0I7SUFDeEIsQ0FBQztJQUVNLHNCQUFNLEdBQWI7UUFDRSxhQUFhO0lBQ2YsQ0FBQztJQUVNLG9CQUFJLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0scUJBQUssR0FBWixVQUFhLElBQVU7UUFDckIsYUFBYTtJQUNmLENBQUM7SUFFTSxvQkFBSSxHQUFYO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0ExQ0EsQUEwQ0MsSUFBQTs7Ozs7QUNoREQ7SUFBQTtRQUNVLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFZN0IsQ0FBQztJQVhRLDBCQUFRLEdBQWY7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0gsQ0FBQztJQUNNLHdCQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBQ00sMEJBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7Ozs7O0FDYkQ7SUFBQTtJQW9CQSxDQUFDO0lBbkJlLHNCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLG9CQUFZLEdBQUcsR0FBRyxDQUFDO0lBQ25CLDRCQUFvQixHQUFHLEVBQUUsQ0FBQztJQUMxQix5QkFBaUIsR0FBRyxDQUFDLENBQUM7SUFDdEIsc0JBQWMsR0FBRyxHQUFHLENBQUM7SUFDckIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsc0JBQWMsR0FBRyxDQUFDLENBQUM7SUFDbkIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsd0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLGVBQU8sR0FBRyxHQUFHLENBQUM7SUFDZCwwQkFBa0IsR0FBRyxHQUFHLENBQUM7SUFDekIsdUJBQWUsR0FBRyxHQUFHLENBQUM7SUFDdEIsK0JBQXVCLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLHVCQUFlLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLHFDQUE2QixHQUFHLElBQUksQ0FBQztJQUNyQyxvQ0FBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsMkJBQW1CLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLGlCQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLCtCQUF1QixHQUFHLEdBQUcsQ0FBQztJQUM5QyxjQUFDO0NBcEJELEFBb0JDLElBQUE7a0JBcEJvQixPQUFPOzs7O0FDQTVCO0lBQUE7SUFLQSxDQUFDO0lBSmUsc0JBQWUsR0FBRyxDQUFDLENBQUM7SUFDcEIscUJBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixrQkFBVyxHQUFHLFlBQVksQ0FBQztJQUMzQixvQkFBYSxHQUFHLGNBQWMsQ0FBQztJQUMvQyxhQUFDO0NBTEQsQUFLQyxJQUFBO2tCQUxvQixNQUFNOzs7O0FDRzNCO0lBV0Usb0JBQVksS0FBWTtRQUF4QixpQkFRQztRQWJPLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGFBQVEsR0FBRztZQUNoQixLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxDQUFDO1FBR0EsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksRUFBakIsQ0FBaUIsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQU0sT0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQUMsS0FBYTtZQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTs7Ozs7QUNyQkQsbUJBQW1CLFdBQWdCLEVBQUUsSUFBYztJQUNqRDtRQUNFLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ3RDLE1BQU0sQ0FBQyxJQUFLLEdBQVcsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFRDtJQU1FO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLEdBQUcsRUFBRTtnQkFBQyxpQkFBVTtxQkFBVixVQUFVLEVBQVYscUJBQVUsRUFBVixJQUFVO29CQUFWLDRCQUFVOztnQkFDZCxlQUFlO1lBQ2pCLENBQUM7U0FDRixDQUFDO1FBQ0YsSUFBTSxTQUFTLEdBQUc7WUFDaEIsTUFBTSxRQUFBO1lBQ04sTUFBTSxRQUFBO1lBQ04sTUFBTSxRQUFBO1lBQ04sT0FBTyxTQUFBO1lBQ1AsS0FBSyxPQUFBO1lBQ0wsSUFBSSxNQUFBO1lBQ0osSUFBSSxNQUFBO1lBQ0osTUFBTSxRQUFBO1lBQ04sSUFBSSxNQUFBO1lBQ0osR0FBRyxLQUFBO1lBQ0gsUUFBUSxVQUFBO1lBQ1IsU0FBUyxXQUFBO1lBQ1QsUUFBUSxVQUFBO1lBQ1IsVUFBVSxZQUFBO1lBQ1YsS0FBSyxPQUFBO1lBQ0wsUUFBUSxVQUFBO1lBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFFRixvRUFBb0U7UUFDcEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTFDLGlDQUFpQztRQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDRCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQyxTQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVNLDBDQUFZLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwrQ0FBaUIsR0FBeEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sa0NBQUksR0FBWCxVQUFZLE1BQWM7UUFDeEIsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBQzVCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDSCwwQkFBQztBQUFELENBNURBLEFBNERDLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RUQseUJBQW9CO0FBRXBCLHFDQUFnQztBQUloQyxpQ0FBNEI7QUFLNUIsSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUM7QUFFOUI7SUFZRSxlQUFvQix1QkFBZ0QsRUFBUyxNQUF1QjtRQUF2Qix1QkFBQSxFQUFBLGNBQXVCO1FBQWhGLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQVg1RixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBT2YsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUUzQixlQUFVLEdBQU0sSUFBSSxXQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBR3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLCtCQUFlLEdBQXRCLFVBQXVCLE1BQWMsRUFBRSxPQUFlLEVBQUUsSUFBWSxFQUFFLEtBQWE7UUFDakYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFNLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDdEMsSUFBTSxDQUFDLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRVksdUJBQU8sR0FBcEIsVUFBcUIsUUFBMkIsRUFBRSxLQUFpQzs7Ozs7OzhCQUM5QyxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVE7Ozs2QkFBYixDQUFBLGNBQWEsQ0FBQTt3QkFBeEIsT0FBTzt3QkFDaEIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2hDLHFCQUFNLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBQTs7d0JBQTdCLFNBQTZCLENBQUM7d0JBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDZixRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDakMscUJBQU0sUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFBOzt3QkFBN0IsU0FBNkIsQ0FBQzs7O3dCQUxWLElBQWEsQ0FBQTs7Ozs7O0tBT3BDO0lBRVksdUJBQU8sR0FBcEIsVUFBcUIsUUFBMkI7Ozs7Z0JBQzlDLHNCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQUMsT0FBZ0I7d0JBQzdDLElBQUksQ0FBQzs0QkFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQzt3QkFDdEQsQ0FBQzt3QkFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNmLFFBQVEsQ0FBQyxPQUFPLENBQUMsMENBQW1DLEtBQUssQ0FBQyxPQUFTLENBQUMsQ0FBQzt3QkFDdkUsQ0FBQztvQkFDSCxDQUFDLENBQUMsRUFBQzs7O0tBQ0o7SUFFTSwwQkFBVSxHQUFqQixVQUFrQixPQUFnQjtRQUNoQyxPQUFPLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sdUJBQU8sR0FBZCxVQUFlLElBQVU7UUFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLDBCQUFVLEdBQWpCLFVBQWtCLE1BQVk7UUFDNUIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztJQUNILENBQUM7SUFFTSxxQkFBSyxHQUFaLFVBQWEsRUFBTTtRQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU0sd0JBQVEsR0FBZixVQUFnQixNQUFVO1FBQ3hCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDO0lBRVksb0JBQUksR0FBakIsVUFBa0IsUUFBMkI7Ozs7Ozt3QkFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyQixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0JBQW9CO3dCQUNyRCxDQUFDO3dCQUVELG9DQUFvQzt3QkFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBRW5DLGNBQWM7d0JBQ2QscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxPQUFnQjtnQ0FDNUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2dDQUNoQixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxFQUFFLEVBQTVCLENBQTRCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7NEJBQ3hGLENBQUMsQ0FBQyxFQUFBOzt3QkFKRixjQUFjO3dCQUNkLFNBR0UsQ0FBQzt3QkFFSCxlQUFlO3dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7d0JBRTFDLGFBQWE7d0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7d0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFaLENBQVksQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQzt3QkFFeEMsY0FBYzt3QkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUU5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBRWIsVUFBVTt3QkFDVixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDOzs7OztLQUMvQjtJQUVPLDJCQUFXLEdBQW5CLFVBQW9CLFFBQTJCO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHO29CQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsTUFBTSxFQUFFLElBQUk7b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQztnQkFDRixRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDM0IsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNILElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssRUFBYixDQUFhLENBQUMsQ0FBQztRQUVqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRztnQkFDWixRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLEtBQUs7YUFDZCxDQUFDO1lBQ0YsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELHdCQUF3QjtRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUM7UUFDRixRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU8sOEJBQWMsR0FBdEIsVUFBdUIsUUFBMkI7UUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLHlDQUF5QztZQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUM7SUFFTSx5QkFBUyxHQUFoQixVQUFpQixLQUFjLEVBQUUsS0FBd0I7UUFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSwwQkFBVSxHQUFqQixVQUFrQixLQUFjLEVBQUUsS0FBd0I7UUFBMUQsaUJBSUM7UUFIQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLDBCQUFVLEdBQWxCLFVBQW1CLEtBQWMsRUFBRSxJQUFVO1FBQzNDLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxJQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzRSxNQUFNLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0lBRU0sOEJBQWMsR0FBckIsVUFBc0IsSUFBVTtRQUM5QixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUs7WUFDeEMsTUFBTSxDQUFDLENBQ0wsS0FBSyxDQUFDLFNBQVM7Z0JBQ2YsS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSztnQkFDMUIsZUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ2xFLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBRUQsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQ2hELE1BQU0sQ0FBQyxDQUNMLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksZUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ2pILENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSx3Q0FBd0IsR0FBL0IsVUFBZ0MsSUFBVTtRQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTyw2QkFBYSxHQUFyQjtRQUNFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBZ0I7WUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxFQUFFLENBQUM7WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRU0sdUJBQU8sR0FBZDtRQUNFLElBQU0sT0FBTyxHQUFnQixFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUc7Z0JBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPO2dCQUNyQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87Z0JBQ3hCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSzthQUNyQixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxvQkFBSSxHQUFaO1FBQ0UsSUFBTSxZQUFZLEdBQWtCLEVBQUUsQ0FBQztRQUN2QyxJQUFNLFNBQVMsR0FBZSxFQUFFLENBQUM7UUFDakMsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztZQUN6QixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFPLElBQW1CLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQXBCLENBQW9CLENBQUM7UUFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQztZQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSztZQUNiLENBQUMsRUFBRSxZQUFZO1lBQ2YsQ0FBQyxFQUFFLFNBQVM7WUFDWixDQUFDLEVBQUUsTUFBTTtTQUNWLENBQUM7SUFDSixDQUFDO0lBQ0gsWUFBQztBQUFELENBM1JBLEFBMlJDLElBQUE7Ozs7O0FDdFNEO0lBQUE7SUFrQkEsQ0FBQztJQWpCZSxlQUFLLEdBQW5CLFVBQW9CLEtBQWEsRUFBRSxTQUFpQjtRQUNsRCxJQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ2EsaUJBQU8sR0FBckIsVUFBc0IsR0FBNEM7UUFDaEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNqQixNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFLSCxnQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7Ozs7O0FDaEJEO0lBSUUsWUFBbUIsS0FBWSxFQUFTLFFBQVcsRUFBUyxLQUFRLEVBQVMsTUFBYztRQUF4RSxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBRztRQUFTLFVBQUssR0FBTCxLQUFLLENBQUc7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3pGLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxtQkFBTSxHQUFiO1FBQ0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVNLGlCQUFJLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0saUJBQUksR0FBWDtRQUNFLE1BQU0sQ0FBQztZQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNWLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUMzQixDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDYixDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBQ0gsU0FBQztBQUFELENBM0JBLEFBMkJDLElBQUE7Ozs7Ozs7Ozs7Ozs7OztBQy9CRCwrQkFBMEI7QUFJMUIseUJBQW9CO0FBQ3BCLHFDQUFnQztBQUVoQztJQUFtQyx5QkFBSTtJQUlyQyxlQUFZLEtBQVksRUFBRSxLQUFjLEVBQVMsU0FBaUIsRUFBRSxLQUFhO1FBQWpGLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsU0FHN0I7UUFKZ0QsZUFBUyxHQUFULFNBQVMsQ0FBUTtRQUgzRCxpQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixZQUFNLEdBQUcsY0FBTSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7UUFJdEIsS0FBSSxDQUFDLEtBQUssR0FBRyxXQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxLQUFJLENBQUMsUUFBUSxHQUFHLGlCQUFPLENBQUMsY0FBYyxDQUFDOztJQUN6QyxDQUFDO0lBRU0sc0JBQU0sR0FBYjtRQUNFLGlCQUFNLE1BQU0sV0FBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsSUFBSSxpQkFBTyxDQUFDLGlCQUFpQixDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUNILFlBQUM7QUFBRCxDQWpCQSxBQWlCQyxDQWpCa0MsY0FBSSxHQWlCdEM7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCRCwrQkFBMEI7QUFNMUIscUNBQWdDO0FBQ2hDLG1EQUE4QztBQUM5Qyx5REFBb0Q7QUFDcEQsbUNBQThCO0FBRzlCO0lBQXFDLDJCQUFJO0lBVXZDLGlCQUFZLEtBQVksRUFBRSxLQUFjLEVBQVMsR0FBNEM7UUFBN0YsWUFDRSxrQkFBTSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQU0vQjtRQVBnRCxTQUFHLEdBQUgsR0FBRyxDQUF5QztRQVR0RixpQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixZQUFNLEdBQUcsY0FBTSxPQUFBLEVBQUUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQztRQUM1QyxVQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ1gsZUFBUyxHQUFHLElBQUksQ0FBQztRQVF0QixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLEtBQUssZ0JBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3RFLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksd0JBQWMsQ0FBQyxLQUFJLENBQUMsQ0FBQztRQUN4QyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JCLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSwyQkFBaUIsQ0FBQyxLQUFJLENBQUMsQ0FBQzs7SUFDaEQsQ0FBQztJQUVNLHlCQUFPLEdBQWQ7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixrQkFBa0I7WUFDbEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsNkJBQTJCLEtBQUssQ0FBQyxPQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEcsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVNLDBCQUFRLEdBQWY7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLHVCQUFLLEdBQVosVUFBYSxNQUFZO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSwwQkFBUSxHQUFmLFVBQWdCLFNBQWlCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUNwQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLE9BQWU7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSwyQkFBUyxHQUFoQixVQUFpQixTQUFpQixFQUFFLEtBQWEsRUFBRSxLQUFjO1FBQy9ELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsV0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sc0JBQUksR0FBWDtRQUNFLElBQU0sU0FBUyxHQUFHLGlCQUFNLElBQUksV0FBRSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDbkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNILGNBQUM7QUFBRCxDQXZFQSxBQXVFQyxDQXZFb0MsY0FBSSxHQXVFeEM7Ozs7Ozs7Ozs7Ozs7OztBQ3BGRCxxQ0FBZ0M7QUFHaEMscUNBQWdDO0FBQ2hDLHlCQUFvQjtBQUVwQjtJQUE0QyxrQ0FBTztJQUtqRCx3QkFBbUIsT0FBZ0I7UUFBbkMsWUFDRSxpQkFBTyxTQUVSO1FBSGtCLGFBQU8sR0FBUCxPQUFPLENBQVM7UUFFakMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUNmLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVNLGdDQUFPLEdBQWQ7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDcEMsSUFBTSxVQUFVLEdBQUcsV0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9FLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDO1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBMUJBLEFBMEJDLENBMUIyQyxpQkFBTyxHQTBCbEQ7Ozs7Ozs7Ozs7Ozs7OztBQ2hDRCwyQ0FBc0M7QUFHdEMsaUNBQTRCO0FBRzVCO0lBQStDLHFDQUFVO0lBV3ZELDJCQUFZLE9BQWdCO1FBQTVCLFlBQ0Usa0JBQU0sT0FBTyxDQUFDLFNBNENmO1FBM0NDLEtBQUksQ0FBQyxTQUFTLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxTQUFTLEVBQWpCLENBQWlCLENBQUM7UUFFekMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM1QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRWhDLEtBQUksQ0FBQyxJQUFJLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQVosQ0FBWSxDQUFDO1FBRS9CLEtBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDdkMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO1lBQ3BCLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRCxJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBRUYsS0FBSSxDQUFDLE9BQU8sR0FBRztZQUNiLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQzFCLENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQztRQUNGLElBQU0sUUFBUSxHQUFHLFVBQUMsS0FBVSxJQUFzQixPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsRUFBM0QsQ0FBMkQsQ0FBQztRQUM5RyxLQUFJLENBQUMsR0FBRyxHQUFHO1lBQUMsaUJBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLDRCQUFpQjs7WUFDM0IsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQztRQUNGLEtBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDdkMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDOztJQUNKLENBQUM7SUFFTSwwQ0FBYyxHQUFyQixVQUFzQixPQUEyQjtRQUMvQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO0lBQ0gsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0EvREEsQUErREMsQ0EvRDhDLG9CQUFVLEdBK0R4RDs7Ozs7Ozs7Ozs7Ozs7O0FDbkVELGlDQUE0QjtBQUM1QiwyQkFBc0I7QUFFdEIseUJBQW9CO0FBQ3BCLGlDQUE0QjtBQUU1QjtJQUFrQyx3QkFBSztJQUtyQyxjQUFZLEtBQVksRUFBUyxLQUFjLEVBQVMsSUFBWTtRQUFwRSxZQUNFLGtCQUFNLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUNqRDtRQUZnQyxXQUFLLEdBQUwsS0FBSyxDQUFTO1FBQVMsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUo3RCxpQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixZQUFNLEdBQUcsY0FBTSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7UUFDakIsZUFBUyxHQUFHLEtBQUssQ0FBQzs7SUFJekIsQ0FBQztJQUVNLHFCQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNiLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFFTyx3QkFBUyxHQUFqQjtRQUNFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzlELElBQU0sUUFBTSxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksWUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFGLENBQUM7SUFDSCxDQUFDO0lBRU0sdUJBQVEsR0FBZixVQUFnQixPQUFnQjtRQUM5QixPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVNLHVCQUFRLEdBQWY7UUFDRSxhQUFhO0lBQ2YsQ0FBQztJQUVNLG1CQUFJLEdBQVg7UUFDRSxNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNWLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUMzQixDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDakIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FsREEsQUFrREMsQ0FsRGlDLGVBQUssR0FrRHRDOzs7Ozs7Ozs7Ozs7Ozs7QUMxREQsaUNBQTRCO0FBRTVCLG1EQUE4QztBQUM5Qyx5REFBb0Q7QUFFcEQscUNBQWdDO0FBQ2hDLG1DQUE4QjtBQUM5QixpQ0FBNEI7QUFDNUIseUJBQW9CO0FBRXBCLGlDQUE0QjtBQUM1QixxQ0FBZ0M7QUFFaEMsMkJBQXNCO0FBU3RCO0lBQXFDLDJCQUFLO0lBYXhDLGlCQUNFLEtBQVksRUFDWixDQUFTLEVBQ1QsQ0FBUyxFQUNGLFFBQWdCLEVBQ2hCLE9BQWUsRUFDZixJQUFZLEVBQ1osS0FBYTtRQVB0QixZQVNFLGtCQUFNLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBS25CO1FBVlEsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFdBQUssR0FBTCxLQUFLLENBQVE7UUFuQmYsV0FBSyxHQUFHLElBQUksQ0FBQztRQUNiLGlCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFlBQU0sR0FBRyxpQkFBTyxDQUFDLGNBQWMsQ0FBQztRQUNoQyxpQkFBVyxHQUFHLGlCQUFPLENBQUMsb0JBQW9CLENBQUM7UUFDM0MsVUFBSSxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDO1FBSzNCLFNBQUcsR0FBcUQsSUFBSSxDQUFDO1FBY25FLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3RGLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSx3QkFBYyxDQUFDLEtBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSwyQkFBaUIsQ0FBQyxLQUFJLENBQUMsQ0FBQzs7SUFDaEQsQ0FBQztJQUVNLHlCQUFPLEdBQWQsVUFBZSxZQUEwQjtRQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLENBQUM7UUFDdkQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztRQUNuRCxDQUFDO0lBQ0gsQ0FBQztJQUVNLHlCQUFPLEdBQWQ7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDZCQUEyQixLQUFLLENBQUMsT0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVNLHdCQUFNLEdBQWI7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFDLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM5RCxJQUFNLFFBQU0sR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNELFVBQVU7UUFDVixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJELHlDQUF5QztRQUN6QyxFQUFFLENBQUMsQ0FBQyxpQkFBTyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFNLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDNUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsaUJBQU8sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVELHlDQUF5QztRQUN6QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxpQkFBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLGlCQUFPLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxXQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxpQkFBTyxDQUFDLG1CQUFtQixDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxXQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsSUFBSSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqRCxXQUFXO1FBQ1gsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFNLFlBQVksR0FBRyxRQUFRLEdBQUcsaUJBQU8sQ0FBQyw2QkFBNkIsQ0FBQztZQUN0RSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxpQkFBTyxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxNQUFNLElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUM1QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxzQkFBSSxHQUFYLFVBQVksS0FBZ0I7UUFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELElBQU0sSUFBSSxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTSwwQkFBUSxHQUFmLFVBQWdCLFNBQWlCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssZ0JBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxlQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSx1QkFBSyxHQUFaLFVBQWEsSUFBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxxQkFBRyxHQUFWLFVBQVcsT0FBZTtRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLDJCQUFTLEdBQWhCLFVBQWlCLFNBQWlCLEVBQUUsS0FBYSxFQUFFLEtBQWM7UUFDL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxXQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxzQkFBSSxHQUFYO1FBQ0UsSUFBTSxJQUFJLEdBQWdCO1lBQ3hCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNWLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUMzQixDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDakIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzlCLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVztZQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3hCLENBQUM7UUFDRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDOUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsY0FBQztBQUFELENBcktBLEFBcUtDLENBcktvQyxlQUFLLEdBcUt6Qzs7Ozs7Ozs7Ozs7Ozs7O0FDM0xELHFDQUFnQztBQUVoQyxxQ0FBZ0M7QUFHaEM7SUFBNEMsa0NBQU87SUFNakQsd0JBQW1CLE9BQWdCO1FBQW5DLFlBQ0UsaUJBQU8sU0FFUjtRQUhrQixhQUFPLEdBQVAsT0FBTyxDQUFTO1FBRWpDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7SUFDZixDQUFDO0lBRU0sOEJBQUssR0FBWjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVNLGdDQUFPLEdBQWQ7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBakNBLEFBaUNDLENBakMyQyxpQkFBTyxHQWlDbEQ7Ozs7Ozs7Ozs7Ozs7OztBQ3RDRCwyQ0FBc0M7QUFHdEMscUNBQWdDO0FBQ2hDLGlDQUE0QjtBQUM1Qix5Q0FBb0M7QUFJcEM7SUFBK0MscUNBQVU7SUFvQnZELDJCQUFZLE9BQWdCO1FBQTVCLFlBQ0Usa0JBQU0sT0FBTyxDQUFDLFNBaUVmO1FBL0RDLEtBQUksQ0FBQyxNQUFNLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxNQUFNLEVBQWQsQ0FBYyxDQUFDO1FBQ25DLEtBQUksQ0FBQyxXQUFXLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxXQUFXLEVBQW5CLENBQW1CLENBQUM7UUFDN0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLFdBQVcsRUFBbkIsQ0FBbUIsQ0FBQztRQUM3QyxLQUFJLENBQUMsSUFBSSxHQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxFQUFaLENBQVksQ0FBQztRQUUvQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDaEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN2QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM5RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN4QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM5RixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLEtBQUssR0FBRztZQUNYLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDdkIsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLE1BQU0sR0FBRztZQUNaLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUN2QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLElBQUksR0FBRztZQUNWLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsU0FBUyxHQUFHLFVBQUMsU0FBUyxFQUFFLEtBQUs7WUFDaEMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxXQUFXLEdBQUcsVUFBQSxHQUFHO1lBQ3BCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQztRQUVGLElBQU0sUUFBUSxHQUFHLFVBQUMsS0FBVSxJQUFzQixPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsRUFBM0QsQ0FBMkQsQ0FBQztRQUM5RyxLQUFJLENBQUMsR0FBRyxHQUFHO1lBQUMsaUJBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLDRCQUFpQjs7WUFDM0IsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQztRQUNGLEtBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDdkMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDOztJQUNKLENBQUM7SUFFTSwwQ0FBYyxHQUFyQixVQUFzQixPQUEyQjtRQUMvQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO0lBQ0gsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0E3RkEsQUE2RkMsQ0E3RjhDLG9CQUFVLEdBNkZ4RDs7Ozs7QUN0R0QseUJBQW9CO0FBR3BCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUV2QjtJQUFBO0lBOERBLENBQUM7SUE3RGUsaUJBQVcsR0FBekIsVUFBMEIsQ0FBSSxFQUFFLFNBQWlCLEVBQUUsS0FBYSxFQUFFLEtBQWE7UUFDN0UsSUFBTSxhQUFhLEdBQUcsVUFBQyxDQUFJLElBQUssT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBdEIsQ0FBc0IsQ0FBQztRQUV2RCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDO1FBQ2hFLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQW5ELENBQW1ELENBQUM7SUFDbEUsQ0FBQztJQUVhLFVBQUksR0FBbEIsVUFBbUIsSUFBTyxFQUFFLE1BQWM7UUFDeEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFNLFNBQVMsR0FBRyxJQUFJLFdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUN6RSxNQUFNLENBQUMsVUFBQyxNQUFTO1lBQ2YsTUFBTSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUMzRSxDQUFDLENBQUM7SUFDSixDQUFDO0lBRWEsa0JBQVksR0FBMUIsVUFBMkIsQ0FBSSxFQUFFLENBQUksRUFBRSxDQUFJO1FBQ3pDLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFYSxjQUFRLEdBQXRCLFVBQXVCLE1BQWM7UUFDbkMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDckMsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM1QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDN0MsQ0FBQztJQUVjLHFCQUFlLEdBQTlCLFVBQStCLE1BQWM7UUFDM0MsSUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUMvQixNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUM7SUFFYSxVQUFJLEdBQWxCLFVBQW1CLEtBQWE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUNILFlBQUM7QUFBRCxDQTlEQSxBQThEQyxJQUFBOzs7OztBQ25FRDtJQUlFLFdBQW1CLENBQVMsRUFBUyxDQUFTO1FBQTNCLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO0lBQUcsQ0FBQztJQUkzQyxlQUFHLEdBQVYsVUFBVyxDQUFNLEVBQUUsQ0FBVTtRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFHTSxvQkFBUSxHQUFmLFVBQWdCLENBQU0sRUFBRSxDQUFVO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNNLG9CQUFRLEdBQWYsVUFBZ0IsQ0FBYTtRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ00sa0JBQU0sR0FBYixVQUFjLENBQWE7UUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNNLGtCQUFNLEdBQWIsVUFBYyxDQUFhO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTSxrQkFBTSxHQUFiO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ00sb0JBQVEsR0FBZixVQUFnQixDQUFJO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFDTSxrQkFBTSxHQUFiO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQy9CLENBQUM7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQy9CLENBQUM7SUFDTSxxQkFBUyxHQUFoQjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5QixJQUFNLEtBQUssR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNNLGlCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFDTSwwQkFBYyxHQUFyQjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzlCLENBQUM7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBQ00sZUFBRyxHQUFWLFVBQVcsS0FBZTtRQUFmLHNCQUFBLEVBQUEsWUFBZTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ00saUJBQUssR0FBWixVQUFhLEtBQVE7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNNLGtCQUFNLEdBQWIsVUFBYyxNQUFjO1FBQzFCLElBQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDYSxXQUFTLEdBQXZCLFVBQXdCLE1BQWM7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNNLG9CQUFRLEdBQWY7UUFDRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFPLENBQUM7SUFDL0QsQ0FBQztJQUNILFFBQUM7QUFBRCxDQXRGQSxBQXNGQyxJQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBGaWVsZCBmcm9tICcuLi9jb3JlL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi4vY29yZS9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xyXG5pbXBvcnQgVGlja0V2ZW50TGlzdGVuZXIgZnJvbSAnLi4vY29yZS9UaWNrRXZlbnRMaXN0ZW5lcic7XHJcbmltcG9ydCB7IFBsYXllcnNEdW1wLCBGcmFtZUR1bXAsIFJlc3VsdER1bXAgfSBmcm9tICcuLi9jb3JlL0R1bXAnO1xyXG5pbXBvcnQgRXhwb3NlZFNjcmlwdExvYWRlciBmcm9tICcuLi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXJJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY29sb3I6IHN0cmluZztcclxuICBzb3VyY2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbml0aWFsUGFyYW1ldGVyIHtcclxuICBpc0RlbW86IGJvb2xlYW47XHJcbiAgc291cmNlczogUGxheWVySW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYXRhID1cclxuICB8IE5leHRDb21tYW5kXHJcbiAgfCBQbGF5ZXJzQ29tbWFuZFxyXG4gIHwgUHJlVGhpbmtDb21tYW5kXHJcbiAgfCBQb3N0VGhpbmtDb21tYW5kXHJcbiAgfCBGaW5pc2hlZENvbW1hbmRcclxuICB8IEVuZE9mR2FtZUNvbW1hbmRcclxuICB8IEVycm9yQ29tbWFuZDtcclxuXHJcbmludGVyZmFjZSBOZXh0Q29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ05leHQnO1xyXG4gIGlzc3VlZElkOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQbGF5ZXJzQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ1BsYXllcnMnO1xyXG4gIHBsYXllcnM6IFBsYXllcnNEdW1wO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUHJlVGhpbmtDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUHJlVGhpbmsnO1xyXG4gIGlkOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3N0VGhpbmtDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUG9zdFRoaW5rJztcclxuICBpZDogbnVtYmVyO1xyXG4gIGxvYWRlZEZyYW1lOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBGaW5pc2hlZENvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdGaW5pc2hlZCc7XHJcbiAgcmVzdWx0OiBSZXN1bHREdW1wO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRW5kT2ZHYW1lQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0VuZE9mR2FtZSc7XHJcbiAgZnJhbWVzOiBGcmFtZUR1bXBbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEVycm9yQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0Vycm9yJztcclxuICBlcnJvcjogc3RyaW5nO1xyXG59XHJcblxyXG5kZWNsYXJlIGZ1bmN0aW9uIHBvc3RNZXNzYWdlKG1lc3NhZ2U6IERhdGEpOiB2b2lkO1xyXG5cclxubGV0IGlzc3VlSWQgPSAwO1xyXG5jb25zdCBpc3N1ZSA9ICgpID0+IGlzc3VlSWQrKztcclxuY29uc3QgY2FsbGJhY2tzOiB7IFtpZDogbnVtYmVyXTogKCkgPT4gdm9pZCB9ID0ge307XHJcblxyXG5vbm1lc3NhZ2UgPSAoeyBkYXRhIH0pID0+IHtcclxuICBpZiAoZGF0YS5pc3N1ZWRJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjYWxsYmFja3NbZGF0YS5pc3N1ZWRJZF0oKTtcclxuICAgIGRlbGV0ZSBjYWxsYmFja3NbZGF0YS5pc3N1ZWRJZF07XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGNvbnN0IGluaXRpYWxQYXJhbWV0ZXIgPSBkYXRhIGFzIEluaXRpYWxQYXJhbWV0ZXI7XHJcbiAgY29uc3QgaXNEZW1vID0gaW5pdGlhbFBhcmFtZXRlci5pc0RlbW8gYXMgYm9vbGVhbjtcclxuICBjb25zdCBwbGF5ZXJzID0gaW5pdGlhbFBhcmFtZXRlci5zb3VyY2VzIGFzIFBsYXllckluZm9bXTtcclxuICBjb25zdCBmcmFtZXM6IEZyYW1lRHVtcFtdID0gW107XHJcbiAgY29uc3QgbGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyID0ge1xyXG4gICAgd2FpdE5leHRUaWNrOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcclxuICAgICAgICBjb25zdCBpc3N1ZWRJZCA9IGlzc3VlKCk7XHJcbiAgICAgICAgY2FsbGJhY2tzW2lzc3VlZElkXSA9IHJlc29sdmU7XHJcbiAgICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgaXNzdWVkSWQsXHJcbiAgICAgICAgICBjb21tYW5kOiAnTmV4dCdcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25QcmVUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiAnUHJlVGhpbmsnLFxyXG4gICAgICAgIGlkOiBzb3VyY2VySWRcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25Qb3N0VGhpbms6IChzb3VyY2VySWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgY29tbWFuZDogJ1Bvc3RUaGluaycsXHJcbiAgICAgICAgaWQ6IHNvdXJjZXJJZCxcclxuICAgICAgICBsb2FkZWRGcmFtZTogZnJhbWVzLmxlbmd0aFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbkZyYW1lOiAoZmllbGREdW1wOiBGcmFtZUR1bXApID0+IHtcclxuICAgICAgZnJhbWVzLnB1c2goZmllbGREdW1wKTtcclxuICAgIH0sXHJcbiAgICBvbkZpbmlzaGVkOiAocmVzdWx0OiBSZXN1bHREdW1wKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICByZXN1bHQsXHJcbiAgICAgICAgY29tbWFuZDogJ0ZpbmlzaGVkJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbkVuZE9mR2FtZTogKCkgPT4ge1xyXG4gICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgZnJhbWVzLFxyXG4gICAgICAgIGNvbW1hbmQ6ICdFbmRPZkdhbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRXJyb3I6IChlcnJvcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBlcnJvcixcclxuICAgICAgICBjb21tYW5kOiAnRXJyb3InXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKEV4cG9zZWRTY3JpcHRMb2FkZXIsIGlzRGVtbyk7XHJcbiAgcGxheWVycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgIGZpZWxkLnJlZ2lzdGVyU291cmNlcih2YWx1ZS5zb3VyY2UsIHZhbHVlLm5hbWUsIHZhbHVlLm5hbWUsIHZhbHVlLmNvbG9yKTtcclxuICB9KTtcclxuXHJcbiAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgY29tbWFuZDogJ1BsYXllcnMnLFxyXG4gICAgcGxheWVyczogZmllbGQucGxheWVycygpXHJcbiAgfSk7XHJcblxyXG4gIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgZmllbGQuY29tcGlsZShsaXN0ZW5lcik7XHJcbiAgICBmb3IgKGxldCBjb3VudCA9IDA7IGNvdW50IDwgMTAwMDAgJiYgIWZpZWxkLmlzRmluaXNoZWQ7IGNvdW50KyspIHtcclxuICAgICAgYXdhaXQgZmllbGQudGljayhsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgfSwgMCk7XHJcbn07XHJcbiIsImltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciB7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHBvc2l0aW9uOiBWO1xyXG4gIHB1YmxpYyBzcGVlZDogVjtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiBudW1iZXI7XHJcbiAgcHVibGljIHNpemUgPSBDb25maWdzLkNPTExJU0lPTl9TSVpFO1xyXG4gIHB1YmxpYyB3YWl0ID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGZpZWxkOiBGaWVsZCwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIHRoaXMud2FpdCA9IDA7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFYoeCwgeSk7XHJcbiAgICB0aGlzLnNwZWVkID0gbmV3IFYoMCwgMCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdGhpbmsoKSB7XHJcbiAgICBpZiAodGhpcy53YWl0IDw9IDApIHtcclxuICAgICAgdGhpcy53YWl0ID0gMDtcclxuICAgICAgdGhpcy5vblRoaW5rKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLndhaXQgPSB0aGlzLndhaXQgLSAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVGhpbmsoKTogdm9pZCB7XHJcbiAgICAvLyBub3QgdGhpbmsgYW55dGhpbmcuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCk6IHZvaWQge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1vdmUoKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5zcGVlZCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoc2hvdDogU2hvdCkge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGR1bXAoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsaW1lbnRhdGlvbicpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kIHtcclxuICBwcml2YXRlIGlzQWNjZXB0ZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgdmFsaWRhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNBY2NlcHRlZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29tbWFuZC4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHVibGljIGFjY2VwdCgpIHtcclxuICAgIHRoaXMuaXNBY2NlcHRlZCA9IHRydWU7XHJcbiAgfVxyXG4gIHB1YmxpYyB1bmFjY2VwdCgpIHtcclxuICAgIHRoaXMuaXNBY2NlcHRlZCA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWdzIHtcclxuICBwdWJsaWMgc3RhdGljIElOSVRJQUxfU0hJRUxEID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9GVUVMID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9NSVNTSUxFX0FNTU8gPSAyMDtcclxuICBwdWJsaWMgc3RhdGljIExBU0VSX0FUVEVOVUFUSU9OID0gMTtcclxuICBwdWJsaWMgc3RhdGljIExBU0VSX01PTUVOVFVNID0gMTI4O1xyXG4gIHB1YmxpYyBzdGF0aWMgRlVFTF9DT1NUID0gMC4yNDtcclxuICBwdWJsaWMgc3RhdGljIENPTExJU0lPTl9TSVpFID0gNDtcclxuICBwdWJsaWMgc3RhdGljIFNDQU5fV0FJVCA9IDAuMzU7XHJcbiAgcHVibGljIHN0YXRpYyBTUEVFRF9SRVNJU1RBTkNFID0gMC45NjtcclxuICBwdWJsaWMgc3RhdGljIEdSQVZJVFkgPSAwLjE7XHJcbiAgcHVibGljIHN0YXRpYyBUT1BfSU5WSVNJQkxFX0hBTkQgPSA0ODA7XHJcbiAgcHVibGljIHN0YXRpYyBESVNUQU5DRV9CT1JEQVIgPSA0MDA7XHJcbiAgcHVibGljIHN0YXRpYyBESVNUQU5DRV9JTlZJU0lCTEVfSEFORCA9IDAuMDA4O1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfQk9SREVSID0gMTAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQgPSAwLjA1O1xyXG4gIHB1YmxpYyBzdGF0aWMgT1ZFUkhFQVRfREFNQUdFX1BPV0VSX1dFSUdIVCA9IDAuMDEyO1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JPVU5EX0RBTUFHRV9TQ0FMRSA9IDE7XHJcbiAgcHVibGljIHN0YXRpYyBDT09MX0RPV04gPSAwLjU7XHJcbiAgcHVibGljIHN0YXRpYyBPTl9ISVRfU1BFRURfR0lWRU5fUkFURSA9IDAuNDtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zdHMge1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUSU9OX1JJR0hUID0gMTtcclxuICBwdWJsaWMgc3RhdGljIERJUkVDVElPTl9MRUZUID0gLTE7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJUSUNBTF9VUCA9ICd2ZXJ0aWFsX3VwJztcclxuICBwdWJsaWMgc3RhdGljIFZFUlRJQ0FMX0RPV04gPSAndmVydGlhbF9kb3duJztcclxufVxyXG4iLCJpbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL0FjdG9yJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBmcmFtZTogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyBhbHRpdHVkZTogKCkgPT4gbnVtYmVyO1xyXG4gIHB1YmxpYyB3YWl0OiAoZnJhbWU6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZnVlbDogKCkgPT4gbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIGZyYW1lc09mTGlmZTogbnVtYmVyID0gMDtcclxuICBwdWJsaWMgcHJlVGhpbmsgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmZyYW1lc09mTGlmZSsrO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFjdG9yOiBBY3Rvcikge1xyXG4gICAgdGhpcy5mcmFtZSA9ICgpID0+IHRoaXMuZnJhbWVzT2ZMaWZlO1xyXG4gICAgdGhpcy5hbHRpdHVkZSA9ICgpID0+IGFjdG9yLnBvc2l0aW9uLnk7XHJcbiAgICB0aGlzLndhaXQgPSAoZnJhbWU6IG51bWJlcikgPT4ge1xyXG4gICAgICBpZiAoMCA8IGZyYW1lKSB7XHJcbiAgICAgICAgYWN0b3Iud2FpdCArPSBmcmFtZTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFNjcmlwdExvYWRlciwgeyBDb25zb2xlTGlrZSB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdChjb25zdHJ1Y3RvcjogYW55LCBhcmdzOiBzdHJpbmdbXSkge1xyXG4gIGZ1bmN0aW9uIGZ1bigpIHtcclxuICAgIHJldHVybiBjb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcclxuICB9XHJcbiAgZnVuLnByb3RvdHlwZSA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcclxuICByZXR1cm4gbmV3IChmdW4gYXMgYW55KSgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvc2VkU2NyaXB0TG9hZGVyIGltcGxlbWVudHMgU2NyaXB0TG9hZGVyIHtcclxuICBwcml2YXRlIGFyZ1ZhbHVlczogYW55W107XHJcbiAgcHJpdmF0ZSBhcmdOYW1lczogc3RyaW5nW107XHJcbiAgcHJpdmF0ZSBiYW5saXN0OiBzdHJpbmdbXTtcclxuICBwcml2YXRlIGNvbnNvbGU6IENvbnNvbGVMaWtlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uc29sZSA9IHtcclxuICAgICAgbG9nOiAoLi4ubWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIC8qIG5vdGhpbmcuLiAqL1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgYWxsb3dMaWJzID0ge1xyXG4gICAgICBPYmplY3QsXHJcbiAgICAgIFN0cmluZyxcclxuICAgICAgTnVtYmVyLFxyXG4gICAgICBCb29sZWFuLFxyXG4gICAgICBBcnJheSxcclxuICAgICAgRGF0ZSxcclxuICAgICAgTWF0aCxcclxuICAgICAgUmVnRXhwLFxyXG4gICAgICBKU09OLFxyXG4gICAgICBOYU4sXHJcbiAgICAgIEluZmluaXR5LFxyXG4gICAgICB1bmRlZmluZWQsXHJcbiAgICAgIHBhcnNlSW50LFxyXG4gICAgICBwYXJzZUZsb2F0LFxyXG4gICAgICBpc05hTixcclxuICAgICAgaXNGaW5pdGUsXHJcbiAgICAgIGNvbnNvbGU6IHRoaXMuY29uc29sZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZnVuY3Rpb24tY29uc3RydWN0b3Itd2l0aC1zdHJpbmctYXJnc1xyXG4gICAgY29uc3QgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XHJcbiAgICB0aGlzLmJhbmxpc3QgPSBbJ19fcHJvdG9fXycsICdwcm90b3R5cGUnXTtcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cclxuICAgIGZvciAoY29uc3QgdGFyZ2V0IGluIGdsb2JhbCkge1xyXG4gICAgICB0aGlzLmJhbmxpc3QucHVzaCh0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgbGV0IGFyZ05hbWVzID0gT2JqZWN0LmtleXMoYWxsb3dMaWJzKTtcclxuICAgIGFyZ05hbWVzID0gYXJnTmFtZXMuY29uY2F0KHRoaXMuYmFubGlzdC5maWx0ZXIodmFsdWUgPT4gYXJnTmFtZXMuaW5kZXhPZih2YWx1ZSkgPj0gMCkpO1xyXG4gICAgdGhpcy5hcmdOYW1lcyA9IGFyZ05hbWVzO1xyXG4gICAgdGhpcy5hcmdWYWx1ZXMgPSBPYmplY3Qua2V5cyhhbGxvd0xpYnMpLm1hcChrZXkgPT4gKGFsbG93TGlicyBhcyBhbnkpW2tleV0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRGVidWdnYWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEV4cG9zZWRDb25zb2xlKCk6IENvbnNvbGVMaWtlIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25zb2xlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoc2NyaXB0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IGFyZ05hbWVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgYXJnTmFtZXMgPSBhcmdOYW1lcy5jb25jYXQodGhpcy5hcmdOYW1lcyk7XHJcbiAgICBhcmdOYW1lcy5wdXNoKCdcInVzZSBzdHJpY3RcIjtcXG4nICsgc2NyaXB0KTtcclxuICAgIHJldHVybiBjb25zdHJ1Y3QoRnVuY3Rpb24sIGFyZ05hbWVzKS5hcHBseSh1bmRlZmluZWQsIHRoaXMuYXJnVmFsdWVzKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFRpY2tFdmVudExpc3RlbmVyIGZyb20gJy4vVGlja0V2ZW50TGlzdGVuZXInO1xyXG5pbXBvcnQgeyBGcmFtZUR1bXAsIFJlc3VsdER1bXAsIFNvdXJjZXJEdW1wLCBTaG90RHVtcCwgRnhEdW1wLCBQbGF5ZXJzRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IFNjcmlwdExvYWRlciwgeyBTY3JpcHRMb2FkZXJDb25zdHJ1Y3RvciB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcclxuXHJcbmNvbnN0IERFTU9fRlJBTUVfTEVOR1RIID0gMTI4O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmllbGQge1xyXG4gIHByaXZhdGUgY3VycmVudElkID0gMDtcclxuICBwcml2YXRlIHNvdXJjZXJzOiBTb3VyY2VyW107XHJcbiAgcHJpdmF0ZSBzaG90czogU2hvdFtdO1xyXG4gIHByaXZhdGUgZnhzOiBGeFtdO1xyXG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcclxuICBwcml2YXRlIHJlc3VsdDogUmVzdWx0RHVtcDtcclxuICBwdWJsaWMgY2VudGVyOiBudW1iZXI7XHJcbiAgcHVibGljIGlzRmluaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBkdW1teUVuZW15OiBWID0gbmV3IFYoMCwgMTUwKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY3JpcHRMb2FkZXJDb25zdHJ1Y3RvcjogU2NyaXB0TG9hZGVyQ29uc3RydWN0b3IsIHB1YmxpYyBpc0RlbW86IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICB0aGlzLnNvdXJjZXJzID0gW107XHJcbiAgICB0aGlzLnNob3RzID0gW107XHJcbiAgICB0aGlzLmZ4cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZ2lzdGVyU291cmNlcihzb3VyY2U6IHN0cmluZywgYWNjb3VudDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHNpZGUgPSB0aGlzLnNvdXJjZXJzLmxlbmd0aCAlIDIgPT09IDAgPyAtMSA6IDE7XHJcbiAgICBjb25zdCB4ID0gVXRpbHMucmFuZCg4MCkgKyAxNjAgKiBzaWRlO1xyXG4gICAgY29uc3QgeSA9IFV0aWxzLnJhbmQoMTYwKSArIDgwO1xyXG4gICAgdGhpcy5hZGRTb3VyY2VyKG5ldyBTb3VyY2VyKHRoaXMsIHgsIHksIHNvdXJjZSwgYWNjb3VudCwgbmFtZSwgY29sb3IpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciwgdGhpbms6IChzb3VyY2VyOiBTb3VyY2VyKSA9PiB2b2lkKSB7XHJcbiAgICBmb3IgKGNvbnN0IHNvdXJjZXIgb2YgdGhpcy5zb3VyY2Vycykge1xyXG4gICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgICAgdGhpbmsoc291cmNlcik7XHJcbiAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBjb21waWxlKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzb3VyY2VyLmNvbXBpbGUobmV3IHRoaXMuc2NyaXB0TG9hZGVyQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbGlzdGVuZXIub25FcnJvcihgVGhlcmUgaXMgYW4gZXJyb3IgaW4geW91ciBjb2RlOuOAgCR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkU291cmNlcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzb3VyY2VyLmlkID0gdGhpcy5jdXJyZW50SWQrKztcclxuICAgIHRoaXMuc291cmNlcnMucHVzaChzb3VyY2VyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRTaG90KHNob3Q6IFNob3QpIHtcclxuICAgIHNob3QuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZVNob3QodGFyZ2V0OiBTaG90KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hvdHMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgaWYgKDAgPD0gaW5kZXgpIHtcclxuICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZEZ4KGZ4OiBGeCkge1xyXG4gICAgZnguaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5meHMucHVzaChmeCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlRngodGFyZ2V0OiBGeCkge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZ4cy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICBpZiAoMCA8PSBpbmRleCkge1xyXG4gICAgICB0aGlzLmZ4cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHRpY2sobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAodGhpcy5mcmFtZSA9PT0gMCkge1xyXG4gICAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTsgLy8gU2F2ZSB0aGUgMCBmcmFtZS5cclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBiZSB1c2VkIGluIHRoZSBpbnZpc2libGUgaGFuZC5cclxuICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XHJcblxyXG4gICAgLy8gVGhpbmsgcGhhc2VcclxuICAgIGF3YWl0IHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgc291cmNlci50aGluaygpO1xyXG4gICAgICB0aGlzLnNob3RzLmZpbHRlcihzaG90ID0+IHNob3Qub3duZXIuaWQgPT09IHNvdXJjZXIuaWQpLmZvckVhY2goc2hvdCA9PiBzaG90LnRoaW5rKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQWN0aW9uIHBoYXNlXHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLmFjdGlvbigpKTtcclxuICAgIHRoaXMuZnhzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG5cclxuICAgIC8vIE1vdmUgcGhhc2VcclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5tb3ZlKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcbiAgICB0aGlzLmZ4cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgcGhhc2VcclxuICAgIHRoaXMuY2hlY2tGaW5pc2gobGlzdGVuZXIpO1xyXG4gICAgdGhpcy5jaGVja0VuZE9mR2FtZShsaXN0ZW5lcik7XHJcblxyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG5cclxuICAgIC8vIG9uRnJhbWVcclxuICAgIGxpc3RlbmVyLm9uRnJhbWUodGhpcy5kdW1wKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0ZpbmlzaChsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICBpZiAoREVNT19GUkFNRV9MRU5HVEggPCB0aGlzLmZyYW1lKSB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSB7XHJcbiAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXHJcbiAgICAgICAgICBpc0RyYXc6IG51bGwsXHJcbiAgICAgICAgICB3aW5uZXJJZDogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc3VsdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKHNvdXJjZXIgPT4ge1xyXG4gICAgICBzb3VyY2VyLmFsaXZlID0gMCA8IHNvdXJjZXIuc2hpZWxkO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBzdXJ2aXZlcnMgPSB0aGlzLnNvdXJjZXJzLmZpbHRlcihzb3VyY2VyID0+IHNvdXJjZXIuYWxpdmUpO1xyXG5cclxuICAgIGlmICgxIDwgc3Vydml2ZXJzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cnZpdmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgY29uc3Qgc3Vydml2ZXIgPSBzdXJ2aXZlcnNbMF07XHJcbiAgICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICAgIHdpbm5lcklkOiBzdXJ2aXZlci5pZCxcclxuICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICB0aW1lb3V0OiBudWxsLFxyXG4gICAgICAgIGlzRHJhdzogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBubyBzdXJ2aXZlci4uIGRyYXcuLi5cclxuICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICB3aW5uZXJJZDogbnVsbCxcclxuICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXHJcbiAgICAgIGlzRHJhdzogdHJ1ZVxyXG4gICAgfTtcclxuICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0VuZE9mR2FtZShsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRmluaXNoZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzdWx0LmZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XHJcbiAgICAgIC8vIFJlY29yZCBzb21lIGZyYW1lcyBldmVuIGFmdGVyIGRlY2lkZWQuXHJcbiAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkVuZW15KG93bmVyOiBTb3VyY2VyLCByYWRhcjogKHQ6IFYpID0+IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbyAmJiB0aGlzLnNvdXJjZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gcmFkYXIodGhpcy5kdW1teUVuZW15KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Vycy5zb21lKHNvdXJjZXIgPT4ge1xyXG4gICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5BdHRhY2sob3duZXI6IFNvdXJjZXIsIHJhZGFyOiAodDogVikgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hvdHMuc29tZShzaG90ID0+IHtcclxuICAgICAgcmV0dXJuIHNob3Qub3duZXIgIT09IG93bmVyICYmIHJhZGFyKHNob3QucG9zaXRpb24pICYmIHRoaXMuaXNJbmNvbWluZyhvd25lciwgc2hvdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNJbmNvbWluZyhvd25lcjogU291cmNlciwgc2hvdDogU2hvdCkge1xyXG4gICAgY29uc3Qgb3duZXJQb3NpdGlvbiA9IG93bmVyLnBvc2l0aW9uO1xyXG4gICAgY29uc3QgYWN0b3JQb3NpdGlvbiA9IHNob3QucG9zaXRpb247XHJcbiAgICBjb25zdCBjdXJyZW50RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24pO1xyXG4gICAgY29uc3QgbmV4dERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uLmFkZChzaG90LnNwZWVkKSk7XHJcbiAgICByZXR1cm4gbmV4dERpc3RhbmNlIDwgY3VycmVudERpc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNoZWNrQ29sbGlzaW9uKHNob3Q6IFNob3QpOiBBY3RvciB8IG51bGwge1xyXG4gICAgY29uc3QgZiA9IHNob3QucG9zaXRpb247XHJcbiAgICBjb25zdCB0ID0gc2hvdC5wb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCk7XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWRTaG90ID0gdGhpcy5zaG90cy5maW5kKGFjdG9yID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBhY3Rvci5icmVha2FibGUgJiZcclxuICAgICAgICBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lciAmJlxyXG4gICAgICAgIFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbikgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGlmIChjb2xsaWRlZFNob3QpIHtcclxuICAgICAgcmV0dXJuIGNvbGxpZGVkU2hvdDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb2xsaWRlZFNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzLmZpbmQoc291cmNlciA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBzaG90Lm93bmVyICYmIFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBzb3VyY2VyLnBvc2l0aW9uKSA8IHNob3Quc2l6ZSArIHNvdXJjZXIuc2l6ZVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoY29sbGlkZWRTb3VyY2VyKSB7XHJcbiAgICAgIHJldHVybiBjb2xsaWRlZFNvdXJjZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50KHNob3Q6IFNob3QpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wdXRlQ2VudGVyKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgbGV0IHN1bVggPSAwO1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XHJcbiAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XHJcbiAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBsYXllcnMoKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJzOiBQbGF5ZXJzRHVtcCA9IHt9O1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKHNvdXJjZXIgPT4ge1xyXG4gICAgICBwbGF5ZXJzW3NvdXJjZXIuaWRdID0ge1xyXG4gICAgICAgIG5hbWU6IHNvdXJjZXIubmFtZSB8fCBzb3VyY2VyLmFjY291bnQsXHJcbiAgICAgICAgYWNjb3VudDogc291cmNlci5hY2NvdW50LFxyXG4gICAgICAgIGNvbG9yOiBzb3VyY2VyLmNvbG9yXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBwbGF5ZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkdW1wKCk6IEZyYW1lRHVtcCB7XHJcbiAgICBjb25zdCBzb3VyY2Vyc0R1bXA6IFNvdXJjZXJEdW1wW10gPSBbXTtcclxuICAgIGNvbnN0IHNob3RzRHVtcDogU2hvdER1bXBbXSA9IFtdO1xyXG4gICAgY29uc3QgZnhEdW1wOiBGeER1bXBbXSA9IFtdO1xyXG5cclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiB7XHJcbiAgICAgIHNvdXJjZXJzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpc1RoaW5rYWJsZSA9ICh4OiBTaG90KTogeCBpcyBNaXNzaWxlID0+IHgudHlwZSA9PT0gJ01pc3NpbGUnO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IHtcclxuICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaChmeCA9PiB7XHJcbiAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmOiB0aGlzLmZyYW1lLFxyXG4gICAgICBzOiBzb3VyY2Vyc0R1bXAsXHJcbiAgICAgIGI6IHNob3RzRHVtcCxcclxuICAgICAgeDogZnhEdW1wXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlUGFyYW0ge1xyXG4gIHB1YmxpYyBzdGF0aWMgbGFzZXIocG93ZXI6IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIpOiBGaXJlUGFyYW0ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xyXG4gICAgcmVzdWx0LnBvd2VyID0gTWF0aC5taW4oTWF0aC5tYXgocG93ZXIgfHwgOCwgMyksIDgpO1xyXG4gICAgcmVzdWx0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgIHJlc3VsdC5zaG90VHlwZSA9ICdMYXNlcic7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwdWJsaWMgc3RhdGljIG1pc3NpbGUoYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBGaXJlUGFyYW0oKTtcclxuICAgIHJlc3VsdC5ib3QgPSBib3Q7XHJcbiAgICByZXN1bHQuc2hvdFR5cGUgPSAnTWlzc2lsZSc7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwdWJsaWMgYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRpcmVjdGlvbjogbnVtYmVyO1xyXG4gIHB1YmxpYyBwb3dlcjogbnVtYmVyO1xyXG4gIHB1YmxpYyBzaG90VHlwZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IHsgRnhEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ4IHtcclxuICBwcml2YXRlIGZyYW1lOiBudW1iZXI7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaWVsZDogRmllbGQsIHB1YmxpYyBwb3NpdGlvbjogViwgcHVibGljIHNwZWVkOiBWLCBwdWJsaWMgbGVuZ3RoOiBudW1iZXIpIHtcclxuICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFjdGlvbigpIHtcclxuICAgIHRoaXMuZnJhbWUrKztcclxuICAgIGlmICh0aGlzLmxlbmd0aCA8PSB0aGlzLmZyYW1lKSB7XHJcbiAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IEZ4RHVtcCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGY6IHRoaXMuZnJhbWUsXHJcbiAgICAgIGw6IE1hdGgucm91bmQodGhpcy5sZW5ndGgpXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhc2VyIGV4dGVuZHMgU2hvdCB7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gNTtcclxuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gODtcclxuICBwcml2YXRlIG1vbWVudHVtOiBudW1iZXI7XHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBvd25lcjogU291cmNlciwgcHVibGljIGRpcmVjdGlvbjogbnVtYmVyLCBwb3dlcjogbnVtYmVyKSB7XHJcbiAgICBzdXBlcihmaWVsZCwgb3duZXIsICdMYXNlcicpO1xyXG4gICAgdGhpcy5zcGVlZCA9IFYuZGlyZWN0aW9uKGRpcmVjdGlvbikubXVsdGlwbHkocG93ZXIpO1xyXG4gICAgdGhpcy5tb21lbnR1bSA9IENvbmZpZ3MuTEFTRVJfTU9NRU5UVU07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgc3VwZXIuYWN0aW9uKCk7XHJcbiAgICB0aGlzLm1vbWVudHVtIC09IENvbmZpZ3MuTEFTRVJfQVRURU5VQVRJT047XHJcbiAgICBpZiAodGhpcy5tb21lbnR1bSA8IDApIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBNaXNzaWxlQ29tbWFuZCBmcm9tICcuL01pc3NpbGVDb21tYW5kJztcclxuaW1wb3J0IE1pc3NpbGVDb250cm9sbGVyIGZyb20gJy4vTWlzc2lsZUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgQ29uc3RzIGZyb20gJy4vQ29uc3RzJztcclxuaW1wb3J0IHsgRGVidWdEdW1wLCBTaG90RHVtcCB9IGZyb20gJy4vRHVtcCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaXNzaWxlIGV4dGVuZHMgU2hvdCB7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMTA7XHJcbiAgcHVibGljIGRhbWFnZSA9ICgpID0+IDEwICsgdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7XHJcbiAgcHVibGljIGZ1ZWwgPSAxMDA7XHJcbiAgcHVibGljIGJyZWFrYWJsZSA9IHRydWU7XHJcblxyXG4gIHB1YmxpYyBjb21tYW5kOiBNaXNzaWxlQ29tbWFuZDtcclxuICBwdWJsaWMgY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXI7XHJcbiAgcHJpdmF0ZSBkZWJ1Z0R1bXA6IERlYnVnRHVtcDtcclxuXHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBvd25lcjogU291cmNlciwgcHVibGljIGJvdDogKGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyKSA9PiB2b2lkKSB7XHJcbiAgICBzdXBlcihmaWVsZCwgb3duZXIsICdNaXNzaWxlJyk7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IG93bmVyLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XHJcbiAgICB0aGlzLnNwZWVkID0gb3duZXIuc3BlZWQ7XHJcbiAgICB0aGlzLmNvbW1hbmQgPSBuZXcgTWlzc2lsZUNvbW1hbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBNaXNzaWxlQ29udHJvbGxlcih0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRoaW5rKCkge1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcblxyXG4gICAgaWYgKHRoaXMuZnVlbCA8PSAwKSB7XHJcbiAgICAgIC8vIENhbmNlbCB0aGlua2luZ1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdLCBhcmNzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5vd25lci5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZTogYE1pc3NpbGUgZnVuY3Rpb24gZXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gLCBjb2xvcjogJ3JlZCcgfSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XHJcbiAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoYXR0YWNrOiBTaG90KSB7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QoYXR0YWNrKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gKyBkaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzY2FuRGVidWcoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5hcmNzLnB1c2goeyBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNob3REdW1wIHtcclxuICAgIGNvbnN0IHN1cGVyRHVtcCA9IHN1cGVyLmR1bXAoKTtcclxuICAgIGlmICh0aGlzLm93bmVyLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUoKSkge1xyXG4gICAgICBzdXBlckR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlckR1bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb21tYW5kIGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGVDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIHNwZWVkVXA6IG51bWJlcjtcclxuICBwdWJsaWMgc3BlZWREb3duOiBudW1iZXI7XHJcbiAgcHVibGljIHR1cm46IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNwZWVkVXAgPSAwO1xyXG4gICAgdGhpcy5zcGVlZERvd24gPSAwO1xyXG4gICAgdGhpcy50dXJuID0gMDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5tdWx0aXBseSgxIC0gdGhpcy5zcGVlZERvd24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyJztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc3BlZWRVcDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgc3BlZWREb3duOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyB0dXJuUmlnaHQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm5MZWZ0OiAoKSA9PiB2b2lkO1xyXG5cclxuICBwdWJsaWMgbG9nOiAoLi4ubWVzc2FnZXM6IGFueVtdKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzY2FuRGVidWc6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKG1pc3NpbGUpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xyXG5cclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IG1pc3NpbGUuZnVlbDtcclxuXHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XHJcbiAgICAgIGNvbnN0IG1pc3NpbGVEaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgbWlzc2lsZURpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkRG93biA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy50dXJuUmlnaHQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gLTk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gOTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBtaXNzaWxlLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiAoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUuc2NhbkRlYnVnKG1pc3NpbGUub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCB7IFNob3REdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hvdCBleHRlbmRzIEFjdG9yIHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiAwO1xyXG4gIHB1YmxpYyBicmVha2FibGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBwdWJsaWMgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lci5wb3NpdGlvbi54LCBvd25lci5wb3NpdGlvbi55KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9uQWN0aW9uKCk7XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xyXG4gICAgaWYgKGNvbGxpZGVkKSB7XHJcbiAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZ4cygpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHMucmFuZCgxNikgLSA4LCBVdGlscy5yYW5kKDE2KSAtIDgpO1xyXG4gICAgICBjb25zdCBzcGVlZCA9IG5ldyBWKFV0aWxzLnJhbmQoMSkgLSAwLjUsIFV0aWxzLnJhbmQoMSkgLSAwLjUpO1xyXG4gICAgICBjb25zdCBsZW5ndGggPSBVdGlscy5yYW5kKDgpICsgNDtcclxuICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgcG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLmFkZChzcGVlZCksIGxlbmd0aCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlYWN0aW9uKHNvdXJjZXI6IFNvdXJjZXIpIHtcclxuICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNob3REdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG86IHRoaXMub3duZXIuaWQsXHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXHJcbiAgICAgIHM6IHRoaXMudHlwZVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyQ29tbWFuZCBmcm9tICcuL1NvdXJjZXJDb21tYW5kJztcclxuaW1wb3J0IFNvdXJjZXJDb250cm9sbGVyIGZyb20gJy4vU291cmNlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IExhc2VyIGZyb20gJy4vTGFzZXInO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgeyBTb3VyY2VyRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xyXG5pbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuaW50ZXJmYWNlIEV4cG9ydFNjb3BlIHtcclxuICBtb2R1bGU6IHtcclxuICAgIGV4cG9ydHM6ICgoY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXIpID0+IHZvaWQpIHwgbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyIGV4dGVuZHMgQWN0b3Ige1xyXG4gIHB1YmxpYyBhbGl2ZSA9IHRydWU7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMDtcclxuICBwdWJsaWMgc2hpZWxkID0gQ29uZmlncy5JTklUSUFMX1NISUVMRDtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW8gPSBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PO1xyXG4gIHB1YmxpYyBmdWVsID0gQ29uZmlncy5JTklUSUFMX0ZVRUw7XHJcblxyXG4gIHB1YmxpYyBjb21tYW5kOiBTb3VyY2VyQ29tbWFuZDtcclxuICBwdWJsaWMgc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXI7XHJcbiAgcHJpdmF0ZSBjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcjtcclxuICBwcml2YXRlIGJvdDogKChjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcikgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGZpZWxkOiBGaWVsZCxcclxuICAgIHg6IG51bWJlcixcclxuICAgIHk6IG51bWJlcixcclxuICAgIHB1YmxpYyBhaVNvdXJjZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGFjY291bnQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgY29sb3I6IHN0cmluZ1xyXG4gICkge1xyXG4gICAgc3VwZXIoZmllbGQsIHgsIHkpO1xyXG5cclxuICAgIHRoaXMuZGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IENvbnN0cy5ESVJFQ1RJT05fUklHSFQgOiBDb25zdHMuRElSRUNUSU9OX0xFRlQ7XHJcbiAgICB0aGlzLmNvbW1hbmQgPSBuZXcgU291cmNlckNvbW1hbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgU291cmNlckNvbnRyb2xsZXIodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29tcGlsZShzY3JpcHRMb2FkZXI6IFNjcmlwdExvYWRlcikge1xyXG4gICAgdGhpcy5zY3JpcHRMb2FkZXIgPSBzY3JpcHRMb2FkZXI7XHJcbiAgICB0aGlzLmJvdCA9IHNjcmlwdExvYWRlci5sb2FkKHRoaXMuYWlTb3VyY2UpO1xyXG4gICAgaWYgKCF0aGlzLmJvdCkge1xyXG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdGdW5jdGlvbiBoYXMgbm90IGJlZW4gcmV0dXJuZWQuJyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmJvdCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdSZXR1cm5lZCBpcyBub3QgYSBGdW5jdGlvbi4nIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpIHtcclxuICAgIGlmICh0aGlzLmJvdCA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdLCBhcmNzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2goeyBtZXNzYWdlOiBgU291cmNlciBmdW5jdGlvbiBlcnJvcjogJHtlcnJvci5tZXNzYWdlfWAsIGNvbG9yOiAncmVkJyB9KTtcclxuICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgVXRpbHMucmFuZCg4KSA8IDEpIHtcclxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChVdGlscy5yYW5kKDE2KSAtIDgsIFV0aWxzLnJhbmQoMTYpIC0gOCk7XHJcbiAgICAgIGNvbnN0IHNwZWVkID0gbmV3IFYoVXRpbHMucmFuZCgxKSAtIDAuNSwgVXRpbHMucmFuZCgxKSArIDAuNSk7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IFV0aWxzLnJhbmQoOCkgKyA0O1xyXG4gICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeCh0aGlzLmZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFpciByZXNpc3RhbmNlXHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xyXG5cclxuICAgIC8vIGdyYXZpdHlcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSk7XHJcblxyXG4gICAgLy8gY29udHJvbCBhbHRpdHVkZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcclxuICAgIGlmIChDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xyXG4gICAgICBjb25zdCBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb250cm9sIGRpc3RhbmNlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxyXG4gICAgY29uc3QgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgaWYgKENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcclxuICAgICAgY29uc3QgbiA9IGRpZmYgPCAwID8gLTEgOiAxO1xyXG4gICAgICBjb25zdCBpbnZpc2libGVIYW5kID0gKE1hdGguYWJzKGRpZmYpIC0gQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIpICogQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCAqIG47XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLnggKyBpbnZpc2libGVIYW5kLCB0aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdvIGludG8gdGhlIGdyb3VuZFxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgdGhpcy5zaGllbGQgLT0gLXRoaXMuc3BlZWQueSAqIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRTtcclxuICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHRoaXMucG9zaXRpb24ueCwgMCk7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVih0aGlzLnNwZWVkLngsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlncy5DT09MX0RPV047XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XHJcblxyXG4gICAgLy8gb3ZlcmhlYXRcclxuICAgIGNvbnN0IG92ZXJoZWF0ID0gdGhpcy50ZW1wZXJhdHVyZSAtIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSO1xyXG4gICAgaWYgKDAgPCBvdmVyaGVhdCkge1xyXG4gICAgICBjb25zdCBsaW5lYXJEYW1hZ2UgPSBvdmVyaGVhdCAqIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XHJcbiAgICAgIGNvbnN0IHBvd2VyRGFtYWdlID0gTWF0aC5wb3cob3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xyXG4gICAgICB0aGlzLnNoaWVsZCAtPSBsaW5lYXJEYW1hZ2UgKyBwb3dlckRhbWFnZTtcclxuICAgIH1cclxuICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xyXG5cclxuICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaXJlKHBhcmFtOiBGaXJlUGFyYW0pIHtcclxuICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ0xhc2VyJykge1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHNob3QgPSBuZXcgTGFzZXIodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XHJcbiAgICAgIHNob3QucmVhY3Rpb24odGhpcyk7XHJcbiAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xyXG4gICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcclxuICAgICAgICBjb25zdCBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYm90KTtcclxuICAgICAgICBtaXNzaWxlLnJlYWN0aW9uKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8tLTtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3QobWlzc2lsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fTEVGVCkge1xyXG4gICAgICByZXR1cm4gVXRpbHMudG9PcHBvc2l0ZShkaXJlY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5hZGQoc2hvdC5zcGVlZC5tdWx0aXBseShDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XHJcbiAgICB0aGlzLnNoaWVsZCAtPSBzaG90LmRhbWFnZSgpO1xyXG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzY2FuRGVidWcoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5hcmNzLnB1c2goeyBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNvdXJjZXJEdW1wIHtcclxuICAgIGNvbnN0IGR1bXA6IFNvdXJjZXJEdW1wID0ge1xyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxyXG4gICAgICBoOiBNYXRoLmNlaWwodGhpcy5zaGllbGQpLFxyXG4gICAgICB0OiBNYXRoLmNlaWwodGhpcy50ZW1wZXJhdHVyZSksXHJcbiAgICAgIGE6IHRoaXMubWlzc2lsZUFtbW8sXHJcbiAgICAgIGY6IE1hdGguY2VpbCh0aGlzLmZ1ZWwpXHJcbiAgICB9O1xyXG4gICAgaWYgKHRoaXMuc2NyaXB0TG9hZGVyLmlzRGVidWdnYWJsZSgpKSB7XHJcbiAgICAgIGR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBkdW1wO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29tbWFuZCBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIGFoZWFkOiBudW1iZXI7XHJcbiAgcHVibGljIGFzY2VudDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0dXJuOiBib29sZWFuO1xyXG4gIHB1YmxpYyBmaXJlOiBGaXJlUGFyYW0gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlcjogU291cmNlcikge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpIHtcclxuICAgIHRoaXMuYWhlYWQgPSAwO1xyXG4gICAgdGhpcy5hc2NlbnQgPSAwO1xyXG4gICAgdGhpcy50dXJuID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpcmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICBpZiAodGhpcy5maXJlKSB7XHJcbiAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHVybikge1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcclxuICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlncy5GVUVMX0NPU1Q7XHJcbiAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XHJcbmltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuaW1wb3J0IHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBzaGllbGQ6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmU6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW86ICgpID0+IG51bWJlcjtcclxuXHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc2NhbkF0dGFjazogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGFoZWFkOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBiYWNrOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBhc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRlc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm46ICgpID0+IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyBmaXJlTGFzZXI6IChkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZmlyZU1pc3NpbGU6IChib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcclxuICBwdWJsaWMgc2NhbkRlYnVnOiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzdXBlcihzb3VyY2VyKTtcclxuXHJcbiAgICB0aGlzLnNoaWVsZCA9ICgpID0+IHNvdXJjZXIuc2hpZWxkO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9ICgpID0+IHNvdXJjZXIudGVtcGVyYXR1cmU7XHJcbiAgICB0aGlzLm1pc3NpbGVBbW1vID0gKCkgPT4gc291cmNlci5taXNzaWxlQW1tbztcclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IHNvdXJjZXIuZnVlbDtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xyXG4gICAgdGhpcy5zY2FuRW5lbXkgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5BdHRhY2sgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkF0dGFjayhzb3VyY2VyLCByYWRhcik7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5haGVhZCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gMC44O1xyXG4gICAgfTtcclxuICAgIHRoaXMuYmFjayA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gLTAuNDtcclxuICAgIH07XHJcbiAgICB0aGlzLmFzY2VudCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFzY2VudCA9IDAuOTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRlc2NlbnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5hc2NlbnQgPSAtMC45O1xyXG4gICAgfTtcclxuICAgIHRoaXMudHVybiA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnR1cm4gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVMYXNlciA9IChkaXJlY3Rpb24sIHBvd2VyKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5maXJlID0gRmlyZVBhcmFtLmxhc2VyKHBvd2VyLCBkaXJlY3Rpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVNaXNzaWxlID0gYm90ID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmZpcmUgPSBGaXJlUGFyYW0ubWlzc2lsZShib3QpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiAoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIuc2NhbkRlYnVnKHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5cclxuY29uc3QgRVBTSUxPTiA9IDEwZS0xMjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJhZGFyKGM6IFYsIGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2hlY2tEaXN0YW5jZSA9ICh0OiBWKSA9PiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlO1xyXG5cclxuICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcclxuICAgICAgcmV0dXJuIGNoZWNrRGlzdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xyXG4gICAgY29uc3QgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcclxuXHJcbiAgICBpZiAoYW5nbGUgPCAxODApIHtcclxuICAgICAgcmV0dXJuIHQgPT4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ID0+IChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgc2lkZShiYXNlOiBWLCBkZWdyZWU6IG51bWJlcik6ICh0OiBWKSA9PiBib29sZWFuIHtcclxuICAgIGNvbnN0IHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBuZXcgVihNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgIGNvbnN0IHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcclxuICAgIHJldHVybiAodGFyZ2V0OiBWKSA9PiB7XHJcbiAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGNhbGNEaXN0YW5jZShmOiBWLCB0OiBWLCBwOiBWKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XHJcbiAgICBjb25zdCBwRnJvbSA9IHAuc3VidHJhY3QoZik7XHJcbiAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xyXG4gICAgY29uc3QgcFRvID0gcC5zdWJ0cmFjdCh0KTtcclxuICAgIGlmIChmcm9tVG8uZG90KHBUbykgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b1JhZGlhbihkZWdyZWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b09wcG9zaXRlKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBVdGlscy5ub3JtYWxpemVEZWdyZWUoZGVncmVlKTtcclxuICAgIGlmIChub3JtYWxpemVkIDw9IDE4MCkge1xyXG4gICAgICByZXR1cm4gKDkwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICAgIH1cclxuICAgIHJldHVybiAoMjcwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIG5vcm1hbGl6ZURlZ3JlZShkZWdyZWU6IG51bWJlcikge1xyXG4gICAgY29uc3QgcmVtYWluZGVyID0gZGVncmVlICUgMzYwO1xyXG4gICAgcmV0dXJuIHJlbWFpbmRlciA8IDAgPyByZW1haW5kZXIgKyAzNjAgOiByZW1haW5kZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHJhbmQocmVuZ2U6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWIHtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRMZW5ndGg6IG51bWJlcjtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRBbmdsZTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgYWRkKHY6IFYpOiBWO1xyXG4gIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBhZGQodjogYW55LCB5PzogbnVtYmVyKTogViB7XHJcbiAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcclxuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2LnggfHwgMCksIHRoaXMueSArICh2LnkgfHwgMCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2IHx8IDApLCB0aGlzLnkgKyAoeSB8fCAwKSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBWKTogVjtcclxuICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBhbnksIHk/OiBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYueCB8fCAwKSwgdGhpcy55IC0gKHYueSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYgfHwgMCksIHRoaXMueSAtICh5IHx8IDApKTtcclxuICB9XHJcbiAgcHVibGljIG11bHRpcGx5KHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgZGl2aWRlKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbW9kdWxvKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdi54LCB0aGlzLnkgJSB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbmVnYXRlKCk6IFYge1xyXG4gICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xyXG4gIH1cclxuICBwdWJsaWMgZGlzdGFuY2UodjogVik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcclxuICB9XHJcbiAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jYWxjdWxhdGVkTGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcclxuICB9XHJcbiAgcHVibGljIG5vcm1hbGl6ZSgpOiBWIHtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgY29uc3Qgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGVJblJhZGlhbnMoKTogbnVtYmVyIHtcclxuICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRBbmdsZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcclxuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcclxuICB9XHJcbiAgcHVibGljIGRvdChwb2ludDogViA9IHRoaXMpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xyXG4gIH1cclxuICBwdWJsaWMgY3Jvc3MocG9pbnQ6IFYpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xyXG4gIH1cclxuICBwdWJsaWMgcm90YXRlKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG4gICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgZGlyZWN0aW9uKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtaW5pbWl6ZSgpIHtcclxuICAgIHJldHVybiB7IHg6IE1hdGgucm91bmQodGhpcy54KSwgeTogTWF0aC5yb3VuZCh0aGlzLnkpIH0gYXMgVjtcclxuICB9XHJcbn1cclxuIl19
