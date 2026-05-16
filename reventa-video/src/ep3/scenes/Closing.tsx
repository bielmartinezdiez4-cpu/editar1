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
// Audio aligned (local):
//   0    (25.62s)  "No fue suerte."
//   69   (27.90s)  "Fue exactamente lo que te llevo contando tres días."
//   226  (33.13s)  "Esto es solo el principio."
//   278  (35.70s)  "Sígueme para todo el viaje."
export const Closing: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={200}>
        <Thesis />
      </Sequence>
      <Sequence from={200} durationInFrames={130}>
        <FinalCTA />
      </Sequence>
      <Sequence from={197} durationInFrames={8} layout="none">
        <Flash />
      </Sequence>
    </AbsoluteFill>
  );
};

const Thesis: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={200}>
        <AnimatedImage
          src="ep3/image5.jpg"
          scaleFrom={1.15}
          scaleTo={1.3}
          panY={-15}
          overlayOpacity={0.7}
          fadeFrames={6}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 70px",
          gap: 30,
        }}
      >
        <BigText
          size={140}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={0.92}
          tokens={[
            { text: "NO" },
            { text: "FUE" },
            { text: "SUERTE", green: true },
          ]}
          staggerStart={6}
        />

        <div
          style={{
            opacity: interpolate(frame, [70, 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            transform: `translateY(${interpolate(frame, [70, 90], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            fontFamily: interFamily,
            fontWeight: 700,
            color: COLORS.gray,
            fontSize: 34,
            letterSpacing: 4,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          fue lo que te llevo
          <br />
          contando tres días
        </div>

        {/* mini series recap chips */}
        <SeriesRecap delay={120} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SeriesRecap: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const items = ["EP 01 · DEMANDA", "EP 02 · DÓNDE", "EP 03 · PRUEBA"];
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        marginTop: 20,
      }}
    >
      {items.map((it, i) => {
        const local = frame - delay - i * 10;
        const op = interpolate(local, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(local, [0, 18], [16, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const isLast = i === items.length - 1;
        return (
          <div
            key={it}
            style={{
              opacity: op,
              transform: `translateY(${y}px)`,
              fontFamily: interFamily,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 2,
              padding: "10px 18px",
              borderRadius: 999,
              background: isLast ? COLORS.green : "transparent",
              color: isLast ? "#001a0e" : COLORS.green,
              border: isLast ? "none" : `1.5px solid ${COLORS.green}`,
              boxShadow: isLast
                ? `0 8px 32px ${COLORS.greenGlow}`
                : "none",
            }}
          >
            {it}
          </div>
        );
      })}
    </div>
  );
};

const FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();

  const principioOp = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const ctaOp = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = interpolate(frame, [60, 92], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const arrowX = interpolate(frame, [80, 130], [-10, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(0,255,127,0.25), #050505 70%)",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          gap: 36,
        }}
      >
        <div style={{ opacity: principioOp }}>
          <SmallChip text="EPISODIO FINAL" variant="outline" delay={0} />
        </div>

        <div
          style={{
            opacity: principioOp,
            transform: `translateY(${interpolate(principioOp, [0, 1], [30, 0])}px)`,
          }}
        >
          <BigText
            size={108}
            bebas
            uppercase
            letterSpacing={2}
            lineHeight={0.92}
            tokens={[
              { text: "ESTO" },
              { text: "ES" },
              { text: "SOLO" },
              { text: "EL" },
              { text: "PRINCIPIO", green: true },
            ]}
            staggerStart={12}
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
            fontSize: 56,
            padding: "26px 50px",
            borderRadius: 999,
            letterSpacing: -1,
            boxShadow: `0 30px 90px ${COLORS.greenGlow}`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 16,
          }}
        >
          SÍGUEME PARA EL VIAJE
          <span
            style={{
              display: "inline-block",
              transform: `translateX(${arrowX}px)`,
              fontSize: 60,
            }}
          >
            →
          </span>
        </div>

        <div
          style={{
            opacity: ctaOp,
            fontFamily: interFamily,
            color: COLORS.white,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          ep 04 · al primer mes
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
      }}
    />
  );
};
