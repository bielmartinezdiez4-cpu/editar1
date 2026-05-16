import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedImage } from "../../components/AnimatedImage";
import { BigText } from "../../components/BigText";
import { SmallChip } from "../../components/Tag";
import { COLORS, interFamily } from "../../fonts";

// 0 - 104 frames
export const Hook2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={104}>
        <AnimatedImage
          src="ep2/image5.jpg"
          scaleFrom={1.4}
          scaleTo={1.6}
          panY={-30}
          overlayOpacity={0.6}
          fadeFrames={6}
        />
      </Sequence>

      {/* Hard-cut flash at start */}
      <Sequence durationInFrames={8}>
        <HardFlash />
      </Sequence>

      <Sequence from={4} durationInFrames={100} layout="none">
        <HookContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookContent: React.FC = () => {
  const frame = useCurrentFrame();
  const chipDelay = 0;
  const titleDelay = 6;

  // pulse on "PROS"
  const pulse = interpolate(
    frame,
    [titleDelay + 20, titleDelay + 28, titleDelay + 36],
    [1, 1.12, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <SmallChip text="🔥  EP 02 · LA SERIE" variant="green" delay={chipDelay} />
      </div>

      <div style={{ transform: `scale(${pulse})` }}>
        <BigText
          size={120}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={0.95}
          tokens={[
            { text: "AQUÍ" },
            { text: "BUSCAN" },
            { text: "LOS" },
            { text: "PROS", green: true },
          ]}
          staggerStart={titleDelay}
        />
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: interFamily,
          color: COLORS.gray,
          fontSize: 30,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        (y donde tú no estás mirando)
      </div>
    </AbsoluteFill>
  );
};

const HardFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 2, 8], [1, 0.4, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        opacity: op,
      }}
    />
  );
};
