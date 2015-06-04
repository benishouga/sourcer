import V = require('./V');
import Actor = require('./Actor');
import Sourcer = require('./Sourcer');
import Shot = require('./Shot');
import Utils = require('./Utils');

class Field {
  public sourcers: Sourcer[];
  public actors: Actor[];
  public shots: Shot[];
  public actorCounter: number;
  public frame: number;
  public center: number;

  constructor() {
    this.sourcers = [];
    this.actors = [];
    this.shots = [];
  }

  public addSourcer(sourcer: Sourcer) {
    this.sourcers.push(sourcer);
    this.addActor(sourcer);
  }

  public addActor(actor: Actor) {
    actor.id = "actor" + this.actors.length;
    this.actors.push(actor);
  }

  public addShot(shot: Shot) {
    this.shots.push(shot);
    this.actors.push(shot);
  }

  public removeActor(target: Actor) {
    for (var i = 0; i < this.actors.length; i++) {
      var actor = this.actors[i];
      if (actor === target) {
        this.actors.splice(i, 1);
        return;
      }
    }
  }

  public tick() {
    this.center = this.computeCenter();

    this.actors.forEach((actor: Actor) => {
      actor.think();
    });
    this.actors.forEach((actor: Actor) => {
      actor.action();
    });
    this.actors.forEach((actor: Actor) => {
      actor.move();
    });
  }

  public scanEnemy(owner: Sourcer, radar: ((t: V) => boolean)): boolean {
    for (var i = 0; i < this.sourcers.length; i++) {
      var sourcer = this.sourcers[i];
      if (sourcer.alive && sourcer !== owner && radar(sourcer.position)) {
        return true;
      }
    }
    return false;
  }

  public scanAttack(owner: Sourcer, radar: ((t: V) => boolean)): boolean {
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

  public checkCollision(shot: Shot): Actor {
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

  public isFinish(): boolean {
    for (var i = 0; i < this.sourcers.length; i++) {
      var sourcer = this.sourcers[i];
      if (!sourcer.alive) {
        return true;
      }
    }
    return false;
  }
}

export = Field;
