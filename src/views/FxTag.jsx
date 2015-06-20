/** @jsx React.DOM */
var React = require('react');

var FxTag = React.createClass({
  render: function() {
    var model = this.props.model;
    var frame = model.frame;
    return (
      <g style={{filter: "url(#f1)"}}>
        <g transform={"translate(" + model.position.x + "," + model.position.y + ")"}>
          <circle className="b" r={frame / 2 + 6} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.length) + ")"} />
          <circle className="m" r={frame / 2 + 5} cy="0" cx="0" fill={"rgba(0,0,0," + (255 * frame / model.length) + ")"} />
          <circle className="b" r={frame / 2 + 3} cy="0" cx="0" fill={"rgba(255,255,255," + (255 * frame / model.length) + ")"} />
        </g>
      </g>
    );
  }
});

module.exports = FxTag;