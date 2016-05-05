import Field from './Field';
import Sourcer from './Sourcer';
import Actor from './Actor';
import Fx from './Fx';
import {ShotDump} from './Dump';
import V from './V';
import Utils from './Utils';

export default class Shot extends Actor {
  temperature = 0;
  damage = () => 0;
  breakable = false;

  constructor(field: Field, public owner: Sourcer, public type: string) {
    super(field, owner.position.x, owner.position.y);
  }

  action() {
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
  }


  createFxs() {
    for (let i = 0; i < 3; i++) {
      let position = this.position.add(Utils.rand(16) - 8, Utils.rand(16) - 8);
      let speed = new V(Utils.rand(1) - 0.5, Utils.rand(1) - 0.5);
      let length = Utils.rand(8) + 4;
      this.field.addFx(new Fx(this.field, position, this.speed.divide(2).add(speed), length));
    }
  }

  reaction(sourcer: Sourcer) {
    sourcer.temperature += this.temperature;
  }

  onAction() {
    // do nothing
  }

  dump(): ShotDump {
    return {
      o: this.owner.id,
      i: this.id,
      p: this.position.minimize(),
      d: this.direction,
      s: this.type
    };
  }
}
