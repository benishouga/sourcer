import * as React from 'react';
import Replayer from './replayer/Replayer';
import { Data, PlayerInfo } from '../../arenaWorker';
import { GameDump } from '../../../core/Dump';

export class Arena {
  public worker: Worker;
  public game: GameDump;
  public error: string | null = null;
  public endOfGame = false;
  public loadedFrame: number | null = null;
  private thinking: number | null = null;
  private timeout = () => {
    const timeoutedName = this.thinking !== null ? this.game.players[this.thinking].name : null;
    const others = Object.keys(this.game.players)
      .map(key => Number(key))
      .filter(key => key !== this.thinking);

    if (others.length === 1) {
      this.game.result = {
        isDraw: false,
        timeout: timeoutedName,
        winnerId: others[0],
        frame: 0
      };
    } else {
      this.game.result = {
        isDraw: true,
        timeout: timeoutedName,
        winnerId: null,
        frame: 0
      };
    }
    this.cancel();
  };
  private handler: NodeJS.Timer | null = null;

  public cancel() {
    this.endOfGame = true;
    this.worker.terminate();
  }

  constructor(players: PlayerInfo[], isDemo: boolean, path: string = 'arenaWorker.js') {
    const start = new Date().getTime();

    this.game = {
      isDemo,
      result: null,
      players: {},
      frames: []
    };

    this.worker = new Worker(path);
    this.worker.addEventListener('message', (e: MessageEvent) => {
      const data: Data = e.data;
      switch (data.command) {
        case 'Next':
          this.worker.postMessage({
            issuedId: data.issuedId
          });
          break;
        case 'Players':
          this.game.players = data.players;
          break;
        case 'PreThink':
          this.thinking = data.id;
          this.handler = setTimeout(() => {
            this.timeout();
          }, 400); // 400 milliseconds think timeout
          break;
        case 'PostThink':
          this.thinking = null;
          if (this.handler) {
            clearTimeout(this.handler);
          }
          this.loadedFrame = data.loadedFrame;
          break;
        case 'Finished':
          this.game.result = data.result;
          break;
        case 'EndOfGame':
          console.log(`endOfGame ${new Date().getTime() - start} ms`);
          this.game.frames = data.frames;
          this.endOfGame = true;
          break;
        case 'Error':
          console.error(data.error);
          this.error = data.error;
          break;
      }
    });
    this.worker.postMessage({
      isDemo,
      sources: players
    });
  }
}

export interface ArenaProps {
  width?: number;
  height?: number;
  scale: number;
  players: PlayerInfo[];
  isDemo: boolean;
  path?: string;
}

export interface ArenaState {
  arena: Arena | null;
  loadedFrame: number;
  dynamicWidth: number;
  gameDump: GameDump | null;
  error: string | null;
}

export default class ArenaTag extends React.Component<ArenaProps, ArenaState> {
  private animationFrameHandler: number | null = null;

  public static defaultProps = {
    width: -1,
    height: 384,
    scale: 1.0
  };

  constructor(props: ArenaProps) {
    super(props);
    this.state = {
      arena: null,
      loadedFrame: 0,
      dynamicWidth: 512,
      gameDump: null,
      error: null
    };
  }

  private cancel() {
    if (this.state.arena) {
      this.state.arena.cancel();
    }
  }

  public onReload() {
    this.cancel();
    this.setState({
      gameDump: null,
      arena: new Arena(this.props.players, this.props.isDemo, this.props.path)
    });
    if (!this.animationFrameHandler) {
      this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    }
  }

  public render() {
    if (this.state.gameDump) {
      return (
        <Replayer
          width={this.props.width}
          height={this.props.height}
          scale={this.props.scale}
          gameDump={this.state.gameDump}
          error={this.state.error}
          onReload={this.onReload.bind(this)}
        />
      );
    }

    const loadedFrame = this.state.loadedFrame;
    return <div ref="root">{`Loading ...${loadedFrame}`}</div>;
  }

  public tick() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());

    const arena = this.state.arena;

    if (arena) {
      const error = arena.error;
      if (this.state.error !== error) {
        this.setState({ error });
      }

      const loadedFrame = arena.loadedFrame || 0;
      if (this.state.loadedFrame !== loadedFrame) {
        this.setState({ loadedFrame });
      }

      if (arena.endOfGame) {
        cancelAnimationFrame(this.animationFrameHandler);
        this.animationFrameHandler = null;
        this.setState({
          gameDump: arena.game
        });
      }
    }
  }

  public componentDidMount() {
    this.animationFrameHandler = requestAnimationFrame(() => this.tick());
    this.setState({ arena: new Arena(this.props.players, this.props.isDemo, this.props.path) });
  }

  public componentWillUnmount() {
    if (this.animationFrameHandler) {
      cancelAnimationFrame(this.animationFrameHandler);
      this.animationFrameHandler = null;
    }
    this.cancel();
  }
}
