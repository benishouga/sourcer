import Field from './Field';
import Actor from './Actor';

export default class Controller {
  field: Field;
  frame: () => number;
  altitude: () => number;
  wait: (frame: number) => void;
  fuel: () => number;
  log: (...messages: any[]) => void;

  countOfThinks: number = 0;
  preThink = () => {
    this.countOfThinks++;
  };

  constructor(actor: Actor) {
    this.log = (...messages: any[]) => {
      console.log.apply(console, messages);
    };
    this.field = actor.field;
    this.frame = () => this.countOfThinks;
    this.altitude = () => actor.position.y;
    this.wait = (frame: number) => {
      if (0 < frame) {
        actor.wait += frame;
      }
    };
  }
}
