import {
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { interFamily, COLORS } from "../fonts";

export const PriceTag: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  variant?: "green" | "white";
}> = ({ text, delay = 0, size = 70, variant = "green" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - delay;
  const s = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bg = variant === "green" ? COLORS.green : COLORS.white;
  const color = variant === "green" ? "#001a0e" : "#000";

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: bg,
        color,
        fontFamily: interFamily,
        fontWeight: 900,
        fontSize: size,
        padding: "18px 44px",
        borderRadius: 999,
        letterSpacing: -1,
        boxShadow: `0 0 60px ${variant === "green" ? COLORS.greenGlow : "rgba(255,255,255,0.4)"}, 0 20px 60px rgba(0,0,0,0.6)`,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const SmallChip: React.FC<{
  text: string;
  delay?: number;
  variant?: "green" | "outline";
}> = ({ text, delay = 0, variant = "outline" }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 16], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: interFamily,
        fontWeight: 700,
        fontSize: 28,
        padding: "12px 24px",
        borderRadius: 999,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: variant === "green" ? "#001a0e" : COLORS.green,
        background: variant === "green" ? COLORS.green : "transparent",
        border:
          variant === "green"
            ? "none"
            : `2px solid ${COLORS.green}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
