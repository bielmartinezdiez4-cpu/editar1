import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedImage } from "../../components/AnimatedImage";
import { BigText } from "../../components/BigText";
import { SmallChip } from "../../components/Tag";
import { COLORS, interFamily } from "../../fonts";

// 0 - 105 frames (3.5s)  HOOK
// Audio: "Compré esto en un mercadillo por quince euros."  (0 - 2.59s)
export const HookEp3: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={105}>
        <AnimatedImage
          src="ep3/image2.jpg"
          scaleFrom={1.25}
          scaleTo={1.45}
          panY={-20}
          overlayOpacity={0.55}
          fadeFrames={6}
        />
      </Sequence>

      <Sequence durationInFrames={10}>
        <HardFlash />
      </Sequence>

      <Sequence from={6} durationInFrames={99} layout="none">
        <HookContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // bottom of frame: caption + huge 15€ pulse
  const s15 = spring({
    frame: frame - 30,
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.7 },
  });
  const scale15 = interpolate(s15, [0, 1], [0.3, 1]);
  const op15 = interpolate(frame, [28, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "240px 50px 0 50px",
      }}
    >
      <SmallChip text="🔥  EP 03 · FINAL" variant="green" delay={0} />
      <div style={{ height: 36 }} />
      <BigText
        size={108}
        bebas
        uppercase
        letterSpacing={2}
        lineHeight={0.92}
        tokens={[
          { text: "COMPRÉ" },
          { text: "ESTO" },
          { text: "POR" },
        ]}
        staggerStart={6}
      />
      <div style={{ height: 20 }} />
      <div
        style={{
          opacity: op15,
          transform: `scale(${scale15})`,
          fontFamily: interFamily,
          fontWeight: 900,
          fontSize: 280,
          color: COLORS.green,
          letterSpacing: -14,
          lineHeight: 1,
          textShadow: `0 0 50px ${COLORS.greenGlow}, 0 0 100px ${COLORS.greenGlow}`,
        }}
      >
        15€
      </div>
    </AbsoluteFill>
  );
};

const HardFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 3, 10], [1, 0.5, 0], {
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: COLORS.white, opacity: op }} />;
};
