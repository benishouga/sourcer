export const fiddle = `
var bot = function(controller) {
  if (controller.altitude() < 100) {
    controller.ascent();
  }
};
return bot;
`;
