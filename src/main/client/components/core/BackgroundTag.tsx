import React, { useState, useEffect } from 'react';
import TreeTag, { Tree } from './TreeTag';
import DomeTag, { Dome } from './DomeTag';
import Screen from './Screen';
import Utils from '../../../core/Utils';

export interface BackgroundProps {
  screen: Screen;
}

const BackgroundTag: React.FC<BackgroundProps> = ({ screen }) => {
  const [trees1, setTrees1] = useState<Tree[]>([]);
  const [trees2, setTrees2] = useState<Tree[]>([]);
  const [trees3, setTrees3] = useState<Tree[]>([]);
  const [domes1, setDomes1] = useState<Dome[]>([]);

  useEffect(() => {
    setTrees1(makeTrees());
    setTrees2(makeTrees());
    setTrees3(makeTrees());
    setDomes1(makeDomes());
  }, []);

  const computeViewInfo = (far: number): { viewLeft: number; viewRight: number; viewTop: number } => {
    const viewLeft = ((screen.left - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewRight = ((screen.right - screen.center) / (screen.scale / far) + screen.center) / far;
    const viewTop = (screen.height - 8) / screen.scale;
    return { viewLeft, viewRight, viewTop };
  };

  const makeBg = (trees: Tree[], far: number) => {
    const { viewLeft, viewRight, viewTop } = computeViewInfo(far);
    const treeTags = trees
      .filter(tree => viewLeft < tree.x + tree.size && tree.x - tree.size < viewRight)
      .map(tree => {
        return <TreeTag key={tree.id} model={tree} far={far} />;
      });
    return (
      <g
        transform={`scale(${screen.scale},${screen.scale}) translate(${-screen.center / far},${viewTop}) scale(1, -1)`}
      >
        {treeTags}
      </g>
    );
  };

  const makeDomeTags = (domes: Dome[], far: number) => {
    const { viewLeft, viewRight, viewTop } = computeViewInfo(far);

    const domeTags = domes
      .filter(dome => viewLeft < dome.x + dome.size && dome.x - dome.size < viewRight)
      .map(dome => {
        return <DomeTag key={dome.id} model={dome} far={far} />;
      });

    return (
      <g
        transform={`scale(${screen.scale}, ${screen.scale}) translate(${-screen.center / far},${viewTop}) scale(1, -1)`}
      >
        {domeTags}
      </g>
    );
  };

  const makeTrees = () => {
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
  };

  const makeDomes = () => {
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
  };

  const ground = <rect fill="#888" width={screen.width} height={1} x={-screen.width / 2} y={screen.height - 6} />;

  const bg1 = makeBg(trees1, 2);
  const bg2 = makeBg(trees2, 3);
  const bg3 = makeBg(trees3, 4);
  const bg4 = makeDomeTags(domes1, 6);

  return (
    <g>
      {bg4}
      {bg3}
      {bg2}
      {bg1}
      {ground}
    </g>
  );
};

export default BackgroundTag;
