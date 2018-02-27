import * as React from 'react';
import { render } from 'react-dom';
import ArenaTag from './components/parts/ArenaTag';
import { PlayerInfo } from './arenaWorker';
import Arc from './components/core/Arc';

import * as Ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/chrome';

const COLORS = ['#866', '#262', '#c55', '#44b'];

const attr = (element: HTMLElement, id: string) => element.getAttribute(id) || '';

Array.prototype.forEach.call(document.getElementsByClassName('sourcer-standalone'), (element: HTMLElement) => {
  const l = (id: string) => attr(element, id);
  const width = parseInt(l('data-width'), 10) || -1;
  const height = parseInt(l('data-height'), 10) || 384;
  const scale = parseFloat(l('data-scale')) || 1.0;
  const isDemo = element.hasAttribute('data-demo');
  const playerIdsText = element.getAttribute('data-players');
  if (playerIdsText) {
    const players = playerIdsText
      .split(',')
      .map((value, index) => {
        const playerElement = document.getElementById(value);
        if (!playerElement) {
          return null;
        }
        if (playerElement.tagName !== 'TEXTAREA') {
          return { name: 'demo', color: COLORS[index], source: playerElement.innerText };
        }
        const playerTextArea = playerElement as HTMLTextAreaElement;
        const playerInfo = { name: value, color: COLORS[index], source: playerTextArea.value } as PlayerInfo;
        const polling = () => {
          playerInfo.source = playerTextArea.value;
          setTimeout(polling, 500);
        };
        polling();
        return playerInfo;
      })
      .filter(playerInfo => playerInfo) as PlayerInfo[];

    render(
      <ArenaTag width={width} height={height} scale={scale} players={players} isDemo={isDemo} path="arenaWorker.js" />,
      element
    );
  }
});

Array.prototype.forEach.call(document.querySelectorAll('.arc'), (element: HTMLElement) => {
  const l = (id: string) => attr(element, id);
  const width = parseInt(l('width'), 10) || 160;
  const height = parseInt(l('height'), 10) || 160;
  const arrowDirection = parseInt(l('data-arrow'), 10) || 0;
  const direction = -parseInt(l('data-direction'), 10);
  const angle = parseInt(l('data-angle'), 10);
  const renge = parseInt(l('data-distance'), 10);

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const lines: JSX.Element[] = [];

  lines.push(<line x1={0} y1={halfHeight} x2={0} y2={-halfHeight} strokeWidth="1" stroke="#ddd" />);
  for (let i = 10; i < halfWidth; i += 10) {
    lines.push(<line x1={-i} y1={halfHeight} x2={-i} y2={-halfHeight} strokeWidth="1" stroke="#ddd" />);
    lines.push(<line x1={i} y1={halfHeight} x2={i} y2={-halfHeight} strokeWidth="1" stroke="#ddd" />);
  }
  lines.push(<line x1={halfWidth} y1={0} x2={-halfWidth} y2={0} strokeWidth="1" stroke="#ddd" />);
  for (let i = 10; i < halfHeight; i += 10) {
    lines.push(<line x1={halfWidth} y1={-i} x2={-halfWidth} y2={-i} strokeWidth="1" stroke="#ddd" />);
    lines.push(<line x1={halfWidth} y1={i} x2={-halfWidth} y2={i} strokeWidth="1" stroke="#ddd" />);
  }

  render(
    <svg
      transform={`scale(1, -1)`}
      width={width}
      height={height}
      viewBox={`${-width / 2 + 0.5} ${-height / 2 + 0.5} ${width} ${height}`}
    >
      <rect x={-halfWidth} y={-halfHeight} height={height} width={width} fill="#eee" />
      {lines}
      <Arc direction={direction} angle={angle} renge={renge} />
      <path
        transform={`rotate(${arrowDirection}, 0, 0)`}
        d="M 10 0 L -10 6 L -4 0 L -10 -6 z"
        fill="#88f"
        stroke="#000"
        strokeWidth="1"
      />
    </svg>,
    element
  );
});

const preElements = document.querySelectorAll('pre.code');
Array.prototype.forEach.call(preElements, (element: HTMLElement) => {
  const editor = Ace.edit(element);
  editor.setTheme('ace/theme/chrome');
  editor.getSession().setMode('ace/mode/javascript');
  editor.setOption('maxLines', 40);
  editor.setReadOnly(true);
});

Array.prototype.forEach.call(document.querySelectorAll('textarea.code'), (element: HTMLTextAreaElement) => {
  element.style.display = 'none';
  const pre = document.createElement('pre');
  pre.className = 'code';
  const parent = element.parentNode;
  if (parent) {
    parent.insertBefore(pre, element);
  }

  setTimeout(() => {
    pre.addEventListener('keydown', event => {
      if (event.keyCode === 32) {
        event.stopPropagation();
      }
    });
    const editor = Ace.edit(pre);
    editor.setTheme('ace/theme/chrome');
    const session = editor.getSession();
    session.setMode('ace/mode/javascript');
    session.setTabSize(2);
    editor.setOption('maxLines', 40);
    editor.$blockScrolling = Infinity;
    session.on('change', e => {
      element.value = editor.getValue();
    });
    editor.setValue(element.value);
    editor.gotoLine(0);
  });
});
