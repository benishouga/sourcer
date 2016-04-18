import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FieldTag from '../core/FieldTag';
import {GameDump, FieldDump, ResultDump} from '../../core/Dump';
import Match from '../../service/Match';

interface ReplayerProps {
  matchId: string;
  width?: number;
  height?: number;
  scale?: number;
}

interface ReplayerStats {
  playing?: boolean;
  frame?: number;
  result?: ResultDump;
  fieldHistory?: FieldDump[];
  dynamicWidth?: number;
}

export default class Replayer extends React.Component<ReplayerProps, ReplayerStats> {
  animationFrameHandler: number;

  static propTypes = {
  };

  static defaultProps = {
    width: -1,
    height: 384,
    scale: 1.0
  };

  constructor() {
    super();
    this.state = { playing: true, frame: 0 };
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

  onFrameChanged(newFrame: number) {
    this.setState({
      frame: newFrame,
    });
  }

  render() {
    var scale = this.props.scale;
    var width = (this.props.width !== -1 ? this.props.width : this.state.dynamicWidth) || 512;
    var height = this.props.height;
    var scaledWidth = width / scale;
    var scaledHeight = height / scale;

    if (this.state.fieldHistory) {
      let result = this.state.result && this.state.result.frame <= this.state.frame && this.state.result;

      return (
        <div ref="root">
          <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
            <g transform={"scale(" + scale + ", " + scale + ")"}>
              <FieldTag field={this.state.fieldHistory[this.state.frame]} result={result} width={scaledWidth} height={scaledHeight} scale={scale} frameLength={this.state.fieldHistory.length}
                playing={this.state.playing} onFrameChanged={this.onFrameChanged.bind(this) } onPlay={this.onPlay.bind(this) } onPause={this.onPause.bind(this) } onReload={this.onReload.bind(this) } />
            </g>
          </svg>
        </div>
      );
    } else {
      return (
        <div ref="root">
          <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
            <g transform={"scale(" + scale + ", " + scale + ")"}>
              <text x={0} y={scaledHeight / 2} textAnchor="middle">{"Loading ..."}</text>
            </g>
          </svg>
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

    if (this.state.fieldHistory && this.state.playing) {
      var nextFrame = this.state.frame + 1;
      if (nextFrame < this.state.fieldHistory.length) {

        this.setState({ frame: nextFrame });
      }
    }
  }

  componentDidMount() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    Match.select(this.props.matchId).then((gameDump: GameDump) => {
      this.setState({
        result: gameDump.result,
        fieldHistory: gameDump.frames
      });
    });
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameHandler)
  }
}
