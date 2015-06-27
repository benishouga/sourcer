return function(controller) {
  if (controller.altitude() < 100) {
      controller.ascent();
  }
};
