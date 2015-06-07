import $ = require('jquery');

$(() => {
  var worker = new Worker("dist/arena.js");
  worker.onmessage = function(e) {
    console.log(e.data);
  };
  worker.postMessage({
    sources: [$("#player").val(), $("#player").val()]
  });

});
