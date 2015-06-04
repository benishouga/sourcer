import Field = require('./core/Field');
import Sourcer = require('./core/Sourcer');
import $ = require('jquery');

$(() => {
  var field = new Field();

  var sourcer1 = new Sourcer(field, 10, 50, $("#player").val());
  var sourcer2 = new Sourcer(field, 30, 50, $("#player").val());

  field.addSourcer(sourcer1);
  field.addSourcer(sourcer2);

  for (var i = 0; i < 10 && !field.isFinish(); i++) {
    field.tick();
    console.log(field);
  }
});
