import * as React from 'react';
import {SourcerDump} from '../core/Sourcer';

interface SourcerTagProps extends React.Props<any> {
  model: SourcerDump;
}

export default class SourcerTag extends React.Component<SourcerTagProps, {}> {
  render() {
    var model = this.props.model;
    return (
      <g transform={"translate(" + model.position.x + "," + model.position.y + ") scale(" + model.direction + ", -1)"}>
        <rect transform="rotate(45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
        <rect transform="rotate(45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill={model.color} />
        <rect transform="rotate(-45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
        <rect transform="rotate(-45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill={model.color} />
        <circle r="12" cy="0" cx="0" fill="#fff" />
        <circle r="11" cy="0" cx="0" fill={model.color} />
        <circle r="9" cy="0" cx="0"  fill="#fff" />
        <rect ry="2" y="-2" x="-16" height="4" width="31" fill="#fff" />
        <rect ry="1" y="-1" x="-15" height="2" width="29" fill={model.color} />
        <circle r="4" cy="0" cx="4" fill="#fff" />
        <circle r="3" cy="0" cx="4" fill={model.color} />
        <circle r="1" cy="0" cx="4" fill="#fff" />
      </g>
    );
  }
}
