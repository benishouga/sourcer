/** @jsx React.DOM */
import * as React from 'react';
import FieldTag from './components/core/FieldTag';
import {FieldDump} from './core/Dump';

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

  constructor() {
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

    var player1 = document.getElementById("player1") as HTMLTextAreaElement;
    var player2 = document.getElementById("player2") as HTMLTextAreaElement;

    this.worker.postMessage({
      sources: [
        { name: "player1", color: "#866", ai: player1.value },
        { name: "player2", color: "#262", ai: player2.value }
      ]
    });
  }
}

interface StandaloneScreenProps {
  width: number;
  height: number;
  scale: number;
}

interface StandaloneScreenStats {
  playing?: boolean;
  frame?: number;
  fieldHistory?: FieldDump[];
  standalone?: Standalone;
  loadedFrame?: number;
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
      standalone: new Standalone()
    });
  }

  onFrameChanged(newFrame: number) {
    this.setState({ frame: newFrame });
  }

  render() {
    var scale = this.props.scale;
    var width = this.props.width;
    var height = this.props.height;
    var scaledWidth = this.props.width / scale;
    var scaledHeight = this.props.height / scale;

    var standalone = this.state.standalone;
    var loadedFrame = this.state.loadedFrame || 0;

    if (this.state.fieldHistory) {
      return (
        <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
          <g transform={"scale(" + scale + ", " + scale + ")"}>
            <FieldTag field={this.state.fieldHistory[this.state.frame]} width={scaledWidth} height={scaledHeight} frameLength={this.state.fieldHistory.length}
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
    this.setState({ standalone: new Standalone() });
  }
}

let screens = document.getElementsByClassName("sourcer-standalone");
for (let i = 0; i < screens.length; i++) {
  let output = screens[i];
  var width = parseInt(output.getAttribute('data-width')) || 512;
  var height = parseInt(output.getAttribute('data-height')) || 384;
  var scale = parseFloat(output.getAttribute('data-scale')) || 1.0;
  React.render(<ScreenTag width={width} height={height} scale={scale} />, output);
}
