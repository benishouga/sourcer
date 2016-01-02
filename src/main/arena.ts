import Field from './core/Field';
import Sourcer from './core/Sourcer';
import Utils from './core/Utils';
import TickEventListener from './core/TickEventListener';
import {FieldDump, ResultDump} from './core/Dump';

declare function postMessage(message: any): void;

function create(field: Field, source: SourcerSource) {
  "use strict";

  return new Sourcer(
    field, Utils.rand(320) - 160, Utils.rand(160) + 80,
    source.ai, source.name, source.color);
}

onmessage = function(e) {
  var sources = e.data.sources as SourcerSource[];
  var idToIndex: { [key: string]: number } = {};
  var listener: TickEventListener = {
    onPreThink: function(sourcerId: string) {
      postMessage({
        command: "PreThink",
        index: idToIndex[sourcerId]
      });
    },
    onPostThink: function(sourcerId: string) {
      postMessage({
        command: "PostThink",
        index: idToIndex[sourcerId]
      });
    },
    onFrame: (field: FieldDump) => {
      postMessage({
        command: "Frame",
        field: field
      });
    },
    onFinished: (result: ResultDump) => {
      postMessage({
        command: "Finished",
        result: result
      });
    },
    onEndOfGame: () => {
      postMessage({
        command: "EndOfGame"
      });
    },
    onLog: (sourcerId: string, ...messages: any[]) => {
      console.log("onLog");
      postMessage({
        command: "Log",
        index: idToIndex[sourcerId],
        messages: messages
      });
    }
  };

  var field = new Field();
  sources.forEach((value, index) => {
    var sourcer = create(field, value);
    field.addSourcer(sourcer);
    idToIndex[sourcer.id] = index;
  });

  for (var i = 0; i < 2000 && !field.isFinished; i++) {
    field.tick(listener);
  }
};
