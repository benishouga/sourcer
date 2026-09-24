import MissileController from './MissileController';

export default abstract class FireParam {
  constructor(private shotType: string) {}
  public isLaser(): this is LaserParam {
    return this.shotType === 'Laser';
  }
  public isMissile(): this is MissileParam {
    return this.shotType === 'Missile';
  }
}

export class MissileParam extends FireParam {
  constructor(public bot: (controller: MissileController) => void) {
    super('Missile');
  }
}

export class LaserParam extends FireParam {
  constructor(power: number, public direction: number) {
    super('Laser');
    this.power = Math.min(Math.max(power || 8, 3), 8);
  }
  public power: number = 0;
}
