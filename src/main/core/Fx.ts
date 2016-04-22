import Field from './Field';
import V from './V';
import {FxDump} from './Dump';

export default class Fx {
  frame: number;
  id: number;

  constructor(public field: Field, public position: V, public speed: V, public length: number) {
    this.frame = 0;
  }

  action() {
    this.frame++;
    if (this.length <= this.frame) {
      this.field.removeFx(this);
    }
  }

  move() {
    this.position = this.position.add(this.speed);
  }

  dump(): FxDump {
    return {
      i: this.id,
      p: this.position.minimize(),
      f: this.frame,
      l: Math.round(this.length)
    };
  }
}
