import * as React from 'react';
import TreeTag, { Tree } from './TreeTag';
import DomeTag, { Dome } from './DomeTag';
import Screen from './Screen';
import Utils from '../../../core/Utils';

export interface BackgroundProps {
  screen: Screen;
}

export default function BackgroundTag(props: BackgroundProps) {
  const screen = props.screen;

  const trees1 = useTrees();
  const trees2 = useTrees();
  const trees3 = useTrees();
  const domes1 = useDomes();

  const ground = <rect fill="#888" width={screen.width} height={1} x={-screen.width / 2} y={screen.height - 6} />;

  const bg1 = makeBg(screen, trees1, 2);
  const bg2 = makeBg(screen, trees2, 3);
  const bg3 = makeBg(screen, trees3, 4);
  const bg4 = makeDomeTags(screen, domes1, 6);

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

function computeViewInfo(screen: Screen, far: number): { viewLeft: number; viewRight: number; viewTop: number } {
  const viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
  const viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
  const viewTop = (screen.height - 8) / screen.scale;
  return { viewLeft, viewRight, viewTop };
}
function makeBg(screen: Screen, trees: Tree[], far: number) {
  const { viewLeft, viewRight, viewTop } = computeViewInfo(screen, far);
  return (
    <g transform={`scale(${screen.scale},${screen.scale}) translate(${-screen.center / far},${viewTop}) scale(1, -1)`}>
      {trees
        .filter(tree => viewLeft < tree.x + tree.size && tree.x - tree.size < viewRight)
        .map(tree => <TreeTag key={tree.id} model={tree} far={far} />)}
    </g>
  );
}

function makeDomeTags(screen: Screen, domes: Dome[], far: number) {
  const { viewLeft, viewRight, viewTop } = computeViewInfo(screen, far);

  return (
    <g transform={`scale(${screen.scale}, ${screen.scale}) translate(${-screen.center / far},${viewTop}) scale(1, -1)`}>
      {domes
        .filter(dome => viewLeft < dome.x + dome.size && dome.x - dome.size < viewRight)
        .map(dome => <DomeTag key={dome.id} model={dome} far={far} />)}
    </g>
  );
}

function useTrees(): Tree[] {
  return React.useMemo(() => {
    const trees: Tree[] = [];
    const wide = 1024 * 4;
    for (let i = 0; i < 32; i++) {
      trees.push({
        id: `tree${i}`,
        x: Utils.rand(wide) - wide / 2,
        height: Utils.rand(360) + 24,
        size: Utils.rand(16) + 8
      });
    }
    return trees;
  }, []);
}

function useDomes(): Dome[] {
  return React.useMemo(() => {
    const domes: Dome[] = [];
    const wide = 1024 * 4;
    for (let i = 0; i < 2; i++) {
      domes.push({
        id: `dome${i}`,
        x: Utils.rand(wide) - wide / 2,
        size: Utils.rand(64) + 64
      });
    }
    return domes;
  }, []);
}
