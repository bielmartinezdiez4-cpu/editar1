import "./index.css";
import { Composition } from "remotion";
import { ReventaVideo, FPS, DURATION_FRAMES } from "./Composition";
import {
  ReventaEp2Video,
  EP2_FPS,
  EP2_DURATION_FRAMES,
} from "./ep2/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reventa"
        component={ReventaVideo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReventaEp2"
        component={ReventaEp2Video}
        durationInFrames={EP2_DURATION_FRAMES}
        fps={EP2_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
