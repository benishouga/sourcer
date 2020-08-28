import * as React from 'react';
import { FABButton, Icon, Slider } from 'react-mdl';
import { GameDump } from '../../../../core/Dump';
import ComponentExplorer from '../../../utils/ComponentExplorer';

interface ControllerProps {
  playing?: boolean;
  frameIndex: number;
  gameDump: GameDump;
  onReload: () => void;
  onPause: () => void;
  onPlay: () => void;
  onFrameChanged: (frame: number) => void;
}

export default function Controller(props: ControllerProps) {
  return (
    <div className="replay-controller">
      <div className="replay-controller-button">
        <FABButton mini colored ripple onClick={() => props.onReload()}>
          <Icon name="replay" />
        </FABButton>
      </div>
      <div className="replay-controller-button">
        {props.playing ? (
          <FABButton mini colored ripple onClick={() => props.onPause()}>
            <Icon name="pause" />
          </FABButton>
        ) : (
          <FABButton mini colored ripple onClick={() => props.onPlay()}>
            <Icon name="play_arrow" />
          </FABButton>
        )}
      </div>
      <div className="replay-slider">
        <Slider
          min={0}
          max={props.gameDump.frames.length - 1}
          value={props.frameIndex}
          onChange={frameEvent => props.onFrameChanged(ComponentExplorer.extractSliderOnChange(frameEvent))}
        />
      </div>
      <div className="replay-controller-frame">
        {props.frameIndex} <span>(frame)</span>
      </div>
    </div>
  );
}
