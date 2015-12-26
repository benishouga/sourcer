import * as React from 'react';
import {FieldDump, ResultDump} from '../../core/Dump';
import V from '../../core/V';
import Screen from './Screen';
import StatusHudTag from './StatusHudTag';
import ControllerHudTag from './ControllerHudTag';
import ResultHudTag from './ResultHudTag';

export default class HudTag extends React.Component<{ field: FieldDump; result: ResultDump; screen: Screen; }, {}> {
  render() {
    var field = this.props.field;
    var result = this.props.result;
    var screen = this.props.screen;
    var length = field.sourcers.length;
    var padding = 1;

    var statusHuds = field.sourcers.map(function(b, index) {
      var width = screen.width / length;

      // space both side.
      var position = new V(-screen.width / 2 + width * index + padding, 0)
      return <StatusHudTag key={b.id + "_hud"} model={b} position={position} width={width - padding * 2} />
    });

    var resultHudTag: JSX.Element = null;
    if (result) {
      resultHudTag = <ResultHudTag result={result} screen={screen} />
    }

    return (
      <g>
        {statusHuds}
        {resultHudTag}
        <ControllerHudTag frame={field.frame} screen={screen} />
        </g>
    );
  }
}
