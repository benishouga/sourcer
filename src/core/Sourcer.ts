import chainchomp = require('../libs/chainchomp');

import Actor = require('./Actor');
import Field = require('./Field');
import SourcerCommand = require('./SourcerCommand');
import SourcerController = require('./SourcerController');
import ShotParam = require('./ShotParam');
import Configs = require('./Configs');
import Consts = require('./Consts');
import Utils = require('./Utils');
import V = require('./V');
import Shot = require('./Shot');
import Laser = require('./Laser');
import Missile = require('./Missile');

class Sourcer extends Actor {
  public alive = true;
  public temperature = 0;
  public shield = Configs.INITIAL_SHIELD;
  public missileAmmo = Configs.INITIAL_MISSILE_AMMO;
  public fuel = Configs.INITIAL_FUEL;

  public command: SourcerCommand;
  public controller: SourcerController;
  public ai: Function;

  constructor(field: Field, x: number, y: number, ai: string) {
    super(field, x, y);
    this.command = new SourcerCommand(this);
    this.controller = new SourcerController(this);

    try {
      this.ai = chainchomp(ai);
    } catch (error) {
      this.ai = null;
    }
  }

  public onThink() {
    if (this.ai === null) {
      return;
    }

    try {
      this.command.accept();
      this.ai(this.controller);
    } catch (error) {
      this.command.reset();
    } finally {
      this.command.unaccept();
    }
  }

  public action() {
    // air resistance
    this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);

    // gravity
    this.speed = this.speed.subtract(0, Configs.GRAVITY);

    // control altitude by the invisible hand
    if (Configs.TOP_INVISIBLE_HAND < this.position.y) {
      var invisiblePower = (this.position.y - Configs.TOP_INVISIBLE_HAND) * 0.1;
      this.speed = this.speed.subtract(0, Configs.GRAVITY * invisiblePower);
    }

    // control distance by the invisible hand
    var diff = this.field.center - this.position.x
    if (Configs.DISTANCE_BORDAR < Math.abs(diff)) {
      var invisibleHand = diff * Configs.DISTANCE_INVISIBLE_HAND;
      this.position = new V(this.position.x + invisibleHand, this.position.y);
    }

    // go into the ground
    if (this.position.y < 0) {
      this.shield += this.speed.y * Configs.GROUND_DAMAGE_SCALE;
      this.position = new V(this.position.x, 0);
      this.speed = new V(this.speed.x, 0);
    }

    this.temperature -= Configs.COOL_DOWN;
    this.temperature = Math.max(this.temperature, 0);

    // overheat
    var overheat = (this.temperature - Configs.OVERHEAT_BORDER);
    if (0 < overheat) {
      var linearDamage = overheat * Configs.OVERHEAT_DAMAGE_LINEAR_WEIGHT;
      var powerDamage = Math.pow(overheat * Configs.OVERHEAT_DAMAGE_POWER_WEIGHT, 2);
      this.shield -= (linearDamage + powerDamage);
    }

    this.command.execute()
    this.command.reset()
  }

  public fire(param: ShotParam) {
    if (param.shotType === "Laser") {
      var direction = this.opposite(param.direction);
      var shot = new Laser(this.field, this, direction, param.power);
      shot.reaction(this);
    }

    if (param.shotType === 'Missile') {
      this.missileAmmo--;
      var missile = new Missile(this.field, this, param.ai);
      missile.reaction(this);
    }
  }

  public opposite(direction: number): number {
    if (this.direction === Consts.DIRECTION_LEFT) {
      return Utils.toOpposite(direction);
    } else {
      return direction;
    }
  }

  public onHit(shot: Shot) {
    this.speed = this.speed.add(shot.speed.multiply(Configs.ON_HIT_SPEED_GIVEN_RATE));
    this.shield -= shot.damage();
    this.field.removeShot(shot);
  }

  public dump(): any {
    var dump = super.dump();
    dump.shield = this.shield;
    dump.temperature = this.temperature;
    dump.missileAmmo = this.missileAmmo;
    dump.fuel = this.fuel;
    return dump;
  }
}

export = Sourcer;
