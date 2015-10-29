import * as React from 'react';
import {SourcerDump} from '../../core/Dump';
import V from '../../core/V';
import Configs from '../../core/Configs';

var PADDING = 2;

interface StatusHudTagProps extends React.Props<any> {
  model: SourcerDump;
  position: V;
  width: number;
}

export default class StatusHudTag extends React.Component<StatusHudTagProps, {}> {
  static height = PADDING * 2 + 19; // 4 status * 4px + 3 span * 1px

  render() {
    var model = this.props.model;
    var position = this.props.position;
    var width = this.props.width;

    return (
      <g transform={"translate(" + position.x + "," + position.y + ")"}>
        <rect fill="#ccc" width={width} height={PADDING * 2 + 19} x="0" y="0" ry="2" />
        <rect fill={model.color} width="8" height={PADDING * 2 + 19} x="0" y="0" ry="1" />

        <rect fill="#fff" width={width - PADDING * 2} height="4" x={PADDING} y={PADDING} ry="2" />
        <rect fill="#00c" width={(width - PADDING * 2 - 2) * model.shield / Configs.INITIAL_SHIELD} height="2" x={PADDING + 1} y={PADDING + 1} ry="1" />

        <rect fill="#fff" width={width - PADDING * 2} height="4" x={PADDING} y={PADDING + 5} ry="2" />
        <rect fill="#f80" width={(width - PADDING * 2 - 2) * model.fuel / Configs.INITIAL_FUEL} height="2" x={PADDING + 1} y={PADDING + 6} ry="1" />

        <rect fill="#fff" width={width - PADDING * 2} height="4" x={PADDING} y={PADDING + 10} ry="2" />
        <rect fill="#f00" width={(width - PADDING * 2 - 2) * model.temperature / Configs.OVERHEAT_BORDER} height="2" x={PADDING + 1} y={PADDING + 11} ry="1" />

        <rect fill="#fff" width={width - PADDING * 2} height="4" x={PADDING} y={PADDING + 15} ry="2" />
        <rect fill="#080" width={(width - PADDING * 2 - 2) * model.missileAmmo / Configs.INITIAL_MISSILE_AMMO} height="2" x={PADDING + 1} y={PADDING + 16} ry="1" />
        </g>
    );
  }
}
