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
        this.argNames = Object.keys(allowLibs);
        this.argValues = this.argNames.map(function (key) { return allowLibs[key]; });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9jbGllbnQvYXJlbmFXb3JrZXIudHMiLCJzcmMvbWFpbi9jb3JlL0FjdG9yLnRzIiwic3JjL21haW4vY29yZS9Db21tYW5kLnRzIiwic3JjL21haW4vY29yZS9Db25maWdzLnRzIiwic3JjL21haW4vY29yZS9Db25zdHMudHMiLCJzcmMvbWFpbi9jb3JlL0NvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL0V4cG9zZWRTY3JpcHRMb2FkZXIudHMiLCJzcmMvbWFpbi9jb3JlL0ZpZWxkLnRzIiwic3JjL21haW4vY29yZS9GaXJlUGFyYW0udHMiLCJzcmMvbWFpbi9jb3JlL0Z4LnRzIiwic3JjL21haW4vY29yZS9MYXNlci50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZS50cyIsInNyYy9tYWluL2NvcmUvTWlzc2lsZUNvbW1hbmQudHMiLCJzcmMvbWFpbi9jb3JlL01pc3NpbGVDb250cm9sbGVyLnRzIiwic3JjL21haW4vY29yZS9TaG90LnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyLnRzIiwic3JjL21haW4vY29yZS9Tb3VyY2VyQ29tbWFuZC50cyIsInNyYy9tYWluL2NvcmUvU291cmNlckNvbnRyb2xsZXIudHMiLCJzcmMvbWFpbi9jb3JlL1V0aWxzLnRzIiwic3JjL21haW4vY29yZS9WLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUJBK0lBOztBQS9JQSx1Q0FBa0M7QUFLbEMsbUVBQThEO0FBNEQ5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQztBQUM5QixJQUFNLFNBQVMsR0FBaUMsRUFBRSxDQUFDO0FBRW5ELFNBQVMsR0FBRyxVQUFDLEVBQVE7UUFBTixjQUFJO0lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDM0IsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRCxJQUFNLGdCQUFnQixHQUFHLElBQXdCLENBQUM7SUFDbEQsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBaUIsQ0FBQztJQUNsRCxJQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUF1QixDQUFDO0lBQ3pELElBQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDL0IsSUFBTSxRQUFRLEdBQXNCO1FBQ2xDLFlBQVksRUFBRTs7Z0JBQ1osc0JBQU8sSUFBSSxPQUFPLENBQU8sVUFBQSxPQUFPO3dCQUM5QixJQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQzt3QkFDekIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQzt3QkFDOUIsV0FBVyxDQUFDOzRCQUNWLFFBQVEsVUFBQTs0QkFDUixPQUFPLEVBQUUsTUFBTTt5QkFDaEIsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxFQUFDOzthQUNKO1FBQ0QsVUFBVSxFQUFFLFVBQUMsU0FBaUI7WUFDNUIsV0FBVyxDQUFDO2dCQUNWLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixFQUFFLEVBQUUsU0FBUzthQUNkLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxXQUFXLEVBQUUsVUFBQyxTQUFpQjtZQUM3QixXQUFXLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLEVBQUUsRUFBRSxTQUFTO2dCQUNiLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTTthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsU0FBb0I7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsVUFBVSxFQUFFLFVBQUMsTUFBa0I7WUFDN0IsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsVUFBVTthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsV0FBVyxDQUFDO2dCQUNWLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsV0FBVzthQUNyQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFFLFVBQUMsS0FBYTtZQUNyQixXQUFXLENBQUM7Z0JBQ1YsS0FBSyxPQUFBO2dCQUNMLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRixDQUFDO0lBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsNkJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsV0FBVyxDQUFDO1FBQ1YsT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7S0FDekIsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDOzs7O3dCQUNULHFCQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUE3QixTQUE2QixDQUFDO29CQUNyQixLQUFLLEdBQUcsQ0FBQzs7O3lCQUFFLENBQUEsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7b0JBQ3BELHFCQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUE7O29CQUExQixTQUEwQixDQUFDOzs7b0JBRDJCLEtBQUssRUFBRSxDQUFBOzs7OztTQUdoRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQyxDQUFDOzs7O0FDNUlGLHlCQUFvQjtBQUNwQixxQ0FBZ0M7QUFHaEM7SUFRRSxlQUFtQixLQUFZLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFBbEMsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUh4QixTQUFJLEdBQUcsaUJBQU8sQ0FBQyxjQUFjLENBQUM7UUFDOUIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUdkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLHFCQUFLLEdBQVo7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSxzQkFBc0I7SUFDeEIsQ0FBQztJQUVNLHNCQUFNLEdBQWI7UUFDRSxhQUFhO0lBQ2YsQ0FBQztJQUVNLG9CQUFJLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0scUJBQUssR0FBWixVQUFhLElBQVU7UUFDckIsYUFBYTtJQUNmLENBQUM7SUFFTSxvQkFBSSxHQUFYO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0ExQ0EsQUEwQ0MsSUFBQTs7Ozs7QUNoREQ7SUFBQTtRQUNVLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFZN0IsQ0FBQztJQVhRLDBCQUFRLEdBQWY7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0gsQ0FBQztJQUNNLHdCQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBQ00sMEJBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7Ozs7O0FDYkQ7SUFBQTtJQW9CQSxDQUFDO0lBbkJlLHNCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLG9CQUFZLEdBQUcsR0FBRyxDQUFDO0lBQ25CLDRCQUFvQixHQUFHLEVBQUUsQ0FBQztJQUMxQix5QkFBaUIsR0FBRyxDQUFDLENBQUM7SUFDdEIsc0JBQWMsR0FBRyxHQUFHLENBQUM7SUFDckIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsc0JBQWMsR0FBRyxDQUFDLENBQUM7SUFDbkIsaUJBQVMsR0FBRyxJQUFJLENBQUM7SUFDakIsd0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLGVBQU8sR0FBRyxHQUFHLENBQUM7SUFDZCwwQkFBa0IsR0FBRyxHQUFHLENBQUM7SUFDekIsdUJBQWUsR0FBRyxHQUFHLENBQUM7SUFDdEIsK0JBQXVCLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLHVCQUFlLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLHFDQUE2QixHQUFHLElBQUksQ0FBQztJQUNyQyxvQ0FBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsMkJBQW1CLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLGlCQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLCtCQUF1QixHQUFHLEdBQUcsQ0FBQztJQUM5QyxjQUFDO0NBcEJELEFBb0JDLElBQUE7a0JBcEJvQixPQUFPOzs7O0FDQTVCO0lBQUE7SUFLQSxDQUFDO0lBSmUsc0JBQWUsR0FBRyxDQUFDLENBQUM7SUFDcEIscUJBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixrQkFBVyxHQUFHLFlBQVksQ0FBQztJQUMzQixvQkFBYSxHQUFHLGNBQWMsQ0FBQztJQUMvQyxhQUFDO0NBTEQsQUFLQyxJQUFBO2tCQUxvQixNQUFNOzs7O0FDRzNCO0lBV0Usb0JBQVksS0FBWTtRQUF4QixpQkFRQztRQWJPLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGFBQVEsR0FBRztZQUNoQixLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxDQUFDO1FBR0EsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksRUFBakIsQ0FBaUIsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQU0sT0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQUMsS0FBYTtZQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTs7Ozs7QUNyQkQsbUJBQW1CLFdBQWdCLEVBQUUsSUFBYztJQUNqRDtRQUNFLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ3RDLE1BQU0sQ0FBQyxJQUFLLEdBQVcsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFRDtJQU1FO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLEdBQUcsRUFBRTtnQkFBQyxpQkFBVTtxQkFBVixVQUFVLEVBQVYscUJBQVUsRUFBVixJQUFVO29CQUFWLDRCQUFVOztnQkFDZCxlQUFlO1lBQ2pCLENBQUM7U0FDRixDQUFDO1FBQ0YsSUFBTSxTQUFTLEdBQUc7WUFDaEIsTUFBTSxRQUFBO1lBQ04sTUFBTSxRQUFBO1lBQ04sTUFBTSxRQUFBO1lBQ04sT0FBTyxTQUFBO1lBQ1AsS0FBSyxPQUFBO1lBQ0wsSUFBSSxNQUFBO1lBQ0osSUFBSSxNQUFBO1lBQ0osTUFBTSxRQUFBO1lBQ04sSUFBSSxNQUFBO1lBQ0osR0FBRyxLQUFBO1lBQ0gsUUFBUSxVQUFBO1lBQ1IsU0FBUyxXQUFBO1lBQ1QsUUFBUSxVQUFBO1lBQ1IsVUFBVSxZQUFBO1lBQ1YsS0FBSyxPQUFBO1lBQ0wsUUFBUSxVQUFBO1lBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFDLFNBQWlCLENBQUMsR0FBRyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRU0sMENBQVksR0FBbkI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLCtDQUFpQixHQUF4QjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFTSxrQ0FBSSxHQUFYLFVBQVksTUFBYztRQUN4QixJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFDNUIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FsREEsQUFrREMsSUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVERCx5QkFBb0I7QUFFcEIscUNBQWdDO0FBSWhDLGlDQUE0QjtBQUs1QixJQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUU5QjtJQVlFLGVBQW9CLHVCQUFnRCxFQUFTLE1BQXVCO1FBQXZCLHVCQUFBLEVBQUEsY0FBdUI7UUFBaEYsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBWDVGLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFPZixlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTNCLGVBQVUsR0FBTSxJQUFJLFdBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRU0sK0JBQWUsR0FBdEIsVUFBdUIsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUNqRixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sQ0FBQyxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN0QyxJQUFNLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFWSx1QkFBTyxHQUFwQixVQUFxQixRQUEyQixFQUFFLEtBQWlDOzs7Ozs7OEJBQzlDLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUTs7OzZCQUFiLENBQUEsY0FBYSxDQUFBO3dCQUF4QixPQUFPO3dCQUNoQixRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDaEMscUJBQU0sUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFBOzt3QkFBN0IsU0FBNkIsQ0FBQzt3QkFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNmLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNqQyxxQkFBTSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDOzs7d0JBTFYsSUFBYSxDQUFBOzs7Ozs7S0FPcEM7SUFFWSx1QkFBTyxHQUFwQixVQUFxQixRQUEyQjs7OztnQkFDOUMsc0JBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxPQUFnQjt3QkFDN0MsSUFBSSxDQUFDOzRCQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO3dCQUN0RCxDQUFDO3dCQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ2YsUUFBUSxDQUFDLE9BQU8sQ0FBQywwQ0FBbUMsS0FBSyxDQUFDLE9BQVMsQ0FBQyxDQUFDO3dCQUN2RSxDQUFDO29CQUNILENBQUMsQ0FBQyxFQUFDOzs7S0FDSjtJQUVNLDBCQUFVLEdBQWpCLFVBQWtCLE9BQWdCO1FBQ2hDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSx1QkFBTyxHQUFkLFVBQWUsSUFBVTtRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0sMEJBQVUsR0FBakIsVUFBa0IsTUFBWTtRQUM1QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVNLHFCQUFLLEdBQVosVUFBYSxFQUFNO1FBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBUSxHQUFmLFVBQWdCLE1BQVU7UUFDeEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFWSxvQkFBSSxHQUFqQixVQUFrQixRQUEyQjs7Ozs7O3dCQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7d0JBQ3JELENBQUM7d0JBRUQsb0NBQW9DO3dCQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFFbkMsY0FBYzt3QkFDZCxxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLE9BQWdCO2dDQUM1QyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBQ2hCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEVBQUUsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQzs0QkFDeEYsQ0FBQyxDQUFDLEVBQUE7O3dCQUpGLGNBQWM7d0JBQ2QsU0FHRSxDQUFDO3dCQUVILGVBQWU7d0JBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7d0JBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQzt3QkFFMUMsYUFBYTt3QkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQzt3QkFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7d0JBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFaLENBQVksQ0FBQyxDQUFDO3dCQUV4QyxjQUFjO3dCQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRTlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFFYixVQUFVO3dCQUNWLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Ozs7O0tBQy9CO0lBRU8sMkJBQVcsR0FBbkIsVUFBb0IsUUFBMkI7UUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUc7b0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixPQUFPLEVBQUUsSUFBSTtvQkFDYixNQUFNLEVBQUUsSUFBSTtvQkFDWixRQUFRLEVBQUUsSUFBSTtpQkFDZixDQUFDO2dCQUNGLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFDRCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUMzQixPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBRWpFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsS0FBSzthQUNkLENBQUM7WUFDRixRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxJQUFJO1NBQ2IsQ0FBQztRQUNGLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTyw4QkFBYyxHQUF0QixVQUF1QixRQUEyQjtRQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMseUNBQXlDO1lBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVNLHlCQUFTLEdBQWhCLFVBQWlCLEtBQWMsRUFBRSxLQUF3QjtRQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLDBCQUFVLEdBQWpCLFVBQWtCLEtBQWMsRUFBRSxLQUF3QjtRQUExRCxpQkFJQztRQUhDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sMEJBQVUsR0FBbEIsVUFBbUIsS0FBYyxFQUFFLElBQVU7UUFDM0MsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNyQyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUQsSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFTSw4QkFBYyxHQUFyQixVQUFzQixJQUFVO1FBQzlCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDeEIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztZQUN4QyxNQUFNLENBQUMsQ0FDTCxLQUFLLENBQUMsU0FBUztnQkFDZixLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLO2dCQUMxQixlQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDbEUsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDaEQsTUFBTSxDQUFDLENBQ0wsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssSUFBSSxlQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDakgsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHdDQUF3QixHQUEvQixVQUFnQyxJQUFVO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVPLDZCQUFhLEdBQXJCO1FBQ0UsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFnQjtZQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTSx1QkFBTyxHQUFkO1FBQ0UsSUFBTSxPQUFPLEdBQWdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDM0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRztnQkFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE9BQU87Z0JBQ3JDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDeEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO2FBQ3JCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVPLG9CQUFJLEdBQVo7UUFDRSxJQUFNLFlBQVksR0FBa0IsRUFBRSxDQUFDO1FBQ3ZDLElBQU0sU0FBUyxHQUFlLEVBQUUsQ0FBQztRQUNqQyxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQ3pCLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFdBQVcsR0FBRyxVQUFDLENBQU8sSUFBbUIsT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBcEIsQ0FBb0IsQ0FBQztRQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7WUFDdEIsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2IsQ0FBQyxFQUFFLFlBQVk7WUFDZixDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxNQUFNO1NBQ1YsQ0FBQztJQUNKLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0EzUkEsQUEyUkMsSUFBQTs7Ozs7QUN0U0Q7SUFBQTtJQWtCQSxDQUFDO0lBakJlLGVBQUssR0FBbkIsVUFBb0IsS0FBYSxFQUFFLFNBQWlCO1FBQ2xELElBQU0sTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDL0IsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUM3QixNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDYSxpQkFBTyxHQUFyQixVQUFzQixHQUE0QztRQUNoRSxJQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUtILGdCQUFDO0FBQUQsQ0FsQkEsQUFrQkMsSUFBQTs7Ozs7QUNoQkQ7SUFJRSxZQUFtQixLQUFZLEVBQVMsUUFBVyxFQUFTLEtBQVEsRUFBUyxNQUFjO1FBQXhFLFVBQUssR0FBTCxLQUFLLENBQU87UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFHO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBRztRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVNLG1CQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDO0lBRU0saUJBQUksR0FBWDtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxpQkFBSSxHQUFYO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1YsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSztZQUNiLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDM0IsQ0FBQztJQUNKLENBQUM7SUFDSCxTQUFDO0FBQUQsQ0EzQkEsQUEyQkMsSUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDL0JELCtCQUEwQjtBQUkxQix5QkFBb0I7QUFDcEIscUNBQWdDO0FBRWhDO0lBQW1DLHlCQUFJO0lBSXJDLGVBQVksS0FBWSxFQUFFLEtBQWMsRUFBUyxTQUFpQixFQUFFLEtBQWE7UUFBakYsWUFDRSxrQkFBTSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUc3QjtRQUpnRCxlQUFTLEdBQVQsU0FBUyxDQUFRO1FBSDNELGlCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFlBQU0sR0FBRyxjQUFNLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQztRQUl0QixLQUFJLENBQUMsS0FBSyxHQUFHLFdBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQU8sQ0FBQyxjQUFjLENBQUM7O0lBQ3pDLENBQUM7SUFFTSxzQkFBTSxHQUFiO1FBQ0UsaUJBQU0sTUFBTSxXQUFFLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxJQUFJLGlCQUFPLENBQUMsaUJBQWlCLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBQ0gsWUFBQztBQUFELENBakJBLEFBaUJDLENBakJrQyxjQUFJLEdBaUJ0Qzs7Ozs7Ozs7Ozs7Ozs7O0FDdkJELCtCQUEwQjtBQU0xQixxQ0FBZ0M7QUFDaEMsbURBQThDO0FBQzlDLHlEQUFvRDtBQUNwRCxtQ0FBOEI7QUFHOUI7SUFBcUMsMkJBQUk7SUFVdkMsaUJBQVksS0FBWSxFQUFFLEtBQWMsRUFBUyxHQUE0QztRQUE3RixZQUNFLGtCQUFNLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBTS9CO1FBUGdELFNBQUcsR0FBSCxHQUFHLENBQXlDO1FBVHRGLGlCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLFlBQU0sR0FBRyxjQUFNLE9BQUEsRUFBRSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUE1QixDQUE0QixDQUFDO1FBQzVDLFVBQUksR0FBRyxHQUFHLENBQUM7UUFDWCxlQUFTLEdBQUcsSUFBSSxDQUFDO1FBUXRCLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsS0FBSyxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDdEUsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSx3QkFBYyxDQUFDLEtBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckIsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLDJCQUFpQixDQUFDLEtBQUksQ0FBQyxDQUFDOztJQUNoRCxDQUFDO0lBRU0seUJBQU8sR0FBZDtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLGtCQUFrQjtZQUNsQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSw2QkFBMkIsS0FBSyxDQUFDLE9BQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRyxDQUFDO2dCQUFTLENBQUM7WUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBRU0sMEJBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sdUJBQUssR0FBWixVQUFhLE1BQVk7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLDBCQUFRLEdBQWYsVUFBZ0IsU0FBaUI7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxxQkFBRyxHQUFWLFVBQVcsT0FBZTtRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLDJCQUFTLEdBQWhCLFVBQWlCLFNBQWlCLEVBQUUsS0FBYSxFQUFFLEtBQWM7UUFDL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxXQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxzQkFBSSxHQUFYO1FBQ0UsSUFBTSxTQUFTLEdBQUcsaUJBQU0sSUFBSSxXQUFFLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0gsY0FBQztBQUFELENBdkVBLEFBdUVDLENBdkVvQyxjQUFJLEdBdUV4Qzs7Ozs7Ozs7Ozs7Ozs7O0FDcEZELHFDQUFnQztBQUdoQyxxQ0FBZ0M7QUFDaEMseUJBQW9CO0FBRXBCO0lBQTRDLGtDQUFPO0lBS2pELHdCQUFtQixPQUFnQjtRQUFuQyxZQUNFLGlCQUFPLFNBRVI7UUFIa0IsYUFBTyxHQUFQLE9BQU8sQ0FBUztRQUVqQyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0lBQ2YsQ0FBQztJQUVNLDhCQUFLLEdBQVo7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRU0sZ0NBQU8sR0FBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNwQyxJQUFNLFVBQVUsR0FBRyxXQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDN0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0ExQkEsQUEwQkMsQ0ExQjJDLGlCQUFPLEdBMEJsRDs7Ozs7Ozs7Ozs7Ozs7O0FDaENELDJDQUFzQztBQUd0QyxpQ0FBNEI7QUFHNUI7SUFBK0MscUNBQVU7SUFXdkQsMkJBQVksT0FBZ0I7UUFBNUIsWUFDRSxrQkFBTSxPQUFPLENBQUMsU0E0Q2Y7UUEzQ0MsS0FBSSxDQUFDLFNBQVMsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLFNBQVMsRUFBakIsQ0FBaUIsQ0FBQztRQUV6QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFaEMsS0FBSSxDQUFDLElBQUksR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLElBQUksRUFBWixDQUFZLENBQUM7UUFFL0IsS0FBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN2QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7WUFDcEIsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELElBQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7UUFFRixLQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDMUIsQ0FBQyxDQUFDO1FBRUYsS0FBSSxDQUFDLFNBQVMsR0FBRztZQUNmLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxRQUFRLEdBQUc7WUFDZCxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxRQUFRLEdBQUcsVUFBQyxLQUFVLElBQXNCLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGlCQUFpQixFQUEzRCxDQUEyRCxDQUFDO1FBQzlHLEtBQUksQ0FBQyxHQUFHLEdBQUc7WUFBQyxpQkFBaUI7aUJBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtnQkFBakIsNEJBQWlCOztZQUMzQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEcsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN2QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLE9BQTJCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQS9EQSxBQStEQyxDQS9EOEMsb0JBQVUsR0ErRHhEOzs7Ozs7Ozs7Ozs7Ozs7QUNuRUQsaUNBQTRCO0FBQzVCLDJCQUFzQjtBQUV0Qix5QkFBb0I7QUFDcEIsaUNBQTRCO0FBRTVCO0lBQWtDLHdCQUFLO0lBS3JDLGNBQVksS0FBWSxFQUFTLEtBQWMsRUFBUyxJQUFZO1FBQXBFLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQ2pEO1FBRmdDLFdBQUssR0FBTCxLQUFLLENBQVM7UUFBUyxVQUFJLEdBQUosSUFBSSxDQUFRO1FBSjdELGlCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFlBQU0sR0FBRyxjQUFNLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQztRQUNqQixlQUFTLEdBQUcsS0FBSyxDQUFDOztJQUl6QixDQUFDO0lBRU0scUJBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQUVPLHdCQUFTLEdBQWpCO1FBQ0UsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQU0sS0FBSyxHQUFHLElBQUksV0FBQyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDOUQsSUFBTSxRQUFNLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxZQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztJQUNILENBQUM7SUFFTSx1QkFBUSxHQUFmLFVBQWdCLE9BQWdCO1FBQzlCLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBRU0sdUJBQVEsR0FBZjtRQUNFLGFBQWE7SUFDZixDQUFDO0lBRU0sbUJBQUksR0FBWDtRQUNFLE1BQU0sQ0FBQztZQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1YsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUNqQixDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDYixDQUFDO0lBQ0osQ0FBQztJQUNILFdBQUM7QUFBRCxDQWxEQSxBQWtEQyxDQWxEaUMsZUFBSyxHQWtEdEM7Ozs7Ozs7Ozs7Ozs7OztBQzFERCxpQ0FBNEI7QUFFNUIsbURBQThDO0FBQzlDLHlEQUFvRDtBQUVwRCxxQ0FBZ0M7QUFDaEMsbUNBQThCO0FBQzlCLGlDQUE0QjtBQUM1Qix5QkFBb0I7QUFFcEIsaUNBQTRCO0FBQzVCLHFDQUFnQztBQUVoQywyQkFBc0I7QUFTdEI7SUFBcUMsMkJBQUs7SUFheEMsaUJBQ0UsS0FBWSxFQUNaLENBQVMsRUFDVCxDQUFTLEVBQ0YsUUFBZ0IsRUFDaEIsT0FBZSxFQUNmLElBQVksRUFDWixLQUFhO1FBUHRCLFlBU0Usa0JBQU0sS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FLbkI7UUFWUSxjQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixVQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osV0FBSyxHQUFMLEtBQUssQ0FBUTtRQW5CZixXQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsaUJBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsWUFBTSxHQUFHLGlCQUFPLENBQUMsY0FBYyxDQUFDO1FBQ2hDLGlCQUFXLEdBQUcsaUJBQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUMzQyxVQUFJLEdBQUcsaUJBQU8sQ0FBQyxZQUFZLENBQUM7UUFLM0IsU0FBRyxHQUFxRCxJQUFJLENBQUM7UUFjbkUsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxjQUFjLENBQUM7UUFDdEYsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHdCQUFjLENBQUMsS0FBSSxDQUFDLENBQUM7UUFDeEMsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLDJCQUFpQixDQUFDLEtBQUksQ0FBQyxDQUFDOztJQUNoRCxDQUFDO0lBRU0seUJBQU8sR0FBZCxVQUFlLFlBQTBCO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sRUFBRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxDQUFDO1FBQ25ELENBQUM7SUFDSCxDQUFDO0lBRU0seUJBQU8sR0FBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsNkJBQTJCLEtBQUssQ0FBQyxPQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDaEcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixDQUFDO2dCQUFTLENBQUM7WUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBRU0sd0JBQU0sR0FBYjtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQUMsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzlELElBQU0sUUFBTSxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksWUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFRCxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFM0QsVUFBVTtRQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckQseUNBQXlDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLGlCQUFPLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUM1RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxpQkFBTyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRUQseUNBQXlDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLGlCQUFPLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7WUFDdkcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBRUQscUJBQXFCO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQUMsbUJBQW1CLENBQUM7WUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksV0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBVyxJQUFJLGlCQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpELFdBQVc7UUFDWCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQU0sWUFBWSxHQUFHLFFBQVEsR0FBRyxpQkFBTyxDQUFDLDZCQUE2QixDQUFDO1lBQ3RFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLGlCQUFPLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQzVDLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLHNCQUFJLEdBQVgsVUFBWSxLQUFnQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakQsSUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVNLDBCQUFRLEdBQWYsVUFBZ0IsU0FBaUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLGVBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLHVCQUFLLEdBQVosVUFBYSxJQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLHFCQUFHLEdBQVYsVUFBVyxPQUFlO1FBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sMkJBQVMsR0FBaEIsVUFBaUIsU0FBaUIsRUFBRSxLQUFhLEVBQUUsS0FBYztRQUMvRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLFdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLHNCQUFJLEdBQVg7UUFDRSxJQUFNLElBQUksR0FBZ0I7WUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1YsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUNqQixDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pCLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDOUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ25CLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDeEIsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FyS0EsQUFxS0MsQ0FyS29DLGVBQUssR0FxS3pDOzs7Ozs7Ozs7Ozs7Ozs7QUMzTEQscUNBQWdDO0FBRWhDLHFDQUFnQztBQUdoQztJQUE0QyxrQ0FBTztJQU1qRCx3QkFBbUIsT0FBZ0I7UUFBbkMsWUFDRSxpQkFBTyxTQUVSO1FBSGtCLGFBQU8sR0FBUCxPQUFPLENBQVM7UUFFakMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUNmLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRU0sZ0NBQU8sR0FBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDeEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FqQ0EsQUFpQ0MsQ0FqQzJDLGlCQUFPLEdBaUNsRDs7Ozs7Ozs7Ozs7Ozs7O0FDdENELDJDQUFzQztBQUd0QyxxQ0FBZ0M7QUFDaEMsaUNBQTRCO0FBQzVCLHlDQUFvQztBQUlwQztJQUErQyxxQ0FBVTtJQW9CdkQsMkJBQVksT0FBZ0I7UUFBNUIsWUFDRSxrQkFBTSxPQUFPLENBQUMsU0FpRWY7UUEvREMsS0FBSSxDQUFDLE1BQU0sR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLE1BQU0sRUFBZCxDQUFjLENBQUM7UUFDbkMsS0FBSSxDQUFDLFdBQVcsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLFdBQVcsRUFBbkIsQ0FBbUIsQ0FBQztRQUM3QyxLQUFJLENBQUMsV0FBVyxHQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsV0FBVyxFQUFuQixDQUFtQixDQUFDO1FBQzdDLEtBQUksQ0FBQyxJQUFJLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQVosQ0FBWSxDQUFDO1FBRS9CLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDNUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxLQUFJLENBQUMsU0FBUyxHQUFHLFVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLO1lBQ3ZDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxJQUFJLGlCQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xDLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCxJQUFNLGVBQWUsR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsRCxJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsVUFBVSxHQUFHLFVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLO1lBQ3hDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxJQUFJLGlCQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xDLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCxJQUFNLGVBQWUsR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsRCxJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUNGLEtBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN2QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUNGLEtBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixLQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxTQUFTLEVBQUUsS0FBSztZQUNoQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksR0FBRyxtQkFBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDO1FBRUYsS0FBSSxDQUFDLFdBQVcsR0FBRyxVQUFBLEdBQUc7WUFDcEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDO1FBRUYsSUFBTSxRQUFRLEdBQUcsVUFBQyxLQUFVLElBQXNCLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGlCQUFpQixFQUEzRCxDQUEyRCxDQUFDO1FBQzlHLEtBQUksQ0FBQyxHQUFHLEdBQUc7WUFBQyxpQkFBaUI7aUJBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtnQkFBakIsNEJBQWlCOztZQUMzQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEcsQ0FBQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSztZQUN2QyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLE9BQTJCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQTdGQSxBQTZGQyxDQTdGOEMsb0JBQVUsR0E2RnhEOzs7OztBQ3RHRCx5QkFBb0I7QUFHcEIsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBRXZCO0lBQUE7SUE4REEsQ0FBQztJQTdEZSxpQkFBVyxHQUF6QixVQUEwQixDQUFJLEVBQUUsU0FBaUIsRUFBRSxLQUFhLEVBQUUsS0FBYTtRQUM3RSxJQUFNLGFBQWEsR0FBRyxVQUFDLENBQUksSUFBSyxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUF0QixDQUFzQixDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUVELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFOUQsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQWpELENBQWlELENBQUM7UUFDaEUsQ0FBQztRQUNELE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBbkQsQ0FBbUQsQ0FBQztJQUNsRSxDQUFDO0lBRWEsVUFBSSxHQUFsQixVQUFtQixJQUFPLEVBQUUsTUFBYztRQUN4QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQU0sU0FBUyxHQUFHLElBQUksV0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxVQUFDLE1BQVM7WUFDZixNQUFNLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzNFLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFYSxrQkFBWSxHQUExQixVQUEyQixDQUFJLEVBQUUsQ0FBSSxFQUFFLENBQUk7UUFDekMsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVhLGNBQVEsR0FBdEIsVUFBdUIsTUFBYztRQUNuQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRWEsZ0JBQVUsR0FBeEIsVUFBeUIsTUFBYztRQUNyQyxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzVDLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUM3QyxDQUFDO0lBRWMscUJBQWUsR0FBOUIsVUFBK0IsTUFBYztRQUMzQyxJQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDckQsQ0FBQztJQUVhLFVBQUksR0FBbEIsVUFBbUIsS0FBYTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBQ0gsWUFBQztBQUFELENBOURBLEFBOERDLElBQUE7Ozs7O0FDbkVEO0lBSUUsV0FBbUIsQ0FBUyxFQUFTLENBQVM7UUFBM0IsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFBRyxDQUFDO0lBSTNDLGVBQUcsR0FBVixVQUFXLENBQU0sRUFBRSxDQUFVO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUdNLG9CQUFRLEdBQWYsVUFBZ0IsQ0FBTSxFQUFFLENBQVU7UUFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ00sb0JBQVEsR0FBZixVQUFnQixDQUFhO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTSxrQkFBTSxHQUFiLFVBQWMsQ0FBYTtRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ00sa0JBQU0sR0FBYixVQUFjLENBQWE7UUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNNLGtCQUFNLEdBQWI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDTSxvQkFBUSxHQUFmLFVBQWdCLENBQUk7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUNNLGtCQUFNLEdBQWI7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDL0IsQ0FBQztRQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUNNLHFCQUFTLEdBQWhCO1FBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzlCLElBQU0sS0FBSyxHQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ00saUJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUNNLDBCQUFjLEdBQXJCO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDOUIsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFDTSxlQUFHLEdBQVYsVUFBVyxLQUFlO1FBQWYsc0JBQUEsRUFBQSxZQUFlO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDTSxpQkFBSyxHQUFaLFVBQWEsS0FBUTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ00sa0JBQU0sR0FBYixVQUFjLE1BQWM7UUFDMUIsSUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNhLFdBQVMsR0FBdkIsVUFBd0IsTUFBYztRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ00sb0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQU8sQ0FBQztJQUMvRCxDQUFDO0lBQ0gsUUFBQztBQUFELENBdEZBLEFBc0ZDLElBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEZpZWxkIGZyb20gJy4uL2NvcmUvRmllbGQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuLi9jb3JlL1NvdXJjZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vY29yZS9VdGlscyc7XHJcbmltcG9ydCBUaWNrRXZlbnRMaXN0ZW5lciBmcm9tICcuLi9jb3JlL1RpY2tFdmVudExpc3RlbmVyJztcclxuaW1wb3J0IHsgUGxheWVyc0R1bXAsIEZyYW1lRHVtcCwgUmVzdWx0RHVtcCB9IGZyb20gJy4uL2NvcmUvRHVtcCc7XHJcbmltcG9ydCBFeHBvc2VkU2NyaXB0TG9hZGVyIGZyb20gJy4uL2NvcmUvRXhwb3NlZFNjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllckluZm8ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBjb2xvcjogc3RyaW5nO1xyXG4gIHNvdXJjZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluaXRpYWxQYXJhbWV0ZXIge1xyXG4gIGlzRGVtbzogYm9vbGVhbjtcclxuICBzb3VyY2VzOiBQbGF5ZXJJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIERhdGEgPVxyXG4gIHwgTmV4dENvbW1hbmRcclxuICB8IFBsYXllcnNDb21tYW5kXHJcbiAgfCBQcmVUaGlua0NvbW1hbmRcclxuICB8IFBvc3RUaGlua0NvbW1hbmRcclxuICB8IEZpbmlzaGVkQ29tbWFuZFxyXG4gIHwgRW5kT2ZHYW1lQ29tbWFuZFxyXG4gIHwgRXJyb3JDb21tYW5kO1xyXG5cclxuaW50ZXJmYWNlIE5leHRDb21tYW5kIHtcclxuICBjb21tYW5kOiAnTmV4dCc7XHJcbiAgaXNzdWVkSWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBsYXllcnNDb21tYW5kIHtcclxuICBjb21tYW5kOiAnUGxheWVycyc7XHJcbiAgcGxheWVyczogUGxheWVyc0R1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQcmVUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQcmVUaGluayc7XHJcbiAgaWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RUaGlua0NvbW1hbmQge1xyXG4gIGNvbW1hbmQ6ICdQb3N0VGhpbmsnO1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgbG9hZGVkRnJhbWU6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZpbmlzaGVkQ29tbWFuZCB7XHJcbiAgY29tbWFuZDogJ0ZpbmlzaGVkJztcclxuICByZXN1bHQ6IFJlc3VsdER1bXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBFbmRPZkdhbWVDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRW5kT2ZHYW1lJztcclxuICBmcmFtZXM6IEZyYW1lRHVtcFtdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRXJyb3JDb21tYW5kIHtcclxuICBjb21tYW5kOiAnRXJyb3InO1xyXG4gIGVycm9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbmRlY2xhcmUgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobWVzc2FnZTogRGF0YSk6IHZvaWQ7XHJcblxyXG5sZXQgaXNzdWVJZCA9IDA7XHJcbmNvbnN0IGlzc3VlID0gKCkgPT4gaXNzdWVJZCsrO1xyXG5jb25zdCBjYWxsYmFja3M6IHsgW2lkOiBudW1iZXJdOiAoKSA9PiB2b2lkIH0gPSB7fTtcclxuXHJcbm9ubWVzc2FnZSA9ICh7IGRhdGEgfSkgPT4ge1xyXG4gIGlmIChkYXRhLmlzc3VlZElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGNhbGxiYWNrc1tkYXRhLmlzc3VlZElkXSgpO1xyXG4gICAgZGVsZXRlIGNhbGxiYWNrc1tkYXRhLmlzc3VlZElkXTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgaW5pdGlhbFBhcmFtZXRlciA9IGRhdGEgYXMgSW5pdGlhbFBhcmFtZXRlcjtcclxuICBjb25zdCBpc0RlbW8gPSBpbml0aWFsUGFyYW1ldGVyLmlzRGVtbyBhcyBib29sZWFuO1xyXG4gIGNvbnN0IHBsYXllcnMgPSBpbml0aWFsUGFyYW1ldGVyLnNvdXJjZXMgYXMgUGxheWVySW5mb1tdO1xyXG4gIGNvbnN0IGZyYW1lczogRnJhbWVEdW1wW10gPSBbXTtcclxuICBjb25zdCBsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIgPSB7XHJcbiAgICB3YWl0TmV4dFRpY2s6IGFzeW5jICgpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzc3VlZElkID0gaXNzdWUoKTtcclxuICAgICAgICBjYWxsYmFja3NbaXNzdWVkSWRdID0gcmVzb2x2ZTtcclxuICAgICAgICBwb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICBpc3N1ZWRJZCxcclxuICAgICAgICAgIGNvbW1hbmQ6ICdOZXh0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblByZVRoaW5rOiAoc291cmNlcklkOiBudW1iZXIpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGNvbW1hbmQ6ICdQcmVUaGluaycsXHJcbiAgICAgICAgaWQ6IHNvdXJjZXJJZFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvblBvc3RUaGluazogKHNvdXJjZXJJZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiAnUG9zdFRoaW5rJyxcclxuICAgICAgICBpZDogc291cmNlcklkLFxyXG4gICAgICAgIGxvYWRlZEZyYW1lOiBmcmFtZXMubGVuZ3RoXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRnJhbWU6IChmaWVsZER1bXA6IEZyYW1lRHVtcCkgPT4ge1xyXG4gICAgICBmcmFtZXMucHVzaChmaWVsZER1bXApO1xyXG4gICAgfSxcclxuICAgIG9uRmluaXNoZWQ6IChyZXN1bHQ6IFJlc3VsdER1bXApID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIHJlc3VsdCxcclxuICAgICAgICBjb21tYW5kOiAnRmluaXNoZWQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRW5kT2ZHYW1lOiAoKSA9PiB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICBmcmFtZXMsXHJcbiAgICAgICAgY29tbWFuZDogJ0VuZE9mR2FtZSdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25FcnJvcjogKGVycm9yOiBzdHJpbmcpID0+IHtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICAgIGNvbW1hbmQ6ICdFcnJvcidcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoRXhwb3NlZFNjcmlwdExvYWRlciwgaXNEZW1vKTtcclxuICBwbGF5ZXJzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgZmllbGQucmVnaXN0ZXJTb3VyY2VyKHZhbHVlLnNvdXJjZSwgdmFsdWUubmFtZSwgdmFsdWUubmFtZSwgdmFsdWUuY29sb3IpO1xyXG4gIH0pO1xyXG5cclxuICBwb3N0TWVzc2FnZSh7XHJcbiAgICBjb21tYW5kOiAnUGxheWVycycsXHJcbiAgICBwbGF5ZXJzOiBmaWVsZC5wbGF5ZXJzKClcclxuICB9KTtcclxuXHJcbiAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBmaWVsZC5jb21waWxlKGxpc3RlbmVyKTtcclxuICAgIGZvciAobGV0IGNvdW50ID0gMDsgY291bnQgPCAxMDAwMCAmJiAhZmllbGQuaXNGaW5pc2hlZDsgY291bnQrKykge1xyXG4gICAgICBhd2FpdCBmaWVsZC50aWNrKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICB9LCAwKTtcclxufTtcclxuIiwiaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIHtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICBwdWJsaWMgcG9zaXRpb246IFY7XHJcbiAgcHVibGljIHNwZWVkOiBWO1xyXG4gIHB1YmxpYyBkaXJlY3Rpb246IG51bWJlcjtcclxuICBwdWJsaWMgc2l6ZSA9IENvbmZpZ3MuQ09MTElTSU9OX1NJWkU7XHJcbiAgcHVibGljIHdhaXQgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmllbGQ6IEZpZWxkLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgdGhpcy53YWl0ID0gMDtcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih4LCB5KTtcclxuICAgIHRoaXMuc3BlZWQgPSBuZXcgVigwLCAwKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0aGluaygpIHtcclxuICAgIGlmICh0aGlzLndhaXQgPD0gMCkge1xyXG4gICAgICB0aGlzLndhaXQgPSAwO1xyXG4gICAgICB0aGlzLm9uVGhpbmsoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2FpdCA9IHRoaXMud2FpdCAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpOiB2b2lkIHtcclxuICAgIC8vIG5vdCB0aGluayBhbnl0aGluZy5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKTogdm9pZCB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHVtcCgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxpbWVudGF0aW9uJyk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmQge1xyXG4gIHByaXZhdGUgaXNBY2NlcHRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyB2YWxpZGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5pc0FjY2VwdGVkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb21tYW5kLicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwdWJsaWMgYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gdHJ1ZTtcclxuICB9XHJcbiAgcHVibGljIHVuYWNjZXB0KCkge1xyXG4gICAgdGhpcy5pc0FjY2VwdGVkID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ3Mge1xyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9TSElFTEQgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX0ZVRUwgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX01JU1NJTEVfQU1NTyA9IDIwO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfQVRURU5VQVRJT04gPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTRVJfTU9NRU5UVU0gPSAxMjg7XHJcbiAgcHVibGljIHN0YXRpYyBGVUVMX0NPU1QgPSAwLjI0O1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09MTElTSU9OX1NJWkUgPSA0O1xyXG4gIHB1YmxpYyBzdGF0aWMgU0NBTl9XQUlUID0gMC4zNTtcclxuICBwdWJsaWMgc3RhdGljIFNQRUVEX1JFU0lTVEFOQ0UgPSAwLjk2O1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JBVklUWSA9IDAuMTtcclxuICBwdWJsaWMgc3RhdGljIFRPUF9JTlZJU0lCTEVfSEFORCA9IDQ4MDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0JPUkRBUiA9IDQwMDtcclxuICBwdWJsaWMgc3RhdGljIERJU1RBTkNFX0lOVklTSUJMRV9IQU5EID0gMC4wMDg7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9CT1JERVIgPSAxMDA7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfTElORUFSX1dFSUdIVCA9IDAuMDU7XHJcbiAgcHVibGljIHN0YXRpYyBPVkVSSEVBVF9EQU1BR0VfUE9XRVJfV0VJR0hUID0gMC4wMTI7XHJcbiAgcHVibGljIHN0YXRpYyBHUk9VTkRfREFNQUdFX1NDQUxFID0gMTtcclxuICBwdWJsaWMgc3RhdGljIENPT0xfRE9XTiA9IDAuNTtcclxuICBwdWJsaWMgc3RhdGljIE9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFID0gMC40O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnN0cyB7XHJcbiAgcHVibGljIHN0YXRpYyBESVJFQ1RJT05fUklHSFQgPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUSU9OX0xFRlQgPSAtMTtcclxuICBwdWJsaWMgc3RhdGljIFZFUlRJQ0FMX1VQID0gJ3ZlcnRpYWxfdXAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVkVSVElDQUxfRE9XTiA9ICd2ZXJ0aWFsX2Rvd24nO1xyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgcHVibGljIGZyYW1lOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIGFsdGl0dWRlOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHdhaXQ6IChmcmFtZTogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBmdWVsOiAoKSA9PiBudW1iZXI7XHJcblxyXG4gIHByaXZhdGUgZnJhbWVzT2ZMaWZlOiBudW1iZXIgPSAwO1xyXG4gIHB1YmxpYyBwcmVUaGluayA9ICgpID0+IHtcclxuICAgIHRoaXMuZnJhbWVzT2ZMaWZlKys7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IoYWN0b3I6IEFjdG9yKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gKCkgPT4gdGhpcy5mcmFtZXNPZkxpZmU7XHJcbiAgICB0aGlzLmFsdGl0dWRlID0gKCkgPT4gYWN0b3IucG9zaXRpb24ueTtcclxuICAgIHRoaXMud2FpdCA9IChmcmFtZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmICgwIDwgZnJhbWUpIHtcclxuICAgICAgICBhY3Rvci53YWl0ICs9IGZyYW1lO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0KGNvbnN0cnVjdG9yOiBhbnksIGFyZ3M6IHN0cmluZ1tdKSB7XHJcbiAgZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH1cclxuICBmdW4ucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG4gIHJldHVybiBuZXcgKGZ1biBhcyBhbnkpKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zZWRTY3JpcHRMb2FkZXIgaW1wbGVtZW50cyBTY3JpcHRMb2FkZXIge1xyXG4gIHByaXZhdGUgYXJnVmFsdWVzOiBhbnlbXTtcclxuICBwcml2YXRlIGFyZ05hbWVzOiBzdHJpbmdbXTtcclxuICBwcml2YXRlIGJhbmxpc3Q6IHN0cmluZ1tdO1xyXG4gIHByaXZhdGUgY29uc29sZTogQ29uc29sZUxpa2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25zb2xlID0ge1xyXG4gICAgICBsb2c6ICguLi5tZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgLyogbm90aGluZy4uICovXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCBhbGxvd0xpYnMgPSB7XHJcbiAgICAgIE9iamVjdCxcclxuICAgICAgU3RyaW5nLFxyXG4gICAgICBOdW1iZXIsXHJcbiAgICAgIEJvb2xlYW4sXHJcbiAgICAgIEFycmF5LFxyXG4gICAgICBEYXRlLFxyXG4gICAgICBNYXRoLFxyXG4gICAgICBSZWdFeHAsXHJcbiAgICAgIEpTT04sXHJcbiAgICAgIE5hTixcclxuICAgICAgSW5maW5pdHksXHJcbiAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgcGFyc2VJbnQsXHJcbiAgICAgIHBhcnNlRmxvYXQsXHJcbiAgICAgIGlzTmFOLFxyXG4gICAgICBpc0Zpbml0ZSxcclxuICAgICAgY29uc29sZTogdGhpcy5jb25zb2xlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYXJnTmFtZXMgPSBPYmplY3Qua2V5cyhhbGxvd0xpYnMpO1xyXG4gICAgdGhpcy5hcmdWYWx1ZXMgPSB0aGlzLmFyZ05hbWVzLm1hcChrZXkgPT4gKGFsbG93TGlicyBhcyBhbnkpW2tleV0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRGVidWdnYWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEV4cG9zZWRDb25zb2xlKCk6IENvbnNvbGVMaWtlIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25zb2xlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoc2NyaXB0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IGFyZ05hbWVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgYXJnTmFtZXMgPSBhcmdOYW1lcy5jb25jYXQodGhpcy5hcmdOYW1lcyk7XHJcbiAgICBhcmdOYW1lcy5wdXNoKCdcInVzZSBzdHJpY3RcIjtcXG4nICsgc2NyaXB0KTtcclxuICAgIHJldHVybiBjb25zdHJ1Y3QoRnVuY3Rpb24sIGFyZ05hbWVzKS5hcHBseSh1bmRlZmluZWQsIHRoaXMuYXJnVmFsdWVzKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFRpY2tFdmVudExpc3RlbmVyIGZyb20gJy4vVGlja0V2ZW50TGlzdGVuZXInO1xyXG5pbXBvcnQgeyBGcmFtZUR1bXAsIFJlc3VsdER1bXAsIFNvdXJjZXJEdW1wLCBTaG90RHVtcCwgRnhEdW1wLCBQbGF5ZXJzRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IFNjcmlwdExvYWRlciwgeyBTY3JpcHRMb2FkZXJDb25zdHJ1Y3RvciB9IGZyb20gJy4vU2NyaXB0TG9hZGVyJztcclxuXHJcbmNvbnN0IERFTU9fRlJBTUVfTEVOR1RIID0gMTI4O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmllbGQge1xyXG4gIHByaXZhdGUgY3VycmVudElkID0gMDtcclxuICBwcml2YXRlIHNvdXJjZXJzOiBTb3VyY2VyW107XHJcbiAgcHJpdmF0ZSBzaG90czogU2hvdFtdO1xyXG4gIHByaXZhdGUgZnhzOiBGeFtdO1xyXG4gIHByaXZhdGUgZnJhbWU6IG51bWJlcjtcclxuICBwcml2YXRlIHJlc3VsdDogUmVzdWx0RHVtcDtcclxuICBwdWJsaWMgY2VudGVyOiBudW1iZXI7XHJcbiAgcHVibGljIGlzRmluaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBkdW1teUVuZW15OiBWID0gbmV3IFYoMCwgMTUwKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY3JpcHRMb2FkZXJDb25zdHJ1Y3RvcjogU2NyaXB0TG9hZGVyQ29uc3RydWN0b3IsIHB1YmxpYyBpc0RlbW86IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICB0aGlzLnNvdXJjZXJzID0gW107XHJcbiAgICB0aGlzLnNob3RzID0gW107XHJcbiAgICB0aGlzLmZ4cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZ2lzdGVyU291cmNlcihzb3VyY2U6IHN0cmluZywgYWNjb3VudDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHNpZGUgPSB0aGlzLnNvdXJjZXJzLmxlbmd0aCAlIDIgPT09IDAgPyAtMSA6IDE7XHJcbiAgICBjb25zdCB4ID0gVXRpbHMucmFuZCg4MCkgKyAxNjAgKiBzaWRlO1xyXG4gICAgY29uc3QgeSA9IFV0aWxzLnJhbmQoMTYwKSArIDgwO1xyXG4gICAgdGhpcy5hZGRTb3VyY2VyKG5ldyBTb3VyY2VyKHRoaXMsIHgsIHksIHNvdXJjZSwgYWNjb3VudCwgbmFtZSwgY29sb3IpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lciwgdGhpbms6IChzb3VyY2VyOiBTb3VyY2VyKSA9PiB2b2lkKSB7XHJcbiAgICBmb3IgKGNvbnN0IHNvdXJjZXIgb2YgdGhpcy5zb3VyY2Vycykge1xyXG4gICAgICBsaXN0ZW5lci5vblByZVRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgICAgdGhpbmsoc291cmNlcik7XHJcbiAgICAgIGxpc3RlbmVyLm9uUG9zdFRoaW5rKHNvdXJjZXIuaWQpO1xyXG4gICAgICBhd2FpdCBsaXN0ZW5lci53YWl0TmV4dFRpY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBjb21waWxlKGxpc3RlbmVyOiBUaWNrRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzb3VyY2VyLmNvbXBpbGUobmV3IHRoaXMuc2NyaXB0TG9hZGVyQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbGlzdGVuZXIub25FcnJvcihgVGhlcmUgaXMgYW4gZXJyb3IgaW4geW91ciBjb2RlOuOAgCR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkU291cmNlcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzb3VyY2VyLmlkID0gdGhpcy5jdXJyZW50SWQrKztcclxuICAgIHRoaXMuc291cmNlcnMucHVzaChzb3VyY2VyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRTaG90KHNob3Q6IFNob3QpIHtcclxuICAgIHNob3QuaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5zaG90cy5wdXNoKHNob3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZVNob3QodGFyZ2V0OiBTaG90KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hvdHMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgaWYgKDAgPD0gaW5kZXgpIHtcclxuICAgICAgdGhpcy5zaG90cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZEZ4KGZ4OiBGeCkge1xyXG4gICAgZnguaWQgPSB0aGlzLmN1cnJlbnRJZCsrO1xyXG4gICAgdGhpcy5meHMucHVzaChmeCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlRngodGFyZ2V0OiBGeCkge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZ4cy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICBpZiAoMCA8PSBpbmRleCkge1xyXG4gICAgICB0aGlzLmZ4cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHRpY2sobGlzdGVuZXI6IFRpY2tFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAodGhpcy5mcmFtZSA9PT0gMCkge1xyXG4gICAgICBsaXN0ZW5lci5vbkZyYW1lKHRoaXMuZHVtcCgpKTsgLy8gU2F2ZSB0aGUgMCBmcmFtZS5cclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBiZSB1c2VkIGluIHRoZSBpbnZpc2libGUgaGFuZC5cclxuICAgIHRoaXMuY2VudGVyID0gdGhpcy5jb21wdXRlQ2VudGVyKCk7XHJcblxyXG4gICAgLy8gVGhpbmsgcGhhc2VcclxuICAgIGF3YWl0IHRoaXMucHJvY2VzcyhsaXN0ZW5lciwgKHNvdXJjZXI6IFNvdXJjZXIpID0+IHtcclxuICAgICAgc291cmNlci50aGluaygpO1xyXG4gICAgICB0aGlzLnNob3RzLmZpbHRlcihzaG90ID0+IHNob3Qub3duZXIuaWQgPT09IHNvdXJjZXIuaWQpLmZvckVhY2goc2hvdCA9PiBzaG90LnRoaW5rKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQWN0aW9uIHBoYXNlXHJcbiAgICB0aGlzLnNvdXJjZXJzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLmFjdGlvbigpKTtcclxuICAgIHRoaXMuZnhzLmZvckVhY2goYWN0b3IgPT4gYWN0b3IuYWN0aW9uKCkpO1xyXG5cclxuICAgIC8vIE1vdmUgcGhhc2VcclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiBhY3Rvci5tb3ZlKCkpO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcbiAgICB0aGlzLmZ4cy5mb3JFYWNoKGFjdG9yID0+IGFjdG9yLm1vdmUoKSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgcGhhc2VcclxuICAgIHRoaXMuY2hlY2tGaW5pc2gobGlzdGVuZXIpO1xyXG4gICAgdGhpcy5jaGVja0VuZE9mR2FtZShsaXN0ZW5lcik7XHJcblxyXG4gICAgdGhpcy5mcmFtZSsrO1xyXG5cclxuICAgIC8vIG9uRnJhbWVcclxuICAgIGxpc3RlbmVyLm9uRnJhbWUodGhpcy5kdW1wKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0ZpbmlzaChsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICBpZiAoREVNT19GUkFNRV9MRU5HVEggPCB0aGlzLmZyYW1lKSB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSB7XHJcbiAgICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXHJcbiAgICAgICAgICBpc0RyYXc6IG51bGwsXHJcbiAgICAgICAgICB3aW5uZXJJZDogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc3VsdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKHNvdXJjZXIgPT4ge1xyXG4gICAgICBzb3VyY2VyLmFsaXZlID0gMCA8IHNvdXJjZXIuc2hpZWxkO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBzdXJ2aXZlcnMgPSB0aGlzLnNvdXJjZXJzLmZpbHRlcihzb3VyY2VyID0+IHNvdXJjZXIuYWxpdmUpO1xyXG5cclxuICAgIGlmICgxIDwgc3Vydml2ZXJzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cnZpdmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgY29uc3Qgc3Vydml2ZXIgPSBzdXJ2aXZlcnNbMF07XHJcbiAgICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICAgIHdpbm5lcklkOiBzdXJ2aXZlci5pZCxcclxuICAgICAgICBmcmFtZTogdGhpcy5mcmFtZSxcclxuICAgICAgICB0aW1lb3V0OiBudWxsLFxyXG4gICAgICAgIGlzRHJhdzogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgbGlzdGVuZXIub25GaW5pc2hlZCh0aGlzLnJlc3VsdCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBubyBzdXJ2aXZlci4uIGRyYXcuLi5cclxuICAgIHRoaXMucmVzdWx0ID0ge1xyXG4gICAgICB3aW5uZXJJZDogbnVsbCxcclxuICAgICAgdGltZW91dDogbnVsbCxcclxuICAgICAgZnJhbWU6IHRoaXMuZnJhbWUsXHJcbiAgICAgIGlzRHJhdzogdHJ1ZVxyXG4gICAgfTtcclxuICAgIGxpc3RlbmVyLm9uRmluaXNoZWQodGhpcy5yZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0VuZE9mR2FtZShsaXN0ZW5lcjogVGlja0V2ZW50TGlzdGVuZXIpIHtcclxuICAgIGlmICh0aGlzLmlzRmluaXNoZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRGVtbykge1xyXG4gICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICBsaXN0ZW5lci5vbkVuZE9mR2FtZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzdWx0LmZyYW1lIDwgdGhpcy5mcmFtZSAtIDkwKSB7XHJcbiAgICAgIC8vIFJlY29yZCBzb21lIGZyYW1lcyBldmVuIGFmdGVyIGRlY2lkZWQuXHJcbiAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgIGxpc3RlbmVyLm9uRW5kT2ZHYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2NhbkVuZW15KG93bmVyOiBTb3VyY2VyLCByYWRhcjogKHQ6IFYpID0+IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmlzRGVtbyAmJiB0aGlzLnNvdXJjZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gcmFkYXIodGhpcy5kdW1teUVuZW15KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Vycy5zb21lKHNvdXJjZXIgPT4ge1xyXG4gICAgICByZXR1cm4gc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBvd25lciAmJiByYWRhcihzb3VyY2VyLnBvc2l0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNjYW5BdHRhY2sob3duZXI6IFNvdXJjZXIsIHJhZGFyOiAodDogVikgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hvdHMuc29tZShzaG90ID0+IHtcclxuICAgICAgcmV0dXJuIHNob3Qub3duZXIgIT09IG93bmVyICYmIHJhZGFyKHNob3QucG9zaXRpb24pICYmIHRoaXMuaXNJbmNvbWluZyhvd25lciwgc2hvdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNJbmNvbWluZyhvd25lcjogU291cmNlciwgc2hvdDogU2hvdCkge1xyXG4gICAgY29uc3Qgb3duZXJQb3NpdGlvbiA9IG93bmVyLnBvc2l0aW9uO1xyXG4gICAgY29uc3QgYWN0b3JQb3NpdGlvbiA9IHNob3QucG9zaXRpb247XHJcbiAgICBjb25zdCBjdXJyZW50RGlzdGFuY2UgPSBvd25lclBvc2l0aW9uLmRpc3RhbmNlKGFjdG9yUG9zaXRpb24pO1xyXG4gICAgY29uc3QgbmV4dERpc3RhbmNlID0gb3duZXJQb3NpdGlvbi5kaXN0YW5jZShhY3RvclBvc2l0aW9uLmFkZChzaG90LnNwZWVkKSk7XHJcbiAgICByZXR1cm4gbmV4dERpc3RhbmNlIDwgY3VycmVudERpc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNoZWNrQ29sbGlzaW9uKHNob3Q6IFNob3QpOiBBY3RvciB8IG51bGwge1xyXG4gICAgY29uc3QgZiA9IHNob3QucG9zaXRpb247XHJcbiAgICBjb25zdCB0ID0gc2hvdC5wb3NpdGlvbi5hZGQoc2hvdC5zcGVlZCk7XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWRTaG90ID0gdGhpcy5zaG90cy5maW5kKGFjdG9yID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBhY3Rvci5icmVha2FibGUgJiZcclxuICAgICAgICBhY3Rvci5vd25lciAhPT0gc2hvdC5vd25lciAmJlxyXG4gICAgICAgIFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBhY3Rvci5wb3NpdGlvbikgPCBzaG90LnNpemUgKyBhY3Rvci5zaXplXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGlmIChjb2xsaWRlZFNob3QpIHtcclxuICAgICAgcmV0dXJuIGNvbGxpZGVkU2hvdDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb2xsaWRlZFNvdXJjZXIgPSB0aGlzLnNvdXJjZXJzLmZpbmQoc291cmNlciA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgc291cmNlci5hbGl2ZSAmJiBzb3VyY2VyICE9PSBzaG90Lm93bmVyICYmIFV0aWxzLmNhbGNEaXN0YW5jZShmLCB0LCBzb3VyY2VyLnBvc2l0aW9uKSA8IHNob3Quc2l6ZSArIHNvdXJjZXIuc2l6ZVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoY29sbGlkZWRTb3VyY2VyKSB7XHJcbiAgICAgIHJldHVybiBjb2xsaWRlZFNvdXJjZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2hlY2tDb2xsaXNpb25FbnZpcm9tZW50KHNob3Q6IFNob3QpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBzaG90LnBvc2l0aW9uLnkgPCAwO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wdXRlQ2VudGVyKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgbGV0IHN1bVggPSAwO1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKChzb3VyY2VyOiBTb3VyY2VyKSA9PiB7XHJcbiAgICAgIGlmIChzb3VyY2VyLmFsaXZlKSB7XHJcbiAgICAgICAgc3VtWCArPSBzb3VyY2VyLnBvc2l0aW9uLng7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc3VtWCAvIGNvdW50O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBsYXllcnMoKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJzOiBQbGF5ZXJzRHVtcCA9IHt9O1xyXG4gICAgdGhpcy5zb3VyY2Vycy5mb3JFYWNoKHNvdXJjZXIgPT4ge1xyXG4gICAgICBwbGF5ZXJzW3NvdXJjZXIuaWRdID0ge1xyXG4gICAgICAgIG5hbWU6IHNvdXJjZXIubmFtZSB8fCBzb3VyY2VyLmFjY291bnQsXHJcbiAgICAgICAgYWNjb3VudDogc291cmNlci5hY2NvdW50LFxyXG4gICAgICAgIGNvbG9yOiBzb3VyY2VyLmNvbG9yXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBwbGF5ZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkdW1wKCk6IEZyYW1lRHVtcCB7XHJcbiAgICBjb25zdCBzb3VyY2Vyc0R1bXA6IFNvdXJjZXJEdW1wW10gPSBbXTtcclxuICAgIGNvbnN0IHNob3RzRHVtcDogU2hvdER1bXBbXSA9IFtdO1xyXG4gICAgY29uc3QgZnhEdW1wOiBGeER1bXBbXSA9IFtdO1xyXG5cclxuICAgIHRoaXMuc291cmNlcnMuZm9yRWFjaChhY3RvciA9PiB7XHJcbiAgICAgIHNvdXJjZXJzRHVtcC5wdXNoKGFjdG9yLmR1bXAoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpc1RoaW5rYWJsZSA9ICh4OiBTaG90KTogeCBpcyBNaXNzaWxlID0+IHgudHlwZSA9PT0gJ01pc3NpbGUnO1xyXG4gICAgdGhpcy5zaG90cy5mb3JFYWNoKGFjdG9yID0+IHtcclxuICAgICAgc2hvdHNEdW1wLnB1c2goYWN0b3IuZHVtcCgpKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5meHMuZm9yRWFjaChmeCA9PiB7XHJcbiAgICAgIGZ4RHVtcC5wdXNoKGZ4LmR1bXAoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmOiB0aGlzLmZyYW1lLFxyXG4gICAgICBzOiBzb3VyY2Vyc0R1bXAsXHJcbiAgICAgIGI6IHNob3RzRHVtcCxcclxuICAgICAgeDogZnhEdW1wXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgTWlzc2lsZUNvbnRyb2xsZXIgZnJvbSAnLi9NaXNzaWxlQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlUGFyYW0ge1xyXG4gIHB1YmxpYyBzdGF0aWMgbGFzZXIocG93ZXI6IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIpOiBGaXJlUGFyYW0ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEZpcmVQYXJhbSgpO1xyXG4gICAgcmVzdWx0LnBvd2VyID0gTWF0aC5taW4oTWF0aC5tYXgocG93ZXIgfHwgOCwgMyksIDgpO1xyXG4gICAgcmVzdWx0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgIHJlc3VsdC5zaG90VHlwZSA9ICdMYXNlcic7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwdWJsaWMgc3RhdGljIG1pc3NpbGUoYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBGaXJlUGFyYW0oKTtcclxuICAgIHJlc3VsdC5ib3QgPSBib3Q7XHJcbiAgICByZXN1bHQuc2hvdFR5cGUgPSAnTWlzc2lsZSc7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwdWJsaWMgYm90OiAoY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXIpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRpcmVjdGlvbjogbnVtYmVyO1xyXG4gIHB1YmxpYyBwb3dlcjogbnVtYmVyO1xyXG4gIHB1YmxpYyBzaG90VHlwZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IHsgRnhEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ4IHtcclxuICBwcml2YXRlIGZyYW1lOiBudW1iZXI7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaWVsZDogRmllbGQsIHB1YmxpYyBwb3NpdGlvbjogViwgcHVibGljIHNwZWVkOiBWLCBwdWJsaWMgbGVuZ3RoOiBudW1iZXIpIHtcclxuICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFjdGlvbigpIHtcclxuICAgIHRoaXMuZnJhbWUrKztcclxuICAgIGlmICh0aGlzLmxlbmd0aCA8PSB0aGlzLmZyYW1lKSB7XHJcbiAgICAgIHRoaXMuZmllbGQucmVtb3ZlRngodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IEZ4RHVtcCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGY6IHRoaXMuZnJhbWUsXHJcbiAgICAgIGw6IE1hdGgucm91bmQodGhpcy5sZW5ndGgpXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgU2hvdCBmcm9tICcuL1Nob3QnO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyIGZyb20gJy4vU291cmNlcic7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhc2VyIGV4dGVuZHMgU2hvdCB7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gNTtcclxuICBwdWJsaWMgZGFtYWdlID0gKCkgPT4gODtcclxuICBwcml2YXRlIG1vbWVudHVtOiBudW1iZXI7XHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBvd25lcjogU291cmNlciwgcHVibGljIGRpcmVjdGlvbjogbnVtYmVyLCBwb3dlcjogbnVtYmVyKSB7XHJcbiAgICBzdXBlcihmaWVsZCwgb3duZXIsICdMYXNlcicpO1xyXG4gICAgdGhpcy5zcGVlZCA9IFYuZGlyZWN0aW9uKGRpcmVjdGlvbikubXVsdGlwbHkocG93ZXIpO1xyXG4gICAgdGhpcy5tb21lbnR1bSA9IENvbmZpZ3MuTEFTRVJfTU9NRU5UVU07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWN0aW9uKCkge1xyXG4gICAgc3VwZXIuYWN0aW9uKCk7XHJcbiAgICB0aGlzLm1vbWVudHVtIC09IENvbmZpZ3MuTEFTRVJfQVRURU5VQVRJT047XHJcbiAgICBpZiAodGhpcy5tb21lbnR1bSA8IDApIHtcclxuICAgICAgdGhpcy5maWVsZC5yZW1vdmVTaG90KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvcic7XHJcbmltcG9ydCBTaG90IGZyb20gJy4vU2hvdCc7XHJcbmltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5pbXBvcnQgViBmcm9tICcuL1YnO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBNaXNzaWxlQ29tbWFuZCBmcm9tICcuL01pc3NpbGVDb21tYW5kJztcclxuaW1wb3J0IE1pc3NpbGVDb250cm9sbGVyIGZyb20gJy4vTWlzc2lsZUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgQ29uc3RzIGZyb20gJy4vQ29uc3RzJztcclxuaW1wb3J0IHsgRGVidWdEdW1wLCBTaG90RHVtcCB9IGZyb20gJy4vRHVtcCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaXNzaWxlIGV4dGVuZHMgU2hvdCB7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMTA7XHJcbiAgcHVibGljIGRhbWFnZSA9ICgpID0+IDEwICsgdGhpcy5zcGVlZC5sZW5ndGgoKSAqIDI7XHJcbiAgcHVibGljIGZ1ZWwgPSAxMDA7XHJcbiAgcHVibGljIGJyZWFrYWJsZSA9IHRydWU7XHJcblxyXG4gIHB1YmxpYyBjb21tYW5kOiBNaXNzaWxlQ29tbWFuZDtcclxuICBwdWJsaWMgY29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXI7XHJcbiAgcHJpdmF0ZSBkZWJ1Z0R1bXA6IERlYnVnRHVtcDtcclxuXHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBvd25lcjogU291cmNlciwgcHVibGljIGJvdDogKGNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyKSA9PiB2b2lkKSB7XHJcbiAgICBzdXBlcihmaWVsZCwgb3duZXIsICdNaXNzaWxlJyk7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IG93bmVyLmRpcmVjdGlvbiA9PT0gQ29uc3RzLkRJUkVDVElPTl9SSUdIVCA/IDAgOiAxODA7XHJcbiAgICB0aGlzLnNwZWVkID0gb3duZXIuc3BlZWQ7XHJcbiAgICB0aGlzLmNvbW1hbmQgPSBuZXcgTWlzc2lsZUNvbW1hbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBNaXNzaWxlQ29udHJvbGxlcih0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRoaW5rKCkge1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcblxyXG4gICAgaWYgKHRoaXMuZnVlbCA8PSAwKSB7XHJcbiAgICAgIC8vIENhbmNlbCB0aGlua2luZ1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdLCBhcmNzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5vd25lci5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZTogYE1pc3NpbGUgZnVuY3Rpb24gZXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gLCBjb2xvcjogJ3JlZCcgfSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLm11bHRpcGx5KENvbmZpZ3MuU1BFRURfUkVTSVNUQU5DRSk7XHJcbiAgICB0aGlzLmNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25IaXQoYXR0YWNrOiBTaG90KSB7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QoYXR0YWNrKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gKyBkaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzY2FuRGVidWcoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5hcmNzLnB1c2goeyBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNob3REdW1wIHtcclxuICAgIGNvbnN0IHN1cGVyRHVtcCA9IHN1cGVyLmR1bXAoKTtcclxuICAgIGlmICh0aGlzLm93bmVyLnNjcmlwdExvYWRlci5pc0RlYnVnZ2FibGUoKSkge1xyXG4gICAgICBzdXBlckR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlckR1bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb21tYW5kIGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCBNaXNzaWxlIGZyb20gJy4vTWlzc2lsZSc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbGVDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIHNwZWVkVXA6IG51bWJlcjtcclxuICBwdWJsaWMgc3BlZWREb3duOiBudW1iZXI7XHJcbiAgcHVibGljIHR1cm46IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNwZWVkVXAgPSAwO1xyXG4gICAgdGhpcy5zcGVlZERvd24gPSAwO1xyXG4gICAgdGhpcy50dXJuID0gMDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgaWYgKDAgPCB0aGlzLm1pc3NpbGUuZnVlbCkge1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZGlyZWN0aW9uICs9IHRoaXMudHVybjtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IFYuZGlyZWN0aW9uKHRoaXMubWlzc2lsZS5kaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuc3BlZWQgPSB0aGlzLm1pc3NpbGUuc3BlZWQuYWRkKG5vcm1hbGl6ZWQubXVsdGlwbHkodGhpcy5zcGVlZFVwKSk7XHJcbiAgICAgIHRoaXMubWlzc2lsZS5zcGVlZCA9IHRoaXMubWlzc2lsZS5zcGVlZC5tdWx0aXBseSgxIC0gdGhpcy5zcGVlZERvd24pO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCAtPSAodGhpcy5zcGVlZFVwICsgdGhpcy5zcGVlZERvd24gKiAzKSAqIENvbmZpZ3MuRlVFTF9DT1NUO1xyXG4gICAgICB0aGlzLm1pc3NpbGUuZnVlbCA9IE1hdGgubWF4KDAsIHRoaXMubWlzc2lsZS5mdWVsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyJztcclxuaW1wb3J0IEZpZWxkIGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcbmltcG9ydCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlzc2lsZUNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICBwdWJsaWMgZGlyZWN0aW9uOiAoKSA9PiBudW1iZXI7XHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc3BlZWRVcDogKCkgPT4gdm9pZDtcclxuICBwdWJsaWMgc3BlZWREb3duOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyB0dXJuUmlnaHQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm5MZWZ0OiAoKSA9PiB2b2lkO1xyXG5cclxuICBwdWJsaWMgbG9nOiAoLi4ubWVzc2FnZXM6IGFueVtdKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBzY2FuRGVidWc6IChkaXJlY3Rpb246IG51bWJlciwgYW5nbGU6IG51bWJlciwgcmVuZ2U/OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1pc3NpbGU6IE1pc3NpbGUpIHtcclxuICAgIHN1cGVyKG1pc3NpbGUpO1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSAoKSA9PiBtaXNzaWxlLmRpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IG1pc3NpbGUuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gbWlzc2lsZS5jb21tYW5kO1xyXG5cclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IG1pc3NpbGUuZnVlbDtcclxuXHJcbiAgICB0aGlzLnNjYW5FbmVteSA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUud2FpdCArPSAxLjU7XHJcbiAgICAgIGNvbnN0IG1pc3NpbGVEaXJlY3Rpb24gPSBtaXNzaWxlLm9wcG9zaXRlKGRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHJhZGFyID0gVXRpbHMuY3JlYXRlUmFkYXIobWlzc2lsZS5wb3NpdGlvbiwgbWlzc2lsZURpcmVjdGlvbiwgYW5nbGUsIHJlbmdlIHx8IE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICByZXR1cm4gbWlzc2lsZS5maWVsZC5zY2FuRW5lbXkobWlzc2lsZS5vd25lciwgcmFkYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkVXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5zcGVlZFVwID0gMC44O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNwZWVkRG93biA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnNwZWVkRG93biA9IDAuMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy50dXJuUmlnaHQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gLTk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHVybkxlZnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC50dXJuID0gOTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBtaXNzaWxlLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiAoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIG1pc3NpbGUuc2NhbkRlYnVnKG1pc3NpbGUub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBGaWVsZCBmcm9tICcuL0ZpZWxkJztcclxuaW1wb3J0IFNvdXJjZXIgZnJvbSAnLi9Tb3VyY2VyJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRnggZnJvbSAnLi9GeCc7XHJcbmltcG9ydCB7IFNob3REdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hvdCBleHRlbmRzIEFjdG9yIHtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmUgPSAwO1xyXG4gIHB1YmxpYyBkYW1hZ2UgPSAoKSA9PiAwO1xyXG4gIHB1YmxpYyBicmVha2FibGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoZmllbGQ6IEZpZWxkLCBwdWJsaWMgb3duZXI6IFNvdXJjZXIsIHB1YmxpYyB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGZpZWxkLCBvd25lci5wb3NpdGlvbi54LCBvd25lci5wb3NpdGlvbi55KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9uQWN0aW9uKCk7XHJcblxyXG4gICAgY29uc3QgY29sbGlkZWQgPSB0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uKHRoaXMpO1xyXG4gICAgaWYgKGNvbGxpZGVkKSB7XHJcbiAgICAgIGNvbGxpZGVkLm9uSGl0KHRoaXMpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUZ4cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmZpZWxkLmNoZWNrQ29sbGlzaW9uRW52aXJvbWVudCh0aGlzKSkge1xyXG4gICAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3QodGhpcyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlRnhzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZ4cygpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoVXRpbHMucmFuZCgxNikgLSA4LCBVdGlscy5yYW5kKDE2KSAtIDgpO1xyXG4gICAgICBjb25zdCBzcGVlZCA9IG5ldyBWKFV0aWxzLnJhbmQoMSkgLSAwLjUsIFV0aWxzLnJhbmQoMSkgLSAwLjUpO1xyXG4gICAgICBjb25zdCBsZW5ndGggPSBVdGlscy5yYW5kKDgpICsgNDtcclxuICAgICAgdGhpcy5maWVsZC5hZGRGeChuZXcgRngodGhpcy5maWVsZCwgcG9zaXRpb24sIHRoaXMuc3BlZWQuZGl2aWRlKDIpLmFkZChzcGVlZCksIGxlbmd0aCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlYWN0aW9uKHNvdXJjZXI6IFNvdXJjZXIpIHtcclxuICAgIHNvdXJjZXIudGVtcGVyYXR1cmUgKz0gdGhpcy50ZW1wZXJhdHVyZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkFjdGlvbigpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNob3REdW1wIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG86IHRoaXMub3duZXIuaWQsXHJcbiAgICAgIGk6IHRoaXMuaWQsXHJcbiAgICAgIHA6IHRoaXMucG9zaXRpb24ubWluaW1pemUoKSxcclxuICAgICAgZDogdGhpcy5kaXJlY3Rpb24sXHJcbiAgICAgIHM6IHRoaXMudHlwZVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEFjdG9yIGZyb20gJy4vQWN0b3InO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBTb3VyY2VyQ29tbWFuZCBmcm9tICcuL1NvdXJjZXJDb21tYW5kJztcclxuaW1wb3J0IFNvdXJjZXJDb250cm9sbGVyIGZyb20gJy4vU291cmNlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuaW1wb3J0IENvbmZpZ3MgZnJvbSAnLi9Db25maWdzJztcclxuaW1wb3J0IENvbnN0cyBmcm9tICcuL0NvbnN0cyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IFYgZnJvbSAnLi9WJztcclxuaW1wb3J0IFNob3QgZnJvbSAnLi9TaG90JztcclxuaW1wb3J0IExhc2VyIGZyb20gJy4vTGFzZXInO1xyXG5pbXBvcnQgTWlzc2lsZSBmcm9tICcuL01pc3NpbGUnO1xyXG5pbXBvcnQgeyBTb3VyY2VyRHVtcCwgRGVidWdEdW1wIH0gZnJvbSAnLi9EdW1wJztcclxuaW1wb3J0IEZ4IGZyb20gJy4vRngnO1xyXG5pbXBvcnQgU2NyaXB0TG9hZGVyLCB7IENvbnNvbGVMaWtlIH0gZnJvbSAnLi9TY3JpcHRMb2FkZXInO1xyXG5cclxuaW50ZXJmYWNlIEV4cG9ydFNjb3BlIHtcclxuICBtb2R1bGU6IHtcclxuICAgIGV4cG9ydHM6ICgoY29udHJvbGxlcjogU291cmNlckNvbnRyb2xsZXIpID0+IHZvaWQpIHwgbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyIGV4dGVuZHMgQWN0b3Ige1xyXG4gIHB1YmxpYyBhbGl2ZSA9IHRydWU7XHJcbiAgcHVibGljIHRlbXBlcmF0dXJlID0gMDtcclxuICBwdWJsaWMgc2hpZWxkID0gQ29uZmlncy5JTklUSUFMX1NISUVMRDtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW8gPSBDb25maWdzLklOSVRJQUxfTUlTU0lMRV9BTU1PO1xyXG4gIHB1YmxpYyBmdWVsID0gQ29uZmlncy5JTklUSUFMX0ZVRUw7XHJcblxyXG4gIHB1YmxpYyBjb21tYW5kOiBTb3VyY2VyQ29tbWFuZDtcclxuICBwdWJsaWMgc2NyaXB0TG9hZGVyOiBTY3JpcHRMb2FkZXI7XHJcbiAgcHJpdmF0ZSBjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcjtcclxuICBwcml2YXRlIGJvdDogKChjb250cm9sbGVyOiBTb3VyY2VyQ29udHJvbGxlcikgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGRlYnVnRHVtcDogRGVidWdEdW1wO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGZpZWxkOiBGaWVsZCxcclxuICAgIHg6IG51bWJlcixcclxuICAgIHk6IG51bWJlcixcclxuICAgIHB1YmxpYyBhaVNvdXJjZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGFjY291bnQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgY29sb3I6IHN0cmluZ1xyXG4gICkge1xyXG4gICAgc3VwZXIoZmllbGQsIHgsIHkpO1xyXG5cclxuICAgIHRoaXMuZGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IENvbnN0cy5ESVJFQ1RJT05fUklHSFQgOiBDb25zdHMuRElSRUNUSU9OX0xFRlQ7XHJcbiAgICB0aGlzLmNvbW1hbmQgPSBuZXcgU291cmNlckNvbW1hbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgU291cmNlckNvbnRyb2xsZXIodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29tcGlsZShzY3JpcHRMb2FkZXI6IFNjcmlwdExvYWRlcikge1xyXG4gICAgdGhpcy5zY3JpcHRMb2FkZXIgPSBzY3JpcHRMb2FkZXI7XHJcbiAgICB0aGlzLmJvdCA9IHNjcmlwdExvYWRlci5sb2FkKHRoaXMuYWlTb3VyY2UpO1xyXG4gICAgaWYgKCF0aGlzLmJvdCkge1xyXG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdGdW5jdGlvbiBoYXMgbm90IGJlZW4gcmV0dXJuZWQuJyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmJvdCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB0aHJvdyB7IG1lc3NhZ2U6ICdSZXR1cm5lZCBpcyBub3QgYSBGdW5jdGlvbi4nIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25UaGluaygpIHtcclxuICAgIGlmICh0aGlzLmJvdCA9PT0gbnVsbCB8fCAhdGhpcy5hbGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5jb21tYW5kLmFjY2VwdCgpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIucHJlVGhpbmsoKTtcclxuICAgICAgdGhpcy5kZWJ1Z0R1bXAgPSB7IGxvZ3M6IFtdLCBhcmNzOiBbXSB9O1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuY29ubmVjdENvbnNvbGUodGhpcy5zY3JpcHRMb2FkZXIuZ2V0RXhwb3NlZENvbnNvbGUoKSk7XHJcbiAgICAgIHRoaXMuYm90KHRoaXMuY29udHJvbGxlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmRlYnVnRHVtcC5sb2dzLnB1c2goeyBtZXNzYWdlOiBgU291cmNlciBmdW5jdGlvbiBlcnJvcjogJHtlcnJvci5tZXNzYWdlfWAsIGNvbG9yOiAncmVkJyB9KTtcclxuICAgICAgdGhpcy5jb21tYW5kLnJlc2V0KCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmNvbW1hbmQudW5hY2NlcHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgVXRpbHMucmFuZCg4KSA8IDEpIHtcclxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChVdGlscy5yYW5kKDE2KSAtIDgsIFV0aWxzLnJhbmQoMTYpIC0gOCk7XHJcbiAgICAgIGNvbnN0IHNwZWVkID0gbmV3IFYoVXRpbHMucmFuZCgxKSAtIDAuNSwgVXRpbHMucmFuZCgxKSArIDAuNSk7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IFV0aWxzLnJhbmQoOCkgKyA0O1xyXG4gICAgICB0aGlzLmZpZWxkLmFkZEZ4KG5ldyBGeCh0aGlzLmZpZWxkLCBwb3NpdGlvbiwgc3BlZWQsIGxlbmd0aCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFpciByZXNpc3RhbmNlXHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5tdWx0aXBseShDb25maWdzLlNQRUVEX1JFU0lTVEFOQ0UpO1xyXG5cclxuICAgIC8vIGdyYXZpdHlcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSk7XHJcblxyXG4gICAgLy8gY29udHJvbCBhbHRpdHVkZSBieSB0aGUgaW52aXNpYmxlIGhhbmRcclxuICAgIGlmIChDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCA8IHRoaXMucG9zaXRpb24ueSkge1xyXG4gICAgICBjb25zdCBpbnZpc2libGVQb3dlciA9ICh0aGlzLnBvc2l0aW9uLnkgLSBDb25maWdzLlRPUF9JTlZJU0lCTEVfSEFORCkgKiAwLjE7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnNwZWVkLnN1YnRyYWN0KDAsIENvbmZpZ3MuR1JBVklUWSAqIGludmlzaWJsZVBvd2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb250cm9sIGRpc3RhbmNlIGJ5IHRoZSBpbnZpc2libGUgaGFuZFxyXG4gICAgY29uc3QgZGlmZiA9IHRoaXMuZmllbGQuY2VudGVyIC0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgaWYgKENvbmZpZ3MuRElTVEFOQ0VfQk9SREFSIDwgTWF0aC5hYnMoZGlmZikpIHtcclxuICAgICAgY29uc3QgbiA9IGRpZmYgPCAwID8gLTEgOiAxO1xyXG4gICAgICBjb25zdCBpbnZpc2libGVIYW5kID0gKE1hdGguYWJzKGRpZmYpIC0gQ29uZmlncy5ESVNUQU5DRV9CT1JEQVIpICogQ29uZmlncy5ESVNUQU5DRV9JTlZJU0lCTEVfSEFORCAqIG47XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVih0aGlzLnBvc2l0aW9uLnggKyBpbnZpc2libGVIYW5kLCB0aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdvIGludG8gdGhlIGdyb3VuZFxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgdGhpcy5zaGllbGQgLT0gLXRoaXMuc3BlZWQueSAqIENvbmZpZ3MuR1JPVU5EX0RBTUFHRV9TQ0FMRTtcclxuICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHRoaXMucG9zaXRpb24ueCwgMCk7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSBuZXcgVih0aGlzLnNwZWVkLngsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudGVtcGVyYXR1cmUgLT0gQ29uZmlncy5DT09MX0RPV047XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5tYXgodGhpcy50ZW1wZXJhdHVyZSwgMCk7XHJcblxyXG4gICAgLy8gb3ZlcmhlYXRcclxuICAgIGNvbnN0IG92ZXJoZWF0ID0gdGhpcy50ZW1wZXJhdHVyZSAtIENvbmZpZ3MuT1ZFUkhFQVRfQk9SREVSO1xyXG4gICAgaWYgKDAgPCBvdmVyaGVhdCkge1xyXG4gICAgICBjb25zdCBsaW5lYXJEYW1hZ2UgPSBvdmVyaGVhdCAqIENvbmZpZ3MuT1ZFUkhFQVRfREFNQUdFX0xJTkVBUl9XRUlHSFQ7XHJcbiAgICAgIGNvbnN0IHBvd2VyRGFtYWdlID0gTWF0aC5wb3cob3ZlcmhlYXQgKiBDb25maWdzLk9WRVJIRUFUX0RBTUFHRV9QT1dFUl9XRUlHSFQsIDIpO1xyXG4gICAgICB0aGlzLnNoaWVsZCAtPSBsaW5lYXJEYW1hZ2UgKyBwb3dlckRhbWFnZTtcclxuICAgIH1cclxuICAgIHRoaXMuc2hpZWxkID0gTWF0aC5tYXgoMCwgdGhpcy5zaGllbGQpO1xyXG5cclxuICAgIHRoaXMuY29tbWFuZC5leGVjdXRlKCk7XHJcbiAgICB0aGlzLmNvbW1hbmQucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaXJlKHBhcmFtOiBGaXJlUGFyYW0pIHtcclxuICAgIGlmIChwYXJhbS5zaG90VHlwZSA9PT0gJ0xhc2VyJykge1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLm9wcG9zaXRlKHBhcmFtLmRpcmVjdGlvbik7XHJcbiAgICAgIGNvbnN0IHNob3QgPSBuZXcgTGFzZXIodGhpcy5maWVsZCwgdGhpcywgZGlyZWN0aW9uLCBwYXJhbS5wb3dlcik7XHJcbiAgICAgIHNob3QucmVhY3Rpb24odGhpcyk7XHJcbiAgICAgIHRoaXMuZmllbGQuYWRkU2hvdChzaG90KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFyYW0uc2hvdFR5cGUgPT09ICdNaXNzaWxlJykge1xyXG4gICAgICBpZiAoMCA8IHRoaXMubWlzc2lsZUFtbW8pIHtcclxuICAgICAgICBjb25zdCBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5maWVsZCwgdGhpcywgcGFyYW0uYm90KTtcclxuICAgICAgICBtaXNzaWxlLnJlYWN0aW9uKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubWlzc2lsZUFtbW8tLTtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZFNob3QobWlzc2lsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcHBvc2l0ZShkaXJlY3Rpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IENvbnN0cy5ESVJFQ1RJT05fTEVGVCkge1xyXG4gICAgICByZXR1cm4gVXRpbHMudG9PcHBvc2l0ZShkaXJlY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkhpdChzaG90OiBTaG90KSB7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5zcGVlZC5hZGQoc2hvdC5zcGVlZC5tdWx0aXBseShDb25maWdzLk9OX0hJVF9TUEVFRF9HSVZFTl9SQVRFKSk7XHJcbiAgICB0aGlzLnNoaWVsZCAtPSBzaG90LmRhbWFnZSgpO1xyXG4gICAgdGhpcy5zaGllbGQgPSBNYXRoLm1heCgwLCB0aGlzLnNoaWVsZCk7XHJcbiAgICB0aGlzLmZpZWxkLnJlbW92ZVNob3Qoc2hvdCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5kZWJ1Z0R1bXAubG9ncy5wdXNoKHsgbWVzc2FnZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzY2FuRGVidWcoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmRlYnVnRHVtcC5hcmNzLnB1c2goeyBkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkdW1wKCk6IFNvdXJjZXJEdW1wIHtcclxuICAgIGNvbnN0IGR1bXA6IFNvdXJjZXJEdW1wID0ge1xyXG4gICAgICBpOiB0aGlzLmlkLFxyXG4gICAgICBwOiB0aGlzLnBvc2l0aW9uLm1pbmltaXplKCksXHJcbiAgICAgIGQ6IHRoaXMuZGlyZWN0aW9uLFxyXG4gICAgICBoOiBNYXRoLmNlaWwodGhpcy5zaGllbGQpLFxyXG4gICAgICB0OiBNYXRoLmNlaWwodGhpcy50ZW1wZXJhdHVyZSksXHJcbiAgICAgIGE6IHRoaXMubWlzc2lsZUFtbW8sXHJcbiAgICAgIGY6IE1hdGguY2VpbCh0aGlzLmZ1ZWwpXHJcbiAgICB9O1xyXG4gICAgaWYgKHRoaXMuc2NyaXB0TG9hZGVyLmlzRGVidWdnYWJsZSgpKSB7XHJcbiAgICAgIGR1bXAuZGVidWcgPSB0aGlzLmRlYnVnRHVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiBkdW1wO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29tbWFuZCBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgQ29uZmlncyBmcm9tICcuL0NvbmZpZ3MnO1xyXG5pbXBvcnQgRmlyZVBhcmFtIGZyb20gJy4vRmlyZVBhcmFtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZXJDb21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgcHVibGljIGFoZWFkOiBudW1iZXI7XHJcbiAgcHVibGljIGFzY2VudDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0dXJuOiBib29sZWFuO1xyXG4gIHB1YmxpYyBmaXJlOiBGaXJlUGFyYW0gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlcjogU291cmNlcikge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpIHtcclxuICAgIHRoaXMuYWhlYWQgPSAwO1xyXG4gICAgdGhpcy5hc2NlbnQgPSAwO1xyXG4gICAgdGhpcy50dXJuID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpcmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICBpZiAodGhpcy5maXJlKSB7XHJcbiAgICAgIHRoaXMuc291cmNlci5maXJlKHRoaXMuZmlyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHVybikge1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgwIDwgdGhpcy5zb3VyY2VyLmZ1ZWwpIHtcclxuICAgICAgdGhpcy5zb3VyY2VyLnNwZWVkID0gdGhpcy5zb3VyY2VyLnNwZWVkLmFkZCh0aGlzLmFoZWFkICogdGhpcy5zb3VyY2VyLmRpcmVjdGlvbiwgdGhpcy5hc2NlbnQpO1xyXG4gICAgICB0aGlzLnNvdXJjZXIuZnVlbCAtPSAoTWF0aC5hYnModGhpcy5haGVhZCkgKyBNYXRoLmFicyh0aGlzLmFzY2VudCkpICogQ29uZmlncy5GVUVMX0NPU1Q7XHJcbiAgICAgIHRoaXMuc291cmNlci5mdWVsID0gTWF0aC5tYXgoMCwgdGhpcy5zb3VyY2VyLmZ1ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgU291cmNlciBmcm9tICcuL1NvdXJjZXInO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9GaWVsZCc7XHJcbmltcG9ydCBDb25maWdzIGZyb20gJy4vQ29uZmlncyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzJztcclxuaW1wb3J0IEZpcmVQYXJhbSBmcm9tICcuL0ZpcmVQYXJhbSc7XHJcbmltcG9ydCBNaXNzaWxlQ29udHJvbGxlciBmcm9tICcuL01pc3NpbGVDb250cm9sbGVyJztcclxuaW1wb3J0IHsgQ29uc29sZUxpa2UgfSBmcm9tICcuL1NjcmlwdExvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gIHB1YmxpYyBzaGllbGQ6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgdGVtcGVyYXR1cmU6ICgpID0+IG51bWJlcjtcclxuICBwdWJsaWMgbWlzc2lsZUFtbW86ICgpID0+IG51bWJlcjtcclxuXHJcbiAgcHVibGljIHNjYW5FbmVteTogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICBwdWJsaWMgc2NhbkF0dGFjazogKGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZT86IG51bWJlcikgPT4gYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGFoZWFkOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBiYWNrOiAoKSA9PiB2b2lkO1xyXG4gIHB1YmxpYyBhc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIGRlc2NlbnQ6ICgpID0+IHZvaWQ7XHJcbiAgcHVibGljIHR1cm46ICgpID0+IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyBmaXJlTGFzZXI6IChkaXJlY3Rpb246IG51bWJlciwgcG93ZXI6IG51bWJlcikgPT4gdm9pZDtcclxuICBwdWJsaWMgZmlyZU1pc3NpbGU6IChib3Q6IChjb250cm9sbGVyOiBNaXNzaWxlQ29udHJvbGxlcikgPT4gdm9pZCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIGxvZzogKC4uLm1lc3NhZ2VzOiBhbnlbXSkgPT4gdm9pZDtcclxuICBwdWJsaWMgc2NhbkRlYnVnOiAoZGlyZWN0aW9uOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHJlbmdlPzogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihzb3VyY2VyOiBTb3VyY2VyKSB7XHJcbiAgICBzdXBlcihzb3VyY2VyKTtcclxuXHJcbiAgICB0aGlzLnNoaWVsZCA9ICgpID0+IHNvdXJjZXIuc2hpZWxkO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9ICgpID0+IHNvdXJjZXIudGVtcGVyYXR1cmU7XHJcbiAgICB0aGlzLm1pc3NpbGVBbW1vID0gKCkgPT4gc291cmNlci5taXNzaWxlQW1tbztcclxuICAgIHRoaXMuZnVlbCA9ICgpID0+IHNvdXJjZXIuZnVlbDtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9IHNvdXJjZXIuZmllbGQ7XHJcbiAgICBjb25zdCBjb21tYW5kID0gc291cmNlci5jb21tYW5kO1xyXG4gICAgdGhpcy5zY2FuRW5lbXkgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkVuZW15KHNvdXJjZXIsIHJhZGFyKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5BdHRhY2sgPSAoZGlyZWN0aW9uLCBhbmdsZSwgcmVuZ2UpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLndhaXQgKz0gQ29uZmlncy5TQ0FOX1dBSVQ7XHJcbiAgICAgIGNvbnN0IG9wcG9zaXRlZERpcmVjdGlvbiA9IHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKTtcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFJlbmdlID0gcmVuZ2UgfHwgTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgY29uc3QgcmFkYXIgPSBVdGlscy5jcmVhdGVSYWRhcihzb3VyY2VyLnBvc2l0aW9uLCBvcHBvc2l0ZWREaXJlY3Rpb24sIGFuZ2xlLCBub3JtYWxpemVkUmVuZ2UpO1xyXG4gICAgICByZXR1cm4gZmllbGQuc2NhbkF0dGFjayhzb3VyY2VyLCByYWRhcik7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5haGVhZCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gMC44O1xyXG4gICAgfTtcclxuICAgIHRoaXMuYmFjayA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFoZWFkID0gLTAuNDtcclxuICAgIH07XHJcbiAgICB0aGlzLmFzY2VudCA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmFzY2VudCA9IDAuOTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRlc2NlbnQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5hc2NlbnQgPSAtMC45O1xyXG4gICAgfTtcclxuICAgIHRoaXMudHVybiA9ICgpID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLnR1cm4gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVMYXNlciA9IChkaXJlY3Rpb24sIHBvd2VyKSA9PiB7XHJcbiAgICAgIGNvbW1hbmQudmFsaWRhdGUoKTtcclxuICAgICAgY29tbWFuZC5maXJlID0gRmlyZVBhcmFtLmxhc2VyKHBvd2VyLCBkaXJlY3Rpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZpcmVNaXNzaWxlID0gYm90ID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBjb21tYW5kLmZpcmUgPSBGaXJlUGFyYW0ubWlzc2lsZShib3QpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpc1N0cmluZyA9ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3RyaW5nID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG4gICAgdGhpcy5sb2cgPSAoLi4ubWVzc2FnZTogYW55W10pID0+IHtcclxuICAgICAgY29tbWFuZC52YWxpZGF0ZSgpO1xyXG4gICAgICBzb3VyY2VyLmxvZyhtZXNzYWdlLm1hcCh2YWx1ZSA9PiAoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKS5qb2luKCcsICcpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNjYW5EZWJ1ZyA9IChkaXJlY3Rpb24sIGFuZ2xlLCByZW5nZSkgPT4ge1xyXG4gICAgICBjb21tYW5kLnZhbGlkYXRlKCk7XHJcbiAgICAgIHNvdXJjZXIuc2NhbkRlYnVnKHNvdXJjZXIub3Bwb3NpdGUoZGlyZWN0aW9uKSwgYW5nbGUsIHJlbmdlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29ubmVjdENvbnNvbGUoY29uc29sZTogQ29uc29sZUxpa2UgfCBudWxsKSB7XHJcbiAgICBpZiAoY29uc29sZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBWIGZyb20gJy4vVic7XHJcbmltcG9ydCBDb25zdHMgZnJvbSAnLi9Db25zdHMnO1xyXG5cclxuY29uc3QgRVBTSUxPTiA9IDEwZS0xMjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJhZGFyKGM6IFYsIGRpcmVjdGlvbjogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCByZW5nZTogbnVtYmVyKTogKHQ6IFYpID0+IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2hlY2tEaXN0YW5jZSA9ICh0OiBWKSA9PiBjLmRpc3RhbmNlKHQpIDw9IHJlbmdlO1xyXG5cclxuICAgIGlmICgzNjAgPD0gYW5nbGUpIHtcclxuICAgICAgcmV0dXJuIGNoZWNrRGlzdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hlY2tMZWZ0ID0gVXRpbHMuc2lkZShjLCBkaXJlY3Rpb24gKyBhbmdsZSAvIDIpO1xyXG4gICAgY29uc3QgY2hlY2tSaWdodCA9IFV0aWxzLnNpZGUoYywgZGlyZWN0aW9uICsgMTgwIC0gYW5nbGUgLyAyKTtcclxuXHJcbiAgICBpZiAoYW5nbGUgPCAxODApIHtcclxuICAgICAgcmV0dXJuIHQgPT4gY2hlY2tMZWZ0KHQpICYmIGNoZWNrUmlnaHQodCkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ID0+IChjaGVja0xlZnQodCkgfHwgY2hlY2tSaWdodCh0KSkgJiYgY2hlY2tEaXN0YW5jZSh0KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgc2lkZShiYXNlOiBWLCBkZWdyZWU6IG51bWJlcik6ICh0OiBWKSA9PiBib29sZWFuIHtcclxuICAgIGNvbnN0IHJhZGlhbiA9IFV0aWxzLnRvUmFkaWFuKGRlZ3JlZSk7XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBuZXcgVihNYXRoLmNvcyhyYWRpYW4pLCBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgIGNvbnN0IHByZXZpb3VzbHkgPSBiYXNlLnggKiBkaXJlY3Rpb24ueSAtIGJhc2UueSAqIGRpcmVjdGlvbi54IC0gRVBTSUxPTjtcclxuICAgIHJldHVybiAodGFyZ2V0OiBWKSA9PiB7XHJcbiAgICAgIHJldHVybiAwIDw9IHRhcmdldC54ICogZGlyZWN0aW9uLnkgLSB0YXJnZXQueSAqIGRpcmVjdGlvbi54IC0gcHJldmlvdXNseTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGNhbGNEaXN0YW5jZShmOiBWLCB0OiBWLCBwOiBWKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHRvRnJvbSA9IHQuc3VidHJhY3QoZik7XHJcbiAgICBjb25zdCBwRnJvbSA9IHAuc3VidHJhY3QoZik7XHJcbiAgICBpZiAodG9Gcm9tLmRvdChwRnJvbSkgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwRnJvbS5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmcm9tVG8gPSBmLnN1YnRyYWN0KHQpO1xyXG4gICAgY29uc3QgcFRvID0gcC5zdWJ0cmFjdCh0KTtcclxuICAgIGlmIChmcm9tVG8uZG90KHBUbykgPCBFUFNJTE9OKSB7XHJcbiAgICAgIHJldHVybiBwVG8ubGVuZ3RoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE1hdGguYWJzKHRvRnJvbS5jcm9zcyhwRnJvbSkgLyB0b0Zyb20ubGVuZ3RoKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b1JhZGlhbihkZWdyZWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB0b09wcG9zaXRlKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBVdGlscy5ub3JtYWxpemVEZWdyZWUoZGVncmVlKTtcclxuICAgIGlmIChub3JtYWxpemVkIDw9IDE4MCkge1xyXG4gICAgICByZXR1cm4gKDkwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICAgIH1cclxuICAgIHJldHVybiAoMjcwIC0gbm9ybWFsaXplZCkgKiAyICsgbm9ybWFsaXplZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIG5vcm1hbGl6ZURlZ3JlZShkZWdyZWU6IG51bWJlcikge1xyXG4gICAgY29uc3QgcmVtYWluZGVyID0gZGVncmVlICUgMzYwO1xyXG4gICAgcmV0dXJuIHJlbWFpbmRlciA8IDAgPyByZW1haW5kZXIgKyAzNjAgOiByZW1haW5kZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHJhbmQocmVuZ2U6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIHJlbmdlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWIHtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRMZW5ndGg6IG51bWJlcjtcclxuICBwcml2YXRlIGNhbGN1bGF0ZWRBbmdsZTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgYWRkKHY6IFYpOiBWO1xyXG4gIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBhZGQodjogYW55LCB5PzogbnVtYmVyKTogViB7XHJcbiAgICBpZiAodiBpbnN0YW5jZW9mIFYpIHtcclxuICAgICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2LnggfHwgMCksIHRoaXMueSArICh2LnkgfHwgMCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCArICh2IHx8IDApLCB0aGlzLnkgKyAoeSB8fCAwKSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBWKTogVjtcclxuICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWO1xyXG4gIHB1YmxpYyBzdWJ0cmFjdCh2OiBhbnksIHk/OiBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYueCB8fCAwKSwgdGhpcy55IC0gKHYueSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFYodGhpcy54IC0gKHYgfHwgMCksIHRoaXMueSAtICh5IHx8IDApKTtcclxuICB9XHJcbiAgcHVibGljIG11bHRpcGx5KHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAqIHYsIHRoaXMueSAqIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgZGl2aWRlKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAvIHYsIHRoaXMueSAvIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbW9kdWxvKHY6IFYgfCBudW1iZXIpOiBWIHtcclxuICAgIGlmICh2IGluc3RhbmNlb2YgVikge1xyXG4gICAgICByZXR1cm4gbmV3IFYodGhpcy54ICUgdi54LCB0aGlzLnkgJSB2LnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBWKHRoaXMueCAlIHYsIHRoaXMueSAlIHYpO1xyXG4gIH1cclxuICBwdWJsaWMgbmVnYXRlKCk6IFYge1xyXG4gICAgcmV0dXJuIG5ldyBWKC10aGlzLngsIC10aGlzLnkpO1xyXG4gIH1cclxuICBwdWJsaWMgZGlzdGFuY2UodjogVik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2KS5sZW5ndGgoKTtcclxuICB9XHJcbiAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jYWxjdWxhdGVkTGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMuZG90KCkpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlbmd0aDtcclxuICB9XHJcbiAgcHVibGljIG5vcm1hbGl6ZSgpOiBWIHtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgY29uc3Qgc2NhbGUgPSBjdXJyZW50ICE9PSAwID8gMSAvIGN1cnJlbnQgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoc2NhbGUpO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmFuZ2xlSW5SYWRpYW5zKCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuICBwdWJsaWMgYW5nbGVJblJhZGlhbnMoKTogbnVtYmVyIHtcclxuICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRBbmdsZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkQW5nbGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGN1bGF0ZWRBbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgdGhpcy54KTtcclxuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRBbmdsZTtcclxuICB9XHJcbiAgcHVibGljIGRvdChwb2ludDogViA9IHRoaXMpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnggKyB0aGlzLnkgKiBwb2ludC55O1xyXG4gIH1cclxuICBwdWJsaWMgY3Jvc3MocG9pbnQ6IFYpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMueCAqIHBvaW50LnkgLSB0aGlzLnkgKiBwb2ludC54O1xyXG4gIH1cclxuICBwdWJsaWMgcm90YXRlKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCByYWRpYW4gPSBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG4gICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIHJldHVybiBuZXcgVihjb3MgKiB0aGlzLnggLSBzaW4gKiB0aGlzLnksIGNvcyAqIHRoaXMueSArIHNpbiAqIHRoaXMueCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBzdGF0aWMgZGlyZWN0aW9uKGRlZ3JlZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFYoMSwgMCkucm90YXRlKGRlZ3JlZSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtaW5pbWl6ZSgpIHtcclxuICAgIHJldHVybiB7IHg6IE1hdGgucm91bmQodGhpcy54KSwgeTogTWF0aC5yb3VuZCh0aGlzLnkpIH0gYXMgVjtcclxuICB9XHJcbn1cclxuIl19
