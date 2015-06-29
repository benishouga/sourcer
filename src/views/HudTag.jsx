/** @jsx React.DOM */
var React = require('react');
var StatusHudTag = require('./StatusHudTag');
var ControllerHudTag = require('./ControllerHudTag');
var V = require('../core/V');

var HudTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var frameLength = this.props.frameLength;
    var screenWidth = this.props.screenWidth;
    var screenHeight = this.props.screenHeight;
    var onValueChanged = this.props.onValueChanged;

    var hudPosition = [new V(-screenWidth / 2, 0), new V(screenWidth / 2 - StatusHudTag.width, 0)];
    var index = 0;
    var statusHuds = field.sourcers.map(function(b){
      return <StatusHudTag key={b.id + "_hud"} model={b} screenHeight={screenHeight} screenWidth={screenWidth} position={hudPosition[index++]} />
    });

    return (
      <g>
        {statusHuds}
        <ControllerHudTag screenHeight={screenHeight} screenWidth={screenWidth} frame={field.frame} frameLength={frameLength} onValueChanged={onValueChanged} />
      </g>
    );
  }
});

module.exports = HudTag;
