/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');
var MissileTag = require('./MissileTag');

var FieldTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var width = this.props.width;
    var height = this.props.height;
    var center = 0;
    var maxTop = Number.MIN_VALUE;
    var maxLeft = Number.MAX_VALUE;
    var maxRight = Number.MIN_VALUE;
    var sumX = 0;

    // TODO: ID を振って、key に設定する
    var sourcers = field.sourcers.map(function(b){
      sumX += b.position.x;
      maxTop = Math.max(maxTop, b.position.y);
      maxRight = Math.max(maxRight, b.position.x);
      maxLeft = Math.min(maxLeft, b.position.x);
      return <SourcerTag model={b} />
    });

    if (sourcers.length != 0) {
      center = sumX / sourcers.length;
    }

    console.log(center, maxTop, maxRight, maxLeft);

    if (field.shots) {
      var shots = field.shots.map(function(b){
        if (b.type === "Missile") {
          return <MissileTag model={b} />
        } else {
          return <LaserTag model={b} />
        }
      });
    }
    return (
      <g transform={"translate(" + (-center) + "," + (height - 24) +") scale(1, -1)"}>
        {sourcers}
        {shots}
      </g>
    );
  }
});

module.exports = FieldTag;
