import * as React from 'react';
import {FieldDump} from '../../core/Field';
import V from '../../core/V';
import Screen from './Screen';
import StatusHudTag from './StatusHudTag';
import ControllerHudTag from './ControllerHudTag';
import ResultHudTag from './ResultHudTag';

export default class HudTag extends React.Component<{ field: FieldDump; screen: Screen; }, {}> {
  render() {
    var field = this.props.field;
    var screen = this.props.screen;

    var hudPosition = [new V(-screen.width / 2, 0), new V(screen.width / 2 - StatusHudTag.width, 0)];
    var index = 0;
    var statusHuds = field.sourcers.map(function(b) {
      return <StatusHudTag key={b.id + "_hud"} model={b} position={hudPosition[index++]} />
    });

    var resultHudTag: JSX.Element = null;
    if (field.result) {
      resultHudTag = <ResultHudTag result={field.result} screen={screen} />
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
