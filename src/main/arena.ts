import Field from './core/Field';
import Sourcer from './core/Sourcer';
import Utils from './core/Utils';
import TickEventListener from './core/TickEventListener';

declare function postMessage(message: any): void;

function create(field: Field, source: SourcerSource) {
  "use strict";

  return new Sourcer(
    field, Utils.rand(320) - 160, Utils.rand(320) - 160,
    source.ai, source.name, source.color);
}

onmessage = function(e) {
  var field = new Field();
  var idToIndex: { [key: string]: number } = {};
  var sources = e.data.sources as SourcerSource[];
  sources.forEach((value, index) => {
    var sourcer = create(field, value);
    field.addSourcer(sourcer);
    idToIndex[sourcer.id] = index;
  });

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
    }
  };

  for (var i = 0; i < 2000 && !field.isFinished; i++) {
    field.tick(listener);
    postMessage({
      command: "Frame",
      field: field.dump()
    });
  }
  postMessage({
    command: "EndOfGame"
  });
};
