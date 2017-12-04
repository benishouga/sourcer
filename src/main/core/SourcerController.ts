import Controller from './Controller';
import Sourcer from './Sourcer';
import Field from './Field';
import Configs from './Configs';
import Utils from './Utils';
import FireParam from './FireParam';
import MissileController from './MissileController';
import { ConsoleLike } from './ScriptLoader';

export default class SourcerController extends Controller {
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
  public fireMissile: (bot: (controller: MissileController) => void) => void;

  public log: (...messages: any[]) => void;

  constructor(sourcer: Sourcer) {
    super(sourcer);

    this.shield = () => sourcer.shield;
    this.temperature = () => sourcer.temperature;
    this.missileAmmo = () => sourcer.missileAmmo;
    this.fuel = () => sourcer.fuel;

    const field = sourcer.field;
    const command = sourcer.command;
    this.scanEnemy = (direction, angle, renge) => {
      command.validate();
      sourcer.wait += Configs.SCAN_WAIT;
      const oppositedDirection = sourcer.opposite(direction);
      const normalizedRenge = renge || Number.MAX_VALUE;
      const radar = Utils.createRadar(sourcer.position, oppositedDirection, angle, normalizedRenge);
      return field.scanEnemy(sourcer, radar);
    };
    this.scanAttack = (direction, angle, renge) => {
      command.validate();
      sourcer.wait += Configs.SCAN_WAIT;
      const oppositedDirection = sourcer.opposite(direction);
      const normalizedRenge = renge || Number.MAX_VALUE;
      const radar = Utils.createRadar(sourcer.position, oppositedDirection, angle, normalizedRenge);
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
      command.fire = FireParam.laser(power, direction);
    };

    this.fireMissile = (bot) => {
      command.validate();
      command.fire = FireParam.missile(bot);
    };

    const isString = (value: any): value is string => Object.prototype.toString.call(value) === '[object String]';
    this.log = (...message: any[]) => {
      sourcer.log(message.map(value => isString(value) ? value : JSON.stringify(value)).join(', '));
    };
  }

  public connectConsole(console: ConsoleLike | null) {
    if (console) {
      console.log = this.log.bind(this);
    }
  }
}
