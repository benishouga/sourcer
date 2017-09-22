import Command from './Command';
import Missile from './Missile';
import Utils from './Utils';
import Configs from './Configs';
import V from './V';

export default class MissileCommand extends Command {
  public speedUp: number;
  public speedDown: number;
  public turn: number;

  constructor(public missile: Missile) {
    super();
    this.reset();
  }

  public reset() {
    this.speedUp = 0;
    this.speedDown = 0;
    this.turn = 0;
  }

  public execute() {
    if (0 < this.missile.fuel) {
      this.missile.direction += this.turn;
      const normalized = V.direction(this.missile.direction);
      this.missile.speed = this.missile.speed.add(normalized.multiply(this.speedUp));
      this.missile.speed = this.missile.speed.multiply(1 - this.speedDown);
      this.missile.fuel -= (this.speedUp + this.speedDown * 3) * Configs.FUEL_COST;
      this.missile.fuel = Math.max(0, this.missile.fuel);
    }
  }
}
