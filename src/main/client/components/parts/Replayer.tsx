import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

export interface ReplayerState {
  playing?: boolean;
  frame: number;
  dynamicWidth?: number;
}

export default class Replayer extends React.Component<ReplayerProps, ReplayerState> {
  private animationFrameHandler: number | null = null;

  public static defaultProps = {
    gameDump: {},
    width: -1,
    height: 384,
    scale: 1.0
  };

  constructor(props: ReplayerProps) {
    super(props);
    this.state = {
      playing: false,
      frame: 0
    };
  }

  private onPlayPauseToggle() {
    if (this.state.playing) {
      this.onPause();
    } else {
      this.onPlay();
    }
  }

  private updateFrame({ playing, frame }: { playing: boolean; frame: number }): void {
    this.startFrame = frame;
    this.startTime = performance.now();
    this.setState({ playing, frame });
  }

  private onPlay(argFrame?: number) {
    const frame = argFrame !== undefined ? argFrame : this.state.frame;
    const isEndOfFrame = this.props.gameDump.frames.length - 1 <= frame;
    this.updateFrame({ playing: true, frame: isEndOfFrame ? 0 : frame });

    if (!this.animationFrameHandler) {
      this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    }
  }

  private onPause(argFrame?: number) {
    const frame = argFrame !== undefined ? argFrame : this.state.frame;
    this.updateFrame({ frame, playing: false });
    if (this.animationFrameHandler) {
      cancelAnimationFrame(this.animationFrameHandler);
      this.animationFrameHandler = null;
    }
  }

  private onReload() {
    if (this.props.onReload) {
      this.props.onReload();
    } else {
      this.onPlay(0);
    }
  }

  private onFrameChanged(frameEvent: any) {
    this.updateFrame({ playing: !!this.state.playing, frame: ComponentExplorer.extractSliderOnChange(frameEvent) });
  }

  public render() {
    const scale = this.props.scale;
    const width = (this.props.width !== -1 ? this.props.width : this.state.dynamicWidth) || 512;
    const height = this.props.height || 384;
    const scaledWidth = width / scale;
    const scaledHeight = height / scale;

    if (!this.props.gameDump.frames) {
      return null;
    }

    const result = this.props.gameDump.result;
    const players = this.props.gameDump.players;
    const frame = this.props.gameDump.frames[this.state.frame];
    const demo = this.props.gameDump.isDemo;

    const playOrPause = this.state.playing ? (
      <FABButton mini colored ripple onClick={() => this.onPause()}>
        <Icon name="pause" />
      </FABButton>
    ) : (
      <FABButton mini colored ripple onClick={() => this.onPlay()}>
        <Icon name="play_arrow" />
      </FABButton>
    );

    const statuses = demo || !frame ? null : this.statuses(frame, players);

    const field = !frame ? null : (
      <FieldTag frame={frame} players={players} width={scaledWidth} height={scaledHeight} scale={scale} />
    );

    let hudTag: JSX.Element | null = null;
    if (!demo) {
      hudTag = <HudTag result={result} players={players} screenHeight={height} frame={this.state.frame} />;
    }

    const debugLogs: JSX.Element[] = [];
    if (frame) {
      let index = 0;
      if (this.props.error) {
        debugLogs.push(
          <span style={{ color: '#f00' }}>
            {this.props.error}
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
      frame.s.forEach(each);
      frame.b.forEach(each);
    }

    return (
      <div ref="root">
        <div
          className="mdl-card mdl-shadow--2dp"
          style={{ width: '100%', marginBottom: '8px' }}
          onClick={() => this.onPlayPauseToggle()}
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
            <FABButton mini colored ripple onClick={() => this.onReload()}>
              <Icon name="replay" />
            </FABButton>
          </div>
          <div className="replay-controller-button">{playOrPause}</div>
          <div className="replay-slider">
            <Slider
              min={0}
              max={this.props.gameDump.frames.length - 1}
              value={this.state.frame}
              onChange={e => this.onFrameChanged(e)}
            />
          </div>
          <div className="replay-controller-frame">
            {this.state.frame} <span>(frame) </span>
          </div>
        </div>
        {statuses}
      </div>
    );
  }

  private adjustWidth() {
    const refs = this.refs as any;
    const node = ReactDOM.findDOMNode(refs.root) as Element;

    if (this.props.width === -1) {
      this.setState({ dynamicWidth: node.clientWidth });
    }
  }

  private FRAME_MILLS = 1000 / 60;
  private startTime = performance.now();
  private startFrame = 0;
  private tick() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());

    this.adjustWidth();

    if (!this.props.gameDump.frames || !this.state.playing) {
      return;
    }

    const delta = performance.now() - this.startTime;
    const frame = Math.floor(delta / this.FRAME_MILLS);
    const nextFrame = this.startFrame + frame;
    if (nextFrame < this.props.gameDump.frames.length) {
      this.setState({ frame: nextFrame });
    } else if (this.props.gameDump.isDemo) {
      this.updateFrame({ playing: !!this.state.playing, frame: 0 });
    } else {
      this.onPause(this.props.gameDump.frames.length - 1);
    }
  }

  private statuses(frame: FrameDump, players: PlayersDump) {
    const player1Status = this.status(frame.s[0], players[frame.s[0].i]);
    const player2Status = this.status(frame.s[1], players[frame.s[1].i]);

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
  }

  private status(model: SourcerDump, profile: ProfileDump) {
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
  }

  public componentDidMount() {
    this.adjustWidth();
    document.addEventListener('keydown', this.onKeyDown);
  }

  public componentWillUnmount() {
    if (this.animationFrameHandler) {
      cancelAnimationFrame(this.animationFrameHandler);
    }
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 32: // Space
        this.onPlayPauseToggle();
        event.preventDefault();
        break;
      case 37: // Arrow Left
        this.updateFrame({ playing: !!this.state.playing, frame: Math.max(0, this.state.frame - 1) });
        event.preventDefault();
        break;
      case 39: // Arrow Right
        this.updateFrame({
          playing: !!this.state.playing,
          frame: Math.min(this.state.frame + 1, this.props.gameDump.frames.length - 1)
        });
        event.preventDefault();
        break;
    }
  };
}
