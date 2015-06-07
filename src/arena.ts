import Field = require('./core/Field');
import Sourcer = require('./core/Sourcer');

declare function postMessage(message: any): void;

onmessage = function(e) {
  console.log("start arena");

  var field = new Field();

  var sourcer1 = new Sourcer(field, 10, 50, e.data.sources[0]);
  var sourcer2 = new Sourcer(field, 30, 50, e.data.sources[1]);

  field.addSourcer(sourcer1);
  field.addSourcer(sourcer2);

  for (var i = 0; i < 100 && !field.isFinish(); i++) {
    field.tick();
    postMessage(field.dump());
  }

};
