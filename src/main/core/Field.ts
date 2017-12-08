import V from './V';
import Actor from './Actor';
import Sourcer from './Sourcer';
import Shot from './Shot';
import Missile from './Missile';
import Fx from './Fx';
import Utils from './Utils';
import TickEventListener from './TickEventListener';
import { FrameDump, ResultDump, SourcerDump, ShotDump, FxDump, PlayersDump, DebugDump } from './Dump';
import ScriptLoader, { ScriptLoaderConstructor } from './ScriptLoader';

const DEMO_FRAME_LENGTH = 128;

export default class Field {
  private currentId = 0;
  private sourcers: Sourcer[];
  private shots: Shot[];
  private fxs: Fx[];
  private frame: number;
  private result: ResultDump;
  public center: number;
  public isFinished: boolean = false;

  private dummyEnemy: V = new V(0, 150);

  constructor(private scriptLoaderConstructor: ScriptLoaderConstructor, public isDemo: boolean = false) {
    this.frame = 0;
    this.sourcers = [];
    this.shots = [];
    this.fxs = [];
  }

  public registerSourcer(source: string, account: string, name: string, color: string) {
    const side = (this.sourcers.length % 2 === 0) ? -1 : 1;
    const x = Utils.rand(80) + 160 * side;
    const y = Utils.rand(160) + 80;
    this.addSourcer(new Sourcer(this, x, y, source, account, name, color));
  }

  public async process(listener: TickEventListener, think: (sourcer: Sourcer) => void) {
    for (const sourcer of this.sourcers) {
      listener.onPreThink(sourcer.id);
      await listener.waitNextTick();
      think(sourcer);
      listener.onPostThink(sourcer.id);
      await listener.waitNextTick();
    }
  }

  public async compile(listener: TickEventListener) {
    return this.process(listener, (sourcer: Sourcer) => {
      try {
        sourcer.compile(new this.scriptLoaderConstructor());
      } catch (error) {
        listener.onError(`There is an error in your code:　${error.message}`);
      }
    });
  }

  public addSourcer(sourcer: Sourcer) {
    sourcer.id = this.currentId++;
    this.sourcers.push(sourcer);
  }

  public addShot(shot: Shot) {
    shot.id = this.currentId++;
    this.shots.push(shot);
  }

  public removeShot(target: Shot) {
    const index = this.shots.indexOf(target);
    if (0 <= index) {
      this.shots.splice(index, 1);
    }
  }

  public addFx(fx: Fx) {
    fx.id = this.currentId++;
    this.fxs.push(fx);
  }

  public removeFx(target: Fx) {
    const index = this.fxs.indexOf(target);
    if (0 <= index) {
      this.fxs.splice(index, 1);
    }
  }

  public async tick(listener: TickEventListener) {
    if (this.frame === 0) {
      listener.onFrame(this.dump()); // Save the 0 frame.
    }

    // To be used in the invisible hand.
    this.center = this.computeCenter();

    // Think phase
    await this.process(listener, (sourcer: Sourcer) => {
      sourcer.think();
      this.shots.filter((shot => shot.owner.id === sourcer.id)).forEach(shot => shot.think());
    });

    // Action phase
    this.sourcers.forEach(actor => actor.action());
    this.shots.forEach(actor => actor.action());
    this.fxs.forEach(actor => actor.action());

    // Move phase
    this.sourcers.forEach(actor => actor.move());
    this.shots.forEach(actor => actor.move());
    this.fxs.forEach(actor => actor.move());

    // Check phase
    this.checkFinish(listener);
    this.checkEndOfGame(listener);

    this.frame++;

    // onFrame
    listener.onFrame(this.dump());
  }

