import SourcerController from '../src/main/core/SourcerController';
import MissileController from '../src/main/core/MissileController';

class Missile {
  think(ctrl: MissileController) {
    if (ctrl.scanEnemy(90, 180)) {
      ctrl.turnLeft();
    } else {
      ctrl.turnRight();
    }

    if (ctrl.frame() % 2) {
      ctrl.speedUp();
    }
  }
}

class SourcerAi {
  think(ctrl: SourcerController) {
    if (ctrl.altitude() < 20) {
      ctrl.ascent();
    }

    if (!ctrl.scanEnemy(0, 180)) {
      ctrl.turn();
      return;
    }

    if (80 < ctrl.temperature()) {
        return;
    }

    if (ctrl.frame() % 2 && ctrl.missileAmmo() !== 0) {
      var missile = new Missile();
      ctrl.fireMissile(missile.think.bind(missile));
      return;
    }

    if (ctrl.scanEnemy(15, 30)) {
      ctrl.fireLaser(Math.random() * 30, 1000);
    } else if (ctrl.scanEnemy(45, 30)) {
      ctrl.fireLaser(Math.random() * 30 + 30, 1000);
    } else {
      ctrl.fireLaser(Math.random() * 30 + 60, 1000);
    }
  }
}

var ai = new SourcerAi();
export = ai.think.bind(ai);
