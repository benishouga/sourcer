import Actor = require('./Actor');
import Shot = require('./Shot');
import Field = require('./Field');
import Sourcer = require('./Sourcer');
import Utils = require('./Utils');
import V = require('./V');
import Fx = require('./Fx');
import Configs = require('./Configs');
import MissileCommand = require('./MissileCommand');
import MissileController = require('./MissileController');
import Consts = require('./Consts');

class Missile extends Shot {
  public temperature = 5;
  public damage = () => 10 + this.speed.length() * 2;
  public fuel = 100;
  public breakable = true;

  public ai: Function;

  public command: MissileCommand;
  public controller: MissileController;

  constructor(field: Field, owner: Sourcer, ai: Function) {
    super(field, owner, "Missile");
    this.ai = ai;
    this.direction = owner.direction === Consts.DIRECTION_RIGHT ? 0 : 180;
    this.speed = owner.speed;
    this.command = new MissileCommand(this);
    this.command.reset();
    this.controller = new MissileController(this);
  }

  public onThink() {
    this.command.reset();
    try {
      this.command.accept();
      this.ai(this.controller);
      this.command.unaccept();
    } catch (error) {
      this.command.reset();
    }
  }

  public onAction() {
    this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);
    this.command.execute();
    this.command.reset();
  }

  public onHit(attack: Shot) {
    this.field.removeShot(this);
    this.field.removeShot(attack);
  }

  public opposite(direction: number): number {
    return this.direction + direction;
  }
}

export = Missile;
