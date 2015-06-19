import Field = require('./Field');
import V = require('./V');

class Fx {
  public frame: number;
  public id: string;

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

  public dump() {
    return {
      id: this.id,
      position: this.position,
      frame: this.frame,
      length: this.length
    };
  }
}

export = Fx;
