import Command from './Command';
import Sourcer from './Sourcer';
import Configs from './Configs';
import FireParam from './FireParam';

export default class SourcerCommand extends Command {
  public ahead: number = 0;
  public ascent: number = 0;
  public turn: boolean = false;
  public fire: FireParam | null = null;

  constructor(public sourcer: Sourcer) {
    super();
    this.reset();
  }

  public reset() {
    this.ahead = 0;
    this.ascent = 0;
    this.turn = false;
    this.fire = null;
  }

  public execute() {
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
