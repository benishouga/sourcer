import * as React from 'react';

export class Dome {
  id: string;
  x: number;
  size: number;
}

interface DomeTagProps extends React.Props<any> {
  model: Dome;
  far: number
}

export default class DomeTag extends React.Component<DomeTagProps, {}> {
  render() {
    var model = this.props.model;
    var far = this.props.far;
    var alpha = 255 - Math.floor(255 / far);
    var color = `rgb(${alpha},${alpha},${alpha})`;
    return (
      <g transform={`translate(${model.x},0)`}>
        <path fill="#fff"  d={`M ${-(model.size + 1)} 0 A ${model.size + 1} ${model.size + 1} 0 0 0 ${model.size + 1} 0 Z`} />
        <path fill={color} d={`M ${-model.size}       0 A ${model.size}     ${model.size}     0 0 0 ${model.size}     0 Z`} />
        <path fill="#fff"  d={`M ${-(model.size - 2)} 0 A ${model.size - 2} ${model.size - 2} 0 0 0 ${model.size - 2} 0 Z`} />
      </g>
    );
  }
}
