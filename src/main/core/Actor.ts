import Consts from './Consts';
import Field from './Field';
import V from './V';
import Configs from './Configs';
import Shot from './Shot';

export default class Actor {
  public id: number;
  public position: V;
  public speed: V;
  public direction: number;
  public size = Configs.COLLISION_SIZE;
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
      this.wait = this.wait - 1;
    }
  }

  public onThink(): void {
    // not think anything.
  }

  public action(): void {
    // do nothing
  }

  public move() {
    this.position = this.position.add(this.speed);
  }

  public onHit(shot: Shot) {
    // do nothing
  }

  public dump() {
    throw new Error('not implimentation');
  }
}
