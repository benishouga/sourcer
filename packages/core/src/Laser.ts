import Shot from './Shot';
import Field from './Field';
import Sourcer from './Sourcer';
import V from './V';
import Configs from './Configs';

export default class Laser extends Shot {
  public temperature = 5;
  public damage = () => 8;
  private momentum: number;
  constructor(field: Field, owner: Sourcer, public direction: number, power: number) {
    super(field, owner, 'Laser');
    this.speed = V.direction(direction).multiply(power);
    this.momentum = Configs.LASER_MOMENTUM;
  }

  public action() {
    super.action();
    this.momentum -= Configs.LASER_ATTENUATION;
    if (this.momentum < 0) {
      this.field.removeShot(this);
    }
  }
}
