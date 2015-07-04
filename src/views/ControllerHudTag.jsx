/** @jsx React.DOM */
var React = require('react');
var Configs = require('../core/Configs');

var PADDING = 2;

var ControllerHudTag = React.createClass({
  getInitialState: function(){
    return { drag : false };
  },

  convert: function(e) {
    return e.clientX - e.target.getBoundingClientRect().left;
  },

  onMouseDown: function(e) {
    this.setState({ drag : true });
    var screen = this.props.screen;
    var length = screen.width - PADDING * 2;
    this.onValueChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
  },

  onMouseMove: function(e) {
    if (this.state.drag) {
      var screen = this.props.screen;
      var length = screen.width - PADDING * 2;
      this.onValueChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
    }
  },

  onMouseUp: function(e) {
    this.setState({ drag : false });
  },

  render: function() {
    var frame = this.props.frame;
    var screen = this.props.screen;
    var playing = this.props.playing;
    this.onValueChanged = screen.onValueChanged;

    return (
      <g>
        <g onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} transform={"translate(" + (-screen.width / 2) + "," + (screen.height - ControllerHudTag.height) + ")"}>
          <rect className="b" fill="#fff" width={screen.width - PADDING * 2} height={ControllerHudTag.height - PADDING * 2} x={PADDING} y={PADDING} ry="4" />
          <rect className="m" fill="#000" width={(screen.width - PADDING * 2 - 2) * frame / screen.frameLength} height={ControllerHudTag.height - PADDING * 2 - 2} x={PADDING+1} y={PADDING+1} ry="3" />
        </g>
      </g>
    );
  }
});

ControllerHudTag.height = 16

module.exports = ControllerHudTag;
