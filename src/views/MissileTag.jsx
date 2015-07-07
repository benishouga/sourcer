/** @jsx React.DOM */
var React = require('react');

var MissileTag = React.createClass({
  render: function() {
    var model = this.props.model;
    return (
      <g style={{filter: "url(#f1)"}}>
        <g transform={"translate(" + model.position.x + "," + model.position.y + ") rotate(" + model.direction + ", 0, 0)"}>
          <path d="m -2,-5 c -4,0 -4,10 0,10 3,0 6,-3 6,-5 0,-2 -3,-5 -6,-5 z" fill="#fff" />
          <path d="m 3,0 c 0,2.5 -4,5 -6,3.5 -1.5,-1 -1.5,-6 0,-7 2,-1.5 6,1 6,3.5 z" fill={model.color} />
          <rect ry="2" y="-2" x="-6" height="4" width="12" fill="#fff" />
          <rect ry="1" y="-1" x="-5" height="2" width="10" fill={model.color} />
        </g>
      </g>
    );
  }
});

module.exports = MissileTag;
