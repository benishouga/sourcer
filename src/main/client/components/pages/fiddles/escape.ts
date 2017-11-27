export const escape = `
var current = 150;
var bot = function(controller) {
  if (controller.frame() % 32 === 0) {
    current = Math.random() * 100 + 50;
  }

  if (controller.frame() % 64 === 0) {
    if (Math.random() < 0.5) {
      controller.turn();
    }
  }
  if (controller.altitude() < current) {
    controller.ascent();
  }
  if (controller.frame() % 4 === 0) {
    controller.ahead();
  }
};
return bot;
`;
