import Controller from './Controller';
import Field from './Field';
import Missile from './Missile';
import Utils from './Utils';
import { ConsoleLike } from './ScriptLoader';

export default class MissileController extends Controller {
  public direction: () => number;
  public scanEnemy: (direction: number, angle: number, renge?: number) => boolean;
  public speedUp: () => void;
  public speedDown: () => void;
  public turnRight: () => void;
  public turnLeft: () => void;

  public log: (...messages: any[]) => void;
  public scanDebug: (direction: number, angle: number, renge?: number) => void;

  constructor(missile: Missile) {
    super(missile);
    this.direction = () => missile.direction;

    const field = missile.field;
    const command = missile.command;

    this.fuel = () => missile.fuel;

    this.scanEnemy = (direction, angle, renge) => {
      command.validate();
      missile.wait += 1.5;
      const missileDirection = missile.opposite(direction);
      const radar = Utils.createRadar(missile.position, missileDirection, angle, renge || Number.MAX_VALUE);
      return missile.field.scanEnemy(missile.owner, radar);
    };

    this.speedUp = () => {
      command.validate();
      command.speedUp = 0.8;
    };

    this.speedDown = () => {
      command.validate();
      command.speedDown = 0.1;
    };

    this.turnRight = () => {
      command.validate();
      command.turn = -9;
    };

    this.turnLeft = () => {
      command.validate();
      command.turn = 9;
    };
    const isString = (value: any): value is string => Object.prototype.toString.call(value) === '[object String]';
    this.log = (...message: any[]) => {
      command.validate();
      missile.log(message.map(value => isString(value) ? value : JSON.stringify(value)).join(', '));
    };
    this.scanDebug = (direction, angle, renge) => {
      command.validate();
      missile.scanDebug(missile.opposite(direction), angle, renge);
    };
  }

  public connectConsole(console: ConsoleLike | null) {
    if (console) {
      console.log = this.log.bind(this);
    }
  }
}
