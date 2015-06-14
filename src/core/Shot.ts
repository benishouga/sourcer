import Field = require('./Field');
import Sourcer = require('./Sourcer');
import Actor = require('./Actor');

class Shot extends Actor {
  public temperature = 0;
  public damage = () => 0;
  public breakable = false;

  public constructor(field: Field, public owner: Sourcer, public type: string) {
    super(field, owner.position.x, owner.position.y);
  }

  public action() {
    this.onAction();
    var collided = this.field.checkCollision(this);
    if (collided) {
      collided.onHit(this);
    }

    if (this.field.checkCollisionEnviroment(this)) {
      this.field.removeShot(this);
    }
  }
  public reaction(sourcer: Sourcer) {
    sourcer.temperature += this.temperature;
  }

  public onAction() {
  }

  public dump(): any {
    var dump = super.dump();
    dump.type = this.type;
    return dump;
  }
}

export = Shot;
