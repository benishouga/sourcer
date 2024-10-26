import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FABButton, Icon, Slider, Grid, Cell, Card, CardTitle, CardText, ProgressBar } from 'react-mdl';

import Configs from '../../../core/Configs';

import FieldTag from '../core/FieldTag';
import HudTag from '../core/HudTag';
import { GameDump, FrameDump, ProfileDump, SourcerDump, PlayersDump, ShotDump } from '../../../core/Dump';
import ComponentExplorer from '../../utils/ComponentExplorer';
import { strings } from '../resources/Strings';

export interface ReplayerProps {
  gameDump: GameDump;
  error?: string | null;
  width?: number;
  height?: number;
  scale: number;
  onReload?: () => void;
}

const Replayer: React.FC<ReplayerProps> = (props) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [frame, setFrame] = useState<number>(0);
  const [dynamicWidth, setDynamicWidth] = useState<number>(512);

  const animationFrameHandler = useRef<number | null>(null);
  const startTime = useRef<number>(performance.now());
  const startFrame = useRef<number>(0);

  const onPlayPauseToggle = () => {
    if (playing) {
      onPause();
    } else {
      onPlay();
    }
  };

  const updateFrame = ({ playing, frame }: { playing: boolean; frame: number }) => {
    startFrame.current = frame;
    startTime.current = performance.now();
    setPlaying(playing);
    setFrame(frame);
  };

  const onPlay = (argFrame?: number) => {
    const frame = argFrame !== undefined ? argFrame : frame;
    const isEndOfFrame = props.gameDump.frames.length - 1 <= frame;
    updateFrame({ playing: true, frame: isEndOfFrame ? 0 : frame });

    if (!animationFrameHandler.current) {
      animationFrameHandler.current = requestAnimationFrame(() => tick());
    }
  };

  const onPause = (argFrame?: number) => {
    const frame = argFrame !== undefined ? argFrame : frame;
    updateFrame({ frame, playing: false });
    if (animationFrameHandler.current) {
      cancelAnimationFrame(animationFrameHandler.current);
      animationFrameHandler.current = null;
    }
  };

  const onReload = () => {
    if (props.onReload) {
      props.onReload();
    } else {
      onPlay(0);
    }
  };

  const onFrameChanged = (frameEvent: any) => {
    updateFrame({ playing: !!playing, frame: ComponentExplorer.extractSliderOnChange(frameEvent) });
  };

  const adjustWidth = () => {
    const node = document.getElementById('root') as Element;

    if (props.width === -1) {
      setDynamicWidth(node.clientWidth);
    }
  };

  const FRAME_MILLS = 1000 / 60;
  const tick = useCallback(() => {
    animationFrameHandler.current = requestAnimationFrame(() => tick());

    adjustWidth();

    if (!props.gameDump.frames || !playing) {
      return;
    }

    const delta = performance.now() - startTime.current;
    const frame = Math.floor(delta / FRAME_MILLS);
    const nextFrame = startFrame.current + frame;
    if (nextFrame < props.gameDump.frames.length) {
      setFrame(nextFrame);
    } else if (props.gameDump.isDemo) {
      updateFrame({ playing: !!playing, frame: 0 });
    } else {
      onPause(props.gameDump.frames.length - 1);
    }
  }, [playing, props.gameDump.frames, props.gameDump.isDemo]);

  useEffect(() => {
    adjustWidth();
    document.addEventListener('keydown', onKeyDown);

    return () => {
      if (animationFrameHandler.current) {
        cancelAnimationFrame(animationFrameHandler.current);
      }
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 32: // Space
        onPlayPauseToggle();
        event.preventDefault();
        break;
      case 37: // Arrow Left
        updateFrame({ playing: !!playing, frame: Math.max(0, frame - 1) });
        event.preventDefault();
        break;
      case 39: // Arrow Right
        updateFrame({
          playing: !!playing,
          frame: Math.min(frame + 1, props.gameDump.frames.length - 1)
        });
        event.preventDefault();
        break;
    }
  };

  const scale = props.scale;
  const width = (props.width !== -1 ? props.width : dynamicWidth) || 512;
  const height = props.height || 384;
  const scaledWidth = width / scale;
  const scaledHeight = height / scale;

  if (!props.gameDump.frames) {
    return null;
  }

  const result = props.gameDump.result;
  const players = props.gameDump.players;
  const frameData = props.gameDump.frames[frame];
  const demo = props.gameDump.isDemo;

  const playOrPause = playing ? (
    <FABButton mini colored ripple onClick={() => onPause()}>
      <Icon name="pause" />
    </FABButton>
  ) : (
    <FABButton mini colored ripple onClick={() => onPlay()}>
      <Icon name="play_arrow" />
    </FABButton>
  );

  const statuses = demo || !frameData ? null : statuses(frameData, players);

  const field = !frameData ? null : (
    <FieldTag frame={frameData} players={players} width={scaledWidth} height={scaledHeight} scale={scale} />
  );

  let hudTag: JSX.Element | null = null;
  if (!demo) {
    hudTag = <HudTag result={result} players={players} screenHeight={height} frame={frame} />;
  }

  const debugLogs: JSX.Element[] = [];
  if (frameData) {
    let index = 0;
    if (props.error) {
      debugLogs.push(
        <span style={{ color: '#f00' }}>
          {props.error}
          <br />
        </span>
      );
    }
    const each = (actor: SourcerDump | ShotDump) => {
      if (actor.debug) {
        actor.debug.logs.forEach(log =>
          debugLogs.push(
            <span key={`log${++index}`} style={{ color: log.color }}>
              {log.message}
              <br />
            </span>
          )
        );
      }
    };
    frameData.s.forEach(each);
    frameData.b.forEach(each);
  }

  return (
    <div id="root">
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
            {debugLogs}
          </div>
          <svg width={width} height={height} viewBox={`${-width / 2} 0 ${width} ${height}`}>
            <g transform={`scale(${scale}, ${scale})`}>
              {field}
              {hudTag}
            </g>
          </svg>
        </div>
      </div>
      <div className="replay-controller">
        <div className="replay-controller-button">
          <FABButton mini colored ripple onClick={() => onReload()}>
            <Icon name="replay" />
          </FABButton>
        </div>
        <div className="replay-controller-button">{playOrPause}</div>
        <div className="replay-slider">
          <Slider
            min={0}
            max={props.gameDump.frames.length - 1}
            value={frame}
            onChange={e => onFrameChanged(e)}
          />
        </div>
        <div className="replay-controller-frame">
          {frame} <span>(frame) </span>
        </div>
      </div>
      {statuses}
    </div>
  );
};

