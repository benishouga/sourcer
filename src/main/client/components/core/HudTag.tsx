import * as React from 'react';
import { PlayersDump, ResultDump, ProfileDump } from '../../../core/Dump';
import V from '../../../core/V';
import Screen from './Screen';
import ResultHudTag from './ResultHudTag';
import ReadyHudTag from './ReadyHudTag';

interface HudTagProps {
  players: PlayersDump;
  frame: number;
  result: ResultDump | null;
  screenHeight: number;
}

export default class HudTag extends React.Component<HudTagProps, {}> {
  public render() {
    const frame = this.props.frame;
    const players = this.props.players;
    const result = this.props.result;
    const screenHeight = this.props.screenHeight;
    const padding = 1;
    let resultHudTag: JSX.Element | null = null;

    if (result) {
      if (result.winnerId !== null && result.frame <= frame) {
        resultHudTag = <ResultHudTag result={result} profile={players[result.winnerId]} screenHeight={screenHeight} />;
      } else if (result.timeout) {
        resultHudTag = <ResultHudTag result={result} profile={null} screenHeight={screenHeight} />;
      }
    }

    const timeout = result && result.timeout;
    const readyHud = !timeout && this.props.frame === 0 ?
      <ReadyHudTag screenHeight={screenHeight} player1={players[0]} player2={players[1]} /> : null;

    return (
      <g>
        {resultHudTag}
        {readyHud}
      </g>
    );
  }
}
