import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FABButton, Icon, Slider, Grid, Cell, Card, CardTitle, CardText, ProgressBar} from 'react-mdl';

import Configs from '../../core/Configs';

import {strings} from '../resources/Strings';

import FieldTag from '../core/FieldTag';
import {GameDump, FieldDump, ResultDump, ProfileDump, SourcerDump} from '../../core/Dump';
import ComponentExplorer from '../../utils/ComponentExplorer';
import ReadyHudTag from '../core/ReadyHudTag';

interface ReplayerProps {
  gameDump?: GameDump;
  width?: number;
  height?: number;
  scale?: number;
  onReload?: () => void;
}

interface ReplayerStats {
  playing?: boolean;
  frame?: number;
  dynamicWidth?: number;
}

export default class Replayer extends React.Component<ReplayerProps, ReplayerStats> {
  animationFrameHandler: number;

  static propTypes = {
  };

  static defaultProps = {
    gameDump: {},
    width: -1,
    height: 384,
    scale: 1.0
  };

  constructor(props: ReplayerProps) {
    super();
    this.state = {
      playing: false,
      frame: 0
    };
  }

  onPlay() {
    this.setState({ playing: true });
  }

  onPause() {
    this.setState({ playing: false });
  }

  onReload() {
    if (this.props.onReload) {
      this.props.onReload();
    } else {
      this.setState({ frame: 0 });
    }
  }

  onFrameChanged(frameEvent: any) {
    this.setState({
      frame: ComponentExplorer.extractSliderOnChange(frameEvent)
    });
  }

  render() {
    var scale = this.props.scale;
    var width = (this.props.width !== -1 ? this.props.width : this.state.dynamicWidth) || 512;
    var height = this.props.height;
    var scaledWidth = width / scale;
    var scaledHeight = height / scale;

    if (this.props.gameDump.frames) {
      let result = this.props.gameDump.result && this.props.gameDump.result.frame <= this.state.frame && this.props.gameDump.result;
      let players = this.props.gameDump.players;
      let frame = this.props.gameDump.frames[this.state.frame];

      let playOrPause = this.state.playing ?
        (<FABButton mini colored ripple onClick={this.onPause.bind(this) }><Icon name="pause" /></FABButton>) :
        (<FABButton mini colored ripple onClick={this.onPlay.bind(this) }><Icon name="play_arrow"  /></FABButton>);

      let player1Status = this.status(frame.s[0], players[frame.s[0].i]);
      let player2Status = this.status(frame.s[1], players[frame.s[1].i]);

      return (
        <div ref="root">
          <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
            <g transform={"scale(" + scale + ", " + scale + ")"}>
              <FieldTag
                field={frame}
                result={result}
                players={players}
                width={scaledWidth}
                height={scaledHeight}
                scale={scale}
                hideStatus={true}
                hideController={true} />
              {this.state.frame === 0 && !this.state.playing ? <ReadyHudTag screenHeight={scaledHeight} player1={players[0]} player2={players[1]} /> : null}
            </g>
          </svg>
          <div className="replay-controller">
            <div className="replay-controller-button"><FABButton mini colored ripple onClick={this.onReload.bind(this) }><Icon name="replay" /></FABButton></div>
            <div className="replay-controller-button">{playOrPause}</div>
            <div className="replay-slider"><Slider min={0} max={this.props.gameDump.frames.length - 1} value={this.state.frame} onChange={this.onFrameChanged.bind(this) } /></div>
          </div>
          <Grid>
            <Cell col={6} tablet={6}>{player1Status}</Cell>
            <Cell col={6} tablet={6}>{player2Status}</Cell>
          </Grid>
        </div>
      );
    }
  }

  tick() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());

    let refs = this.refs as any;
    const node = ReactDOM.findDOMNode(refs.root);

    if (this.props.width === -1) {
      this.setState({ dynamicWidth: node.clientWidth })
    }

    if (this.props.gameDump.frames && this.state.playing) {
      var nextFrame = this.state.frame + 1;
      if (nextFrame < this.props.gameDump.frames.length) {

        this.setState({ frame: nextFrame });
      }
    }
  }

  status(model: SourcerDump, profile: ProfileDump) {
    let resource = strings();

    let shield = (model.h / Configs.INITIAL_SHIELD) * 100;

    let backgroundColor: string
    if (50 < shield) {
      backgroundColor = '#fff';
    } else if (25 < shield) {
      backgroundColor = '#ff8';
    } else {
      backgroundColor = '#f44';
    }

    return (
      <Card shadow={0} style={{ width: '100%', margin: 'auto', backgroundColor: backgroundColor }}>
        <CardTitle><div style={{ height: '32px', width: '16px', marginRight: '8px', backgroundColor: profile.color }} /> {profile.name}</CardTitle>
        <CardText style={{ paddingTop: '0px' }}>
          <div>
            <div className="status"><span className="title">{resource.shield}</span><span className="main">{model.h}</span> / {Configs.INITIAL_SHIELD}</div>
            <div><ProgressBar className="progress-status progress-shield" progress={(model.h / Configs.INITIAL_SHIELD) * 100} /></div>
          </div>
          <div>
            <div className="status"><span className="title">{resource.fuel}</span><span className="main">{model.f}</span> / {Configs.INITIAL_FUEL}</div>
            <div><ProgressBar className="progress-status progress-fuel" progress={(model.f / Configs.INITIAL_FUEL) * 100} /></div>
          </div>
          <div>
            <div className="status"><span className="title">{resource.temperature}</span><span className="main">{model.t}</span> / {Configs.OVERHEAT_BORDER}</div>
            <div><ProgressBar className="progress-status progress-temperature" progress={(model.t / Configs.OVERHEAT_BORDER) * 100} /></div>
          </div>
          <div>
            <div className="status"><span className="title">{resource.ammo}</span><span className="main">{model.a}</span> / {Configs.INITIAL_MISSILE_AMMO}</div>
            <div><ProgressBar className="progress-status progress-ammo" progress={(model.a / Configs.INITIAL_MISSILE_AMMO) * 100} /></div>
          </div>
        </CardText>
      </Card>
    );
  }

  componentDidMount() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameHandler)
  }
}
