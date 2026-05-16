import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedImage } from "../../components/AnimatedImage";
import { Counter } from "../../ep2/components/Counter";
import { COLORS, interFamily } from "../../fonts";

// 0 - 270 frames (9s)  THE CLIMAX
// Audio aligned (local frames):
//   0    (17.99s)  "Tres días después…"
//   50   (19.65s)  "vendido."
//   96   (21.17s)  "Noventa y cinco euros."
//   160  (23.31s)  "Beneficio, ochenta euros,"
//   192  (24.40s)  "en una tarde de trabajo."
export const Reveal: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={270}>
        <AnimatedImage
          src="ep3/image4.jpg"
          scaleFrom={1.1}
          scaleTo={1.25}
          panY={-15}
          overlayOpacity={0.78}
          fadeFrames={6}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,255,127,0.18), transparent 60%)",
        }}
      />

      <Sequence durationInFrames={270} layout="none">
        <RevealContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const RevealContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 50px",
        gap: 40,
      }}
    >
      {/* Phase 1: "3 días después" countdown */}
      <DaysCountdown frame={frame} />

      {/* Phase 2: VENDIDO slap */}
      <SoldSlap frame={frame} fps={fps} />

      {/* Phase 3: 15 → 95 ticker */}
      <PriceJump frame={frame} fps={fps} />

      {/* Phase 4: +80€ profit */}
      <ProfitSlap frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const DaysCountdown: React.FC<{ frame: number }> = ({ frame }) => {
  // visible 0-50
  const op = interpolate(frame, [4, 14, 44, 56], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [4, 14], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  if (op <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        opacity: op,
        transform: `scale(${scale})`,
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: 130,
        color: COLORS.white,
        letterSpacing: -3,
        lineHeight: 0.9,
        textAlign: "center",
        textShadow: `0 0 40px rgba(0,0,0,0.6)`,
      }}
    >
      3 DÍAS
      <br />
      <span style={{ color: COLORS.green }}>DESPUÉS…</span>
    </div>
  );
};

const SoldSlap: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // visible 50-96
  const local = frame - 50;
  const op = interpolate(local, [0, 6, 40, 50], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = spring({
    frame: local,
    fps,
    config: { damping: 8, stiffness: 240, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [0.2, 1]);
  if (op <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        opacity: op,
        transform: `scale(${scale}) rotate(-6deg)`,
        background: COLORS.green,
        color: "#001a0e",
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: 180,
        padding: "20px 70px",
        borderRadius: 40,
        letterSpacing: -4,
        boxShadow: `0 40px 100px ${COLORS.greenGlow}`,
      }}
    >
      VENDIDO
    </div>
  );
};

const PriceJump: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  // visible 96-220
  const local = frame - 96;
  const op = interpolate(local, [0, 8, 110, 124], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0) return null;

  const counterStart = 12;
  const counterEnd = 56;

  return (
    <div
      style={{
        position: "absolute",
        opacity: op,
        display: "flex",
        alignItems: "center",
        gap: 38,
      }}
    >
      <div
        style={{
          fontFamily: interFamily,
          fontWeight: 900,
          fontSize: 140,
          color: COLORS.gray,
          textDecoration: "line-through",
          letterSpacing: -4,
          lineHeight: 1,
        }}
      >
        15€
      </div>
      <div
        style={{
          color: COLORS.green,
          fontSize: 100,
          filter: `drop-shadow(0 0 18px ${COLORS.greenGlow})`,
        }}
      >
        →
      </div>
      <Counter
        from={15}
        to={95}
        suffix="€"
        size={200}
        startFrame={counterStart}
        endFrame={counterEnd}
        color={COLORS.green}
        glow
      />
    </div>
  );
};

const ProfitSlap: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // visible 220-270
  const local = frame - 220;
  const op = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0) return null;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 8, stiffness: 240, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [0.3, 1]);
  return (
    <div
      style={{
        position: "absolute",
        opacity: op,
        transform: `scale(${scale}) rotate(-4deg)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          background: COLORS.green,
          color: "#001a0e",
          fontFamily: interFamily,
          fontWeight: 900,
          fontSize: 220,
          padding: "20px 70px",
          borderRadius: 40,
          letterSpacing: -8,
          lineHeight: 1,
          boxShadow: `0 40px 120px ${COLORS.greenGlow}`,
        }}
      >
        +80€
      </div>
      <div
        style={{
          fontFamily: interFamily,
          fontWeight: 800,
          color: COLORS.white,
          fontSize: 38,
          letterSpacing: 4,
          textTransform: "uppercase",
          textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        }}
      >
        en una tarde
      </div>
    </div>
  );
};
