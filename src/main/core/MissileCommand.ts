import Command from './Command';
import Missile from './Missile';
import Utils from './Utils';
import Configs from './Configs';
import V from './V';

export default class MissileCommand extends Command {
  speedUp: number;
  speedDown: number;
  turn: number;

  constructor(public missile: Missile) {
    super();
    this.reset();
  }

  reset() {
    this.speedUp = 0;
    this.speedDown = 0;
    this.turn = 0;
  }

  execute() {
    if (0 < this.missile.fuel) {
      this.missile.direction += this.turn;
      var normalized = V.direction(this.missile.direction);
      this.missile.speed = this.missile.speed.add(normalized.multiply(this.speedUp));
      this.missile.speed = this.missile.speed.multiply(1 - this.speedDown);
      this.missile.fuel -= (this.speedUp + this.speedDown * 3) * Configs.FUEL_COST;
      this.missile.fuel = Math.max(0, this.missile.fuel);
    }
  }
}
