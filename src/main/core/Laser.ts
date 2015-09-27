import Shot from './Shot';
import Field from './Field';
import Sourcer from './Sourcer';
import Utils from './Utils';
import V from './V';

export default class Laser extends Shot {
  temperature = 5;
  damage = () => 8;
  constructor(field: Field, owner: Sourcer, public direction: number, power: number) {
    super(field, owner, "Laser");
    this.speed = V.direction(direction).multiply(power);
  }
}
