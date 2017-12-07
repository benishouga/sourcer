import * as React from 'react';

interface ArcProps {
  x?: number;
  y?: number;
  direction: number;
  angle: number;
  renge?: number;
  fillColor?: string;
  centerColor?: string;
}

export default function Arc({ x = 0, y = 0, direction, angle, renge: argRenge = 0, fillColor = '#d448', centerColor = '#f00' }: ArcProps) {
  const norenge = argRenge <= 0;
  const renge = norenge ? 320 : argRenge;
  const defs = norenge ? <defs>
    <radialGradient id="grad" r="1" cx="0" >
      <stop offset="0%" stopColor={fillColor} />
      <stop offset="100%" stopColor="#fff0" />
    </radialGradient>
  </defs> : null;

  const color = norenge ? 'url(#grad)' : fillColor;

  if (360 <= angle) {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={renge} cy={y} cx={x} fill={color} />
      </g>
    );
  }

  const normalizedAngle = Math.max(0, angle);
  const halfAngleRadian = normalizedAngle * Math.PI / 180 / 2;
  const angleX = renge * Math.cos(halfAngleRadian);
  const angleY = renge * Math.sin(halfAngleRadian);
  const d = `
    M 0,0
    L ${angleX},${angleY}
    A ${renge} ${renge} ${normalizedAngle / 2} ${normalizedAngle > 180 ? 1 : 0} 0 ${angleX},${-angleY}
    Z
  `;

  return (
    <g transform={`translate(${x},${y}) rotate(${-direction}, 0, 0)`} fill={color}>
      {defs}
      <path d={d} />
      <line x1={0} y1={0} x2={renge} y2={0} strokeWidth="1" stroke={centerColor} />
    </g>
  );
}
