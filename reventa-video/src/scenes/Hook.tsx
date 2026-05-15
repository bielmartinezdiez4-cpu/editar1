import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedImage } from "../components/AnimatedImage";
import { BigText } from "../components/BigText";
import { SmallChip } from "../components/Tag";
import { COLORS } from "../fonts";

export const Hook: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={90}>
        <AnimatedImage
          src="image3.jpg"
          scaleFrom={1.15}
          scaleTo={1.35}
          panY={-30}
          overlayOpacity={0.75}
          fadeFrames={8}
        />
      </Sequence>

      <Sequence from={6} durationInFrames={84} layout="none">
        <FlashBar />
      </Sequence>

      <Sequence from={10} durationInFrames={80} layout="none">
        <HookContent />
      </Sequence>

      <Sequence durationInFrames={10}>
        <FlashFrame />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookContent: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <SmallChip text="MINI DOC · EP 1" variant="green" delay={2} />
      </div>
      <BigText
        size={120}
        bebas
        letterSpacing={2}
        lineHeight={0.95}
        uppercase
        tokens={[
          { text: "ASÍ" },
          { text: "FUNCIONA" },
          { text: "REALMENTE" },
          { text: "LA", green: true },
          { text: "REVENTA", green: true },
        ]}
        staggerStart={4}
      />
    </AbsoluteFill>
  );
};

const FlashBar: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, 30], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 0 220px 0",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${w}%`,
          maxWidth: 940,
          height: 4,
          background: COLORS.green,
          boxShadow: `0 0 20px ${COLORS.greenGlow}`,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};

const FlashFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4, 10], [0.6, 0.2, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        opacity,
      }}
    />
  );
};
