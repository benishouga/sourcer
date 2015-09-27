import * as React from 'react';
import {FxDump} from '../../core/Fx';

interface FxTagProps extends React.Props<any> {
  model: FxDump;
}

export default class FxTag extends React.Component<FxTagProps, {}> {
  render() {
    var model = this.props.model;
    var frame = model.frame;
    return (
      <g>
        <g transform={"translate(" + model.position.x + "," + model.position.y + ")"}>
          <circle r={frame / 2 + 6} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.length) + ")"} />
          <circle r={frame / 2 + 5} cy="0" cx="0" fill={"rgba(0,0,0," + (255 * frame / model.length) + ")"} />
          <circle r={frame / 2 + 3} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.length) + ")"} />
        </g>
      </g>
    );
  }
}
