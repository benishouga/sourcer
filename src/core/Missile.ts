import Actor from './Actor';
import Shot from './Shot';
import Field from './Field';
import Sourcer from './Sourcer';
import Utils from './Utils';
import V from './V';
import Fx from './Fx';
import Configs from './Configs';
import MissileCommand from './MissileCommand';
import MissileController from './MissileController';
import Consts from './Consts';

export default class Missile extends Shot {
  temperature = 5;
  damage = () => 10 + this.speed.length() * 2;
  fuel = 100;
  breakable = true;

  command: MissileCommand;
  controller: MissileController;

  constructor(field: Field, owner: Sourcer, public ai: Function) {
    super(field, owner, "Missile");
    this.ai = ai;
    this.direction = owner.direction === Consts.DIRECTION_RIGHT ? 0 : 180;
    this.speed = owner.speed;
    this.command = new MissileCommand(this);
    this.command.reset();
    this.controller = new MissileController(this);
  }

  onThink() {
    this.command.reset();
    try {
      this.command.accept();
      this.ai(this.controller);
      this.command.unaccept();
    } catch (error) {
      this.command.reset();
    }
  }

  onAction() {
    this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);
    this.command.execute();
    this.command.reset();
  }

  onHit(attack: Shot) {
    this.field.removeShot(this);
    this.field.removeShot(attack);
  }

  opposite(direction: number): number {
    return this.direction + direction;
  }
}
