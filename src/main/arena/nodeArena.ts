import * as cluster from 'cluster';
import {FieldDump, SourcerDump, GameDump, ResultDump} from '../core/Dump';

import Field from '../core/Field';
import Sourcer from '../core/Sourcer';
import Utils from '../core/Utils';
import TickEventListener from '../core/TickEventListener';

interface ArenaMessage {
  command: Command;
  data: any;
}

enum Command {
  PRE_THINK, POST_THINK, FRAME, FINISHED, END_OF_GAME, LOG
}

export function arena(players: SourcerSource[]): Promise<GameDump> {
  'use strict';

  cluster.setupMaster({ exec: __dirname + '/nodeArena.js' });
  let child = cluster.fork();

  return new Promise<GameDump>((resolve, reject) => {

    let game: GameDump = {
      result: null,
      frames: []
    };
    let currentThink: SourcerSource = null;
    let thinkTimer: NodeJS.Timer = null;
    let gameTimer: NodeJS.Timer = null;
    let thinkTimeout = () => {
      child.kill();
      clearTimeout(gameTimer);
      resolve(game);
    };
    gameTimer = setTimeout(() => {
      child.kill();
      clearTimeout(thinkTimer);
      resolve(game);
    }, 20000); // 20 seconds

    let resolved: boolean = false;
    child.on('message', (message: ArenaMessage) => {
      if (resolved) { return; }

      switch (message.command) {
        case Command.PRE_THINK:
          currentThink = players[message.data.index];
          thinkTimer = setTimeout(thinkTimeout, 10); // 10 milliseconds think timeout
          break;
        case Command.POST_THINK:
          currentThink = null;
          clearTimeout(thinkTimer);
          break;
        case Command.FRAME:
          game.frames.push(message.data.field);
          break;
        case Command.FINISHED:
          game.result = message.data.result;
          break;
        case Command.END_OF_GAME:
          resolved = true;
          resolve(game);
          setTimeout(() => {
            child.kill();
            clearTimeout(gameTimer);
            clearTimeout(thinkTimer);
          });
          break;
        case Command.LOG:
          let player = players[message.data.index];
          console.log.apply(console, message.data.messages.unshift(player.name));
          break;
      }
    });

    setTimeout(() => {
      child.send({ sourcers: players });
    });
  });
}

function create(field: Field, source: SourcerSource) {
  'use strict';
  return new Sourcer(
    field, Utils.rand(320) - 160, Utils.rand(160) + 80,
    source.ai, source.name, source.color);
}

if (cluster.isWorker) {
  process.on('message', (message: { sourcers: SourcerSource[] }) => {
    let field = new Field();
    let idToIndex: { [key: string]: number } = {};
    message.sourcers.forEach((value, index) => {
      let sourcer = create(field, value);
      field.addSourcer(sourcer);
      idToIndex[sourcer.id] = index;
    });

    let listener: TickEventListener = {
      onPreThink: function(sourcerId: string) {
        process.send({
          command: Command.PRE_THINK,
          data: { index: idToIndex[sourcerId] }
        });
      },
      onPostThink: function(sourcerId: string) {
        process.send({
          command: Command.POST_THINK,
          data: { index: idToIndex[sourcerId] }
        });
      },
      onFrame: (field: FieldDump) => {
        process.send({
          command: Command.FRAME,
          data: { field: field }
        });
      },
      onFinished: (result: ResultDump) => {
        process.send({
          command: Command.FINISHED,
          data: { result: result }
        });
      },
      onEndOfGame: () => {
        process.send({
          command: Command.END_OF_GAME
        });
      },
      onLog: (sourcerId: string, ...messages: any[]) => {
        process.send({
          command: Command.LOG,
          data: {
            index: idToIndex[sourcerId],
            messages: messages
          }
        });
      }
    };

    while (!field.isFinished) {
      field.tick(listener);
    }
    process.exit(0);
  });

}
