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
    for (var i = 0; i < this.shots.length; i++) {
      var actor = this.shots[i];
      if (actor === target) {
        this.shots.splice(i, 1);
        return;
      }
    }
  }

  addFx(fx: Fx) {
    fx.id = "fx" + (this.currentId++);
    this.fxs.push(fx);
  }

  removeFx(target: Fx) {
    for (var i = 0; i < this.fxs.length; i++) {
      var fx = this.fxs[i];
      if (fx === target) {
        this.fxs.splice(i, 1);
        return;
      }
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

    this.frame++;
  }

  checkResult() {
    if (this.result) {
      return;
    }

    var survived: Sourcer = null;
    for (var i = 0; i < this.sourcers.length; i++) {
      var sourcer = this.sourcers[i];
      if (sourcer.shield <= 0) {
        sourcer.alive = false;
      } else if (!survived) {
        survived = sourcer;
      } else {
        return;
      }
    }

    this.result = {
      winner: survived.dump(),
      frame: this.frame,
      isDraw: !survived
    };
  }

  scanEnemy(owner: Sourcer, radar: (t: V) => boolean): boolean {
    for (var i = 0; i < this.sourcers.length; i++) {
      var sourcer = this.sourcers[i];
      if (sourcer.alive && sourcer !== owner && radar(sourcer.position)) {
        return true;
      }
    }
    return false;
  }

  scanAttack(owner: Sourcer, radar: (t: V) => boolean): boolean {
    var ownerPosition = owner.position;
    for (var i = 0; i < this.shots.length; i++) {
      var shot = this.shots[i];
      var actorPosition = shot.position;
      if (shot.owner !== owner && radar(actorPosition)) {
        var currentDistance = ownerPosition.distance(actorPosition);
        var nextDistance = ownerPosition.distance(actorPosition.add(shot.speed));
        if (nextDistance < currentDistance) {
          return true;
        }
      }
    }
    return false;
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
        if (distance < shot.size + actor.size) {
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

  isFinish(): boolean {
    var finished = false;

    if (!this.finishedFrame) {
      for (var i = 0; i < this.sourcers.length; i++) {
        var sourcer = this.sourcers[i];
        if (!sourcer.alive) {
          finished = true;
          this.finishedFrame = this.frame;
        }
      }
      return false;
    }

    if (this.finishedFrame < this.frame - 90) {
      return true;
    }

    return false;
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
