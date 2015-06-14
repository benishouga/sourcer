import Controller = require('./Controller');
import Sourcer = require('./Sourcer');
import Field = require('./Field');
import Configs = require('./Configs');
import Utils = require('./Utils');
import ShotParam = require('./ShotParam');

class SourcerController extends Controller {
  public shield: () => number;
  public temperature: () => number;
  public missileAmmo: () => number;

  public scanEnemy: (direction: number, angle: number, renge?: number) => boolean;
  public scanAttack: (direction: number, angle: number, renge?: number) => boolean;

  public ahead: () => void;
  public back: () => void;
  public ascent: () => void;
  public descent: () => void;
  public turn: () => void;

  public fireLaser: (direction: number, power: number) => void;
  public fireMissile: (ai: Function) => void;

  constructor(sourcer: Sourcer) {
    super(sourcer);

    this.shield = () => sourcer.shield;
    this.temperature = () => sourcer.temperature;
    this.missileAmmo = () => sourcer.missileAmmo;
    this.fuel = () => sourcer.fuel;

    var field = sourcer.field;
    var command = sourcer.command;
    this.scanEnemy = (direction, angle, renge) => {
      command.validate();
      sourcer.wait += Configs.SCAN_WAIT;
      direction = sourcer.opposite(direction);
      renge = renge || Number.MAX_VALUE;
      var radar = Utils.createRadar(sourcer.position, direction, angle, renge);
      return field.scanEnemy(sourcer, radar);
    };
    this.scanAttack = (direction, angle, renge) => {
      command.validate();
      sourcer.wait += Configs.SCAN_WAIT;
      direction = sourcer.opposite(direction);
      renge = renge || Number.MAX_VALUE;
      var radar = Utils.createRadar(sourcer.position, direction, angle, renge);
      return field.scanAttack(sourcer, radar);
    };
    this.ahead = () => {
      command.validate();
      command.ahead = 0.8;
    };
    this.back = () => {
      command.validate();
      command.ahead = -0.4;
    };
    this.ascent = () => {
      command.validate();
      command.ascent = 0.9;
    };
    this.descent = () => {
      command.validate();
      command.ascent = -0.9;
    };
    this.turn = () => {
      command.validate();
      command.turn = true;
    };

    this.fireLaser = (direction, power) => {
      command.validate()
      power = Math.min(Math.max(power || 8, 3), 8);
      command.fire = new ShotParam();
      command.fire.power = power;
      command.fire.direction = direction;
      command.fire.shotType = 'Laser';
    };

    this.fireMissile = (ai) => {
      command.validate()
      command.fire = new ShotParam();
      command.fire.ai = ai;
      command.fire.shotType = 'Missile';
    };

  }
}
export = SourcerController;
