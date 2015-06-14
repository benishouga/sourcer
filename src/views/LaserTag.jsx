/** @jsx React.DOM */
var React = require('react');

var LaserTag = React.createClass({
  render: function() {
    var model = this.props.model;
    return (
      <g transform={"translate(" + model.position.x + "," + model.position.y + ") rotate(" + model.direction + ", 0, 0)"}>
        <rect className="b" fill="#fff" width="14" height="4" x="-7" y="-2" ry="2" />
        <rect className="m" fill="#000" width="12" height="2" x="-6" y="-1" ry="1" />
      </g>
    );
  }
});

module.exports = LaserTag;
