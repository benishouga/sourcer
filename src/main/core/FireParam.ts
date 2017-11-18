import MissileController from './MissileController';

export default class FireParam {
  public static laser(power: number, direction: number): FireParam {
    const result = new FireParam();
    result.power = Math.min(Math.max(power || 8, 3), 8);
    result.direction = direction;
    result.shotType = 'Laser';
    return result;
  }
  public static missile(bot: (controller: MissileController) => void) {
    const result = new FireParam();
    result.bot = bot;
    result.shotType = 'Missile';
    return result;
  }
  public bot: (controller: MissileController) => void;
  public direction: number;
  public power: number;
  public shotType: string;
}
