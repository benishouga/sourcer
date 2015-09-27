import SourcerController from '../src/main/core/SourcerController';

class SourcerAi {
  port = (ctrl: SourcerController) => this.think(ctrl);

  think(ctrl: SourcerController) {
    // thinking ....
    if (ctrl.altitude() < 100) {
      ctrl.ascent();
    }
  }
}

export = new SourcerAi().port;
