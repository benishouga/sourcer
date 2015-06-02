/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');

var FieldTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var sourcers = field.sourcers.map(function(b){
      return <SourcerTag model={b} />
    });
    return (
      <g>
        {sourcers}
      </g>
    );
  }
});

module.exports = FieldTag;
