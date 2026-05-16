import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { interFamily, bebasFamily } from "../../fonts";
import { BRAND_CREAM } from "./Letterbox";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) Pulse a black hold
  // 2) Logo scales in with subtle glow
  // 3) "@realresell" types in below
  // 4) "PRÓXIMAMENTE" small caps line under

  const s = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.7 },
  });
  const logoScale = interpolate(s, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const handleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const handleY = interpolate(handleOpacity, [0, 1], [16, 0]);

  const tagOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle ambient glow pulse behind logo
  const glowPulse = (Math.sin(frame * 0.08) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
      }}
    >
      {/* ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(244,237,224,${0.06 + glowPulse * 0.04}), transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 38,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            width: 760,
            height: 760,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `drop-shadow(0 0 ${30 + glowPulse * 20}px rgba(244,237,224,0.25))`,
          }}
        >
          <Img
            src={staticFile("trailer/logo.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            opacity: handleOpacity,
            transform: `translateY(${handleY}px)`,
            fontFamily: bebasFamily,
            fontSize: 76,
            fontWeight: 900,
            color: BRAND_CREAM,
            letterSpacing: 6,
            lineHeight: 1,
            textTransform: "lowercase",
          }}
        >
          @realresell
        </div>

        <div
          style={{
            opacity: tagOpacity * 0.7,
            fontFamily: interFamily,
            fontSize: 26,
            fontWeight: 700,
            color: BRAND_CREAM,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginTop: 12,
          }}
        >
          el proceso real · pronto
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
