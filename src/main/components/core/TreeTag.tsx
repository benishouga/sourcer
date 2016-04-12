import * as React from 'react';

export class Tree {
  id: string;
  x: number;
  size: number;
  height: number;
}

interface TreeTagProps extends React.Props<TreeTag> {
  model: Tree;
  far: number
}

export default class TreeTag extends React.Component<TreeTagProps, {}> {
  render() {
    var model = this.props.model;
    var far = this.props.far;
    var alpha = 255 - Math.floor(255 / far);
    var color = `rgb(${alpha},${alpha},${alpha})`;
    return (
      <g transform={`translate(${model.x},0)`}>
        <rect fill="#fff"  width="4" height={model.height + 2} x="-2" y="-2" ry="2" />
        <rect fill={color} width="2" height={model.height}     x="-1" y="-1" ry="1" />
        <circle r={model.size + 1} cy={model.height} cx="0" fill="#fff" />
        <circle r={model.size}     cy={model.height} cx="0" fill={color} />
        <circle r={model.size - 2} cy={model.height} cx="0" fill="#fff" />
      </g>
    );
  }
}
