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
    var bg1 = this.makeBg(this.state.bg1, 4);
    var bg2 = this.makeBg(this.state.bg2, 3);
    var bg3 = this.makeBg(this.state.bg3, 2);

    return (
      <g>
        {bg1}
        {bg2}
        {bg3}
      </g>
    );
  },

  makeBg: function(trees, far) {
    var screenScale = this.props.screenScale;
    var center = this.props.center;
    var screenHeight = this.props.screenHeight;
    var screenLeft = this.props.screenLeft;
    var screenRight = this.props.screenRight;

    var viewLeft = ((screenLeft - center) / (screenScale / far) + center) / far;
    var viewRight = ((screenRight - center) / (screenScale / far) + center) / far;
    var treeTags = trees.map(function(b) {
      if(viewLeft < b.x + b.size && b.x - b.size < viewRight) {
        return <TreeTag key={b.id} model={b} />
      }
    });
    return (
      <g transform={"scale(" + screenScale + ", " + screenScale + ") translate(" + (-center / far) + "," + (screenHeight - 24) / screenScale +") scale(1, -1)"}>
        {treeTags}
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
