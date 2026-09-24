import Actor from './Actor';

export default class Controller {
  public frame: () => number;
  public altitude: () => number;
  public wait: (frame: number) => void;

  private framesOfLife: number = 0;
  public preThink = () => {
    this.framesOfLife++;
  };

  constructor(actor: Actor) {
    this.frame = () => this.framesOfLife;
    this.altitude = () => actor.position.y;
    this.wait = (frame: number) => {
      if (0 < frame) {
        actor.wait += frame;
      }
    };
  }
}
