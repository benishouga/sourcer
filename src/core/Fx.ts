import Field from './Field';
import V from './V';

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

  dump() {
    return new FxDump(this);
  }
}

export class FxDump {
  id: string;
  position: V;
  frame: number;
  length: number;

  constructor(fx: Fx) {
    this.id = fx.id;
    this.position = fx.position;
    this.frame = fx.frame;
    this.length = fx.length;
  }
}
