/** @jsx React.DOM */
var React = require('react');

var TreeTag = React.createClass({
  render: function() {
    var model = this.props.model;
    return (
      <g transform={"translate(" + model.x + ",0)"}>
        <rect className="b" fill="#fff" width="4" height={model.height + 2} x="-2" y="-2" ry="2" />
        <rect className="m" fill="#000" width="2" height={model.height}     x="-1" y="-1" ry="1" />
        <circle className="b" r={model.size + 1} cy={model.height} cx="0" fill="#fff" />
        <circle className="m" r={model.size}     cy={model.height} cx="0" fill="#000" />
        <circle className="b" r={model.size - 2} cy={model.height} cx="0" fill="#fff" />
      </g>
    );
  }
});

module.exports = TreeTag;
