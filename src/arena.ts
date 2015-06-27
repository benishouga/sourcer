import Field = require('./core/Field');
import Sourcer = require('./core/Sourcer');
import Utils = require('./core/Utils');
import TickEventListener = require('./core/TickEventListener');

declare function postMessage(message: any): void;

onmessage = function(e) {
  var field = new Field();

  var sourcer1 = new Sourcer(field, Utils.rand(320) - 160, Utils.rand(320) - 160, e.data.sources[0]);
  var sourcer2 = new Sourcer(field, Utils.rand(320) - 160, Utils.rand(320) - 160, e.data.sources[1]);

  field.addSourcer(sourcer1);
  field.addSourcer(sourcer2);

  var listener: TickEventListener = {
    onPreThink: function(sourcerId: string) {
      postMessage({
        command: "PreThink",
        index: sourcer1.id == sourcerId ? 0 : 1
      });
    },
    onPostThink: function(sourcerId: string) {
      postMessage({
        command: "PostThink",
        index: sourcer1.id == sourcerId ? 0 : 1
      });
    }
  };

  for (var i = 0; i < 2000 && !field.isFinish(); i++) {
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
