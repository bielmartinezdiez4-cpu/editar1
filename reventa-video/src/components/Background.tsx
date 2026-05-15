import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../fonts";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 1200], [0, 200], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(0,255,127,0.18), transparent 60%)",
          transform: `translateY(${-shift * 0.2}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0,255,127,0.10), transparent 60%)",
        }}
      />
      <GridOverlay shift={shift} />
    </AbsoluteFill>
  );
};

const GridOverlay: React.FC<{ shift: number }> = ({ shift }) => {
  const cellSize = 80;
  const cols = Math.ceil(1080 / cellSize) + 4;
  const rows = Math.ceil(1920 / cellSize) + 4;

  return (
    <AbsoluteFill
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
        opacity: 0.6,
      }}
    >
      <svg
        viewBox={`0 0 ${cols * cellSize} ${rows * cellSize}`}
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${shift - cellSize * 2}px, ${shift - cellSize * 2}px)`,
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          <line
            key={`r-${r}`}
            x1={0}
            x2={cols * cellSize}
            y1={r * cellSize}
            y2={r * cellSize}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: cols }).map((_, c) => (
          <line
            key={`c-${c}`}
            y1={0}
            y2={rows * cellSize}
            x1={c * cellSize}
            x2={c * cellSize}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
