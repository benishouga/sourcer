export const fiddle = `
var ai = function(controller) {
  // 高さが 100 より低い場合、上昇する
  if (controller.altitude() < 100) {
    controller.ascent();
  }
};
return ai;
`;
