import * as React from 'react';
import {ResultDump, ProfileDump} from '../../core/Dump';
import Screen from './Screen';

export default class ReadyHudTag extends React.Component<{
  player1: ProfileDump;
  player2: ProfileDump;
  screenHeight: number;
}, {}> {
  static width = 384;
  static height = 64;

  render() {
    return (
      <g transform={"translate(" + (-ReadyHudTag.width / 2) + "," + ((this.props.screenHeight - ReadyHudTag.height) / 2) + ")"}>
        <rect ry="4" y="0" x="0" height={ReadyHudTag.height} width={ReadyHudTag.width} fill="#fff" />
        <rect ry="3" y="1" x="1" height={ReadyHudTag.height - 1 * 2} width={ReadyHudTag.width - 1 * 2} fill="#888" />
        <rect ry="1" y="3" x="3" height={ReadyHudTag.height - (1 + 2) * 2} width={ReadyHudTag.width - (1 + 2) * 2} fill="#fff" />
        <text x={ReadyHudTag.width / 2} y={ReadyHudTag.height / 2} textAnchor="middle">vs</text>
        <text x={ReadyHudTag.width / 4} y={ReadyHudTag.height / 2} textAnchor="middle">{this.props.player1.name}</text>
        <text x={ReadyHudTag.width / 4 + ReadyHudTag.width / 2} y={ReadyHudTag.height / 2} textAnchor="middle">{this.props.player2.name}</text>
        <rect y={ReadyHudTag.height / 2 - 18} x={16} height={32} width={8} fill={this.props.player1.color} />
        <rect y={ReadyHudTag.height / 2 - 18} x={ReadyHudTag.width / 2 + 24} height={32} width={8} fill={this.props.player2.color} />
      </g>
    );
  }
}
