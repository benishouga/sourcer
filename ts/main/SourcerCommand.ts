import Command = require('./Command');
import Sourcer = require('./Sourcer');
import Configs = require('./Configs');
import ShotParam = require('./ShotParam');

class SourcerCommand extends Command {
  public ahead: number;
  public ascent: number;
  public turn: boolean;
  public fire: ShotParam;

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
    }
  }
}

export = SourcerCommand;
