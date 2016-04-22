import Field from './Field';
import V from './V';
import {FxDump} from './Dump';

export default class Fx {
  frame: number;
  id: string;

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
      id: this.id,
      position: this.position.minimize(),
      frame: this.frame,
      length: this.length
    };
  }
}
