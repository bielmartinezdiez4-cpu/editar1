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

// 0 - 330 frames (11s)
// Breakdown:
//   0-150  "El secreto no es barato. Es invisible." (image5 map)
//   150-330 "Parte 3 mañana" end card
export const Secret: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150}>
        <SecretReveal />
      </Sequence>
      <Sequence from={150} durationInFrames={180}>
        <EndCard />
      </Sequence>
      <Sequence from={147} durationInFrames={8} layout="none">
        <Flash />
      </Sequence>
    </AbsoluteFill>
  );
};

const SecretReveal: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150}>
        <AnimatedImage
          src="ep2/image5.jpg"
          scaleFrom={1.5}
          scaleTo={1.2}
          panY={10}
          overlayOpacity={0.55}
          fadeFrames={8}
        />
      </Sequence>
      <Sequence from={4} durationInFrames={146} layout="none">
        <SecretContent />
      </Sequence>
    </AbsoluteFill>
  );
};

const SecretContent: React.FC = () => {
  const frame = useCurrentFrame();

  const line2Op = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line2Y = interpolate(line2Op, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        gap: 30,
      }}
    >
      <SmallChip text="LA REGLA" variant="green" delay={0} />

      <BigText
        size={92}
        bebas
        uppercase
        letterSpacing={2}
        lineHeight={0.95}
        tokens={[
          { text: "NO" },
          { text: "ES" },
          { text: "COMPRAR" },
          { text: "BARATO." },
        ]}
        staggerStart={6}
      />

      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Y}px)`,
        }}
      >
        <BigText
          size={108}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={0.95}
          tokens={[
            { text: "ES" },
            { text: "COMPRAR" },
            { text: "INVISIBLE.", green: true },
          ]}
          staggerStart={50}
        />
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const teaserOp = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const ctaOp = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = interpolate(frame, [50, 80], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const arrowX = interpolate(frame, [70, 130], [-10, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const followOp = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(0,255,127,0.22), #050505 70%)",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 70px",
          gap: 36,
        }}
      >
        <div
          style={{
            opacity: teaserOp,
            transform: `translateY(${interpolate(teaserOp, [0, 1], [30, 0])}px)`,
          }}
        >
          <SmallChip text="ESTA SEMANA LO PRUEBO" variant="outline" delay={0} />
        </div>

        <div
          style={{
            opacity: teaserOp,
          }}
        >
          <BigText
            size={130}
            bebas
            uppercase
            letterSpacing={2}
            lineHeight={0.9}
            tokens={[
              { text: "PARTE" },
              { text: "3", green: true },
            ]}
            staggerStart={16}
          />
        </div>

        <div
          style={{
            opacity: ctaOp,
            transform: `scale(${ctaScale})`,
            background: COLORS.green,
            color: "#001a0e",
            fontFamily: interFamily,
            fontWeight: 900,
            fontSize: 60,
            padding: "26px 52px",
            borderRadius: 999,
            letterSpacing: -1,
            boxShadow: `0 30px 90px ${COLORS.greenGlow}`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 20,
          }}
        >
          MAÑANA · CUANDO LO HAGA
          <span
            style={{
              display: "inline-block",
              transform: `translateX(${arrowX}px)`,
              fontSize: 64,
            }}
          >
            →
          </span>
        </div>

        <div
          style={{
            opacity: followOp,
            fontFamily: interFamily,
            color: COLORS.white,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 1,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          sígueme para no perderlo
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 2, 8], [0, 0.65, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.green,
        opacity: op,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
