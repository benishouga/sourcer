/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');
var MissileTag = require('./MissileTag');
var TreeTag = require('./TreeTag');
var Utils = require('../core/Utils');

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
    var width = this.props.width;
    var height = this.props.height;
    var center = 0;
    var maxTop = Number.MIN_VALUE;
    var maxLeft = Number.MAX_VALUE;
    var maxRight = Number.MIN_VALUE;
    var sumX = 0;

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

    var trees = this.state.trees.map(function(b) {
      return <TreeTag key={b.id} model={b} />
    });

    return (
      <g transform={"translate(" + (-center) + "," + (height - 24) +") scale(1, -1)"}>
        {trees}
        {sourcers}
        {shots}
      </g>
    );
  }
});

module.exports = FieldTag;
