import * as React from 'react';
import {GameResult} from '../core/Field';
import Screen from './Screen';

var PADDING = 2;

class ControllerHudTagProps {
  frame: number; screen: Screen;
}

export default class ControllerHudTag extends React.Component<ControllerHudTagProps, { drag: boolean }> {
  static height = 16;

  progressLeft: number;

  constructor() {
    super();
    this.state = { drag: false };
  }
  convert(e: React.MouseEvent) {
    var element = e.target as Element;
    return e.clientX - element.getBoundingClientRect().left;
  }

  onMouseDown(e: React.MouseEvent) {
    this.setState({ drag: true });
    var screen = this.props.screen;
    var length = screen.width - PADDING * 2 - this.progressLeft;
    screen.onFrameChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
  }

  onMouseMove(e: React.MouseEvent) {
    if (this.state.drag) {
      var screen = this.props.screen;
      var length = screen.width - PADDING * 2 - this.progressLeft;
      screen.onFrameChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
    }
  }

  onMouseUp(e: React.MouseEvent) {
    this.setState({ drag: false });
  }

  render() {
    var frame = this.props.frame;
    var screen = this.props.screen;


    var reload = (<g onClick={screen.onReload} transform={"translate(" + (-screen.width / 2) + "," + (screen.height - ControllerHudTag.height) + ")"}>
      <circle r="8" cy="8" cx="8" fill="#fff" />
      <circle r="7" cy="8" cx="8" fill="#000" />
      <circle r="5" cx="8" cy="8" fill="#fff" />
      <path fill="#000" d="M 8 4 A 4 4 0 0 0 6.3300781 4.3730469 L 6.3261719 4.3652344 L 5.2011719 5.984375 L 7.1621094 6.1835938 L 7.1640625 6.1855469 A 2 2 0 0 1 8 6 A 2 2 0 0 1 10 8 C 10 8.5535396 10.44646 9 11 9 C 11.55354 9 12 8.5535396 12 8 A 4 4 0 0 0 8 4 z M 5 7 C 4.4464604 7 4 7.4464604 4 8 A 4 4 0 0 0 8 12 A 4 4 0 0 0 9.6835938 11.619141 L 9.6855469 11.619141 L 9.6914062 11.634766 L 10.810547 10.009766 L 8.8496094 9.8222656 L 8.84375 9.8105469 A 2 2 0 0 1 8 10 A 2 2 0 0 1 6 8 C 6 7.4464604 5.5535396 7 5 7 z " />
      </g>);
    this.progressLeft = 16;

    var playOrStop = screen.playing ? (<g onClick={screen.onPause} transform={"translate(" + (-screen.width / 2 + this.progressLeft) + "," + (screen.height - ControllerHudTag.height) + ")"}>
        <circle r="8" cy="8" cx="8" fill="#fff" />
        <circle r="7" cy="8" cx="8" fill="#000" />
        <circle r="5" cy="8" cx="8" fill="#fff" />
        <rect ry="0.5" y="5" x="5.5" height="6" width="2" fill="#000" />
        <rect ry="0.5" y="5" x="8.5" height="6" width="2" fill="#000" />
      </g>) : (<g onClick={screen.onPlay} transform={"translate(" + (-screen.width / 2 + this.progressLeft) + "," + (screen.height - ControllerHudTag.height) + ")"}>
          <circle fill="#fff" cx="8" cy="8" r="8" />
          <circle fill="#000" cx="8" cy="8" r="7" />
          <circle fill="#fff" cx="8" cy="8" r="5" />
          <path fill="#000" d="m 5.9218744,5.5214845 0,4.9999995 c -0.00168,0.180296 0.080036,0.326383 0.2167942,0.421874 0.1059966,0.08984 0.3899239,0.08869 0.5351557,0.01172 L 11.003906,8.4550781 c 0.16293,-0.1113478 0.239497,-0.246851 0.24218,-0.4316396 -0.0043,-0.2080202 -0.06772,-0.3161707 -0.24217,-0.435546 l -4.3300779,-2.5 C 6.3904484,4.9194131 6.1517574,5.0466129 6.0813464,5.1113293 5.9980061,5.1869727 5.9272825,5.2586905 5.9218744,5.5214845 Z" />
        </g>);
    this.progressLeft += 16;

    return (
      <g>
        {reload}
        {playOrStop}
        <g onMouseDown={(e) => this.onMouseDown(e) } onMouseMove={(e) => this.onMouseMove(e) } onMouseUp={(e) => this.onMouseUp(e) } transform={"translate(" + (-screen.width / 2 + this.progressLeft) + "," + (screen.height - ControllerHudTag.height) + ")"}>
          <rect fill="#fff" width={screen.width - PADDING * 2 - this.progressLeft} height={ControllerHudTag.height - PADDING * 2} x={PADDING} y={PADDING} ry="4" />
          <rect fill="#000" width={(screen.width - PADDING * 2 - 2 - this.progressLeft) * frame / screen.frameLength} height={ControllerHudTag.height - PADDING * 2 - 2} x={PADDING + 1} y={PADDING + 1} ry="3" />
        </g>
      </g>
    );
  }
}
