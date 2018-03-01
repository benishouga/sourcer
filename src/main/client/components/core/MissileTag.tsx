import * as React from 'react';
import { ShotDump, ProfileDump } from '../../../core/Dump';

export interface MissileTagProps {
  profile: ProfileDump;
  model: ShotDump;
}
export default function MissileTag({ profile, model }: MissileTagProps) {
  return (
    <g transform={`translate(${model.p.x},${model.p.y}) rotate(${model.d}, 0, 0)`}>
      <path d="m -2,-5 c -4,0 -4,10 0,10 3,0 6,-3 6,-5 0,-2 -3,-5 -6,-5 z" fill="#fff" />
      <path d="m 3,0 c 0,2.5 -4,5 -6,3.5 -1.5,-1 -1.5,-6 0,-7 2,-1.5 6,1 6,3.5 z" fill={profile.color} />
      <rect ry="2" y="-2" x="-6" height="4" width="12" fill="#fff" />
      <rect ry="1" y="-1" x="-5" height="2" width="10" fill={profile.color} />
    </g>
  );
}
