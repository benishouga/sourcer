import Controller from './Controller';
import Sourcer from './Sourcer';
import Field from './Field';
import Configs from './Configs';
import Utils from './Utils';
import ShotParam from './ShotParam';

export default class SourcerController extends Controller {
  shield: () => number;
  temperature: () => number;
  missileAmmo: () => number;

  scanEnemy: (direction: number, angle: number, renge?: number) => boolean;
  scanAttack: (direction: number, angle: number, renge?: number) => boolean;

  ahead: () => void;
  back: () => void;
  ascent: () => void;
  descent: () => void;
  turn: () => void;

  fireLaser: (direction: number, power: number) => void;
  fireMissile: (ai: Function) => void;

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
      command.validate();
      power = Math.min(Math.max(power || 8, 3), 8);
      command.fire = new ShotParam();
      command.fire.power = power;
      command.fire.direction = direction;
      command.fire.shotType = 'Laser';
    };

    this.fireMissile = (ai) => {
      command.validate();
      command.fire = new ShotParam();
      command.fire.ai = ai;
      command.fire.shotType = 'Missile';
    };

  }
}