  private checkFinish(listener: TickEventListener) {
    if (this.isDemo) {
      if (DEMO_FRAME_LENGTH < this.frame) {
        this.result = {
          frame: this.frame,
          timeout: null,
          isDraw: null,
          winnerId: null
        };
        listener.onFinished(this.result);
      }
      return;
    }

    if (this.result) {
      return;
    }

    this.sourcers.forEach((sourcer) => { sourcer.alive = 0 < sourcer.shield; });
    const survivers = this.sourcers.filter(sourcer => sourcer.alive);

    if (1 < survivers.length) {
      return;
    }

    if (survivers.length === 1) {
      const surviver = survivers[0];
      this.result = {
        winnerId: surviver.id,
        frame: this.frame,
        timeout: null,
        isDraw: false
      };
      listener.onFinished(this.result);
      return;
    }

    // no surviver.. draw...
    this.result = {
      winnerId: null,
      timeout: null,
      frame: this.frame,
      isDraw: true
    };
    listener.onFinished(this.result);
  }

  private checkEndOfGame(listener: TickEventListener) {
    if (this.isFinished) {
      return;
    }

    if (!this.result) {
      return;
    }

    if (this.isDemo) {
      this.isFinished = true;
      listener.onEndOfGame();
      return;
    }

    if (this.result.frame < this.frame - 90) { // Record some frames even after decided.
      this.isFinished = true;
      listener.onEndOfGame();
    }
  }

  public scanEnemy(owner: Sourcer, radar: (t: V) => boolean): boolean {
    if (this.isDemo && this.sourcers.length === 1) {
      return radar(this.dummyEnemy);
    }

    return this.sourcers.some((sourcer) => {
      return sourcer.alive && sourcer !== owner && radar(sourcer.position);
    });
  }

  public scanAttack(owner: Sourcer, radar: (t: V) => boolean): boolean {
    return this.shots.some((shot) => {
      return shot.owner !== owner && radar(shot.position) && this.isIncoming(owner, shot);
    });
  }

  private isIncoming(owner: Sourcer, shot: Shot) {
    const ownerPosition = owner.position;
    const actorPosition = shot.position;
    const currentDistance = ownerPosition.distance(actorPosition);
    const nextDistance = ownerPosition.distance(actorPosition.add(shot.speed));
    return nextDistance < currentDistance;
  }

  public checkCollision(shot: Shot): Actor | null {
    const f = shot.position;
    const t = shot.position.add(shot.speed);

    const collidedShot = this.shots.find((actor) => {
      return actor.breakable && actor.owner !== shot.owner &&
        Utils.calcDistance(f, t, actor.position) < shot.size + actor.size;
    });
    if (collidedShot) {
      return collidedShot;
    }

    const collidedSourcer = this.sourcers.find((sourcer) => {
      return sourcer.alive && sourcer !== shot.owner &&
        Utils.calcDistance(f, t, sourcer.position) < shot.size + sourcer.size;
    });
    if (collidedSourcer) {
      return collidedSourcer;
    }

    return null;
  }

  public checkCollisionEnviroment(shot: Shot): boolean {
    return shot.position.y < 0;
  }

  private computeCenter(): number {
    let count = 0;
    let sumX = 0;
    this.sourcers.forEach((sourcer: Sourcer) => {
      if (sourcer.alive) {
        sumX += sourcer.position.x;
        count++;
      }
    });
    return sumX / count;
  }

  public players() {
    const players: PlayersDump = {};
    this.sourcers.forEach((sourcer) => {
      players[sourcer.id] = {
        name: sourcer.name || sourcer.account,
        account: sourcer.account,
        color: sourcer.color
      };
    });
    return players;
  }

  private dump(): FrameDump {
    const sourcersDump: SourcerDump[] = [];
    const shotsDump: ShotDump[] = [];
    const fxDump: FxDump[] = [];

    this.sourcers.forEach((actor) => {
      sourcersDump.push(actor.dump());
    });

    const isThinkable = (x: Shot): x is Missile => x.type === 'Missile';
    this.shots.forEach((actor) => {
      shotsDump.push(actor.dump());
    });
    this.fxs.forEach((fx) => {
      fxDump.push(fx.dump());
    });

    return {
      f: this.frame,
      s: sourcersDump,
      b: shotsDump,
      x: fxDump
    };
  }
}
