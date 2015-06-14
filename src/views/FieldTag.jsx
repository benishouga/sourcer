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

    // TODO: ID を振って、key に設定する
    var sourcers = field.sourcers.map(function(b){
      return <SourcerTag model={b} />
    });
    if(field.shots) {
      var shots = field.shots.map(function(b){
        if(b.type === "Missile") {
          return <MissileTag model={b} />
        } else {
          return <LaserTag model={b} />
        }
      });
    }
    return (
      <g transform={"translate(0," + (height - 24) +") scale(1, -1)"}>
        {sourcers}
        {shots}
      </g>
    );
  }
});

module.exports = FieldTag;
