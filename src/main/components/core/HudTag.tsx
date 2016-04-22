import * as React from 'react';
import {FieldDump, MembersDump, ResultDump} from '../../core/Dump';
import V from '../../core/V';
import Screen from './Screen';
import StatusHudTag from './StatusHudTag';
import ControllerHudTag from './ControllerHudTag';
import ResultHudTag from './ResultHudTag';

export default class HudTag extends React.Component<{ field: FieldDump; members: MembersDump; result: ResultDump; screen: Screen; }, {}> {
  render() {
    const field = this.props.field;
    const members = this.props.members;
    const result = this.props.result;
    const screen = this.props.screen;
    const length = field.s.length;
    const padding = 1;

    const statusHuds = field.s.map(function(b, index) {
      var width = screen.width / length;

      // space both side.
      var position = new V(-screen.width / 2 + width * index + padding, 0)
      return <StatusHudTag key={b.i + "_hud"} model={b} profile={members[b.i]} position={position} width={width - padding * 2} />
    });

    var resultHudTag: JSX.Element = null;
    if (result) {
      resultHudTag = <ResultHudTag result={result} profile={members[result.winnerId]} screen={screen} />
    }

    return (
      <g>
        {statusHuds}
        {resultHudTag}
        <ControllerHudTag frame={field.f} screen={screen} />
      </g>
    );
  }
}
