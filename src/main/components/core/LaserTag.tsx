import * as React from 'react';
import {ShotDump} from '../../core/Dump';
import ShotTag from './ShotTag';

export default class LaserTag extends ShotTag {
  render() {
    var model = this.props.model;
    return (
      <g transform={"translate(" + model.position.x + "," + model.position.y + ") rotate(" + model.direction + ", 0, 0)"}>
        <rect fill="#fff" width="14" height="4" x="-7" y="-2" ry="2" />
        <rect fill={model.color} width="12" height="2" x="-6" y="-1" ry="1" />
      </g>
    );
  }
}
