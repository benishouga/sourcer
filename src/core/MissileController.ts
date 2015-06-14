import Controller = require('./Controller');
import Field = require('./Field');
import Missile = require('./Missile');
import Utils = require('./Utils');

class MissileController extends Controller {
  public direction: () => number;
  public scanEnemy: (direction: number, angle: number, renge: number) => boolean;
  public speedUp: () => void;
  public speedDown: () => void;
  public turnRight: () => void;
  public turnLeft: () => void;

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

export = MissileController;
