import SourcerController from '../src/core/SourcerController';

class SourcerAi {
  public port = (ctrl: SourcerController) => this.think(ctrl);

  private think(ctrl: SourcerController) {
    // thinking ....
    if (ctrl.altitude() < 100) {
      ctrl.ascent();
    }
  }
}

export = new SourcerAi().port;
