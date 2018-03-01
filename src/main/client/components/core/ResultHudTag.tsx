import * as React from 'react';
import { ResultDump, ProfileDump } from '../../../core/Dump';

export interface ResultHudTagProps {
  result: ResultDump;
  profile: ProfileDump | null;
  screenHeight: number;
}

const WIDTH = 256;
const HEIGHT = 64;
export default function ResultHudTag({ result, profile, screenHeight }: ResultHudTagProps) {
  const timeout = result.timeout ? `${result.timeout} Infinite loop` : null;
  const text = result.isDraw || !profile ? 'Draw !!' : `${profile.name} Win !!`;
  const color = result.isDraw || !profile ? '#000' : profile.color;

  return (
    <g transform={`translate(${-WIDTH / 2},${(screenHeight - HEIGHT) / 2})`}>
      <rect ry="4" y="0" x="0" height={HEIGHT} width={WIDTH} fill="#fff" />
      <rect ry="3" y="1" x="1" height={HEIGHT - 1 * 2} width={WIDTH - 1 * 2} fill={color} />
      <rect ry="1" y="3" x="3" height={HEIGHT - (1 + 2) * 2} width={WIDTH - (1 + 2) * 2} fill="#fff" />
      <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle">
        {timeout || text}
      </text>
    </g>
  );
}
