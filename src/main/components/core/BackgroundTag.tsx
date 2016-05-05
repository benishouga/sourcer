import * as React from 'react';
import TreeTag, {Tree} from './TreeTag';
import DomeTag, {Dome} from './DomeTag';
import Utils from '../../core/Utils';
import Screen from './Screen';

export default class BackgroundTag extends React.Component<{ screen: Screen; }, { trees1: Tree[], trees2: Tree[], trees3: Tree[], domes1: Dome[] }> {
  constructor(props: { screen: Screen; }) {
    super();
    this.state = {
      trees1: this.makeTrees(),
      trees2: this.makeTrees(),
      trees3: this.makeTrees(),
      domes1: this.makeDomes()
    };
  }
  render() {
    var screen = this.props.screen;

    var ground = (<rect fill="#888" width={screen.width} height={1} x={-screen.width / 2} y={screen.height - (screen.hideController ? 6 : 22)} />);
    var bg1 = this.makeBg(this.state.trees1, 2);
    var bg2 = this.makeBg(this.state.trees2, 3);
    var bg3 = this.makeBg(this.state.trees3, 4);
    var bg4 = this.makeDomeTags(this.state.domes1, 6);

    return (
      <g>
        {bg4}
        {bg3}
        {bg2}
        {bg1}
        {ground}
      </g>
    );
  }

  makeBg(trees: Tree[], far: number) {
    var screen = this.props.screen;

    var viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
    var viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
    var viewTop = (screen.height - (screen.hideController ? 8 : 24)) / screen.scale;
    var treeTags = trees.map((tree) => {
      if (viewLeft < tree.x + tree.size && tree.x - tree.size < viewRight) {
        return <TreeTag key={tree.id} model={tree} far={far} />
      }
    });
    return (
      <g transform={"scale(" + screen.scale + ", " + screen.scale + ") translate(" + (-screen.center / far) + "," + viewTop + ") scale(1, -1)"}>
        {treeTags}
      </g>
    );
  }

  makeDomeTags(domes: Dome[], far: number) {
    var screen = this.props.screen;

    var viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
    var viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
    var viewTop = (screen.height - (screen.hideController ? 8 : 24)) / screen.scale;
    var domeTags = domes.map((dome) => {
      if (viewLeft < dome.x + dome.size && dome.x - dome.size < viewRight) {
        return <DomeTag key={dome.id} model={dome} far={far} />
      }
    });
    return (
      <g transform={"scale(" + screen.scale + ", " + screen.scale + ") translate(" + (-screen.center / far) + "," + viewTop + ") scale(1, -1)"}>
        {domeTags}
      </g>
    );
  }

  makeTrees() {
    var trees: Tree[] = [];
    var wide = 1024 * 4;
    for (var i = 0; i < 32; i++) {
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

  makeDomes() {
    var domes: Dome[] = [];
    var wide = 1024 * 4;
    for (var i = 0; i < 2; i++) {
      var dome = {
        id: "dome" + i,
        x: Utils.rand(wide) - wide / 2,
        size: Utils.rand(64) + 64
      };
      domes.push(dome);
    }
    return domes;
  }
}
