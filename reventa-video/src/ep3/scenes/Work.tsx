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

// 0 - 195 frames (6.5s)
// Audio aligned:
//   11.56 (local 0)    "Le dediqué una tarde."
//   13.37 (local 54)   "Lo limpié,"
//   14.42 (local 86)   "hice fotos decentes,"
//   15.80 (local 127)  "y escribí un anuncio honesto."
export const Work: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={195}>
        <AnimatedImage
          src="ep3/image3.jpg"
          scaleFrom={1.06}
          scaleTo={1.2}
          panY={5}
          overlayOpacity={0.62}
          fadeFrames={6}
        />
      </Sequence>
      <Sequence from={4} durationInFrames={191} layout="none">
        <WorkContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const WorkContent: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        padding: "220px 60px 0 60px",
        alignItems: "center",
      }}
    >
      <SmallChip text="ACT 2 · EL TRABAJO" variant="green" delay={0} />

      <div style={{ height: 30 }} />

      <div
        style={{
          fontFamily: interFamily,
          fontWeight: 900,
          fontSize: 116,
          color: COLORS.white,
          letterSpacing: -3,
          lineHeight: 0.9,
          textTransform: "uppercase",
          opacity: interpolate(frame, [4, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [4, 22], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px)`,
        }}
      >
        1 <span style={{ color: COLORS.green }}>TARDE</span>
      </div>

      <div style={{ height: 50 }} />

      <Steps frame={frame} />
    </AbsoluteFill>
  );
};

const Steps: React.FC<{ frame: number }> = ({ frame }) => {
  const items = [
    { label: "LIMPIÉ", delay: 50 },
    { label: "FOTOGRAFIÉ", delay: 82 },
    { label: "ANUNCIO HONESTO", delay: 122 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((it) => {
        const local = frame - it.delay;
        const op = interpolate(local, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(local, [0, 18], [-60, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={it.label}
            style={{
              opacity: op,
              transform: `translateX(${x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontFamily: interFamily,
            }}
          >
            <div
              style={{
                fontWeight: 900,
                color: COLORS.green,
                fontSize: 60,
                lineHeight: 1,
              }}
            >
              ✓
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: COLORS.white,
                letterSpacing: -1,
                textShadow: "0 4px 24px rgba(0,0,0,0.7)",
              }}
            >
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
