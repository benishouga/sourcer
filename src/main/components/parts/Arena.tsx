import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FieldTag from '../core/FieldTag';
import {GameDump, FieldDump, ResultDump, PlayersDump} from '../../core/Dump';
import Replayer from './Replayer';

var colors = ['#866', '#262', '#c55', '#44b'];

export interface PlayerInfo {
  name: string;
  color: string;
  ai: string;
}

class Standalone {
  worker: Worker;
  game: GameDump = {
    result: null,
    players: null,
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

  cancel() {
    this.endOfGame = true;
    this.worker.terminate();
  }

  constructor(players: PlayerInfo[], path: string = "arena.js") {
    this.worker = new Worker(path);
    this.worker.addEventListener('message', (e: MessageEvent) => {
      switch (e.data.command) {
        case "Players":
          this.game.players = e.data.players;
          break;
        case "PreThink":
          this.thinking = e.data.index;
          this.handler = setTimeout(() => { this.timeout(); }, 400); // 400 milliseconds think timeout
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

interface ArenaProps {
  width?: number;
  height?: number;
  scale?: number;
  players: PlayerInfo[];
  path?: string;
}

interface ArenaStats {
  standalone?: Standalone;
  loadedFrame?: number;
  dynamicWidth?: number;
  gameDump?: GameDump;
}

export default class Arena extends React.Component<ArenaProps, ArenaStats> {
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
    this.state = {};
  }

  onReload() {
    var standalone = this.state.standalone;
    if (standalone) {
      standalone.worker.terminate();
    }
    this.setState({
      gameDump: null,
      standalone: new Standalone(this.props.players, this.props.path)
    });
    if (!this.animationFrameHandler) {
      this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    }
  }

  render() {
    var scale = this.props.scale;
    var width = (this.props.width !== -1 ? this.props.width : this.state.dynamicWidth) || 512;
    var height = this.props.height;
    var scaledWidth = width / scale;
    var scaledHeight = height / scale;

    var standalone = this.state.standalone;
    var loadedFrame = this.state.loadedFrame || 0;

    if (this.state.gameDump) {
      return (
        <Replayer width={this.props.width} height={this.props.height} scale={this.props.scale} gameDump={this.state.gameDump} onReload={this.onReload.bind(this) } />
      );
    } else {
      return (
        <div ref="root">
          <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
            <g transform={"scale(" + scale + ", " + scale + ")"}>
              <text x={0} y={scaledHeight / 2} textAnchor="middle">{"Loading ..." + loadedFrame}</text>
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

    var standalone = this.state.standalone;

    var loadedFrame = standalone && standalone.game.frames.length;
    if (this.state.loadedFrame !== loadedFrame) {
      this.setState({ loadedFrame: loadedFrame });
    }

    if (standalone.endOfGame) {
      if (!this.state.gameDump) {
        cancelAnimationFrame(this.animationFrameHandler)
        this.animationFrameHandler = null;
        this.setState({
          gameDump: standalone.game
        });
      }
    }
  }

  componentDidMount() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    this.setState({ standalone: new Standalone(this.props.players, this.props.path) });
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameHandler)
    this.animationFrameHandler = null;
    this.state.standalone.cancel();
  }
}
