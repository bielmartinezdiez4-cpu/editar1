import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { COLORS } from "../fonts";

type Props = {
  src: string;
  /** start scale (1 = no zoom) */
  scaleFrom?: number;
  scaleTo?: number;
  /** pan in pixels */
  panX?: number;
  panY?: number;
  fadeFrames?: number;
  overlayOpacity?: number;
  /** rounded card style */
  rounded?: boolean;
  /** crop side - left/right/center */
  align?: "center" | "left" | "right" | "top" | "bottom";
};

export const AnimatedImage: React.FC<Props> = ({
  src,
  scaleFrom = 1.05,
  scaleTo = 1.2,
  panX = 0,
  panY = 0,
  fadeFrames = 12,
  overlayOpacity = 0.5,
  rounded = false,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  const scale = interpolate(progress, [0, 1], [scaleFrom, scaleTo]);
  const tx = interpolate(progress, [0, 1], [0, panX]);
  const ty = interpolate(progress, [0, 1], [0, panY]);

  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames],
    [1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = fadeIn * fadeOut;

  const objectPosition =
    align === "left"
      ? "left center"
      : align === "right"
        ? "right center"
        : align === "top"
          ? "center top"
          : align === "bottom"
            ? "center bottom"
            : "center center";

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          borderRadius: rounded ? 60 : 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
          }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.6}) 0%, rgba(0,0,0,${overlayOpacity * 0.2}) 35%, rgba(0,0,0,${overlayOpacity * 0.4}) 65%, rgba(0,0,0,${overlayOpacity}) 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ImageCard: React.FC<{
  src: string;
  enterFrames?: number;
  align?: "center" | "left" | "right" | "top" | "bottom";
  scaleFrom?: number;
  scaleTo?: number;
}> = ({
  src,
  enterFrames = 14,
  align = "center",
  scaleFrom = 1.04,
  scaleTo = 1.12,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(
    frame,
    [durationInFrames - enterFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(enter, exit);

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [scaleFrom, scaleTo]);

  const rise = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        padding: "180px 80px 480px 80px",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 48,
          overflow: "hidden",
          position: "relative",
          boxShadow: `0 40px 120px rgba(0,255,127,0.18), 0 0 0 1px ${COLORS.border}`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition:
              align === "left"
                ? "left center"
                : align === "right"
                  ? "right center"
                  : align === "top"
                    ? "center top"
                    : align === "bottom"
                      ? "center bottom"
                      : "center center",
            transform: `scale(${scale})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
