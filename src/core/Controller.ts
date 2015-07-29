import Field from './Field';
import Actor from './Actor';

export default class Controller {
  field: Field;
  frame: () => number;
  altitude: () => number;
  wait: (frame: number) => void;
  fuel: () => number;
  log: (message?: any, ...optionalParams: any[]) => void;

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
  }
}
