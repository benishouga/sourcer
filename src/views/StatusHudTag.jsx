/** @jsx React.DOM */
var React = require('react');
var Configs = require('../core/Configs');

var PADDING = 2;

var StatusHudTag = React.createClass({
  render: function() {
    var model = this.props.model;
    var position = this.props.position;

    return (
      <g transform={"translate(" + position.x + "," + position.y + ")"}>
        <rect className="b" fill="#ccc" width={StatusHudTag.width} height={PADDING * 2 + 19} x="0" y="0" ry="2" />

        <rect className="b" fill="#fff" width={StatusHudTag.width - PADDING * 2} height="4" x={PADDING} y={PADDING} ry="2" />
        <rect className="b" fill="#00c" width={(StatusHudTag.width - PADDING * 2 - 2) * model.shield / Configs.INITIAL_SHIELD} height="2" x={PADDING + 1} y={PADDING+1} ry="1" />

        <rect className="b" fill="#fff" width={StatusHudTag.width - PADDING * 2} height="4" x={PADDING} y={PADDING + 5} ry="2" />
        <rect className="b" fill="#f80" width={(StatusHudTag.width - PADDING * 2 - 2) * model.fuel / Configs.INITIAL_FUEL} height="2" x={PADDING + 1} y={PADDING+6} ry="1" />

        <rect className="b" fill="#fff" width={StatusHudTag.width - PADDING * 2} height="4" x={PADDING} y={PADDING + 10} ry="2" />
        <rect className="b" fill="#f00" width={(StatusHudTag.width - PADDING * 2 - 2) * model.temperature / Configs.OVERHEAT_BORDER} height="2" x={PADDING + 1} y={PADDING+11} ry="1" />

        <rect className="b" fill="#fff" width={StatusHudTag.width - PADDING * 2} height="4" x={PADDING} y={PADDING + 15} ry="2" />
        <rect className="b" fill="#080" width={(StatusHudTag.width - PADDING * 2 - 2) * model.missileAmmo / Configs.INITIAL_MISSILE_AMMO} height="2" x={PADDING + 1} y={PADDING+16} ry="1" />
      </g>
    );
  }
});

StatusHudTag.width = 128;

module.exports = StatusHudTag;