const statuses = (frame: FrameDump, players: PlayersDump) => {
  const player1Status = status(frame.s[0], players[frame.s[0].i]);
  const player2Status = status(frame.s[1], players[frame.s[1].i]);

  return (
    <Grid>
      <Cell col={6} tablet={4} phone={4}>
        {player1Status}
      </Cell>
      <Cell col={6} tablet={4} phone={4}>
        {player2Status}
      </Cell>
    </Grid>
  );
};

const status = (model: SourcerDump, profile: ProfileDump) => {
  const resource = strings();

  const shield = (model.h / Configs.INITIAL_SHIELD) * 100;

  let backgroundColor: string;
  if (50 < shield) {
    backgroundColor = '#fff';
  } else if (25 < shield) {
    backgroundColor = '#ff8';
  } else {
    backgroundColor = '#f44';
  }

  return (
    <Card shadow={0} style={{ backgroundColor, width: '100%', margin: 'auto' }}>
      <CardTitle>
        <div style={{ height: '32px', width: '16px', marginRight: '8px', backgroundColor: profile.color }} />{' '}
        {profile.name}
      </CardTitle>
      <CardText style={{ paddingTop: '0px' }}>
        <div>
          <div className="status">
            <span className="title">{resource.shield}</span>
            <span className="main">{model.h}</span> / {Configs.INITIAL_SHIELD}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-shield"
              progress={(model.h / Configs.INITIAL_SHIELD) * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.fuel}</span>
            <span className="main">{model.f}</span> / {Configs.INITIAL_FUEL}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-fuel"
              progress={(model.f / Configs.INITIAL_FUEL) * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.temperature}</span>
            <span className="main">{model.t}</span> / {Configs.OVERHEAT_BORDER}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-temperature"
              progress={(model.t / Configs.OVERHEAT_BORDER) * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.ammo}</span>
            <span className="main">{model.a}</span> / {Configs.INITIAL_MISSILE_AMMO}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-ammo"
              progress={(model.a / Configs.INITIAL_MISSILE_AMMO) * 100}
            />
          </div>
        </div>
      </CardText>
    </Card>
  );
};

export default Replayer;
