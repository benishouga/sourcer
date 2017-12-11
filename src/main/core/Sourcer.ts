import Actor from './Actor';
import Field from './Field';
import SourcerCommand from './SourcerCommand';
import SourcerController from './SourcerController';
import FireParam from './FireParam';
import Configs from './Configs';
import Consts from './Consts';
import Utils from './Utils';
import V from './V';
import Shot from './Shot';
import Laser from './Laser';
import Missile from './Missile';
import { SourcerDump, DebugDump } from './Dump';
import Fx from './Fx';
import ScriptLoader, { ConsoleLike } from './ScriptLoader';

interface ExportScope {
  module: {
    exports: ((controller: SourcerController) => void) | null;
  };
}

export default class Sourcer extends Actor {
  public alive = true;
  public temperature = 0;
  public shield = Configs.INITIAL_SHIELD;
  public missileAmmo = Configs.INITIAL_MISSILE_AMMO;
  public fuel = Configs.INITIAL_FUEL;

  public command: SourcerCommand;
  public scriptLoader: ScriptLoader;
  private controller: SourcerController;
  private bot: ((controller: SourcerController) => void) | null = null;
  private debugDump: DebugDump;

  constructor(
    field: Field,
    x: number,
    y: number,
    public aiSource: string,
    public account: string,
    public name: string,
    public color: string
  ) {
    super(field, x, y);

    this.direction = Math.random() < 0.5 ? Consts.DIRECTION_RIGHT : Consts.DIRECTION_LEFT;
    this.command = new SourcerCommand(this);
    this.controller = new SourcerController(this);
  }

  public compile(scriptLoader: ScriptLoader) {
    this.scriptLoader = scriptLoader;
    this.bot = scriptLoader.load(this.aiSource);
    if (!this.bot) {
      throw { message: 'Function has not been returned.' };
    }
    if (typeof this.bot !== 'function') {
      throw { message: 'Returned is not a Function.' };
    }
  }

  public onThink() {
    if (this.bot === null || !this.alive) {
      return;
    }

    try {
      this.command.accept();
      this.controller.preThink();
      this.debugDump = { logs: [], arcs: [] };
      this.controller.connectConsole(this.scriptLoader.getExposedConsole());
      this.bot(this.controller);
    } catch (error) {
      this.debugDump.logs.push({ message: `Sourcer function error: ${error.message}`, color: 'red' });
      this.command.reset();
    } finally {
      this.command.unaccept();
    }
  }

  public action() {
    if (!this.alive && Utils.rand(8) < 1) {
      const position = this.position.add(Utils.rand(16) - 8, Utils.rand(16) - 8);
      const speed = new V(Utils.rand(1) - 0.5, Utils.rand(1) + 0.5);
      const length = Utils.rand(8) + 4;
      this.field.addFx(new Fx(this.field, position, speed, length));
    }

    // air resistance
    this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);

    // gravity
    this.speed = this.speed.subtract(0, Configs.GRAVITY);

    // control altitude by the invisible hand
    if (Configs.TOP_INVISIBLE_HAND < this.position.y) {
      const invisiblePower = (this.position.y - Configs.TOP_INVISIBLE_HAND) * 0.1;
      this.speed = this.speed.subtract(0, Configs.GRAVITY * invisiblePower);
    }

    // control distance by the invisible hand
    const diff = this.field.center - this.position.x;
    if (Configs.DISTANCE_BORDAR < Math.abs(diff)) {
      const n = diff < 0 ? -1 : 1;
      const invisibleHand = (Math.abs(diff) - Configs.DISTANCE_BORDAR) * Configs.DISTANCE_INVISIBLE_HAND * n;
      this.position = new V(this.position.x + invisibleHand, this.position.y);
    }

    // go into the ground
    if (this.position.y < 0) {
      this.shield -= -this.speed.y * Configs.GROUND_DAMAGE_SCALE;
      this.position = new V(this.position.x, 0);
      this.speed = new V(this.speed.x, 0);
    }

    this.temperature -= Configs.COOL_DOWN;
    this.temperature = Math.max(this.temperature, 0);

    // overheat
    const overheat = this.temperature - Configs.OVERHEAT_BORDER;
    if (0 < overheat) {
      const linearDamage = overheat * Configs.OVERHEAT_DAMAGE_LINEAR_WEIGHT;
      const powerDamage = Math.pow(overheat * Configs.OVERHEAT_DAMAGE_POWER_WEIGHT, 2);
      this.shield -= linearDamage + powerDamage;
    }
    this.shield = Math.max(0, this.shield);

    this.command.execute();
    this.command.reset();
  }

  public fire(param: FireParam) {
    if (param.shotType === 'Laser') {
      const direction = this.opposite(param.direction);
      const shot = new Laser(this.field, this, direction, param.power);
      shot.reaction(this);
      this.field.addShot(shot);
    }

    if (param.shotType === 'Missile') {
      if (0 < this.missileAmmo) {
        const missile = new Missile(this.field, this, param.bot);
        missile.reaction(this);
        this.missileAmmo--;
        this.field.addShot(missile);
      }
    }
  }

  public opposite(direction: number): number {
    if (this.direction === Consts.DIRECTION_LEFT) {
      return Utils.toOpposite(direction);
    }
    return direction;
  }

  public onHit(shot: Shot) {
    this.speed = this.speed.add(shot.speed.multiply(Configs.ON_HIT_SPEED_GIVEN_RATE));
    this.shield -= shot.damage();
    this.shield = Math.max(0, this.shield);
    this.field.removeShot(shot);
  }

  public log(message: string) {
    this.debugDump.logs.push({ message });
  }

  public scanDebug(direction: number, angle: number, renge?: number) {
    this.debugDump.arcs.push({ direction, angle, renge });
  }

  public dump(): SourcerDump {
    const dump: SourcerDump = {
      i: this.id,
      p: this.position.minimize(),
      d: this.direction,
      h: Math.ceil(this.shield),
      t: Math.ceil(this.temperature),
      a: this.missileAmmo,
      f: Math.ceil(this.fuel)
    };
    if (this.scriptLoader.isDebuggable()) {
      dump.debug = this.debugDump;
    }
    return dump;
  }
}
