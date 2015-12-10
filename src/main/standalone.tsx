/** @jsx React.DOM */
import * as React from 'react';
import FieldTag from './components/core/FieldTag';
import {FieldDump} from './core/Dump';

var colors = ['#866', '#262', '#c55', '#44b'];

class Standalone {
  worker = new Worker("dist/arena.js");
  frames: FieldDump[] = [];
  endOfGame = false;
  thinking: number = null;
  timeout = () => {
    console.log("timeout", this.thinking);
    this.endOfGame = true;
    this.worker.terminate();
  };
  handler: NodeJS.Timer = null;

  constructor(playerIds: string[]) {
    this.worker.addEventListener('message', (e: MessageEvent) => {
      if (e.data.command === "PreThink") {
        this.thinking = e.data.index;
        this.handler = setTimeout(() => { this.timeout(); }, 10); // 10 milliseconds think timeout
      } else if (e.data.command === "PostThink") {
        this.thinking = null;
        clearTimeout(this.handler);
      } else if (e.data.command === "EndOfGame") {
        this.endOfGame = true;
      } else {
        this.frames.push(e.data.field);
      }
    });
    var players = playerIds.map((value, index) => {
      var player = document.getElementById(value) as HTMLTextAreaElement;
      return { name: value, color: colors[index], ai: player.value }
    });
    this.worker.postMessage({ sources: players });
  }
}

interface StandaloneScreenProps {
  width: number;
  height: number;
  scale: number;
  playerIds: string[];
  output: Element;
}

interface StandaloneScreenStats {
  playing?: boolean;
  frame?: number;
  fieldHistory?: FieldDump[];
  standalone?: Standalone;
  loadedFrame?: number;
  dynamicWidth?: number;
}

class ScreenTag extends React.Component<StandaloneScreenProps, StandaloneScreenStats> {
  constructor() {
    super();
    this.state = { playing: true };
  }
  onPlay() {
    this.setState({ playing: true });
  }

  onPause() {
    this.setState({ playing: false });
  }

  onReload() {
    var standalone = this.state.standalone;
    if (standalone) {
      standalone.worker.terminate();
    }
    this.setState({
      fieldHistory: null,
      standalone: new Standalone(this.props.playerIds)
    });
  }

  onFrameChanged(newFrame: number) {
    this.setState({ frame: newFrame });
  }

  render() {
    var scale = this.props.scale;
    var width = (this.props.width !== -1 ? this.props.width : this.state.dynamicWidth) || 512;
    var height = this.props.height;
    var scaledWidth = width / scale;
    var scaledHeight = height / scale;

    var standalone = this.state.standalone;
    var loadedFrame = this.state.loadedFrame || 0;

    if (this.state.fieldHistory) {
      return (
        <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
          <g transform={"scale(" + scale + ", " + scale + ")"}>
            <FieldTag field={this.state.fieldHistory[this.state.frame]} width={scaledWidth} height={scaledHeight} scale={scale} frameLength={this.state.fieldHistory.length}
              playing={this.state.playing} onFrameChanged={(frame) => this.onFrameChanged(frame) } onPlay={() => this.onPlay() } onPause={() => this.onPause() } onReload={() => this.onReload() } />
            </g>
          </svg>
      );
    } else {

      return (
        <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
          <g transform={"scale(" + scale + ", " + scale + ")"}>
            <text x={0} y={scaledHeight / 2} textAnchor="middle">{"Loading ..." + loadedFrame}</text>
            </g>
          </svg>
      );
    }
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    if (this.props.width === -1) {
      this.setState({ dynamicWidth: this.props.output.clientWidth })
    }

    var standalone = this.state.standalone;

    var loadedFrame = standalone && standalone.frames.length;
    if (this.state.loadedFrame !== loadedFrame) {
      this.setState({ loadedFrame: loadedFrame });
    }

    if (standalone.endOfGame) {
      if (!this.state.fieldHistory) {
        this.setState({
          fieldHistory: standalone.frames,
          frame: 0
        });
      } else if (this.state.playing) {
        var nextFrame = this.state.frame + 1;
        if (nextFrame < this.state.fieldHistory.length) {
          this.setState({ frame: nextFrame });
        }
      }
    }
  }

  componentDidMount() {
    requestAnimationFrame(() => this.tick());
    this.setState({ standalone: new Standalone(this.props.playerIds) });
  }
}

let screens = document.getElementsByClassName("sourcer-standalone");
for (let i = 0; i < screens.length; i++) {
  let output = screens[i];
  var width = parseInt(output.getAttribute('data-width')) || -1;
  var height = parseInt(output.getAttribute('data-height')) || 384;
  var scale = parseFloat(output.getAttribute('data-scale')) || 1.0;
  var playerIdsText = output.getAttribute('data-players');
  if (playerIdsText) {
    React.render(<ScreenTag width={width} height={height} scale={scale} playerIds={playerIdsText.split(',') } output={output} />, output);
  }
}
