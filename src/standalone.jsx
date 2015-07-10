/** @jsx React.DOM */
var React = require('react');
var FieldTag = require('./views/FieldTag');

var Standalone = function() {
  this.worker = new Worker("dist/arena.js");
  this.frames = [];
  this.frame = 0;
  this.endOfGame = false;
  this.thinking = null;
  this.timeout = function() {
    console.log("timeout", thinking);
    this.endOfGame = true;
    this.worker.terminate();
  };
  this.handler = null;
  var that = this;
  this.worker.addEventListener('message', function(e) {
    if(e.data.command === "PreThink") {
      that.thinking = e.data.index;
      that.handler = setTimeout(function() { that.timeout(); }, 10); // 10 milliseconds think timeout
    } else if(e.data.command === "PostThink") {
      that.thinking = null;
      clearTimeout(that.handler);
    } else if(e.data.command === "EndOfGame") {
      that.endOfGame = true;
    } else {
      that.frames.push(e.data.field);
    }
  });
  this.worker.postMessage({
    sources: [
      { name: "player1", color: "#866", ai: $("#player1").val() },
      { name: "player2", color: "#262", ai: $("#player2").val() }
    ]
  });
};

var standalone = new Standalone();

var ScreenTag = React.createClass({
  getInitialState: function(){
    return {
      playing: true
    };
  },

  onPlay: function() {
    this.setState({ playing: true });
  },

  onPause: function() {
    this.setState({ playing: false });
  },

  onReload: function() {
    if (standalone) {
      standalone.worker.terminate();
    }
    standalone = new Standalone();
  },

  render: function() {
    var width = this.props.width;
    var height = this.props.height;

    if(standalone.endOfGame) {
      var onFrameChanged = function(newFrame) {
        standalone.frame = newFrame;
      };
      return (
        <svg width={width} height={height} viewBox={(-width / 2) + " 0 " + width + " " + height}>
          <FieldTag field={this.state.field} width={width} height={height} frameLength={standalone.frames.length}
            playing={this.state.playing} onFrameChanged={onFrameChanged} onPlay={this.onPlay} onPause={this.onPause} onReload={this.onReload} />
        </svg>
      );
    } else {
      return <p>Loading...</p>
    }
  },

  tick : function(){
    requestAnimationFrame(this.tick);

    if (standalone.endOfGame && standalone.frame < standalone.frames.length) {
      this.setState({
        field: standalone.frames[standalone.frame]
      });

      if (this.state.playing) {
        standalone.frame++;
      }
    }
  },

  componentWillMount : function(){
    requestAnimationFrame( this.tick );
  }
});

var output = document.getElementById("screen");
React.render(<ScreenTag width="512" height="384" /> , output);
