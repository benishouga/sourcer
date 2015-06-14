/** @jsx React.DOM */
var React = require('react');
var FieldTag = require('./views/FieldTag');

var worker = new Worker("dist/arena.js");
var frames = [];
var frame = 0;
var endOfGame = false;

worker.onmessage = function(e) {
  if(e.data.command === "EndOfGame") {
    endOfGame = true;
  } else {
    frames.push(e.data.field);
  }
};

worker.postMessage({
  sources: [$("#player").val(), $("#player").val()]
});

var ScreenTag = React.createClass({
  render: function() {
    if(endOfGame) {
      return (
        <svg width="512" height="512" viewBox="-256 0 512 512">
          <FieldTag field={this.state.field} width="512" height="512" />
        </svg>
      );
    } else {
      return <p>Loading...</p>
    }
  },

  tick : function(){
    requestAnimationFrame(this.tick);

    if(endOfGame) {
      if(frame < frames.length) {
        this.setState({
          field: frames[frame]
        });
        frame++;
      }
    }
  },
  componentWillMount : function(){
    requestAnimationFrame( this.tick );
  }
});

var output = document.getElementById("screen");
React.render(<ScreenTag width="512" height="512" /> , output);
