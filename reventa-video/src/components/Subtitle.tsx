import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { interFamily, COLORS } from "../fonts";

export type SubtitleCue = {
  from: number;
  duration: number;
  text: string;
  highlight?: string;
};

export const SubtitleTrack: React.FC<{ cues: SubtitleCue[] }> = ({ cues }) => {
  return (
    <>
      {cues.map((cue, i) => (
        <Sequence
          key={i}
          from={cue.from}
          durationInFrames={cue.duration}
          layout="none"
        >
          <SubtitleCard text={cue.text} highlight={cue.highlight} />
        </Sequence>
      ))}
    </>
  );
};

const SubtitleCard: React.FC<{ text: string; highlight?: string }> = ({
  text,
  highlight,
}) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rise = interpolate(enter, [0, 1], [24, 0]);
  const scale = interpolate(enter, [0, 1], [0.95, 1]);

  const parts = highlight ? splitByHighlight(text, highlight) : [{ text, hl: false }];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 70px 280px 70px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: enter,
          transform: `translateY(${rise}px) scale(${scale})`,
          fontFamily: interFamily,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.12,
          textAlign: "center",
          color: COLORS.white,
          letterSpacing: -1,
          textShadow:
            "0 4px 24px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.85)",
          maxWidth: 940,
        }}
      >
        {parts.map((p, idx) => (
          <span
            key={idx}
            style={{
              color: p.hl ? COLORS.green : COLORS.white,
              textShadow: p.hl
                ? `0 0 28px ${COLORS.greenGlow}, 0 2px 8px rgba(0,0,0,0.9)`
                : "0 4px 24px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.85)",
            }}
          >
            {p.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const splitByHighlight = (
  text: string,
  highlight: string,
): { text: string; hl: boolean }[] => {
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return [{ text, hl: false }];
  return [
    { text: text.slice(0, idx), hl: false },
    { text: text.slice(idx, idx + highlight.length), hl: true },
    { text: text.slice(idx + highlight.length), hl: false },
  ];
};
