import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { interFamily, bebasFamily } from "../../fonts";
import { BRAND_CREAM } from "./Letterbox";

// Big centered teaser caption with strong fade + scale + tracking-in.
export const TrailerCaption: React.FC<{
  text: string;
  size?: number;
  bebas?: boolean;
  letterSpacing?: number;
  uppercase?: boolean;
  weight?: number;
  color?: string;
  shadow?: boolean;
  positionY?: "center" | "bottom";
}> = ({
  text,
  size = 100,
  bebas = true,
  letterSpacing = 2,
  uppercase = true,
  weight = 900,
  color = BRAND_CREAM,
  shadow = true,
  positionY = "center",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Tracking-in letter spacing animation
  const lsAnim = interpolate(fadeIn, [0, 1], [letterSpacing + 20, letterSpacing]);
  // Subtle scale settle
  const scale = interpolate(fadeIn, [0, 1], [1.04, 1]);
  // Subtle Y rise
  const y = interpolate(fadeIn, [0, 1], [16, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: positionY === "center" ? "center" : "flex-end",
        alignItems: "center",
        padding: positionY === "center" ? "0 60px" : "0 60px 360px 60px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          fontFamily: bebas ? bebasFamily : interFamily,
          fontWeight: weight,
          fontSize: size,
          color,
          letterSpacing: lsAnim,
          lineHeight: 0.95,
          textTransform: uppercase ? "uppercase" : "none",
          textAlign: "center",
          textShadow: shadow ? "0 4px 30px rgba(0,0,0,0.85)" : "none",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Triple stacked words ("CADA FLIP / CADA ERROR / CADA EURO") with spring punch
export const PunchWord: React.FC<{
  text: string;
  highlight?: string;
  size?: number;
  delayFrames?: number;
}> = ({ text, highlight, size = 160, delayFrames = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const local = frame - delayFrames;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [0.3, 1]);
  const op = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = op * fadeOut;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontFamily: bebasFamily,
          fontWeight: 900,
          fontSize: size,
          color: BRAND_CREAM,
          letterSpacing: 3,
          lineHeight: 0.9,
          textTransform: "uppercase",
          textAlign: "center",
          textShadow: "0 4px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.6)",
        }}
      >
        {highlight ? (
          <>
            <span>{text}</span>
            <br />
            <span style={{ color: "#00ff7f", textShadow: "0 0 28px rgba(0,255,127,0.55)" }}>{highlight}</span>
          </>
        ) : (
          text
        )}
      </div>
    </AbsoluteFill>
  );
};
