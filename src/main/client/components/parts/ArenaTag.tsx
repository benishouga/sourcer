import React, { useState, useEffect, useRef, useCallback } from 'react';
import Replayer from './Replayer';
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

const ArenaTag: React.FC<ArenaProps> = (props) => {
  const [arena, setArena] = useState<Arena | null>(null);
  const [loadedFrame, setLoadedFrame] = useState<number>(0);
  const [dynamicWidth, setDynamicWidth] = useState<number>(512);
  const [gameDump, setGameDump] = useState<GameDump | null>(null);
  const [error, setError] = useState<string | null>(null);

  const animationFrameHandler = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (arena) {
      arena.cancel();
    }
  }, [arena]);

  const onReload = useCallback(() => {
    cancel();
    setGameDump(null);
    setArena(new Arena(props.players, props.isDemo, props.path));
    if (!animationFrameHandler.current) {
      animationFrameHandler.current = requestAnimationFrame(() => tick());
    }
  }, [cancel, props.players, props.isDemo, props.path]);

  const tick = useCallback(() => {
    animationFrameHandler.current = requestAnimationFrame(() => tick());

    if (arena) {
      const error = arena.error;
      if (error !== error) {
        setError(error);
      }

      const loadedFrame = arena.loadedFrame || 0;
      if (loadedFrame !== loadedFrame) {
        setLoadedFrame(loadedFrame);
      }

      if (arena.endOfGame) {
        cancelAnimationFrame(animationFrameHandler.current!);
        animationFrameHandler.current = null;
        setGameDump(arena.game);
      }
    }
  }, [arena]);

  useEffect(() => {
    animationFrameHandler.current = requestAnimationFrame(() => tick());
    setArena(new Arena(props.players, props.isDemo, props.path));

    return () => {
      if (animationFrameHandler.current) {
        cancelAnimationFrame(animationFrameHandler.current);
        animationFrameHandler.current = null;
      }
      cancel();
    };
  }, [props.players, props.isDemo, props.path, tick, cancel]);

  if (gameDump) {
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

  return <div>{`Loading ...${loadedFrame}`}</div>;
};

export default ArenaTag;
