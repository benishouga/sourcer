import Shot = require('./Shot');
import Field = require('./Field');
import Sourcer = require('./Sourcer');
import Utils = require('./Utils');
import V = require('./V');

class Laser extends Shot {
  public temperature = 5;
  public damage = () => 8;
  constructor(field: Field, owner: Sourcer, public direction: number, power: number) {
    super(field, owner, "Laser");
    this.speed = V.direction(direction).multiply(power);
  }
}

export = Laser;
