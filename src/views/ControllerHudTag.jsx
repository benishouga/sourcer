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
    var length = screen.width - PADDING * 2 - this.progressLeft;
    this.onFrameChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
  },

  onMouseMove: function(e) {
    if (this.state.drag) {
      var screen = this.props.screen;
      var length = screen.width - PADDING * 2 - this.progressLeft;
      this.onFrameChanged(Math.floor(this.convert(e) / length * this.props.screen.frameLength));
    }
  },

  onMouseUp: function(e) {
    this.setState({ drag : false });
  },

  render: function() {
    var frame = this.props.frame;
    var screen = this.props.screen;
    this.onFrameChanged = screen.onFrameChanged;

    var playOrStop = screen.playing ? (<g onClick={screen.onPause} transform={"translate(" + (-screen.width / 2) + "," + (screen.height - ControllerHudTag.height) + ")"}>
      <circle r="8" cy="8" cx="8" fill="#fff" />
      <circle r="7" cy="8" cx="8" fill="#000" />
      <circle r="5" cy="8" cx="8" fill="#fff" />
      <rect ry="0.5" y="5" x="5.5" height="6" width="2" fill="#000" />
      <rect ry="0.5" y="5" x="8.5" height="6" width="2" fill="#000" />
    </g>) : (<g onClick={screen.onPlay} transform={"translate(" + (-screen.width / 2) + "," + (screen.height - ControllerHudTag.height) + ")"}>
        <circle fill="#fff" cx="8" cy="8" r="8" />
        <circle fill="#000" cx="8" cy="8" r="7" />
        <circle fill="#fff" cx="8" cy="8" r="5" />
        <path fill="#000" d="m 5.9218744,5.5214845 0,4.9999995 c -0.00168,0.180296 0.080036,0.326383 0.2167942,0.421874 0.1059966,0.08984 0.3899239,0.08869 0.5351557,0.01172 L 11.003906,8.4550781 c 0.16293,-0.1113478 0.239497,-0.246851 0.24218,-0.4316396 -0.0043,-0.2080202 -0.06772,-0.3161707 -0.24217,-0.435546 l -4.3300779,-2.5 C 6.3904484,4.9194131 6.1517574,5.0466129 6.0813464,5.1113293 5.9980061,5.1869727 5.9272825,5.2586905 5.9218744,5.5214845 Z" />
      </g>);
    this.progressLeft = 16;

    return (
      <g>
        {playOrStop}
        <g onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} transform={"translate(" + (-screen.width / 2 + this.progressLeft) + "," + (screen.height - ControllerHudTag.height) + ")"}>
          <rect className="b" fill="#fff" width={screen.width - PADDING * 2 - this.progressLeft} height={ControllerHudTag.height - PADDING * 2} x={PADDING} y={PADDING} ry="4" />
          <rect className="m" fill="#000" width={(screen.width - PADDING * 2 - 2 - this.progressLeft) * frame / screen.frameLength} height={ControllerHudTag.height - PADDING * 2 - 2} x={PADDING+1} y={PADDING+1} ry="3" />
        </g>
      </g>
    );
  }
});

ControllerHudTag.height = 16

module.exports = ControllerHudTag;
