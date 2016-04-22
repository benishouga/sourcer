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

const GAME_TIMEOUT = 200000; // 120 sec
const THINK_TIMEOUT = 100; // 120 sec

export function arena(players: SourcerSource[]): Promise<GameDump> {
  'use strict';
  let id = players.map(p => p.name).join(',');
  let start = new Date().getTime();
  console.log('arena', id);

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
      console.log('arena', id, 'thinkTimer', new Date().getTime() - start);
      child.kill();
      clearTimeout(gameTimer);
      resolve(game);
    };
    gameTimer = setTimeout(() => {
      console.log('arena', id, 'gameTimer', new Date().getTime() - start);
      child.kill();
      clearTimeout(thinkTimer);
      resolve(game);
    }, GAME_TIMEOUT);

    let resolved: boolean = false;
    child.on('message', (message: ArenaMessage) => {
      if (resolved) { return; }

      switch (message.command) {
        // case Command.PRE_THINK:
        //   currentThink = players[message.data.index];
        //   thinkTimer = setTimeout(thinkTimeout, THINK_TIMEOUT);
        //   break;
        // case Command.POST_THINK:
        //   currentThink = null;
        //   clearTimeout(thinkTimer);
        //   break;
        // case Command.FRAME:
        //   game.frames.push(message.data.field);
        //   break;
        case Command.FINISHED:
          console.log('arena', id, 'Command.FINISHED', new Date().getTime() - start);
          game.result = message.data.result;
          break;
        case Command.END_OF_GAME:
          console.log('arena', id, 'Command.END_OF_GAME', new Date().getTime() - start);
          resolved = true;
          game.frames = message.data.frames;
          resolve(game);
          setTimeout(() => {
            console.log('arena', id, 'finish', new Date().getTime() - start);
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

    let id = message.sourcers.map(p => p.name).join(',');
    let start = new Date().getTime();
    console.log('arena', id, 'forked');

    let frames: FieldDump[] = [];
    let listener: TickEventListener = {
      onPreThink: function(sourcerId: string) {
        // process.send({
        //   command: Command.PRE_THINK,
        //   data: { index: idToIndex[sourcerId] }
        // });
      },
      onPostThink: function(sourcerId: string) {
        // process.send({
        //   command: Command.POST_THINK,
        //   data: { index: idToIndex[sourcerId] }
        // });
      },
      onFrame: (field: FieldDump) => {
        frames.push(field);
        // process.send({
        //   command: Command.FRAME,
        //   data: { field: field }
        // });
      },
      onFinished: (result: ResultDump) => {
        console.log('arena', id, 'onFinished', new Date().getTime() - start);
        process.send({
          command: Command.FINISHED,
          data: { result: result }
        });
      },
      onEndOfGame: () => {
        console.log('arena', id, 'onEndOfGame', new Date().getTime() - start);
        process.send({
          command: Command.END_OF_GAME,
          data: { frames: frames }
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
    console.log('arena', id, 'process.exit');
    process.exit(0);
  });

}
