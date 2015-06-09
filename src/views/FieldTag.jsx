/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');

var FieldTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var width = this.props.width;
    var height = this.props.height;
    var sourcers = field.sourcers.map(function(b){
      return <SourcerTag model={b} />
    });
    return (
      <g transform={"translate(1," + height +") scale(1, -1)"}>
        {sourcers}
        <rect class="m" ry="1" y="15" x="1" height="2" width="16" transform="rotate(0, 16, 16)" fill="#000" />
      </g>
    );
  }
});

module.exports = FieldTag;
