import * as React from 'react';
import {FieldDump, ResultDump, PlayersDump} from '../../core/Dump';
import V from '../../core/V';
import Screen from './Screen';
import SourcerTag from './SourcerTag';
import ShotTag from './ShotTag';
import LaserTag from './LaserTag';
import MissileTag from './MissileTag';
import FxTag from './FxTag';
import HudTag from './HudTag';
import BackgroundTag from './BackgroundTag';
import Utils from '../../core/Utils';

export default class FieldTag extends React.Component<{
  isDemo: boolean;
  height: number;
  width: number;
  scale: number;
  playing?: boolean;
  frameLength?: number;
  onFrameChanged?: (frame: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReload?: () => void;
  field: FieldDump;
  result: ResultDump;
  players: PlayersDump;
  hideStatus?: boolean;
  hideController?: boolean;
}, {}> {
  render() {
    const field = this.props.field;
    const result = this.props.result;
    const players = this.props.players;

    const screen: Screen = {
      frameLength: this.props.frameLength,
      height: this.props.height,
      width: this.props.width,
      viewScale: this.props.scale,
      left: 0,
      right: 0,
      top: 0,
      scale: 0,
      center: 0,
      playing: this.props.playing,
      onFrameChanged: this.props.onFrameChanged,
      onPlay: this.props.onPlay,
      onPause: this.props.onPause,
      onReload: this.props.onReload,
      hideController: this.props.hideController
    };

    var maxLeft = Number.MAX_VALUE;
    var maxRight = -Number.MAX_VALUE;
    var maxTop = -Number.MAX_VALUE;
    var sumX = 0;

    const sourcers: JSX.Element[] = field.s.map(function(b) {
      sumX += b.p.x;
      maxTop = Math.max(maxTop, b.p.y);
      maxRight = Math.max(maxRight, b.p.x);
      maxLeft = Math.min(maxLeft, b.p.x);
      return <SourcerTag key={b.i} model={b} profile={players[b.i]} />
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

    const viewLeft = (screen.left - screen.center) / screen.scale + screen.center;
    const viewRight = (screen.right - screen.center) / screen.scale + screen.center;
    const viewTop = (screen.height - (this.props.hideController ? 8 : 24)) / screen.scale;

    var shots: JSX.Element[];
    if (field.b) {
      shots = field.b.map((b) => {
        const x = b.p.x;
        const y = b.p.y;
        if (viewLeft < x && x < viewRight && y < viewTop) {
          if (b.s === "Missile") {
            return <MissileTag key={b.i} model={b} profile={players[b.o]} />
          } else {
            return <LaserTag key={b.i} model={b} profile={players[b.o]} />
          }
        }
      });
    }

    var fxs: JSX.Element[] = field.x.map((b) => {
      return <FxTag key={b.i} model={b} />
    });

    var hudTag: JSX.Element = null;
    if (!this.props.isDemo) {
      hudTag = <HudTag field={field} result={result} players={players} screen={screen} hideStatus={this.props.hideStatus} hideController={this.props.hideController} />;
    }

    return (
      <g>
        <BackgroundTag screen={screen} />

        <g transform={"scale(" + screen.scale + ", " + screen.scale + ") translate(" + (-screen.center) + "," + viewTop + ") scale(1, -1)"}>
          <g>
            {sourcers}
            {shots}
          </g>
          {fxs}
        </g>
        {hudTag}
      </g>
    );
  }
}
