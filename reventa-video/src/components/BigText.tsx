import { useCurrentFrame, interpolate, Easing } from "remotion";
import { interFamily, bebasFamily, COLORS } from "../fonts";

type Token = { text: string; green?: boolean };

export const BigText: React.FC<{
  tokens: Token[];
  size?: number;
  align?: "left" | "center";
  weight?: number;
  uppercase?: boolean;
  bebas?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  staggerStart?: number;
}> = ({
  tokens,
  size = 110,
  align = "center",
  weight = 900,
  uppercase = false,
  bebas = false,
  letterSpacing = -2,
  lineHeight = 1.0,
  staggerStart = 0,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily: bebas ? bebasFamily : interFamily,
        fontWeight: weight,
        fontSize: size,
        textAlign: align,
        color: COLORS.white,
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing,
        lineHeight,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "0 18px",
      }}
    >
      {tokens.map((tok, i) => {
        const local = frame - (staggerStart + i * 4);
        const op = interpolate(local, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const y = interpolate(local, [0, 16], [40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: op,
              transform: `translateY(${y}px)`,
              color: tok.green ? COLORS.green : COLORS.white,
              textShadow: tok.green
                ? `0 0 32px ${COLORS.greenGlow}`
                : "0 4px 30px rgba(0,0,0,0.6)",
            }}
          >
            {tok.text}
          </span>
        );
      })}
    </div>
  );
};
