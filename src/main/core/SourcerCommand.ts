import Command from './Command';
import Sourcer from './Sourcer';
import Configs from './Configs';
import ShotParam from './ShotParam';

export default class SourcerCommand extends Command {
  ahead: number;
  ascent: number;
  turn: boolean;
  fire: ShotParam;

  constructor(public sourcer: Sourcer) {
    super();
    this.reset();
  }

  reset() {
    this.ahead = 0;
    this.ascent = 0;
    this.turn = false;
    this.fire = null;
  }

  execute() {
    if (this.fire) {
      this.sourcer.fire(this.fire);
    }

    if (this.turn) {
      this.sourcer.direction *= -1;
    }

    if (0 < this.sourcer.fuel) {
      this.sourcer.speed = this.sourcer.speed.add(this.ahead * this.sourcer.direction, this.ascent);
      this.sourcer.fuel -= (Math.abs(this.ahead) + Math.abs(this.ascent)) * Configs.FUEL_COST;
      this.sourcer.fuel = Math.max(0, this.sourcer.fuel);
    }
  }
}
