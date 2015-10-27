/** @jsx React.DOM */
import * as React from 'react';
import FieldTag from './components/core/FieldTag';
import {FieldDump} from './core/Dump';

class Standalone {
  worker = new Worker("dist/arena.js");
  frames: FieldDump[] = [];
  frame = 0;
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

var standalone = new Standalone();

class ScreenTag extends React.Component<{ width: number; height: number; scale: number }, { field?: FieldDump; playing?: boolean }> {
  constructor() {
    super();
    this.state = { field: null, playing: true };
  }
  onPlay() {
    this.setState({ playing: true });
  }

  onPause() {
    this.setState({ playing: false });
  }

  onReload() {
    if (standalone) {
      standalone.worker.terminate();
    }
    standalone = new Standalone();
  }

  render() {
    var scale = this.props.scale;
    var width = this.props.width;
    var height = this.props.height;
    var scaledWidth = this.props.width / scale;
    var scaledHeight = this.props.height / scale;

    if (standalone.endOfGame) {
      var onFrameChanged = (newFrame: number) => {
        standalone.frame = newFrame;
      };
      return (
        <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
          <g transform={"scale(" + scale + ", " + scale + ")"}>
            <FieldTag field={this.state.field} width={scaledWidth} height={scaledHeight} frameLength={standalone.frames.length}
              playing={this.state.playing} onFrameChanged={onFrameChanged} onPlay={() => this.onPlay() } onPause={() => this.onPause() } onReload={() => this.onReload() } />
            </g>
          </svg>
      );
    } else {
      return (<p>Loading...</p>);
    }
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    if (standalone.endOfGame && standalone.frame < standalone.frames.length) {
      this.setState({
        field: standalone.frames[standalone.frame]
      });

      if (this.state.playing) {
        standalone.frame++;
      }
    }
  }

  componentDidMount() {
    requestAnimationFrame(() => this.tick());
  }
}

let screens = document.getElementsByClassName("sourcer-standalone");
for (let i = 0; i < screens.length; i++) {
  let output = screens[i];
  var width = parseInt(output.getAttribute('data-width')) || 512;
  var height = parseInt(output.getAttribute('data-height')) || 384;
  var scale = parseInt(output.getAttribute('data-scale')) || 1.0;
  React.render(<ScreenTag width={width} height={height} scale={scale} />, output);
}
