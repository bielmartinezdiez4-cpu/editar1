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
import { COLORS, interFamily } from "../fonts";

// 360 frames total (12 seconds)
export const Finale: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0-120: no es suerte */}
      <Sequence durationInFrames={120}>
        <NotLuck />
      </Sequence>
      {/* 120-240: detectar valor */}
      <Sequence from={120} durationInFrames={120}>
        <DetectValue />
      </Sequence>
      {/* 240-360: aprender + parte 2 */}
      <Sequence from={240} durationInFrames={120}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

const NotLuck: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="image3.jpg"
          scaleFrom={1.4}
          scaleTo={1.15}
          panY={20}
          overlayOpacity={0.7}
        />
      </Sequence>
      <Sequence from={6} durationInFrames={114} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 70px",
          }}
        >
          <BigText
            size={130}
            bebas
            uppercase
            letterSpacing={2}
            lineHeight={0.95}
            tokens={[
              { text: "NO" },
              { text: "ES" },
              { text: "SUERTE", green: true },
            ]}
            staggerStart={4}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const DetectValue: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="image4.jpg"
          scaleFrom={1.1}
          scaleTo={1.25}
          panY={-20}
          overlayOpacity={0.7}
        />
      </Sequence>
      <Sequence from={4} durationInFrames={116} layout="none">
        <DetectValueContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const DetectValueContent: React.FC = () => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
      }}
    >
      <BigText
        size={120}
        bebas
        uppercase
        letterSpacing={2}
        lineHeight={0.95}
        tokens={[
          { text: "ES" },
          { text: "DETECTAR" },
          { text: "VALOR", green: true },
        ]}
        staggerStart={4}
      />
      <div style={{ height: 22 }} />
      <div
        style={{
          fontFamily: interFamily,
          fontWeight: 700,
          color: COLORS.gray,
          fontSize: 34,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: subOp,
        }}
      >
        antes que el resto
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const lineOp = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const part2Op = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const part2Scale = interpolate(frame, [50, 80], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const arrowX = interpolate(frame, [70, 110], [-10, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(0,255,127,0.18), #050505 70%)",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 50,
        }}
      >
        <SmallChip text="YO VOY A APRENDER" variant="outline" delay={0} />
        <div
          style={{
            opacity: lineOp,
            transform: `translateY(${interpolate(lineOp, [0, 1], [30, 0])}px)`,
          }}
        >
          <BigText
            size={108}
            bebas
            uppercase
            letterSpacing={2}
            lineHeight={0.95}
            tokens={[
              { text: "Y" },
              { text: "VOY" },
              { text: "A" },
              { text: "ENSEÑARTE", green: true },
            ]}
            staggerStart={10}
          />
        </div>

        <div
          style={{
            opacity: part2Op,
            transform: `scale(${part2Scale})`,
            marginTop: 30,
            background: COLORS.green,
            color: "#001a0e",
            fontFamily: interFamily,
            fontWeight: 900,
            fontSize: 76,
            padding: "26px 60px",
            borderRadius: 999,
            letterSpacing: -2,
            boxShadow: `0 30px 90px ${COLORS.greenGlow}`,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          PARTE 2 · MAÑANA
          <span
            style={{
              display: "inline-block",
              transform: `translateX(${arrowX}px)`,
              fontSize: 80,
            }}
          >
            →
          </span>
        </div>

        <div
          style={{
            opacity: part2Op,
            fontFamily: interFamily,
            color: COLORS.gray,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 700,
            marginTop: 10,
          }}
        >
          sígueme para el episodio 2
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
