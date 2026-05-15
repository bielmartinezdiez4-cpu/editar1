import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedImage, ImageCard } from "../components/AnimatedImage";
import { BigText } from "../components/BigText";
import { SmallChip } from "../components/Tag";
import { COLORS, interFamily } from "../fonts";

// 270 frames total (9 seconds)
export const Demand: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={130}>
        <Beat1 />
      </Sequence>
      <Sequence from={130} durationInFrames={140}>
        <Beat2 />
      </Sequence>
    </AbsoluteFill>
  );
};

const Beat1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={130}>
        <AnimatedImage
          src="image2.jpg"
          scaleFrom={1.1}
          scaleTo={1.25}
          panY={-40}
          overlayOpacity={0.55}
        />
      </Sequence>
      <Sequence from={8} durationInFrames={122} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 240,
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <SmallChip text="LA REGLA #1" variant="outline" delay={4} />
          </div>
          <BigText
            size={140}
            bebas
            uppercase
            letterSpacing={2}
            tokens={[
              { text: "DEMANDA" },
              { text: ">", green: true },
              { text: "PRECIO" },
            ]}
            staggerStart={10}
          />
          <div
            style={{
              marginTop: 28,
              fontFamily: interFamily,
              color: COLORS.gray,
              fontSize: 30,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              opacity: 0.85,
            }}
          >
            la nueva economía de segunda mano
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Beat2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={140}>
        <ImageCard
          src="image4.jpg"
          align="center"
          scaleFrom={1.05}
          scaleTo={1.18}
        />
      </Sequence>
      <Sequence from={6} durationInFrames={134} layout="none">
        <FloatingMetrics />
      </Sequence>
    </AbsoluteFill>
  );
};

const FloatingMetrics: React.FC = () => {
  const frame = useCurrentFrame();

  const cards = [
    { label: "BÚSQUEDAS", value: "+184%", delay: 0, x: -260, y: -560 },
    { label: "VISITAS", value: "x3.2", delay: 14, x: 240, y: -380 },
    { label: "MENSAJES", value: "+62", delay: 26, x: -300, y: 0 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {cards.map((c, i) => {
        const local = frame - c.delay;
        const op = interpolate(local, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const tr = interpolate(local, [0, 16], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(${c.x}px, ${c.y + tr}px)`,
              opacity: op,
              background: "rgba(10,10,10,0.78)",
              border: `1.5px solid ${COLORS.green}`,
              borderRadius: 20,
              padding: "18px 30px",
              fontFamily: interFamily,
              color: COLORS.white,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${COLORS.greenGlow}`,
              minWidth: 280,
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: 3,
                color: COLORS.gray,
                fontWeight: 700,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: 70,
                fontWeight: 900,
                color: COLORS.green,
                letterSpacing: -2,
                lineHeight: 1,
                marginTop: 4,
                textShadow: `0 0 24px ${COLORS.greenGlow}`,
              }}
            >
              {c.value}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
