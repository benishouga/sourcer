import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Cell } from 'react-mdl';

import { GameDump, Message } from '../../../../core/Dump';
import FieldTag from '../../core/FieldTag';
import HudTag from '../../core/HudTag';
import Status from './Status';
import Controller from './Controller';

const FRAME_MILLS = 1000 / 60;

export interface ReplayerProps {
  gameDump: GameDump;
  error?: string | null;
  width?: number;
  height?: number;
  scale: number;
  onReload?: () => void;
}

interface ReplayerMemo {
  animationFrameHandler: number | null;
  startTime: number;
  startFrame: number;
  replayerState: ReplayerState;
}

interface ReplayerState {
  frameIndex: number;
  playing: boolean;
}

const DEFAULT_PROPS = {
  gameDump: {},
  width: -1,
  height: 384,
  scale: 1.0
};

export default function Replayer(argProps: ReplayerProps) {
  const props = { ...DEFAULT_PROPS, ...argProps };
  const [replayerState, setReplayerState] = React.useState<ReplayerState>({ frameIndex: 0, playing: false });
  const [dynamicWidth, setDynamicWidth] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const memo = React.useMemo<ReplayerMemo>(() => {
    return { replayerState, animationFrameHandler: null, startTime: performance.now(), startFrame: 0 };
  }, []);

  memo.replayerState = replayerState; // for to call tick() recursively.

  const scale = props.scale;
  const width = (props.width !== -1 ? props.width : dynamicWidth) || 512;
  const height = props.height || 384;

  if (!props.gameDump.frames) {
    return null;
  }
  const frames = props.gameDump.frames;
  const result = props.gameDump.result;
  const players = props.gameDump.players;
  const currentFrame = frames[replayerState.frameIndex];
  const demo = props.gameDump.isDemo;

  React.useEffect(() => {
    adjustWidth();
    return () => {
      if (memo.animationFrameHandler) {
        cancelAnimationFrame(memo.animationFrameHandler);
      }
    };
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      switch (event.keyCode) {
        case 32: // Space
          onPlayPauseToggle();
          event.preventDefault();
          break;
        case 37: // Arrow Left
          updateFrame({
            playing: !!replayerState.playing,
            frameIndex: Math.max(0, replayerState.frameIndex - 1)
          });
          event.preventDefault();
          break;
        case 39: // Arrow Right
          updateFrame({
            playing: !!replayerState.playing,
            frameIndex: Math.min(replayerState.frameIndex + 1, frames.length - 1)
          });
          event.preventDefault();
          break;
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  function onPlayPauseToggle() {
    if (replayerState.playing) {
      onPause();
    } else {
      onPlay();
    }
  }

  function updateFrame(arg: ReplayerState): void {
    memo.startFrame = arg.frameIndex;
    memo.startTime = performance.now();
    setReplayerState({ ...arg });
  }

  function onPlay(argFrame?: number) {
    const targetFrameIndex = argFrame !== undefined ? argFrame : replayerState.frameIndex;
    updateFrame({ playing: true, frameIndex: targetFrameIndex < frames.length - 1 ? targetFrameIndex : 0 });

    if (!memo.animationFrameHandler) {
      memo.animationFrameHandler = requestAnimationFrame(() => tick());
    }
  }

  function onPause(argFrame?: number) {
    const targetFrameIndex = argFrame !== undefined ? argFrame : replayerState.frameIndex;
    updateFrame({ frameIndex: targetFrameIndex, playing: false });
    if (memo.animationFrameHandler) {
      cancelAnimationFrame(memo.animationFrameHandler);
      memo.animationFrameHandler = null;
    }
  }

  function onReload() {
    props.onReload ? props.onReload() : onPlay(0);
  }

  function onFrameChanged(argFrameIndex: number) {
    updateFrame({ frameIndex: argFrameIndex, playing: !!replayerState.playing });
  }

  function adjustWidth() {
    if (!rootRef.current) {
      return;
    }
    const node = ReactDOM.findDOMNode(rootRef.current) as Element;

    if (props.width === -1) {
      setDynamicWidth(node.clientWidth);
    }
  }

  function tick() {
    memo.animationFrameHandler = requestAnimationFrame(() => tick());

    adjustWidth();

    if (!frames || !memo.replayerState.playing) {
      return;
    }

    const delta = performance.now() - memo.startTime;
    const frameDelta = Math.floor(delta / FRAME_MILLS);
    const nextFrame = memo.startFrame + frameDelta;
    if (nextFrame < frames.length) {
      setReplayerState(prev => ({ ...prev, frameIndex: nextFrame }));
    } else if (demo) {
      updateFrame({ playing: !!memo.replayerState.playing, frameIndex: 0 });
    } else {
      onPause(frames.length - 1);
    }
  }

  let logs: Message[] = [];
  if (props.error) {
    logs.push({ message: props.error, color: '#f00' });
  }

  if (currentFrame) {
    const reduced = [...currentFrame.s, ...currentFrame.b]
      .filter(actor => actor.debug)
      .map(actor => actor.debug && actor.debug.logs)
      .reduce((a, b) => a && b && [...a, ...b], []);
    if (reduced) {
      logs = logs.concat(reduced);
    }
  }

  return (
    <div ref={rootRef}>
      <div
        className="mdl-card mdl-shadow--2dp"
        style={{ width: '100%', marginBottom: '8px' }}
        onClick={() => onPlayPauseToggle()}
      >
        <div style={{ width, height, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              fontFamily: 'monospace',
              fontSize: '80%'
            }}
          >
            {logs.map((log, index) => (
              <span key={`log${index}`} style={{ color: log.color }}>
                {log.message}
                <br />
              </span>
            ))}
          </div>
          <svg width={width} height={height} viewBox={`${-width / 2} 0 ${width} ${height}`}>
            <g transform={`scale(${scale}, ${scale})`}>
              {currentFrame && (
                <FieldTag
                  frame={currentFrame}
                  players={players}
                  width={width / scale}
                  height={height / scale}
                  scale={scale}
                />
              )}
              {!demo && (
                <HudTag result={result} players={players} screenHeight={height} frame={replayerState.frameIndex} />
              )}
            </g>
          </svg>
        </div>
      </div>
      <Controller
        frameIndex={replayerState.frameIndex}
        gameDump={props.gameDump}
        onFrameChanged={number => onFrameChanged(number)}
        onReload={() => onReload()}
        onPlay={() => onPlay()}
        onPause={() => onPause()}
        playing={replayerState.playing}
      />
      {!demo &&
        currentFrame && (
          <Grid>
            <Cell col={6} tablet={4} phone={4}>
              <Status model={currentFrame.s[0]} profile={players[currentFrame.s[0].i]} />
            </Cell>
            <Cell col={6} tablet={4} phone={4}>
              <Status model={currentFrame.s[1]} profile={players[currentFrame.s[1].i]} />
            </Cell>
          </Grid>
        )}
    </div>
  );
}
