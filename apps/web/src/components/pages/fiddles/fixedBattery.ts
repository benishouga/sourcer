export const fixedBattery = `
var bot = function(controller) {
  if (controller.altitude() < 15) {
    controller.ascent();
  }
  if (controller.frame() % 4 === 0) {
    if (controller.temperature() < 80) {
      if (controller.scanEnemy(0, 20)) {
        controller.fireLaser(0);
      } else if(controller.scanEnemy(20, 20)) {
        controller.fireLaser(20);
      } else if(controller.scanEnemy(40, 20)) {
        controller.fireLaser(40);
      } else if(controller.scanEnemy(60, 20)) {
        controller.fireLaser(60);
      } else if(controller.scanEnemy(80, 20)) {
        controller.fireLaser(80);
      } else if(controller.scanEnemy(100, 20)) {
        controller.fireLaser(100);
      } else if(controller.scanEnemy(120, 20)) {
        controller.fireLaser(120);
      } else if(controller.scanEnemy(140, 20)) {
        controller.fireLaser(140);
      } else if(controller.scanEnemy(160, 20)) {
        controller.fireLaser(160);
      } else if(controller.scanEnemy(180, 20)) {
        controller.fireLaser(180);
      } else if(controller.scanEnemy(200, 20)) {
        controller.fireLaser(200);
      } else if(controller.scanEnemy(220, 20)) {
        controller.fireLaser(220);
      } else if(controller.scanEnemy(240, 20)) {
        controller.fireLaser(240);
      } else if(controller.scanEnemy(260, 20)) {
        controller.fireLaser(260);
      } else if(controller.scanEnemy(280, 20)) {
        controller.fireLaser(280);
      } else if(controller.scanEnemy(300, 20)) {
        controller.fireLaser(300);
      } else if(controller.scanEnemy(320, 20)) {
        controller.fireLaser(320);
      } else if(controller.scanEnemy(340, 20)) {
        controller.fireLaser(340);
      }
    }
  }
};
return bot;
`;
