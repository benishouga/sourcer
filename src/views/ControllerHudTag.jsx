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
    var screenWidth = this.props.screenWidth;
    var length = screenWidth - PADDING * 2;
    this.onValueChanged(this.convert(e) / length * this.props.frameLength);
  },

  onMouseMove: function(e) {
    if (this.state.drag) {
      var screenWidth = this.props.screenWidth;
      var length = screenWidth - PADDING * 2;
      this.onValueChanged(this.convert(e) / length * this.props.frameLength);
    }
  },

  onMouseUp: function(e) {
    this.setState({ drag : false });
  },

  render: function() {
    var frame = this.props.frame;
    var frameLength = this.props.frameLength;
    var screenWidth = this.props.screenWidth;
    var screenHeight = this.props.screenHeight;

    this.onValueChanged = this.props.onValueChanged;

    return (
      <g onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} transform={"translate(" + (-screenWidth / 2) + "," + (screenHeight - ControllerHudTag.height) + ")"}>
        <rect className="b" fill="#fff" width={screenWidth - PADDING * 2} height={ControllerHudTag.height - PADDING * 2} x={PADDING} y={PADDING} ry="4" />
        <rect className="m" fill="#000" width={(screenWidth - PADDING * 2 - 2) * frame / frameLength} height={ControllerHudTag.height - PADDING * 2 - 2} x={PADDING+1} y={PADDING+1} ry="3" />
      </g>
    );
  }
});

ControllerHudTag.height = 16

module.exports = ControllerHudTag;
