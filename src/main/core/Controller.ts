import Field from './Field';
import Actor from './Actor';

export default class Controller {
  public field: Field;
  public frame: () => number;
  public altitude: () => number;
  public wait: (frame: number) => void;
  public fuel: () => number;
  public log: (...messages: any[]) => void;

  private framesOfLife: number = 0;
  public preThink = () => {
    this.framesOfLife++;
  }

  constructor(actor: Actor) {
    this.log = (...messages: any[]) => {
      console.log.apply(console, messages);
    };
    this.field = actor.field;
    this.frame = () => this.framesOfLife;
    this.altitude = () => actor.position.y;
    this.wait = (frame: number) => {
      if (0 < frame) {
        actor.wait += frame;
      }
    };
  }
}
