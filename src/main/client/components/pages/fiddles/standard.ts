export const standard = `
var missile = function(controller) {
  if (controller.scanEnemy(90, 180)) {
    controller.turnLeft();
  } else {
    controller.turnRight();
  }
  controller.speedUp();
};

var bot = function(controller) {
  if (controller.scanAttack(0, 60, 60)) {
    controller.back();
    controller.descent();
    return;
  }

  if (controller.altitude() < 100) {
    controller.ascent();
    return;
  }

  if (!controller.scanEnemy(0, 180)) {
    controller.turn();
    return;
  }

  if (controller.scanEnemy(0, 100, 200)) {
    if (80 < controller.temperature()) {
      return;
    }
    if (controller.frame() % 5 === 0) {
      controller.fireMissile(missile);
    } else {
      if (controller.scanEnemy(0, 20)) {
        controller.fireLaser(0, 100);
      } else if (controller.scanEnemy(30, 40)) {
        controller.fireLaser(30, 100);
      } else if (controller.scanEnemy(-30, 40)) {
        controller.fireLaser(-30, 100);
      }
    }
    return;
  }
  if (controller.scanEnemy(0, 180, 60)) {
      controller.back();
      return;
  }
  if (controller.scanEnemy(0, 30)) {
      controller.ahead();
      return;
  }
  if (controller.scanEnemy(-45, 90)) {
      controller.descent();
      return;
  }
  controller.ascent();
  return;
};
return bot;
`;
