import * as React from 'react';
import { FxDump } from '../../../core/Dump';

export interface FxTagProps {
  model: FxDump;
}

export default function FxTag({ model }: FxTagProps) {
  const frame = model.f;
  const alpha = 255 * frame / model.l;
  return (
    <g>
      <g transform={`translate(${model.p.x},${model.p.y})`}>
        <circle r={frame / 2 + 6} cy="0" cx="0" fill={`rgba(255,255,255,${alpha})`} />
        <circle r={frame / 2 + 5} cy="0" cx="0" fill={`rgba(255,64,0,${alpha})`} />
        <circle r={frame / 2 + 3} cy="0" cx="0" fill={`rgba(255,255,255,${alpha})`} />
        <circle r={frame / 2 + 1} cy="0" cx="0" fill={`rgba(255,255,128,${alpha})`} />
      </g>
    </g>
  );
}
