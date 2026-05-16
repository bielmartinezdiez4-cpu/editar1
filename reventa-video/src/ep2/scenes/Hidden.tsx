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
import { Counter } from "../components/Counter";
import { COLORS, interFamily } from "../../fonts";

// 540 frames (18s) — 12s to 30s in ep2
// Audio alignment:
//   12.64 "Donde sí se gana, es donde casi nadie mira"
//   16.07 "Mercadillos de barrio"
//   17.59 "Vaciados de pisos"
//   19.02 "Lotes en subastas"
//   20.70 "Compras una caja por cien euros, con veinte objetos dentro"
//   24.24 "Y vendes cada uno, por separado"
//   26.98 "El mismo objeto, en el sitio correcto, vale el doble"
export const Hidden: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0-100 (12-15.3s)  Intro */}
      <Sequence durationInFrames={100}>
        <HiddenIntro />
      </Sequence>
      {/* 100-156 (15.3-17.2s)  Spot 1 mercadillo */}
      <Sequence from={100} durationInFrames={56}>
        <Spot
          src="ep2/image1.jpg"
          label="MERCADILLOS"
          sub="DE BARRIO"
          align="center"
          spotIndex={1}
        />
      </Sequence>
      {/* 156-212 (17.2-19.1s)  Spot 2 vaciados */}
      <Sequence from={156} durationInFrames={56}>
        <Spot
          src="ep2/image3.jpg"
          label="VACIADOS"
          sub="DE PISOS"
          align="center"
          spotIndex={2}
        />
      </Sequence>
      {/* 212-268 (19.1-20.9s)  Spot 3 lotes */}
      <Sequence from={212} durationInFrames={56}>
        <Spot
          src="ep2/image4.jpg"
          label="LOTES"
          sub="EN SUBASTAS"
          align="center"
          spotIndex={3}
        />
      </Sequence>
      {/* 268-540 (20.9-30s)  Math */}
      <Sequence from={268} durationInFrames={272}>
        <MathBreakdown />
      </Sequence>

      {/* Flash transitions */}
      {[100, 156, 212, 268].map((f, i) => (
        <Sequence key={i} from={f - 3} durationInFrames={8} layout="none">
          <Flash />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const HiddenIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={100}>
        <AnimatedImage
          src="ep2/image1.jpg"
          scaleFrom={1.25}
          scaleTo={1.45}
          panY={-20}
          overlayOpacity={0.75}
          fadeFrames={8}
        />
      </Sequence>
      <Sequence from={4} durationInFrames={96} layout="none">
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
              { text: "DONDE" },
              { text: "NADIE" },
              { text: "ESTÁ" },
              { text: "MIRANDO", green: true },
            ]}
            staggerStart={4}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Spot: React.FC<{
  src: string;
  label: string;
  sub: string;
  align?: "center" | "top" | "bottom";
  spotIndex: number;
}> = ({ src, label, sub, spotIndex }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={src}
        scaleFrom={1.18}
        scaleTo={1.32}
        panY={-15}
        overlayOpacity={0.5}
        fadeFrames={5}
      />

      {/* Top-left number badge */}
      <AbsoluteFill
        style={{
          padding: "260px 0 0 80px",
        }}
      >
        <BadgeNum n={spotIndex} delay={0} />
      </AbsoluteFill>

      {/* Center label */}
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
          lineHeight={0.9}
          tokens={[{ text: label, green: true }]}
          staggerStart={5}
        />
        <BigText
          size={64}
          bebas
          uppercase
          letterSpacing={2}
          lineHeight={1}
          tokens={[{ text: sub }]}
          staggerStart={12}
        />
      </AbsoluteFill>

      {/* Marker bottom-right */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: "0 90px 460px 0",
        }}
      >
        <Marker fps={fps} delay={8} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BadgeNum: React.FC<{ n: number; delay: number }> = ({ n, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(10,10,10,0.85)",
        border: `2px solid ${COLORS.green}`,
        borderRadius: 999,
        padding: "12px 28px",
        boxShadow: `0 0 30px ${COLORS.greenGlow}`,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: COLORS.green,
          boxShadow: `0 0 14px ${COLORS.greenGlow}`,
        }}
      />
      <div
        style={{
          fontFamily: interFamily,
          fontWeight: 900,
          color: COLORS.green,
          fontSize: 34,
          letterSpacing: 4,
        }}
      >
        SITIO #{n}
      </div>
    </div>
  );
};

const Marker: React.FC<{ fps: number; delay: number }> = ({ fps, delay }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const pulse = (Math.sin(local * 0.3) + 1) / 2;
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        width: 40,
        height: 40,
        borderRadius: 999,
        background: COLORS.green,
        boxShadow: `0 0 ${24 + pulse * 30}px ${COLORS.greenGlow}, 0 0 ${48 + pulse * 60}px ${COLORS.greenGlow}`,
        border: "4px solid white",
      }}
    />
  );
};

const MathBreakdown: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={272}>
        <AnimatedImage
          src="ep2/image4.jpg"
          scaleFrom={1.06}
          scaleTo={1.18}
          panY={20}
          overlayOpacity={0.78}
          fadeFrames={6}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          gap: 36,
        }}
      >
        {/* Step 1: 1 caja = €100 */}
        <Step
          delay={6}
          left="CAJA"
          right={
            <Counter
              from={0}
              to={100}
              suffix="€"
              size={130}
              startFrame={6}
              endFrame={32}
              color={COLORS.white}
              glow={false}
            />
          }
        />

        {/* Step 2: 20 objetos */}
        <Step
          delay={52}
          left="DENTRO"
          right={
            <div
              style={{
                fontFamily: interFamily,
                fontWeight: 900,
                fontSize: 130,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              20 cosas
            </div>
          }
        />

        {/* Step 3: VENDIENDO POR SEPARADO */}
        <Step
          delay={120}
          left="VENDIDOS"
          right={
            <Counter
              from={100}
              to={350}
              suffix="€"
              size={170}
              startFrame={120}
              endFrame={170}
              color={COLORS.green}
              glow
            />
          }
        />

        {/* Multiplier slap */}
        <Multiplier delay={180} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Step: React.FC<{
  delay: number;
  left: string;
  right: React.ReactNode;
}> = ({ delay, left, right }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const op = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(local, [0, 18], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
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
          fontWeight: 700,
          color: COLORS.gray,
          fontSize: 36,
          letterSpacing: 4,
          textTransform: "uppercase",
          minWidth: 230,
          textAlign: "right",
        }}
      >
        {left}
      </div>
      <div
        style={{
          fontWeight: 900,
          color: COLORS.green,
          fontSize: 60,
        }}
      >
        =
      </div>
      <div>{right}</div>
    </div>
  );
};

const Multiplier: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [0.2, 1]);
  const op = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${scale}) rotate(-3deg)`,
        background: COLORS.green,
        color: "#001a0e",
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: 100,
        padding: "16px 50px",
        borderRadius: 30,
        letterSpacing: -2,
        boxShadow: `0 30px 90px ${COLORS.greenGlow}`,
        marginTop: 16,
      }}
    >
      x 3.5
    </div>
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
        background: COLORS.white,
        opacity: op,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
