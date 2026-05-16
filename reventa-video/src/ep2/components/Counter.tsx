import {
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { interFamily, COLORS } from "../../fonts";

export const Counter: React.FC<{
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  startFrame?: number;
  endFrame?: number;
  color?: string;
  glow?: boolean;
  appearSpring?: boolean;
}> = ({
  from,
  to,
  prefix = "",
  suffix = "",
  size = 200,
  startFrame = 0,
  endFrame = 30,
  color,
  glow = true,
  appearSpring = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const v = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
  const value = Math.round(v);

  const s = appearSpring
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 12, stiffness: 200, mass: 0.7 },
      })
    : 1;
  const scale = interpolate(s, [0, 1], [0.5, 1]);

  const c = color ?? COLORS.green;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: size,
        color: c,
        letterSpacing: -size * 0.04,
        lineHeight: 1,
        textShadow: glow
          ? `0 0 40px ${COLORS.greenGlow}, 0 0 80px ${COLORS.greenGlow}`
          : "none",
      }}
    >
      {prefix}
      {value}
      {suffix}
    </div>
  );
};

// Pulsing dot — TikTok-style
export const PulsingDot: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0,
  size = 24,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const pulse = (Math.sin(local * 0.2) + 1) / 2;
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: COLORS.green,
        boxShadow: `0 0 ${20 + pulse * 30}px ${COLORS.greenGlow}`,
        opacity: opacity * (0.6 + pulse * 0.4),
      }}
    />
  );
};
