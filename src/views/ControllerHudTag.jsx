/** @jsx React.DOM */
var React = require('react');
var Configs = require('../core/Configs');
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
    this.onValueChanged(this.convert(e) / length * this.props.length);
  },

  onMouseMove: function(e) {
    if (this.state.drag) {
      this.onValueChanged(this.convert(e));
    }
  },

  onMouseUp: function(e) {
    this.setState({ drag : false });
  },

  render: function() {
    var frame = this.props.frame;
    var length = this.props.length;
    var screenWidth = this.props.screenWidth;
    var screenHeight = this.props.screenHeight;

    this.onValueChanged = this.props.onValueChanged;

    return (
      <g onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} transform={"translate(" + (-screenWidth / 2) + "," + (screenHeight - ControllerHudTag.height) + ")"}>
        <rect className="b" fill="#fff" width={screenWidth - PADDING * 2} height={ControllerHudTag.height - PADDING * 2} x={PADDING} y={PADDING} ry="2" />
        <rect className="m" fill="#000" width={(screenWidth - PADDING * 2 - 2) * frame / length} height={ControllerHudTag.height - PADDING * 2 - 2} x={PADDING+1} y={PADDING+1} ry="1" />
      </g>
    );
  }
});

ControllerHudTag.height = 12

module.exports = ControllerHudTag;
