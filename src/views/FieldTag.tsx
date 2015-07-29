import * as React from 'react';
import {FieldDump} from '../core/Field';
import V from '../core/V';
import Screen from './Screen';
import SourcerTag from './SourcerTag';
import ShotTag from './ShotTag';
import LaserTag from './LaserTag';
import MissileTag from './MissileTag';
import FxTag from './FxTag';
import HudTag from './HudTag';
import BackgroundTag from './BackgroundTag';
import Utils from '../core/Utils';

export default class FieldTag extends React.Component<{
  height: number;
  width: number;
  playing: boolean;
  frameLength: number;
  onFrameChanged: (frame: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReload: () => void;
  field: FieldDump;
}, {}> {
  render() {
    var field = this.props.field;

    var screen: Screen = {
      frameLength: this.props.frameLength,
      height: this.props.height,
      width: this.props.width,
      left: 0,
      right: 0,
      top: 0,
      scale: 0,
      center: 0,
      playing: this.props.playing,
      onFrameChanged: this.props.onFrameChanged,
      onPlay: this.props.onPlay,
      onPause: this.props.onPause,
      onReload: this.props.onReload
    };

    var maxLeft = Number.MAX_VALUE;
    var maxRight = -Number.MAX_VALUE;
    var maxTop = -Number.MAX_VALUE;
    var sumX = 0;

    var sourcers: JSX.Element[] = field.sourcers.map(function(b) {
      sumX += b.position.x;
      maxTop = Math.max(maxTop, b.position.y);
      maxRight = Math.max(maxRight, b.position.x);
      maxLeft = Math.min(maxLeft, b.position.x);
      return <SourcerTag key={b.id} model={b} />
    });

    if (sourcers.length != 0) {
      screen.center = sumX / sourcers.length;
    }

    screen.left = maxLeft - 100;
    screen.right = maxRight + 100;
    screen.top = maxTop + 100;

    if (screen.width > screen.right - screen.left) {
      screen.right = screen.center + screen.width / 2;
      screen.left = screen.center - screen.width / 2;
    }

    screen.scale = Math.min(1, Math.min(screen.height / screen.top, screen.width / (screen.right - screen.left)));

    var viewLeft = (screen.left - screen.center) / screen.scale + screen.center;
    var viewRight = (screen.right - screen.center) / screen.scale + screen.center;
    var viewTop = (screen.height - 24) / screen.scale;

    if (field.shots) {
      var shots: JSX.Element[] = field.shots.map(function(b) {
        var x = b.position.x;
        var y = b.position.y;
        if (viewLeft < x && x < viewRight && y < viewTop) {
          if (b.type === "Missile") {
            return <MissileTag key={b.id} model={b} />
          } else {
            return <LaserTag key={b.id} model={b} />
          }
        }
      });
    }

    var fxs: JSX.Element[] = field.fxs.map(function(b) {
      return <FxTag key={b.id} model={b} />
    });

    return (
      <g>
        <BackgroundTag screen={screen} />

        <g transform={"scale(" + screen.scale + ", " + screen.scale + ") translate(" + (-screen.center) + "," + (screen.height - 24) / screen.scale + ") scale(1, -1)"}>
          <g>
            {sourcers}
            {shots}
          </g>
          {fxs}
        </g>

        <HudTag field={field} screen={screen} />
      </g>
    );
  }
}
