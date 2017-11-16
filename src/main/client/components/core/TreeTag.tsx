import * as React from 'react';

export interface Tree {
  id: string;
  x: number;
  size: number;
  height: number;
}

interface TreeTagProps {
  model: Tree;
  far: number;
}

export default class TreeTag extends React.Component<TreeTagProps, {}> {
  public render() {
    const model = this.props.model;
    const far = this.props.far;
    const alpha = 255 - Math.floor(255 / far);
    const color = `rgb(${alpha},${alpha},${alpha})`;
    return (
      <g transform={`translate(${model.x},0)`}>
        <rect fill="#fff" width="4" height={model.height + 2} x="-2" y="-2" ry="2" />
        <rect fill={color} width="2" height={model.height} x="-1" y="-1" ry="1" />
        <circle r={model.size + 1} cy={model.height} cx="0" fill="#fff" />
        <circle r={model.size} cy={model.height} cx="0" fill={color} />
        <circle r={model.size - 2} cy={model.height} cx="0" fill="#fff" />
      </g>
    );
  }
}
