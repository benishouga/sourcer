import * as React from 'react';
import { ShotDump, ProfileDump } from '../../../core/Dump';

interface LaserTagProps {
  profile: ProfileDump;
  model: ShotDump;
}
export default function LaserTag({ profile, model }: LaserTagProps) {
  return (
    <g transform={`translate(${model.p.x},${model.p.y}) rotate(${model.d}, 0, 0)`}>
      <rect fill="#fff" width="14" height="4" x="-7" y="-2" ry="2" />
      <rect fill={profile.color} width="12" height="2" x="-6" y="-1" ry="1" />
    </g>
  );
}
