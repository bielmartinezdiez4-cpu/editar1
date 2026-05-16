import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

export const BRAND_CREAM = "#F4EDE0";
export const BRAND_BLACK = "#0A0A0A";

// Horizontal image displayed letterbox-style inside vertical 1080×1920.
// Optional slow horizontal pan ("Ken Burns") and optional vertical bar tint.
export const Letterbox: React.FC<{
  src: string;
  panFrom?: number; // -1 to 1 (fraction of image extra width)
  panTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
  fadeFrames?: number;
  /** crop instead of letterbox — fills full vertical, ken-burns horizontally */
  fill?: boolean;
}> = ({
  src,
  panFrom = -0.05,
  panTo = 0.05,
  scaleFrom = 1.06,
  scaleTo = 1.18,
  fadeFrames = 8,
  fill = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
  const scale = interpolate(t, [0, 1], [scaleFrom, scaleTo]);
  const panX = interpolate(t, [0, 1], [panFrom, panTo]);

  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  if (fill) {
    return (
      <AbsoluteFill style={{ background: BRAND_BLACK, opacity }}>
        <AbsoluteFill
          style={{
            transform: `translateX(${panX * 100}%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }

  // Letterbox: image fills width, centered vertically with black bars
  return (
    <AbsoluteFill style={{ background: BRAND_BLACK, opacity }}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            position: "relative",
            overflow: "hidden",
            transform: `translateX(${panX * 80}px) scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
          {/* image-edge vignette */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      </AbsoluteFill>
      {/* top + bottom soft scanlines/black bars overlay (cinematic) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
