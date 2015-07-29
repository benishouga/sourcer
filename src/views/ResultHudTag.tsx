import * as React from 'react';
import {GameResult} from '../core/Field';
import Screen from './Screen';

export default class ResultHudTag extends React.Component<{ result: GameResult; screen: Screen; }, {}> {
  static width = 256;
  static height = 64;
  render() {
    var screen = this.props.screen;
    var result = this.props.result;

    var text = result.isDraw ? "Draw !!" : result.winner.name + " Win !!";
    var color = result.isDraw ? "#000" : result.winner.color;

    return (
      <g transform={"translate("+ (-ResultHudTag.width / 2) +"," + ((screen.height - ResultHudTag.height) / 2) + ")"}>
        <rect ry="4" y="0" x="0" height={ResultHudTag.height} width={ResultHudTag.width} fill="#fff" />
        <rect ry="3" y="1" x="1" height={ResultHudTag.height - 1 * 2} width={ResultHudTag.width - 1 * 2} fill={color} />
        <rect ry="1" y="3" x="3" height={ResultHudTag.height - (1 + 2) * 2} width={ResultHudTag.width - (1 + 2) * 2} fill="#fff" />
        <text x={ResultHudTag.width / 2} y={ResultHudTag.height / 2} textAnchor="middle">{text}</text>
      </g>
    );
  }
}
