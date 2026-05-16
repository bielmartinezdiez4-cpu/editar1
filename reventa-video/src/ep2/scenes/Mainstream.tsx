import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedImage } from "../../components/AnimatedImage";
import { SmallChip } from "../../components/Tag";
import { COLORS, interFamily } from "../../fonts";

// 0 - 256 frames (8.5s)
export const Mainstream: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={256}>
        <AnimatedImage
          src="ep2/image2.jpg"
          scaleFrom={1.1}
          scaleTo={1.28}
          panY={-30}
          overlayOpacity={0.62}
          fadeFrames={8}
        />
      </Sequence>

      <Sequence from={4} durationInFrames={130} layout="none">
        <PlatformChips />
      </Sequence>

      <Sequence from={120} durationInFrames={136} layout="none">
        <MarginCrush />
      </Sequence>
    </AbsoluteFill>
  );
};

const PlatformChips: React.FC = () => {
  const frame = useCurrentFrame();
  const platforms = ["WALLAPOP", "VINTED", "EBAY"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 240,
      }}
    >
      <SmallChip text="EL ERROR" variant="outline" delay={0} />
      <div style={{ height: 28 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
        }}
      >
        {platforms.map((p, i) => {
          const local = frame - 10 - i * 12;
          const op = interpolate(local, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(local, [0, 16], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const scale = interpolate(local, [0, 16], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={p}
              style={{
                opacity: op,
                transform: `translateY(${y}px) scale(${scale})`,
                fontFamily: interFamily,
                fontWeight: 900,
                fontSize: 90,
                color: COLORS.white,
                letterSpacing: -2,
                textShadow: "0 4px 30px rgba(0,0,0,0.7)",
              }}
            >
              {p}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: interFamily,
          fontWeight: 700,
          color: COLORS.gray,
          fontSize: 32,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: interpolate(frame, [54, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        aquí busca todo el mundo
      </div>
    </AbsoluteFill>
  );
};

const MarginCrush: React.FC = () => {
  const frame = useCurrentFrame();

  // 50 → 70 (only 20€ profit)
  const op = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slamScale = interpolate(frame, [80, 95], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          opacity: op,
          fontFamily: interFamily,
          fontWeight: 700,
          color: COLORS.gray,
          fontSize: 30,
          letterSpacing: 5,
          textTransform: "uppercase",
          marginBottom: -10,
        }}
      >
        margen real
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: op,
        }}
      >
        <div
          style={{
            fontFamily: interFamily,
            fontWeight: 900,
            fontSize: 130,
            color: COLORS.gray,
            textDecoration: "line-through",
            letterSpacing: -3,
          }}
        >
          50€
        </div>
        <div
          style={{
            color: COLORS.green,
            fontSize: 80,
            filter: `drop-shadow(0 0 14px ${COLORS.greenGlow})`,
          }}
        >
          →
        </div>
        <div
          style={{
            fontFamily: interFamily,
            fontWeight: 900,
            fontSize: 130,
            color: COLORS.white,
            letterSpacing: -3,
          }}
        >
          70€
        </div>
      </div>

      <div
        style={{
          transform: `scale(${slamScale})`,
          opacity: interpolate(frame, [60, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          background: "#ff3b3b",
          color: COLORS.white,
          fontFamily: interFamily,
          fontWeight: 900,
          fontSize: 60,
          padding: "16px 40px",
          borderRadius: 999,
          letterSpacing: -1,
          boxShadow: "0 20px 60px rgba(255,59,59,0.45)",
          marginTop: 10,
        }}
      >
        +20€ · NADA
      </div>
    </AbsoluteFill>
  );
};
