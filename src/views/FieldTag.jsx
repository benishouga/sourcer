/** @jsx React.DOM */
var React = require('react');
var SourcerTag = require('./SourcerTag');
var LaserTag = require('./LaserTag');
var MissileTag = require('./MissileTag');
var FxTag = require('./FxTag');
var HudTag = require('./HudTag');
var BackgroundTag = require('./BackgroundTag');
var Utils = require('../core/Utils');

var FieldTag = React.createClass({
  render: function() {
    var field = this.props.field;
    var frameLength = this.props.frameLength;
    var width = this.props.width;
    var height = this.props.height;
    var center = 0;
    var maxLeft = Number.MAX_VALUE;
    var maxRight = -Number.MAX_VALUE;
    var maxTop = -Number.MAX_VALUE;
    var sumX = 0;

    var onValueChanged = this.props.onValueChanged;

    var sourcers = field.sourcers.map(function(b){
      sumX += b.position.x;
      maxTop = Math.max(maxTop, b.position.y);
      maxRight = Math.max(maxRight, b.position.x);
      maxLeft = Math.min(maxLeft, b.position.x);
      return <SourcerTag key={b.id} model={b} />
    });

    if (sourcers.length != 0) {
      center = sumX / sourcers.length;
    }

    var screenLeft = maxLeft - 100;
    var screenRight = maxRight + 100;
    var screenTop = maxTop + 100;

    if(width > screenRight - screenLeft) {
      screenRight = center + width / 2;
      screenLeft = center - width / 2;
    }

    var screenScale = Math.min(1, Math.min(height / screenTop, width / (screenRight - screenLeft)));

    var viewLeft = (screenLeft - center) / screenScale + center;
    var viewRight = (screenRight - center) / screenScale + center;
    var viewTop = (height - 24) / screenScale;

    if (field.shots) {
      var shots = field.shots.map(function(b){
        var x = b.position.x;
        var y = b.position.y;
        if(viewLeft < x && x < viewRight && y < viewTop) {
          if (b.type === "Missile") {
            return <MissileTag key={b.id} model={b} />
          } else {
            return <LaserTag key={b.id} model={b} />
          }
        }
      });
    }

    var fxs = field.fxs.map(function(b) {
      return <FxTag key={b.id} model={b} />
    });
    var filter = '<filter id="f1" x="-1" y="-1" width="300%" height="300%">' +
      '  <feOffset result="offOut" in="SourceAlpha" dx="0.5" dy="-0.5" />' +
      '  <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" />' +
      '  <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />' +
      '</filter>';

    return (
      <g>
        <defs dangerouslySetInnerHTML={{__html:filter}} />

        <BackgroundTag screenScale={screenScale} center={center} screenHeight={height} screenLeft={screenLeft} screenRight={screenRight} />

        <g transform={"scale(" + screenScale + ", " + screenScale + ") translate(" + (-center) + "," + (height - 24) / screenScale + ") scale(1, -1)"}>
          <g>
            {sourcers}
            {shots}
          </g>
          {fxs}
        </g>

        <HudTag screenHeight={height} screenWidth={width} field={field} frameLength={frameLength} onValueChanged={onValueChanged} />
      </g>
    );
  }
});

module.exports = FieldTag;
