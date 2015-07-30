import chainchomp from '../libs/chainchomp';
import Actor, {ActorDump} from './Actor';
import Field from './Field';
import SourcerCommand from './SourcerCommand';
import SourcerController from './SourcerController';
import ShotParam from './ShotParam';
import Configs from './Configs';
import Consts from './Consts';
import Utils from './Utils';
import V from './V';
import Shot from './Shot';
import Laser from './Laser';
import Missile from './Missile';

export default class Sourcer extends Actor {
  alive = true;
  temperature = 0;
  shield = Configs.INITIAL_SHIELD;
  missileAmmo = Configs.INITIAL_MISSILE_AMMO;
  fuel = Configs.INITIAL_FUEL;

  command: SourcerCommand;
  controller: SourcerController;
  ai: Function;

  constructor(field: Field, x: number, y: number, ai: string, public name: string, public color: string) {
    super(field, x, y);
    this.direction = Consts.DIRECTION_RIGHT;
    this.command = new SourcerCommand(this);
    this.controller = new SourcerController(this);

    try {
      interface ExportScope {
        module: {
          exports: Function;
        };
      }

      let scope: ExportScope = {
        module: {
          exports: null
        }
      };
      this.ai = chainchomp(ai, scope) || scope.module && scope.module.exports;
    } catch (error) {
      this.ai = null;
    }
  }

  onThink() {
    if (this.ai === null || !this.alive) {
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

  action() {
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
      this.shield -= (-this.speed.y * Configs.GROUND_DAMAGE_SCALE);
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
    this.shield = Math.max(0, this.shield);

    this.command.execute()
    this.command.reset()
  }

  fire(param: ShotParam) {
    if (param.shotType === "Laser") {
      var direction = this.opposite(param.direction);
      var shot = new Laser(this.field, this, direction, param.power);
      shot.reaction(this);
      this.field.addShot(shot);
    }

    if (param.shotType === 'Missile') {
      if (0 < this.missileAmmo) {
        var missile = new Missile(this.field, this, param.ai);
        missile.reaction(this);
        this.missileAmmo--;
        this.field.addShot(missile);
      }
    }
  }

  opposite(direction: number): number {
    if (this.direction === Consts.DIRECTION_LEFT) {
      return Utils.toOpposite(direction);
    } else {
      return direction;
    }
  }

  onHit(shot: Shot) {
    this.speed = this.speed.add(shot.speed.multiply(Configs.ON_HIT_SPEED_GIVEN_RATE));
    this.shield -= shot.damage();
    this.shield = Math.max(0, this.shield);
    this.field.removeShot(shot);
  }

  dump() {
    return new SourcerDump(this);
  }
}

export class SourcerDump extends ActorDump {
  shield: number;
  temperature: number;
  missileAmmo: number;
  fuel: number;
  name: string;
  color: string;

  constructor(sourcer: Sourcer) {
    super(sourcer);
    this.shield = sourcer.shield;
    this.temperature = sourcer.temperature;
    this.missileAmmo = sourcer.missileAmmo;
    this.fuel = sourcer.fuel;
    this.name = sourcer.name;
    this.color = sourcer.color;
  }
}
