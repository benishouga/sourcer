import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FABButton, Icon, Slider} from 'react-mdl';

import FieldTag from '../core/FieldTag';
import {GameDump, FieldDump, ResultDump} from '../../core/Dump';
import ComponentExplorer from '../../utils/ComponentExplorer';

interface ReplayerProps {
  gameDump?: GameDump;
  width?: number;
  height?: number;
  scale?: number;
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
      playing: true,
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
    this.setState({ frame: 0 });
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

      let playOrPause = this.state.playing ?
        (<FABButton mini colored ripple onClick={this.onPause.bind(this) }><Icon name="pause" /></FABButton>) :
        (<FABButton mini colored ripple onClick={this.onPlay.bind(this) }><Icon name="play_arrow"  /></FABButton>);

      return (
        <div ref="root">
          <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
            <g transform={"scale(" + scale + ", " + scale + ")"}>
              <FieldTag
                field={this.props.gameDump.frames[this.state.frame]}
                result={result}
                players={players}
                width={scaledWidth}
                height={scaledHeight}
                scale={scale}
                hideStatus={true}
                hideController={true} />
            </g>
          </svg>
          <div className="replay-controller">
            <div className="replay-controller-button"><FABButton mini colored ripple onClick={this.onReload.bind(this) }><Icon name="replay" /></FABButton></div>
            <div className="replay-controller-button">{playOrPause}</div>
            <div className="replay-slider"><Slider max={this.props.gameDump.frames.length} value={this.state.frame} onChange={this.onFrameChanged.bind(this) } /></div>
          </div>
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

  componentDidMount() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameHandler)
  }
}
