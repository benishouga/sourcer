import * as React from 'react';
import { ProfileDump } from '../../../core/Dump';

export interface ReadyHudTagProps {
  player1: ProfileDump;
  player2: ProfileDump;
  screenHeight: number;
}

const WIDTH = 384;
const HEIGHT = 64;
export default function ReadyHudTag({ player1, player2, screenHeight }: ReadyHudTagProps) {
  return (
    <g transform={`translate(${-WIDTH / 2},${(screenHeight - HEIGHT) / 2})`}>
      <rect ry="4" y="0" x="0" height={HEIGHT} width={WIDTH} fill="#fff" />
      <rect ry="3" y="1" x="1" height={HEIGHT - 1 * 2} width={WIDTH - 1 * 2} fill="#888" />
      <rect ry="1" y="3" x="3" height={HEIGHT - (1 + 2) * 2} width={WIDTH - (1 + 2) * 2} fill="#fff" />
      <text x={WIDTH / 2} y={HEIGHT / 2} fontSize={13} textAnchor="middle">
        vs
      </text>
      <text x={WIDTH / 4} y={HEIGHT / 2} fontSize={13} textAnchor="middle">
        {player1.name}
      </text>
      <text x={WIDTH / 4 + WIDTH / 2} y={HEIGHT / 2} fontSize={13} textAnchor="middle">
        {player2.name}
      </text>
      <rect y={HEIGHT / 2 - 18} x={16} height={32} width={8} fill={player1.color} />
      <rect y={HEIGHT / 2 - 18} x={WIDTH / 2 + 24} height={32} width={8} fill={player2.color} />
    </g>
  );
}
