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

const DEFAULT_PROPS = {
  width: -1,
  height: 384,
  scale: 1.0
};

interface ArenaTagMemo {
  animationFrameHandler: number | null;
  arena: Arena | null;
}

export default function ArenaTag(argProps: ArenaProps) {
  const props = { ...DEFAULT_PROPS, ...argProps };

  const [arena, setArena] = React.useState<Arena | null>(null);
  const [loadedFrame, setLoadedFrame] = React.useState<number>(0);
  const [gameDump, setGameDump] = React.useState<GameDump | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const memo = React.useMemo<ArenaTagMemo>(() => {
    return { animationFrameHandler: null, arena: null };
  }, []);
  memo.arena = arena;

  React.useEffect(() => {
    memo.animationFrameHandler = requestAnimationFrame(() => tick());
    setArena(new Arena(props.players, props.isDemo, props.path));

    return () => {
      if (memo.animationFrameHandler) {
        cancelAnimationFrame(memo.animationFrameHandler);
        memo.animationFrameHandler = null;
      }
      cancel();
    };
  }, []);

  function cancel() {
    if (arena) {
      arena.cancel();
    }
  }

  function onReload() {
    cancel();
    setGameDump(null);
    setArena(new Arena(props.players, props.isDemo, props.path));
    if (!memo.animationFrameHandler) {
      memo.animationFrameHandler = requestAnimationFrame(() => tick());
    }
  }

  function tick() {
    memo.animationFrameHandler = requestAnimationFrame(() => tick());

    if (memo.arena) {
      if (error !== memo.arena.error) {
        setError(memo.arena.error);
      }

      const arenaLoadedFrame = memo.arena.loadedFrame || 0;
      if (loadedFrame !== arenaLoadedFrame) {
        setLoadedFrame(arenaLoadedFrame);
      }

      if (memo.arena.endOfGame) {
        cancelAnimationFrame(memo.animationFrameHandler);
        memo.animationFrameHandler = null;
        setGameDump(memo.arena.game);
      }
    }
  }

  if (!gameDump) {
    return <div>{`Loading ...${loadedFrame}`}</div>;
  }

  return (
    <Replayer
      width={props.width}
      height={props.height}
      scale={props.scale}
      gameDump={gameDump}
      error={error}
      onReload={onReload}
    />
  );
}
