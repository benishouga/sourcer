class SourcerAi
  port: (ctrl) => @think ctrl
  think: (ctrl) =>
    if ctrl.altitude() < 100
      ctrl.ascent();

module.exports = new SourcerAi().port;
