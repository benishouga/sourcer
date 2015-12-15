import * as cluster from 'cluster';
import {FieldDump, SourcerDump} from '../core/Dump';

import Field from '../core/Field';
import Sourcer from '../core/Sourcer';
import Utils from '../core/Utils';
import TickEventListener from '../core/TickEventListener';

interface MatchResult {
  frames: FieldDump[];
}

interface ArenaMessage {
  command: Command;
  data: any;
}

enum Command {
  ENTER_FRAME, PRE_THINK, POST_THINK, END_OF_GAME
}

export function arena(players: SourcerSource[]): Promise<MatchResult> {
  'use strict';

  cluster.setupMaster({ exec: __dirname + '/nodeArena.js' });
  let child = cluster.fork();

  return new Promise<MatchResult>((resolve, reject) => {

    let match: MatchResult = {
      frames: []
    };
    let currentThink: number = null;
    let timer: NodeJS.Timer = null;
    let timeout = () => {
      child.kill('SIGTERM');
      resolve(match);
    };

    child.on('message', (message: ArenaMessage) => {
      switch (message.command) {
        case Command.ENTER_FRAME:
          match.frames.push(message.data.field);
          break;
        case Command.PRE_THINK:
          currentThink = message.data.index;
          timer = setTimeout(timeout, 10); // 10 milliseconds think timeout
          break;
        case Command.POST_THINK:
          currentThink = null;
          clearTimeout(timer);
          break;
        case Command.END_OF_GAME:
          resolve(match);
          break;
      }
    });

    setTimeout(() => {
      child.send({ sourcers: players });
    });
  });
}

if (cluster.isWorker) {
  process.on('message', (message: { sourcers: SourcerSource[] }) => {
    function create(field: Field, source: SourcerSource) {
      'use strict';
      return new Sourcer(
        field, Utils.rand(320) - 160, Utils.rand(320) - 160,
        source.ai, source.name, source.color);
    }

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
      }
    };
    for (let i = 0; i < 2000 && !field.isFinished; i++) {
      field.tick(listener);
      process.send({
        command: Command.ENTER_FRAME,
        data: { field: field.dump() }
      });
    }
    process.send({
      command: Command.END_OF_GAME
    });
  });

}
