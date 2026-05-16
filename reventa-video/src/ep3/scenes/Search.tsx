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
import { BigText } from "../../components/BigText";
import { SmallChip } from "../../components/Tag";
import { COLORS, interFamily } from "../../fonts";

// 0 - 240 frames (8s)
// Audio aligned:
//   3.11  "Fui a uno de los sitios que te enseñé."
//   5.45  "Mercadillo de barrio."
//   7.67  "Estuve cuarenta minutos buscando,"
//   9.83  "hasta que vi esto."
// Local frames inside this Sequence:
//   0-120  POV mercadillo (image1)
//   120-240 zoom on the find (image2)
export const Search: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <SearchPart1 />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <SearchPart2 />
      </Sequence>
      <Sequence from={117} durationInFrames={8} layout="none">
        <Flash />
      </Sequence>
    </AbsoluteFill>
  );
};

const SearchPart1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="ep3/image1.jpg"
          scaleFrom={1.1}
          scaleTo={1.28}
          panY={-25}
          overlayOpacity={0.55}
          fadeFrames={6}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: "260px 60px 0 60px",
          alignItems: "center",
        }}
      >
        <SmallChip text="ACT 1 · LA BÚSQUEDA" variant="outline" delay={0} />
        <div style={{ height: 28 }} />
        <BigText
          size={104}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={0.95}
          tokens={[{ text: "MERCADILLO" }, { text: "DE", green: true }, { text: "BARRIO", green: true }]}
          staggerStart={6}
        />
      </AbsoluteFill>

      {/* "40 minutos" floating */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 0 540px 0",
        }}
      >
        <FortyMinutes delay={50} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FortyMinutes: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const op = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${scale}) rotate(-3deg)`,
        background: "rgba(10,10,10,0.85)",
        border: `2px solid ${COLORS.green}`,
        borderRadius: 24,
        padding: "16px 36px",
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: 56,
        color: COLORS.white,
        letterSpacing: -1,
        boxShadow: `0 30px 80px ${COLORS.greenGlow}`,
      }}
    >
      <span style={{ color: COLORS.green }}>40 MIN</span> BUSCANDO
    </div>
  );
};

const SearchPart2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="ep3/image2.jpg"
          scaleFrom={1.45}
          scaleTo={1.2}
          panY={20}
          overlayOpacity={0.45}
          fadeFrames={4}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: "230px 0 0 0",
          alignItems: "center",
        }}
      >
        <BigText
          size={110}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={0.95}
          tokens={[{ text: "HASTA" }, { text: "QUE" }, { text: "VI", green: true }, { text: "ESTO", green: true }]}
          staggerStart={4}
        />
      </AbsoluteFill>

      {/* Pulsing ring around imaginary item center-low */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PulseRing delay={20} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PulseRing: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  return (
    <>
      {[0, 18, 36].map((d, i) => {
        const t = local - d;
        const op = interpolate(t, [0, 30, 60], [0.7, 0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(t, [0, 60], [0.4, 1.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: 999,
              border: `3px solid ${COLORS.green}`,
              opacity: op,
              transform: `scale(${scale}) translateY(120px)`,
              boxShadow: `0 0 40px ${COLORS.greenGlow}`,
            }}
          />
        );
      })}
    </>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 2, 8], [0, 0.55, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        opacity: op,
        mixBlendMode: "screen",
      }}
    />
  );
};
