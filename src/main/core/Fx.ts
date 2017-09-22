import Field from './Field';
import V from './V';
import { FxDump } from './Dump';

export default class Fx {
  private frame: number;
  public id: number;

  constructor(public field: Field, public position: V, public speed: V, public length: number) {
    this.frame = 0;
  }

  public action() {
    this.frame++;
    if (this.length <= this.frame) {
      this.field.removeFx(this);
    }
  }

  public move() {
    this.position = this.position.add(this.speed);
  }

  public dump(): FxDump {
    return {
      i: this.id,
      p: this.position.minimize(),
      f: this.frame,
      l: Math.round(this.length)
    };
  }
}
