/** @jsx React.DOM */
var React = require('react');

var SourcerTag = React.createClass({
  render: function() {
    var model = this.props.model;
    return (
      <g id="ship" transform={"translate(" + model.position.x + "," + model.position.y + ") scale(" + model.direction + ", -1) translate(-16, -16)"}>
        <rect class="b" transform="rotate(45, 16, 16)" ry="2" y="14" x="0" height="4" width="18" fill="#fff" />
        <rect class="m" transform="rotate(45, 16, 16)" ry="1" y="15" x="1" height="2" width="16" fill="#000" />
        <rect class="b" transform="rotate(-45, 16, 16)" ry="2" y="14" x="0" height="4" width="18" fill="#fff" />
        <rect class="m" transform="rotate(-45, 16, 16)" ry="1" y="15" x="1" height="2" width="16" fill="#000" />
        <circle class="b" r="12" cy="16" cx="16" fill="#fff" />
        <circle class="m" r="11" cy="16" cx="16" id="path4136" fill="#000" />
        <circle class="b" r="9" cy="16" cx="16" id="path4140" fill="#fff" />
        <rect class="b" ry="2" y="14" x="0" height="4" width="31" fill="#fff" />
        <rect class="m" ry="1" y="15" x="1" height="2" width="29" fill="#000" />
        <circle class="b" r="4" cy="16" cx="20" fill="#fff" />
        <circle class="m" r="3" cy="16" cx="20" fill="#000" />
        <circle class="b" r="1" cy="16" cx="20" fill="#fff" />
      </g>
    );
  }
});

module.exports = SourcerTag;
