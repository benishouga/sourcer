import * as React from 'react';
import { ResultDump, ProfileDump } from '../../../core/Dump';
import Screen from './Screen';

export default class ResultHudTag extends React.Component<{ result: ResultDump; profile: ProfileDump | null; screenHeight: number; }, {}> {
  private static width = 256;
  private static height = 64;

  public render() {
    const screenHeight = this.props.screenHeight;
    const result = this.props.result;
    const profile = this.props.profile;

    const timeout = result.timeout ? `${result.timeout} Infinite loop` : null;
    const text = result.isDraw || !profile ? 'Draw !!' : `${profile.name} Win !!`;
    const color = result.isDraw || !profile ? '#000' : profile.color;

    return (
      <g transform={`translate(${-ResultHudTag.width / 2},${(screenHeight - ResultHudTag.height) / 2})`}>
        <rect ry="4" y="0" x="0" height={ResultHudTag.height} width={ResultHudTag.width} fill="#fff" />
        <rect ry="3" y="1" x="1" height={ResultHudTag.height - 1 * 2} width={ResultHudTag.width - 1 * 2} fill={color} />
        <rect ry="1" y="3" x="3" height={ResultHudTag.height - (1 + 2) * 2} width={ResultHudTag.width - (1 + 2) * 2} fill="#fff" />
        <text x={ResultHudTag.width / 2} y={ResultHudTag.height / 2} textAnchor="middle">{timeout || text}</text>
      </g>
    );
  }
}
