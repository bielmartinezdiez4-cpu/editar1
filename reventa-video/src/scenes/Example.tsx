import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedImage, ImageCard } from "../components/AnimatedImage";
import { BigText } from "../components/BigText";
import { PriceTag, SmallChip } from "../components/Tag";
import { COLORS, interFamily } from "../fonts";

// 480 frames total (16 seconds)
export const Example: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0-120: encuentra cámara */}
      <Sequence durationInFrames={120}>
        <FindCamera />
      </Sequence>
      {/* 120-240: limpia + anuncio */}
      <Sequence from={120} durationInFrames={120}>
        <CleanList />
      </Sequence>
      {/* 240-360: notificaciones */}
      <Sequence from={240} durationInFrames={120}>
        <Notifications />
      </Sequence>
      {/* 360-480: precio final */}
      <Sequence from={360} durationInFrames={120}>
        <FinalPrice />
      </Sequence>
    </AbsoluteFill>
  );
};

const FindCamera: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="image1.jpg"
          scaleFrom={1.18}
          scaleTo={1.32}
          panY={20}
          overlayOpacity={0.5}
        />
      </Sequence>
      <Sequence from={6} durationInFrames={114} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 220,
          }}
        >
          <SmallChip text="HALLAZGO" variant="outline" delay={2} />
          <div style={{ height: 30 }} />
          <BigText
            size={110}
            bebas
            uppercase
            letterSpacing={2}
            tokens={[{ text: "CÁMARA" }, { text: "ANTIGUA" }]}
            staggerStart={8}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={40} durationInFrames={80} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 540,
          }}
        >
          <PriceTag text="20 €" size={96} delay={0} variant="green" />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const CleanList: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <ImageCard src="image5.jpg" scaleFrom={1.06} scaleTo={1.18} />
      </Sequence>
      <Sequence from={6} durationInFrames={114} layout="none">
        <Steps />
      </Sequence>
    </AbsoluteFill>
  );
};

const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["LIMPIAR", "FOTOGRAFIAR", "PUBLICAR"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 220,
      }}
    >
      <SmallChip text="EL PROCESO" variant="green" delay={0} />
      <div style={{ height: 40 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map((it, i) => {
          const local = frame - 14 - i * 18;
          const op = interpolate(local, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const x = interpolate(local, [0, 18], [-60, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={it}
              style={{
                opacity: op,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                fontFamily: interFamily,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  background: COLORS.green,
                  boxShadow: `0 0 24px ${COLORS.greenGlow}`,
                }}
              />
              <div
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  color: COLORS.white,
                  letterSpacing: -1,
                  textShadow: "0 4px 24px rgba(0,0,0,0.7)",
                }}
              >
                {it}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Notifications: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <AnimatedImage
          src="image2.jpg"
          scaleFrom={1.15}
          scaleTo={1.3}
          panY={-50}
          overlayOpacity={0.75}
        />
      </Sequence>
      <NotificationStack />
    </AbsoluteFill>
  );
};

const NotificationStack: React.FC = () => {
  const frame = useCurrentFrame();
  const messages = [
    { text: "¿Sigue disponible?", delay: 6 },
    { text: "Te doy 60 €", delay: 22 },
    { text: "Me la quedo", delay: 40 },
    { text: "Pago ya · 80 €", delay: 60 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          width: "100%",
          maxWidth: 800,
        }}
      >
        {messages.map((m, i) => {
          const local = frame - m.delay;
          const op = interpolate(local, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(local, [0, 16], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const isLast = i === messages.length - 1;
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                background: isLast
                  ? `linear-gradient(135deg, ${COLORS.green}, #00cc66)`
                  : "rgba(20,20,20,0.85)",
                color: isLast ? "#001a0e" : COLORS.white,
                border: isLast
                  ? "none"
                  : `1.5px solid rgba(255,255,255,0.08)`,
                borderRadius: 28,
                padding: "28px 36px",
                fontFamily: interFamily,
                fontWeight: 700,
                fontSize: 44,
                boxShadow: isLast
                  ? `0 30px 80px ${COLORS.greenGlow}`
                  : "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FinalPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // animate 20 -> 80
  const numProgress = interpolate(frame, [10, 60], [20, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const value = Math.round(numProgress);

  const arrowSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const arrowScale = interpolate(arrowSpring, [0, 1], [0.4, 1]);

  const flashOp = interpolate(frame, [56, 64, 80], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,255,127,0.12), rgba(0,0,0,1) 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        <SmallChip text="DÍAS DESPUÉS" variant="outline" delay={0} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
              fontFamily: interFamily,
              fontSize: 90,
              fontWeight: 900,
              color: COLORS.gray,
              textDecoration: "line-through",
              letterSpacing: -2,
            }}
          >
            20 €
          </div>
          <div
            style={{
              transform: `scale(${arrowScale})`,
              opacity: interpolate(frame, [26, 36], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              color: COLORS.green,
              fontSize: 90,
              filter: `drop-shadow(0 0 20px ${COLORS.greenGlow})`,
            }}
          >
            →
          </div>
          <div
            style={{
              opacity: interpolate(frame, [10, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontFamily: interFamily,
              fontSize: 200,
              fontWeight: 900,
              color: COLORS.green,
              letterSpacing: -8,
              textShadow: `0 0 40px ${COLORS.greenGlow}`,
              lineHeight: 1,
            }}
          >
            {value}€
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            opacity: interpolate(frame, [40, 56], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [40, 56], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <Stat label="GANANCIA" value="+60 €" />
          <Stat label="MARGEN" value="x4" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: COLORS.green,
          opacity: flashOp * 0.4,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div
      style={{
        background: "rgba(20,20,20,0.7)",
        border: `1.5px solid ${COLORS.green}`,
        borderRadius: 16,
        padding: "16px 28px",
        fontFamily: interFamily,
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
        {label}
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: COLORS.green,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
};
