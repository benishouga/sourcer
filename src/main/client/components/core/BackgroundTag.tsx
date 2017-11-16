import * as React from 'react';
import TreeTag, { Tree } from './TreeTag';
import DomeTag, { Dome } from './DomeTag';
import Screen from './Screen';
import Utils from '../../../core/Utils';

interface BackgroundProps {
  screen: Screen;
}

interface BackgroundState {
  trees1: Tree[];
  trees2: Tree[];
  trees3: Tree[];
  domes1: Dome[];
}

export default class BackgroundTag extends React.Component<BackgroundProps, BackgroundState> {

  constructor(props: BackgroundProps) {
    super(props);
    this.state = {
      trees1: this.makeTrees(),
      trees2: this.makeTrees(),
      trees3: this.makeTrees(),
      domes1: this.makeDomes()
    };
  }

  public render() {
    const screen = this.props.screen;

    const ground = (<rect
      fill="#888"
      width={screen.width}
      height={1}
      x={-screen.width / 2}
      y={screen.height - 6}
    />);

    const bg1 = this.makeBg(this.state.trees1, 2);
    const bg2 = this.makeBg(this.state.trees2, 3);
    const bg3 = this.makeBg(this.state.trees3, 4);
    const bg4 = this.makeDomeTags(this.state.domes1, 6);

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

  private makeBg(trees: Tree[], far: number) {
    const screen = this.props.screen;

    const viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewTop = (screen.height - 8) / screen.scale;
    const treeTags = trees.filter(tree => viewLeft < tree.x + tree.size && tree.x - tree.size < viewRight).map((tree) => {
      return <TreeTag key={tree.id} model={tree} far={far} />;
    });
    return (
      <g transform={`scale(${screen.scale},${screen.scale}) translate(${(-screen.center / far)},${viewTop}) scale(1, -1)`}>
        {treeTags}
      </g>
    );
  }

  private makeDomeTags(domes: Dome[], far: number) {
    const screen = this.props.screen;

    const viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewTop = (screen.height - 8) / screen.scale;
    const domeTags = domes.filter(dome => viewLeft < dome.x + dome.size && dome.x - dome.size < viewRight).map((dome) => {
      return <DomeTag key={dome.id} model={dome} far={far} />;
    });

    return (
      <g transform={`scale(${screen.scale}, ${screen.scale}) translate(${(-screen.center / far)},${viewTop}) scale(1, -1)`}>
        {domeTags}
      </g>
    );
  }

  private makeTrees() {
    const trees: Tree[] = [];
    const wide = 1024 * 4;
    for (let i = 0; i < 32; i++) {
      const tree = {
        id: `tree${i}`,
        x: Utils.rand(wide) - wide / 2,
        height: Utils.rand(360) + 24,
        size: Utils.rand(16) + 8
      };
      trees.push(tree);
    }
    return trees;
  }

  private makeDomes() {
    const domes: Dome[] = [];
    const wide = 1024 * 4;
    for (let i = 0; i < 2; i++) {
      const dome = {
        id: `dome${i}`,
        x: Utils.rand(wide) - wide / 2,
        size: Utils.rand(64) + 64
      };
      domes.push(dome);
    }
    return domes;
  }
}
