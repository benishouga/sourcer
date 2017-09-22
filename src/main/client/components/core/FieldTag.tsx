import * as React from 'react';
import { SourcerDump, FieldDump, ResultDump, PlayersDump } from '../../../core/Dump';
import Screen from './Screen';
import SourcerTag from './SourcerTag';
import ShotTag from './ShotTag';
import LaserTag from './LaserTag';
import MissileTag from './MissileTag';
import FxTag from './FxTag';
import BackgroundTag from './BackgroundTag';

export default class FieldTag extends React.Component<{
  height: number;
  width: number;
  scale: number;
  field: FieldDump;
  players: PlayersDump;
}, {}> {
  public render() {
    const field = this.props.field;
    const players = this.props.players;

    const screen: Screen = {
      height: this.props.height,
      width: this.props.width,
      viewScale: this.props.scale,
      left: 0,
      right: 0,
      top: 0,
      scale: 0,
      center: 0
    };

    let maxLeft = Number.MAX_VALUE;
    let maxRight = -Number.MAX_VALUE;
    let maxTop = -Number.MAX_VALUE;
    let sumX = 0;

    const sourcers: JSX.Element[] = field.s.map((b) => {
      sumX += b.p.x;
      maxTop = Math.max(maxTop, b.p.y);
      maxRight = Math.max(maxRight, b.p.x);
      maxLeft = Math.min(maxLeft, b.p.x);
      return <SourcerTag key={b.i} model={b} profile={players[b.i]} />;
    });

    if (sourcers.length !== 0) {
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
    const viewTop = (screen.height - 8) / screen.scale;

    const shots: JSX.Element[] = field.b.filter((b) => {
      const x = b.p.x;
      const y = b.p.y;
      return viewLeft < x && x < viewRight && y < viewTop;
    }).map((b) => {
      if (b.s === 'Missile') {
        return <MissileTag key={b.i} model={b} profile={players[b.o]} />;
      }
      return <LaserTag key={b.i} model={b} profile={players[b.o]} />;
    });

    const fxs: JSX.Element[] = field.x.map((b) => {
      return <FxTag key={b.i} model={b} />;
    });

    return (
      <g>
        <BackgroundTag screen={screen} />

        <g transform={`scale(${screen.scale}, ${screen.scale}) translate(${-screen.center},${viewTop}) scale(1, -1)`}>
          <g>
            {sourcers}
            {shots}
          </g>
          {fxs}
        </g>
      </g>
    );
  }
}
