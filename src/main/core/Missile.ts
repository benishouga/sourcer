import Actor from './Actor';
import Shot from './Shot';
import Field from './Field';
import Sourcer from './Sourcer';
import Utils from './Utils';
import V from './V';
import Fx from './Fx';
import Configs from './Configs';
import MissileCommand from './MissileCommand';
import MissileController from './MissileController';
import Consts from './Consts';
import { DebugDump, ShotDump } from './Dump';

export default class Missile extends Shot {
  public temperature = 10;
  public damage = () => 10 + this.speed.length() * 2;
  public fuel = 100;
  public breakable = true;

  public command: MissileCommand;
  public controller: MissileController;
  private debugDump: DebugDump;

  constructor(field: Field, owner: Sourcer, public bot: (controller: MissileController) => void) {
    super(field, owner, 'Missile');
    this.direction = owner.direction === Consts.DIRECTION_RIGHT ? 0 : 180;
    this.speed = owner.speed;
    this.command = new MissileCommand(this);
    this.command.reset();
    this.controller = new MissileController(this);
  }

  public onThink() {
    this.command.reset();

    if (this.fuel <= 0) {
      // Cancel thinking
      return;
    }

    try {
      this.command.accept();
      this.controller.preThink();
      this.debugDump = { logs: [], arcs: [] };
      this.controller.connectConsole(this.owner.scriptLoader.getExposedConsole());
      this.bot(this.controller);
    } catch (error) {
      this.command.reset();
      this.debugDump.logs.push({ message: `Missile function error: ${error.message}`, color: 'red' });
    } finally {
      this.command.unaccept();
    }
  }

  public onAction() {
    this.speed = this.speed.multiply(Configs.SPEED_RESISTANCE);
    this.command.execute();
    this.command.reset();
  }

  public onHit(attack: Shot) {
    this.field.removeShot(this);
    this.field.removeShot(attack);
  }

  public opposite(direction: number): number {
    return this.direction + direction;
  }

  public log(message: string) {
    this.debugDump.logs.push({ message });
  }

  public scanDebug(direction: number, angle: number, renge?: number) {
    this.debugDump.arcs.push({ direction, angle, renge });
  }

  public dump(): ShotDump {
    const superDump = super.dump();
    if (this.owner.scriptLoader.isDebuggable) {
      superDump.debug = this.debugDump;
    }
    return superDump;
  }
}
