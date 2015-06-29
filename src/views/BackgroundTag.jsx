/** @jsx React.DOM */
var React = require('react');
var TreeTag = require('./TreeTag');
var Utils = require('../core/Utils');

var BackgroundTag = React.createClass({
  getInitialState: function(){
    return {
      bg1 : this.makeTrees(),
      bg2 : this.makeTrees(),
      bg3 : this.makeTrees()
    };
  },

  render: function() {
    var screenScale = this.props.screenScale;
    var center = this.props.center;
    var screenHeight = this.props.screenHeight;
    var screenLeft = this.props.screenLeft;
    var screenRight = this.props.screenRight;

    var viewLeft1 = ((screenLeft - center) / (screenScale / 4) + center) / 4;
    var viewRight1 = ((screenRight - center) / (screenScale / 4) + center) / 4;
    var trees1 = this.state.bg1.map(function(b) {
      if(viewLeft1 < b.x + b.size && b.x - b.size < viewRight1) {
        return <TreeTag key={b.id} model={b} />
      }
    });
    var viewLeft2 = ((screenLeft - center) / (screenScale / 3) + center) / 3;
    var viewRight2 = ((screenRight - center) / (screenScale / 3) + center) / 3;
    var trees2 = this.state.bg2.map(function(b) {
      if(viewLeft2 < b.x + b.size && b.x - b.size < viewRight2) {
        return <TreeTag key={b.id} model={b} />
      }
    });
    var viewLeft3 = ((screenLeft - center) / (screenScale / 2) + center) / 2;
    var viewRight3 = ((screenRight - center) / (screenScale / 2) + center) / 2;
    var trees3 = this.state.bg3.map(function(b) {
      if(viewLeft3 < b.x + b.size && b.x - b.size < viewRight3) {
        return <TreeTag key={b.id} model={b} />
      }
    });

    return (
      <g>
        <g transform={"scale(" + screenScale + ", " + screenScale + ") translate(" + (-center / 4) + "," + (screenHeight - 24) / screenScale +") scale(1, -1)"}>
          {trees1}
        </g>
        <g transform={"scale(" + screenScale + ", " + screenScale + ") translate(" + (-center / 3) + "," + (screenHeight - 24) / screenScale +") scale(1, -1)"}>
          {trees2}
        </g>
        <g transform={"scale(" + screenScale + ", " + screenScale + ") translate(" + (-center / 2) + "," + (screenHeight - 24) / screenScale +") scale(1, -1)"}>
          {trees3}
        </g>
      </g>
    );
  },

  makeTrees: function() {
    var trees = [];
    var wide = 1024 * 4;
    for(var i = 0; i < 32; i++) {
      var tree = {
        id: "tree" + i,
        x: Utils.rand(wide) - wide / 2,
        height: Utils.rand(360) + 24,
        size: Utils.rand(16) + 8
      };
      trees.push(tree);
    }
    return trees;
  }
});

module.exports = BackgroundTag;
