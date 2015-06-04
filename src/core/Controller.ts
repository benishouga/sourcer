import Field = require('./Field');
import Actor = require('./Actor');

class Controller {
  public field: Field;
  public frame: () => number;
  public altitude: () => number;
  public wait: (frame: number) => void;
  public fuel: () => number;
  public log: (message?: any, ...optionalParams: any[]) => void;

  constructor(actor: Actor) {
    this.log = (message?: any, ...optionalParams: any[]) => {
      console.log(message, optionalParams);
    };
    this.field = actor.field;
    this.frame = () => this.field.frame;
    this.altitude = () => actor.position.y;
    this.wait = (frame: number) => {
      if (0 < frame) {
        actor.wait += frame;
      }
    };
    this.fuel = () => actor.fuel;
  }
}

export = Controller;
