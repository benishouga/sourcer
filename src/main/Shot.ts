import Field = require('./Field');
import Sourcer = require('./Sourcer');
import Actor = require('./Actor');

class Shot extends Actor {
  public temperature = 0;
  public damage = () => 0;
  public breakable = false;

  public constructor(field: Field, public owner: Sourcer) {
    super(field, owner.position.x, owner.position.y);
    field.addShot(this);
  }

  public action() {
    this.onAction();
    var collided = this.field.checkCollision(this);
    if (collided) {
      collided.onHit(this);
      return;
    }
  }
  public reaction(sourcer: Sourcer) {
    sourcer.temperature += this.temperature;
  }

  public onAction() {
  }
}

export = Shot;
