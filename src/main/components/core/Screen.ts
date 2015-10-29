export default class Screen {
  frameLength: number;
  height: number;
  width: number;
  viewScale: number;
  left: number;
  right: number;
  top: number;
  scale: number;
  center: number;
  playing: boolean;
  onFrameChanged: (frame: number) => void;
  onPlay: () => void;
  onPause:  () => void;
  onReload:  () => void;
}
