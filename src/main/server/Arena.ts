import * as cluster from 'cluster';
import { FieldDump, SourcerDump, GameDump, ResultDump, PlayersDump } from '../core/Dump';

import Field from '../core/Field';
import Sourcer from '../core/Sourcer';
import Utils from '../core/Utils';
import TickEventListener from '../core/TickEventListener';
import SandboxedScriptLoader from '../core/SandboxedScriptLoader';

export type Data = PlayersCommand | PreThinkCommand | PostThinkCommand | FinishedCommand | EndOfGameCommand | LogCommand;

interface PlayersCommand {
  command: Command.CONTESTANTS;
  data: {
    players: PlayersDump;
  };
}

interface PreThinkCommand {
  command: Command.PRE_THINK;
  data: {
    id: number;
  };
}

interface PostThinkCommand {
  command: Command.POST_THINK;
  data: {
    id: number;
    loadedFrame: number;
  };
}

interface FinishedCommand {
  command: Command.FINISHED;
  data: {
    result: ResultDump;
  };
}

interface EndOfGameCommand {
  command: Command.END_OF_GAME;
  data: {
    frames: FieldDump[];
  };
}

interface LogCommand {
  command: Command.LOG;
  data: {
    id: number;
    messages: any[];
  };

}

enum Command {
  PRE_THINK, POST_THINK, FINISHED, END_OF_GAME, LOG, CONTESTANTS
}

const GAME_TIMEOUT_MILLS = 15 * 1000; // 15 sec
const THINK_TIMEOUT = 20; // 20 msec
const DELAY_FOR_POSTMESSAGE = 10 * 1000; // 10 sec
const DELAY_FOR_END_OF_GAME = 10 * 1000; // 10 sec

export function arena(players: SourcerSource[]): Promise<GameDump> {
  const id = players.map(p => p.account).join(',');
  const start = new Date().getTime();
  console.log('arena', id);

  cluster.setupMaster({ exec: __dirname + '/Arena' });
  const child = cluster.fork();

  return new Promise<GameDump>((resolve, reject) => {
    const game: GameDump = {
      isDemo: false,
      result: null,
      players: {},
      frames: []
    };
    let currentThink: number | null = null;
    let thinkTimer: NodeJS.Timer | null = null;
    const thinkTimeout = () => {
      const timeoutedName = currentThink !== null ? game.players[currentThink].name : null;
      const others = Object.keys(game.players).map(key => Number(key)).filter(key => key !== currentThink);

      if (others.length === 1) {
        game.result = {
          isDraw: false,
          timeout: timeoutedName,
          winnerId: others[0],
          frame: 0
        };
      } else {
        game.result = {
          isDraw: true,
          timeout: timeoutedName,
          winnerId: null,
          frame: 0
        };
      }
      process.kill(child.process.pid);
      clearTimeout(gameTimer);
      resolved = true;
      resolve(game);
    };
    const gameTimer = setTimeout(() => {
      if (thinkTimer) {
        clearTimeout(thinkTimer);
      }
      process.kill(child.process.pid);
      resolved = true;
      resolve(game);
    }, GAME_TIMEOUT_MILLS);

    let resolved: boolean = false;
    child.on('message', (message: Data) => {
      if (resolved) { return; }

      switch (message.command) {
        case Command.CONTESTANTS:
          game.players = message.data.players;
          break;
        case Command.PRE_THINK:
          currentThink = message.data.id;
          thinkTimer = setTimeout(thinkTimeout, THINK_TIMEOUT);
          break;
        case Command.POST_THINK:
          currentThink = null;
          if (thinkTimer) {
            clearTimeout(thinkTimer);
          }
          break;
        case Command.FINISHED:
          console.log('arena', id, 'Command.FINISHED', new Date().getTime() - start);
          game.result = message.data.result;
          break;
        case Command.END_OF_GAME:
          console.log('arena', id, 'Command.END_OF_GAME', new Date().getTime() - start);
          game.frames = message.data.frames;
          resolved = true;
          resolve(game);
          clearTimeout(gameTimer);
          setTimeout(() => {
            console.log('arena', id, 'finish', new Date().getTime() - start);
            process.kill(child.process.pid);
          }, DELAY_FOR_END_OF_GAME);
          break;
        case Command.LOG:
          const player = players[message.data.id];
          console.log.apply(console, message.data.messages.unshift(player.account));
          break;
      }
    });

    setTimeout(() => {
      child.send({ sourcers: players });
    }, 0);
  });
}

if (cluster.isWorker) {

  process.on('message', (message: { sourcers: SourcerSource[] }) => {
    if (!process.send) { return; }
    const field = new Field(new SandboxedScriptLoader());
    message.sourcers.forEach((value, index) => {
      field.registerSourcer(value.ai, value.account, value.name, value.color);
    });

    const players = field.players();
    process.send({
      command: Command.CONTESTANTS,
      data: { players }
    });

    const id = message.sourcers.map(p => p.account).join(',');
    const start = new Date().getTime();
    console.log('arena', id, 'forked');

    const frames: FieldDump[] = [];

    const listener: TickEventListener = {
      onImmediate: (callback: () => void) => {
        setImmediate(callback);
      },
      onPreThink: (sourcerId: number) => {
        if (!process.send) { return; }
        process.send({
          command: Command.PRE_THINK,
          data: { id: sourcerId }
        });
      },
      onPostThink: (sourcerId: number) => {
        if (!process.send) { return; }
        process.send({
          command: Command.POST_THINK,
          data: { id: sourcerId }
        });
      },
      onFrame: (fieldDump: FieldDump) => {
        frames.push(fieldDump);
      },
      onFinished: (result: ResultDump) => {
        console.log('arena', id, 'onFinished', new Date().getTime() - start);
        if (!process.send) { return; }
        process.send({
          command: Command.FINISHED,
          data: { result }
        });
      },
      onEndOfGame: () => {
        console.log('arena', id, 'onEndOfGame', new Date().getTime() - start);
        if (!process.send) { return; }
        process.send({
          command: Command.END_OF_GAME,
          data: { frames }
        });
      },
      onLog: (sourcerId: number, ...messages: any[]) => {
        if (!process.send) { return; }
        process.send({
          command: Command.LOG,
          data: {
            messages,
            id: sourcerId
          }
        });
      }
    };

    setTimeout(() => {
      field.compile(listener, () => {
        let count = 0;
        const next = () => {
          field.tick(listener, () => {
            if (count < 10000 && !field.isFinished) {
              count++;
              next();
            } else {
              setTimeout(() => {
                console.log('arena', id, 'process.exit');
                process.exit(0);
              }, DELAY_FOR_POSTMESSAGE);
            }
          });
        };
        next();
      });
    }, 0);
  });
}
