/** @jsx React.DOM */
var React = require('react');
var FieldTag = require('./views/FieldTag');

var worker = new Worker("dist/arena.js");
var log = [];
var frame = 0;

worker.onmessage = function(e) {
  log.push(e.data);
};

worker.postMessage({
  sources: [$("#player").val(), $("#player").val()]
});

var ScreenTag = React.createClass({
  getInitialState: function(){
    return { field: { sourcers: [] } };
  },
  render: function() {
    return (
      <svg width="512" height="512" viewBox="-256 0 512 512">
        <FieldTag field={this.state.field} width="512" height="512" />
      </svg>
    );
  },
  tick : function(){
    requestAnimationFrame(this.tick);
    if(frame < log.length) {
      this.setState({
        field: log[frame]
      });
      frame++;
    }
  },
  componentWillMount : function(){
    requestAnimationFrame( this.tick );
  }
});

var output = document.getElementById("screen");
React.render(<ScreenTag width="512" height="512" /> , output);
