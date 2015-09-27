import SourcerController from '../src/main/core/SourcerController';
import MissileController from '../src/main/core/MissileController';

class Consts {
  static STIR = 3;
  static MISSILE_AMMO = 20;
}

class MissilePod {
  index = 0;
  fire() {
    return new MissileAi(this.index++);
  }
}

class MissileAi {
  frame = 0;
  odd: number;
  stir: number;
  constructor(index: number) {
    this.odd = index % 2 ? 1 : -1;
    this.stir = (Consts.MISSILE_AMMO - index) * this.odd * Consts.STIR;
  }

  think(ctrl: MissileController) {
    if (ctrl.scanEnemy(90 + this.stir, 180)) {
      ctrl.turnLeft();
    } else {
      ctrl.turnRight();
    }

    var warn = Math.max(0, (100 - ctrl.altitude()) / 30);

    if (this.frame % (warn + 2) < 1) {
      ctrl.speedUp();
    }

    if (0 < this.stir * this.odd) {
      this.stir -= this.odd * 0.5;
    } else {
      this.stir = 0;
    }
  }

  port = (ctrl: MissileController) => {
    this.frame++;
    this.think(ctrl);
  }
}

class ActionQueue {
  queue: ((ctrl: SourcerController) => void)[];

  constructor() {
    this.queue = [];
  }

  push(action: (ctrl: SourcerController) => void) {
    this.queue.push(action);
  }

  next(ctrl: SourcerController) {
    if (this.queue.length === 0) {
      return false;
    }
    var action = this.queue.shift();
    action(ctrl);
    return true;
  }
}

class SourcerAi {
  frame = 0;
  pod = new MissilePod();
  queue = new ActionQueue();

  port = (ctrl: SourcerController) => {
    this.frame++;
    if (this.queue.next(ctrl)) {
      return;
    }
    this.think(ctrl);
  }

  think(ctrl: SourcerController) {
    if (!ctrl.scanEnemy(0, 180)) {
      ctrl.turn();
      return;
    }

    if (ctrl.temperature() < 60) {
      if (this.frame % 2 === 0 && ctrl.missileAmmo() !== 0) {
        this.queue.push((ctrl) => {
          ctrl.fireMissile(this.pod.fire().port);
        });

        ctrl.turn();
        return;
      }
      var direction = this.scanEnemyDirection(ctrl, 6);
      this.queue.push((ctrl) => {
        ctrl.fireLaser(direction, 100);
      });
      for (var i = 1; i <= 2; i++) {
        (() => {
          var stir = i * 6;
          this.queue.push((ctrl) => {
            ctrl.fireLaser(direction + stir, 100);
          })
          this.queue.push((ctrl) => {
            ctrl.fireLaser(direction - stir, 100);
          })
        })();
      }
      return;
    }
    if (!(this.frame % 4)) {
      for (var i = 1; i <= 3; i++) {
        this.queue.push((ctrl) => {
          if (ctrl.altitude() < this.frame * 3 % 250 + 40) {
            ctrl.ascent();
          } else {
            ctrl.descent();
          }
          ctrl.ahead();
        });
      }
    }
  }

  scanEnemyDirection(ctrl: SourcerController, precision: number) {
    var currentAngle = 180;
    var currentDirection = 0;
    for (var i = 0; i < precision; i++) {
      currentAngle /= 2;
      var up = currentDirection + currentAngle / 2;
      var down = currentDirection - currentAngle / 2;
      if (ctrl.scanEnemy(up, currentAngle)) {
        currentDirection = up;
      } else {
        currentDirection = down;
      }
    }
    return currentDirection;
  }
}

export = new SourcerAi().port;
