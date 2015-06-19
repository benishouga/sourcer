/** @jsx React.DOM */
var React = require('react');

var SourcerTag = React.createClass({
  render: function() {
    var model = this.props.model;
    return (
      <g style={{filter: "url(#f1)"}}>
        <g id="ship" transform={"translate(" + model.position.x + "," + model.position.y + ") scale(" + model.direction + ", -1)"}>
          <rect className="b" transform="rotate(45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
          <rect className="m" transform="rotate(45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill="#000" />
          <rect className="b" transform="rotate(-45, 0, 0)" ry="2" y="-2" x="-16" height="4" width="18" fill="#fff" />
          <rect className="m" transform="rotate(-45, 0, 0)" ry="1" y="-1" x="-15" height="2" width="16" fill="#000" />
          <circle className="b" r="12" cy="0" cx="0" fill="#fff" />
          <circle className="m" r="11" cy="0" cx="0" fill="#000" />
          <circle className="b" r="9" cy="0" cx="0"  fill="#fff" />
          <rect className="b" ry="2" y="-2" x="-16" height="4" width="31" fill="#fff" />
          <rect className="m" ry="1" y="-1" x="-15" height="2" width="29" fill="#000" />
          <circle className="b" r="4" cy="0" cx="4" fill="#fff" />
          <circle className="m" r="3" cy="0" cx="4" fill="#000" />
          <circle className="b" r="1" cy="0" cx="4" fill="#fff" />
        </g>
      </g>
    );
  }
});

module.exports = SourcerTag;
