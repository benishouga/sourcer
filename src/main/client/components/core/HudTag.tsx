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

export default function HudTag({ players, frame, result, screenHeight }: HudTagProps) {
  if (!result) {
    return null;
  }

  const readyHud = !result.timeout && frame === 0 ?
    <ReadyHudTag screenHeight={screenHeight} player1={players[0]} player2={players[1]} /> :
    null;

  let resultHudTag: JSX.Element | null = null;
  if (result.winnerId !== null && result.frame <= frame) {
    resultHudTag = <ResultHudTag result={result} profile={players[result.winnerId]} screenHeight={screenHeight} />;
  } else if (result.timeout) {
    resultHudTag = <ResultHudTag result={result} profile={null} screenHeight={screenHeight} />;
  }

  return (
    <g>
      {readyHud}
      {resultHudTag}
    </g>
  );
}
