/** @jsx React.DOM */
var React = require('react');
var StatusHudTag = require('./StatusHudTag');
var ControllerHudTag = require('./ControllerHudTag');
var ResultHudTag = require('./ResultHudTag');
var V = require('../core/V');

var HudTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var screen = this.props.screen;

    var hudPosition = [new V(-screen.width / 2, 0), new V(screen.width / 2 - StatusHudTag.width, 0)];
    var index = 0;
    var statusHuds = field.sourcers.map(function(b){
      return <StatusHudTag key={b.id + "_hud"} model={b} screen={screen} position={hudPosition[index++]} />
    });

    var resultHudTag = null;
    if(field.result) {
      resultHudTag = <ResultHudTag result={field.result} screen={screen} />
    }

    return (
      <g>
        {statusHuds}
        {resultHudTag}
        <ControllerHudTag frame={field.frame} screen={screen} />
      </g>
    );
  }
});

module.exports = HudTag;
