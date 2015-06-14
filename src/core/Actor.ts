import Consts = require('./Consts');
import Field = require('./Field');
import V = require('./V');
import Configs = require('./Configs');
import Shot = require('./Shot');

class Actor {
  public id: string;
  public size = Configs.COLLISION_SIZE;
  public position: V;
  public speed: V;
  public direction: number;
  public wait = 0;

  constructor(public field: Field, x: number, y: number) {
    this.wait = 0;
    this.position = new V(x, y);
    this.speed = new V(0, 0);
  }

  public think() {
    if (this.wait <= 0) {
      this.wait = 0;
      this.onThink();
    } else {
      this.wait--;
    }
  }

  public onThink() {
  }

  public action() {
  }

  public move() {
    this.position = this.position.add(this.speed);
  }

  public onHit(shot: Shot) {
  }

  public dump(): any {
    return {
      position: this.position,
      speed: this.speed,
      direction: this.direction
    }
  }
}
export = Actor;
