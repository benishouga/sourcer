import Shot = require('./Shot');
import Field = require('./Field');
import Sourcer = require('./Sourcer');
import Utils = require('./Utils');
import V = require('./V');

class Laser extends Shot {
  public temperature = 5;
  public damage = () => 8;
  constructor(field: Field, owner: Sourcer, direction: number, power: number) {
    super(field, owner);
    var radian = Utils.toRadian(direction);
    this.speed = new V(power * Math.cos(radian), power * Math.sin(radian));
  }
}

export = Laser;
