import './index.css';
import {Composition} from 'remotion';
import {ViralVideo} from './viral/ViralVideo';
import {VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_DURATION_SECONDS} from './viral/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Viral"
      component={ViralVideo}
      durationInFrames={Math.ceil(VIDEO_DURATION_SECONDS * VIDEO_FPS)}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
