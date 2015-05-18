var Field = require('./main/Field');
var Sourcer = require('./main/Sourcer');

var field = new Field();
field.addSourcer(new Sourcer(field, 0, 0, ""));
field.tick();
field.tick();
field.tick();
field.tick();
field.tick();
