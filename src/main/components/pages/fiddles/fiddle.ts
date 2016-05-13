export var fiddle = `
return function(controller) {
  // 高さが 150 より低い場合、上昇する
  if (controller.altitude() < 150) {
    controller.ascent();
  }
};
`;
