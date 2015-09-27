import Field from './Field';
import Sourcer from './Sourcer';
import Actor, {ActorDump} from './Actor';
import Fx from './Fx';

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
      this.field.addFx(new Fx(this.field, this.position, this.speed.divide(2), 8));
    }

    if (this.field.checkCollisionEnviroment(this)) {
      this.field.removeShot(this);
      this.field.addFx(new Fx(this.field, this.position, this.speed.divide(2), 8));
    }
  }
  reaction(sourcer: Sourcer) {
    sourcer.temperature += this.temperature;
  }

  onAction() {
    // do nothing
  }

  dump() {
    return new ShotDump(this);
  }
}

export class ShotDump extends ActorDump {
  type: string;
  color: string;

  constructor(shot: Shot) {
    super(shot);
    this.type = shot.type;
    this.color = shot.owner.color;
  }
}
