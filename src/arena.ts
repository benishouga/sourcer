import Field = require('./core/Field');
import Sourcer = require('./core/Sourcer');
import Utils = require('./core/Utils');

declare function postMessage(message: any): void;

onmessage = function(e) {
  var field = new Field();

  var sourcer1 = new Sourcer(field, Utils.rand(320), Utils.rand(320) - 160, e.data.sources[0]);
  var sourcer2 = new Sourcer(field, Utils.rand(320), Utils.rand(320) - 160, e.data.sources[1]);

  field.addSourcer(sourcer1);
  field.addSourcer(sourcer2);

  for (var i = 0; i < 1000 && !field.isFinish(); i++) {
    field.tick();
    postMessage({
      command: "Frame",
      field: field.dump()
    });
  }
  postMessage({
    command: "EndOfGame"
  });
};
