/** @jsx React.DOM */
var React = require('react');

var LaserTag = React.createClass({
  render: function() {
    return (
      <g id="aaa" transform="translate(16, 16) rotate(45, 8, 8) scale(1, 1)">
        <rect class="b" fill="#fff" width="14" height="4" x="1" y="6" ry="2" />
        <rect class="m" fill="#000" width="12" height="2" x="2" y="7" ry="1" />
      </g>
    );
  }
});

module.exports = LaserTag;
