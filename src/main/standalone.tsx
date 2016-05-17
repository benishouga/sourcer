/** @jsx React.DOM */
import * as React from 'react';
import { render } from 'react-dom'
import Arena, {PlayerInfo} from './components/parts/Arena';

let colors = ['#866', '#262', '#c55', '#44b'];

let screens = document.getElementsByClassName("sourcer-standalone");
for (let i = 0; i < screens.length; i++) {
  let output = screens[i];
  let width = parseInt(output.getAttribute('data-width')) || -1;
  let height = parseInt(output.getAttribute('data-height')) || 384;
  let scale = parseFloat(output.getAttribute('data-scale')) || 1.0;
  let isDemo = output.hasAttribute('data-demo');
  let playerIdsText = output.getAttribute('data-players');
  if (playerIdsText) {
    let players = playerIdsText.split(',').map((value, index) => {
      let element = document.getElementById(value);
      let playerInfo: PlayerInfo;
      if (element.tagName === 'TEXTAREA') {
        let player = element as HTMLTextAreaElement;
        playerInfo = { name: value, color: colors[index], ai: player.value };
        function r() {
          playerInfo.ai = player.value;
          setTimeout(r, 1000);
        }
        setTimeout(r, 1000);
      } else {
        playerInfo = { name: 'demo', color: colors[index], ai: element.innerText };
      }
      return playerInfo;
    });
    render(<Arena width={width} height={height} scale={scale} players={players} isDemo={isDemo} path="dist/arena.js" />, output);
  }
}
