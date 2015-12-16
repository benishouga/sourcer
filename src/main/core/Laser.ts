import Shot from './Shot';
import Field from './Field';
import Sourcer from './Sourcer';
import Utils from './Utils';
import V from './V';
import Configs from './Configs';

export default class Laser extends Shot {
  temperature = 5;
  damage = () => 8;
  momentum: number;
  constructor(field: Field, owner: Sourcer, public direction: number, power: number) {
    super(field, owner, "Laser");
    this.speed = V.direction(direction).multiply(power);
    this.momentum = Configs.LASER_MOMENTUM;
  }

  action() {
    super.action();
    this.momentum -= Configs.LASER_ATTENUATION;
    if (this.momentum < 0) {
      this.field.removeShot(this);
    }
  }
}
