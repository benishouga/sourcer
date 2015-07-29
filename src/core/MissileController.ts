import Controller from './Controller';
import Field from './Field';
import Missile from './Missile';
import Utils from './Utils';

export default class MissileController extends Controller {
  direction: () => number;
  scanEnemy: (direction: number, angle: number, renge?: number) => boolean;
  speedUp: () => void;
  speedDown: () => void;
  turnRight: () => void;
  turnLeft: () => void;

  constructor(missile: Missile) {
    super(missile);
    this.direction = () => missile.direction;

    var field = missile.field;
    var command = missile.command;

    this.fuel = () => missile.fuel;

    this.scanEnemy = (direction, angle, renge) => {
      command.validate();
      missile.wait += 1.5;
      direction = missile.opposite(direction);
      renge = renge || Number.MAX_VALUE;
      var radar = Utils.createRadar(missile.position, direction, angle, renge);
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
    }
  }
}
