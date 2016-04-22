/** @jsx React.DOM */
import * as React from 'react';
import { render } from 'react-dom'
import FieldTag from './components/core/FieldTag';
import {GameDump, FieldDump, ResultDump, MembersDump} from './core/Dump';

var colors = ['#866', '#262', '#c55', '#44b'];

class Standalone {
  worker = new Worker("dist/arena.js");
  game: GameDump = {
    result: null,
    members: null,
    frames: []
  };
  endOfGame = false;
  thinking: number = null;
  timeout = () => {
    console.log("timeout", this.thinking);
    this.endOfGame = true;
    this.worker.terminate();
  };
  handler: NodeJS.Timer = null;

  constructor(playerIds: string[]) {
    var players = playerIds.map((value, index) => {
      var player = document.getElementById(value) as HTMLTextAreaElement;
      return { name: value, color: colors[index], ai: player.value }
    });
    this.worker.addEventListener('message', (e: MessageEvent) => {
      switch (e.data.command) {
        case "Members":
          this.game.members = e.data.members;
          break;
        case "PreThink":
          this.thinking = e.data.index;
          this.handler = setTimeout(() => { this.timeout(); }, 10); // 10 milliseconds think timeout
          break;
        case "PostThink":
          this.thinking = null;
          clearTimeout(this.handler);
          break;
        case "Frame":
          this.game.frames.push(e.data.field);
          break;
        case "Finished":
          this.game.result = e.data.result;
          break;
        case "EndOfGame":
          this.endOfGame = true;
          break;
        case "Log":
          var player = players[e.data.index];
          console.log.apply(console, e.data.messages.unshift(player.name));
          break;
      }
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
  result?: ResultDump;
  members?: MembersDump;
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
    var standalone = this.state.standalone;

    this.setState({
      frame: newFrame,
      result: standalone.game.result && standalone.game.result.frame <= newFrame && standalone.game.result
    });
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
            <FieldTag
              field={this.state.fieldHistory[this.state.frame]}
              members={this.state.members}
              result={this.state.result}
              width={scaledWidth}
              height={scaledHeight}
              scale={scale}
              frameLength={this.state.fieldHistory.length}
              playing={this.state.playing}
              onFrameChanged={this.onFrameChanged.bind(this) }
              onPlay={this.onPlay.bind(this) }
              onPause={this.onPause.bind(this) }
              onReload={this.onReload.bind(this) }
              />
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

    var loadedFrame = standalone && standalone.game.frames.length;
    if (this.state.loadedFrame !== loadedFrame) {
      this.setState({ loadedFrame: loadedFrame });
    }

    if (standalone.endOfGame) {
      if (!this.state.fieldHistory) {
        this.setState({
          fieldHistory: standalone.game.frames,
          frame: 0
        });
      } else if (this.state.playing) {
        var nextFrame = this.state.frame + 1;
        if (nextFrame < this.state.fieldHistory.length) {

          this.setState({
            frame: nextFrame,
            result: standalone.game.result && standalone.game.result.frame <= nextFrame && standalone.game.result
          });
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
    render(<ScreenTag width={width} height={height} scale={scale} playerIds={playerIdsText.split(',') } output={output} />, output);
  }
}
