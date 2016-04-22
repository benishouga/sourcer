import Consts from './Consts';
import Field from './Field';
import V from './V';
import Configs from './Configs';
import Shot from './Shot';

export default class Actor {
  id: number;
  position: V;
  speed: V;
  direction: number;
  size = Configs.COLLISION_SIZE;
  wait = 0;

  constructor(public field: Field, x: number, y: number) {
    this.wait = 0;
    this.position = new V(x, y);
    this.speed = new V(0, 0);
  }

  think() {
    if (this.wait <= 0) {
      this.wait = 0;
      this.onThink();
    } else {
      this.wait--;
    }
  }

  onThink(): void {
    // not think anything.
  };

  action() {
    // do nothing
  }

  move() {
    this.position = this.position.add(this.speed);
  }

  onHit(shot: Shot) {
    // do nothing
  }

  dump() {
    throw new Error('not implimentation');
  }
}
