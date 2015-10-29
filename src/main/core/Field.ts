import V from './V';
import Actor from './Actor';
import Sourcer from './Sourcer';
import Shot from './Shot';
import Fx from './Fx';
import Utils from './Utils';
import TickEventListener from './TickEventListener';
import {FieldDump, GameResult, SourcerDump, ShotDump, FxDump} from './Dump';

export default class Field {
  currentId = 0;
  sourcers: Sourcer[];
  shots: Shot[];
  fxs: Fx[];
  actorCounter: number;
  frame: number;
  finishedFrame: number;
  center: number;
  result: GameResult;
  isFinished: boolean = false;

  constructor() {
    this.frame = 0;
    this.sourcers = [];
    this.shots = [];
    this.fxs = [];
  }

  addSourcer(sourcer: Sourcer) {
    sourcer.id = "sourcer" + (this.currentId++);
    this.sourcers.push(sourcer);
  }

  addShot(shot: Shot) {
    shot.id = "shot" + (this.currentId++);
    this.shots.push(shot);
  }

  removeShot(target: Shot) {
    var index = this.shots.indexOf(target);
    if (0 <= index) {
      this.shots.splice(index, 1);
    }
  }

  addFx(fx: Fx) {
    fx.id = "fx" + (this.currentId++);
    this.fxs.push(fx);
  }

  removeFx(target: Fx) {
    var index = this.fxs.indexOf(target);
    if (0 <= index) {
      this.fxs.splice(index, 1);
    }
  }

  tick(listener: TickEventListener) {
    // To be used in the invisible hand.
    this.center = this.computeCenter();

    this.sourcers.forEach((sourcer: Sourcer) => {
      listener.onPreThink(sourcer.id);
      sourcer.think();
      listener.onPostThink(sourcer.id);
    });
    this.shots.forEach((shot: Shot) => {
      listener.onPreThink(shot.owner.id);
      shot.think();
      listener.onPostThink(shot.owner.id);
    });

    this.sourcers.forEach((actor: Actor) => {
      actor.action();
    });
    this.shots.forEach((actor: Actor) => {
      actor.action();
    });
    this.fxs.forEach((fx: Fx) => {
      fx.action();
    });

    this.sourcers.forEach((actor: Actor) => {
      actor.move();
    });
    this.shots.forEach((actor: Actor) => {
      actor.move();
    });
    this.fxs.forEach((fx: Fx) => {
      fx.move();
    });

    this.checkResult();
    this.checkFinish();

    this.frame++;
  }

  checkResult() {
    // 決定済み
    if (this.result) {
      return;
    }

    this.sourcers.forEach((sourcer) => { sourcer.alive = 0 < sourcer.shield; });
    var survivers = this.sourcers.filter((sourcer) => { return sourcer.alive; });

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
      return;
    }

    // no surviver draw...
    this.result = {
      winner: null,
      frame: this.frame,
      isDraw: true
    };
  }

  checkFinish() {
    if (this.isFinished) {
      return;
    }

    var finished = false;

    if (!this.finishedFrame) {
      var survivers = this.sourcers.filter((sourcer) => { return sourcer.alive; });
      if (survivers.length <= 1) {
        this.finishedFrame = this.frame;
      }
      return;
    }

    if (this.finishedFrame < this.frame - 90) {
      this.isFinished = true;
    }
  }

  scanEnemy(owner: Sourcer, radar: (t: V) => boolean): boolean {
    return this.sourcers.some((sourcer) => {
      return sourcer.alive && sourcer !== owner && radar(sourcer.position);
    });
  }

  scanAttack(owner: Sourcer, radar: (t: V) => boolean): boolean {
    return this.shots.some((shot) => {
      return shot.owner !== owner && radar(shot.position) && this.isIncoming(owner, shot);
    });
  }

  isIncoming(owner: Sourcer, shot: Shot) {
    var ownerPosition = owner.position;
    var actorPosition = shot.position;
    var currentDistance = ownerPosition.distance(actorPosition);
    var nextDistance = ownerPosition.distance(actorPosition.add(shot.speed));
    return nextDistance < currentDistance;
  }

  checkCollision(shot: Shot): Actor {
    var f = shot.position;
    var t = shot.position.add(shot.speed);

    for (var i = 0; i < this.shots.length; i++) {
      var actor = this.shots[i];
      if (actor.breakable && actor.owner !== shot.owner) {
        var distance = Utils.calcDistance(f, t, actor.position);
        if (distance < shot.size + actor.size) {
          return actor;
        }
      }
    }

    for (var i = 0; i < this.sourcers.length; i++) {
      var sourcer = this.sourcers[i];
      if (sourcer.alive && sourcer !== shot.owner) {
        var distance = Utils.calcDistance(f, t, sourcer.position);
        if (distance < shot.size + sourcer.size) {
          return sourcer;
        }
      }
    }

    return null;
  }

  checkCollisionEnviroment(shot: Shot): boolean {
    return shot.position.y < 0;
  }

  private computeCenter(): number {
    var count = 0;
    var sumX = 0;
    this.sourcers.forEach((sourcer: Sourcer) => {
      if (sourcer.alive) {
        sumX += sourcer.position.x;
        count++;
      }
    });
    return sumX / count;
  }

  dump(): FieldDump {
    var sourcersDump: any[] = [];
    var shotsDump: any[] = [];
    var fxDump: any[] = [];
    var resultDump: any = null;

    this.sourcers.forEach((actor: Actor) => {
      sourcersDump.push(actor.dump());
    });
    this.shots.forEach((actor: Actor) => {
      shotsDump.push(actor.dump());
    });
    this.fxs.forEach((fx: Fx) => {
      fxDump.push(fx.dump());
    });

    return {
      frame: this.frame,
      sourcers: sourcersDump,
      shots: shotsDump,
      fxs: fxDump,
      result: this.result
    };
  }
}
