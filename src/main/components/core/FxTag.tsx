import * as React from 'react';
import {FxDump} from '../../core/Dump';

interface FxTagProps extends React.Props<any> {
  model: FxDump;
}

export default class FxTag extends React.Component<FxTagProps, {}> {
  render() {
    var model = this.props.model;
    var frame = model.f;
    return (
      <g>
        <g transform={"translate(" + model.p.x + "," + model.p.y + ")"}>
          <circle r={frame / 2 + 6} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.l) + ")"} />
          <circle r={frame / 2 + 5} cy="0" cx="0" fill={"rgba(255,64,0," + (255 * frame / model.l) + ")"} />
          <circle r={frame / 2 + 3} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.l) + ")"} />
          <circle r={frame / 2 + 1} cy="0" cx="0" fill={"rgba(255,255,128," + (255 * frame / model.l) + ")"} />
        </g>
      </g>
    );
  }
}
