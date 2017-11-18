import * as React from 'react';
import { render } from 'react-dom';
import ArenaTag from './components/parts/ArenaTag';
import { PlayerInfo } from './arenaWorker';

const COLORS = ['#866', '#262', '#c55', '#44b'];

const screens = document.getElementsByClassName('sourcer-standalone');
Array.prototype.forEach.call(screens, (output: HTMLElement) => {
  const l = (id: string) => output.getAttribute(id) || '';
  const width = parseInt(l('data-width'), 10) || -1;
  const height = parseInt(l('data-height'), 10) || 384;
  const scale = parseFloat(l('data-scale')) || 1.0;
  const isDemo = output.hasAttribute('data-demo');
  const playerIdsText = output.getAttribute('data-players');
  if (playerIdsText) {
    const players = playerIdsText.split(',').map((value, index) => {
      const element = document.getElementById(value);
      if (!element) {
        return null;
      }
      if (element.tagName !== 'TEXTAREA') {
        return { name: 'demo', color: COLORS[index], source: element.innerText };
      }
      const player = element as HTMLTextAreaElement;
      const playerInfo = { name: value, color: COLORS[index], source: player.value };
      const polling = () => {
        playerInfo.source = player.value;
        setTimeout(polling, 1000);
      };
      setTimeout(polling, 1000);
      return playerInfo;
    }).filter(playerInfo => playerInfo) as PlayerInfo[];

    render(<ArenaTag width={width} height={height} scale={scale} players={players} isDemo={isDemo} path="arenaWorker.js" />, output);
  }
});
