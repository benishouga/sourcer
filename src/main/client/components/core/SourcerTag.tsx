import * as React from 'react';
import { SourcerDump, ProfileDump } from '../../../core/Dump';

interface SourcerTagProps {
  profile: ProfileDump;
  model: SourcerDump;
}

export default class SourcerTag extends React.Component<SourcerTagProps, {}> {
  public render() {
    const profile = this.props.profile;
    const model = this.props.model;
    return (
      <g transform={`translate(${model.p.x},${model.p.y}) scale(${model.d}, -1)`}>
        <rect transform="rotate(45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
        <rect transform="rotate(45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill={profile.color} />
        <rect transform="rotate(-45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
        <rect transform="rotate(-45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill={profile.color} />
        <circle r="12" cy="0" cx="0" fill="#fff" />
        <circle r="11" cy="0" cx="0" fill={profile.color} />
        <circle r="9" cy="0" cx="0" fill="#fff" />
        <rect ry="2" y="-2" x="-16" height="4" width="31" fill="#fff" />
        <rect ry="1" y="-1" x="-15" height="2" width="29" fill={profile.color} />
        <circle r="4" cy="0" cx="4" fill="#fff" />
        <circle r="3" cy="0" cx="4" fill={profile.color} />
        <circle r="1" cy="0" cx="4" fill="#fff" />
      </g>
    );
  }
}
