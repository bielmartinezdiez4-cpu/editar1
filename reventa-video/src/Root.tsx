import "./index.css";
import { Composition } from "remotion";
import { ReventaVideo, FPS, DURATION_FRAMES } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reventa"
      component={ReventaVideo}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
