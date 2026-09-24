export const defaultBot = `// for missile
var missile = function(controller) {
  if(controller.scanEnemy(90, 180)) {
    controller.turnLeft();
  } else {
    controller.turnRight();
  }
  controller.speedUp();
};

// for sourcer
var bot = function(controller) {
  // Avoid front attacks.
  //   - Is it enemy attack exists front 0 degrees,
  //       width 60 degrees, distance 60.
  if (controller.scanAttack(0, 60, 60)) {
    controller.back();
    controller.descent();
    return;
  }

  if (controller.altitude() < 100) {
    controller.ascent();
    return;
  }

  // Is not it enemy exists front.
  if (!controller.scanEnemy(0, 180)) {
    controller.turn();
    return;
  }

  // Attack if the enemy is nearby
  //   - Is it enemy exists front 0 degrees,
  //       width 30 degrees, distance 200.
  if (controller.scanEnemy(0, 30, 200)) {
    // Check temperature
    if (80 < controller.temperature()) {
      return;
    }

    // Fire a missile once in 5 frames.
    if (controller.frame() % 5 === 0) {
      controller.fireMissile(missile);
    } else {
      controller.fireLaser(0, 8);
    }
    return;
  }

  // Go ahead if the enemy is far.
  if (controller.scanEnemy(0, 30)) {
    controller.ahead();
    return;
  }
};

return bot;`;
