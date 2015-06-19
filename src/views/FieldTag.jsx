/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');
var MissileTag = require('./MissileTag');
var FxTag = require('./FxTag');
var TreeTag = require('./TreeTag');
var StatusHudTag = require('./StatusHudTag');
var ControllerHudTag = require('./ControllerHudTag');
var Utils = require('../core/Utils');
var V = require('../core/V');

var FieldTag = React.createClass({
  getInitialState: function(){
    var trees = [];
    for(var i = 0; i < 10; i++) {
      trees.push({
        id: "tree" + i,
        x: Utils.rand(512) - 256,
        height: Utils.rand(360) + 24,
        size: Utils.rand(16) + 8
      });
    }
    return {
      trees : trees
    };
  },

  render: function() {
    var field = this.props.field;
    var length = this.props.length;
    var width = this.props.width;
    var height = this.props.height;
    var center = 0;
    var maxTop = Number.MIN_VALUE;
    var maxLeft = Number.MAX_VALUE;
    var maxRight = Number.MIN_VALUE;
    var sumX = 0;

    var onValueChanged = this.props.onValueChanged;

    var trees = this.state.trees.map(function(b) {
      return <TreeTag key={b.id} model={b} />
    });

    var sourcers = field.sourcers.map(function(b){
      sumX += b.position.x;
      maxTop = Math.max(maxTop, b.position.y);
      maxRight = Math.max(maxRight, b.position.x);
      maxLeft = Math.min(maxLeft, b.position.x);
      return <SourcerTag key={b.id} model={b} />
    });

    if (sourcers.length != 0) {
      center = sumX / sourcers.length;
    }

    if (field.shots) {
      var shots = field.shots.map(function(b){
        if (b.type === "Missile") {
          return <MissileTag key={b.id} model={b} />
        } else {
          return <LaserTag key={b.id} model={b} />
        }
      });
    }

    var fxs = field.fxs.map(function(b) {
      return <FxTag key={b.id} model={b} />
    });
    var hudPosition = [new V(-width / 2, 0), new V(width / 2 - StatusHudTag.width, 0)];
    var index = 0;
    var statusHuds = field.sourcers.map(function(b){
      return <StatusHudTag key={b.id + "_hud"} model={b} screenHeight={height} screenWidth={width} position={hudPosition[index++]} />
    });

    var controller = <ControllerHudTag screenHeight={height} screenWidth={width} frame={field.frame} length={length} onValueChanged={onValueChanged} />;

    return (
      <g>
        <g transform={"translate(" + (-center) + "," + (height - 24) +") scale(1, -1)"}>
          <defs dangerouslySetInnerHTML={{__html:'<filter id="f1" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="0.5" dy="-0.5" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'}} />
          {trees}
          <g>
            {sourcers}
            {shots}
          </g>
          {fxs}
        </g>
        {statusHuds}
        {controller}
    </g>
    );
  }
});

module.exports = FieldTag;
