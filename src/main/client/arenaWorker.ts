import Field from '../core/Field';
import Sourcer from '../core/Sourcer';
import Utils from '../core/Utils';
import TickEventListener from '../core/TickEventListener';
import { PlayersDump, FrameDump, ResultDump } from '../core/Dump';
import ExposedScriptLoader from '../core/ExposedScriptLoader';

export interface PlayerInfo {
  name: string;
  color: string;
  source: string;
}

export interface InitialParameter {
  isDemo: boolean;
  sources: PlayerInfo[];
}

export type Data = NextCommand | PlayersCommand | PreThinkCommand | PostThinkCommand | FinishedCommand | EndOfGameCommand | ErrorCommand;

interface NextCommand {
  command: 'Next';
  issuedId: number;
}

interface PlayersCommand {
  command: 'Players';
  players: PlayersDump;
}

interface PreThinkCommand {
  command: 'PreThink';
  id: number;
}

interface PostThinkCommand {
  command: 'PostThink';
  id: number;
  loadedFrame: number;
}

interface FinishedCommand {
  command: 'Finished';
  result: ResultDump;
}

interface EndOfGameCommand {
  command: 'EndOfGame';
  frames: FrameDump[];
}

interface ErrorCommand {
  command: 'Error';
  error: string;
}

declare function postMessage(message: Data): void;

let issueId = 0;
const issue = () => issueId++;
const callbacks: { [id: number]: () => void; } = {};

onmessage = ({ data }) => {
  if (data.issuedId !== undefined) {
    callbacks[data.issuedId]();
    delete callbacks[data.issuedId];
    return;
  }
  const initialParameter = data as InitialParameter;
  const isDemo = initialParameter.isDemo as boolean;
  const players = initialParameter.sources as PlayerInfo[];
  const frames: FrameDump[] = [];
  const listener: TickEventListener = {
    waitNextTick: async () => {
      return new Promise<void>((resolve) => {
        const issuedId = issue();
        callbacks[issuedId] = resolve;
        postMessage({
          issuedId,
          command: 'Next'
        });
      });
    },
    onPreThink: (sourcerId: number) => {
      postMessage({
        command: 'PreThink',
        id: sourcerId
      });
    },
    onPostThink: (sourcerId: number) => {
      postMessage({
        command: 'PostThink',
        id: sourcerId,
        loadedFrame: frames.length
      });
    },
    onFrame: (fieldDump: FrameDump) => {
      frames.push(fieldDump);
    },
    onFinished: (result: ResultDump) => {
      postMessage({
        result,
        command: 'Finished'
      });
    },
    onEndOfGame: () => {
      postMessage({
        frames,
        command: 'EndOfGame'
      });
    },
    onError: (error: string) => {
      postMessage({
        error,
        command: 'Error'
      });
    }
  };

  const field = new Field(ExposedScriptLoader, isDemo);
  players.forEach((value, index) => {
    field.registerSourcer(value.source, value.name, value.name, value.color);
  });

  postMessage({
    command: 'Players',
    players: field.players()
  });

  setTimeout(async () => {
    await field.compile(listener);
    for (let count = 0; count < 10000 && !field.isFinished; count++) {
      await field.tick(listener);
    }
  }, 0);
};
